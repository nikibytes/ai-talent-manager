# Architecture — ai-talent-manager

## Architectural Source of Truth

- `docs/planning/` contains the **approved planning specification** and locked product/domain decisions.
- This file is the **implementation-facing consolidated architecture reference**.
- When implementation introduces a new module, schema, integration, or architectural responsibility, this file and the relevant planning document must be updated in the same commit.

## Data Flow (high level)

The AI Talent Manager is a single-user, local-first orchestration system for the candidate's LinkedIn-focused job search.

```text
Scheduled 10:00 AM Trigger (Configurable time + timezone)
                 OR
Manual "Run Now" Trigger
                 ↓
        Same Daily Run Orchestrator
                 ↓
        Create Daily Run Log
                 ↓
   Inspect Persistent Opportunity Queue (SQLite)
                 ↓
Calculate Remaining Application Slots
                 ↓
Can queue fill the remaining slots?
        ├── YES → Select highest-priority qualifying jobs
        └── NO  → Discover additional jobs
                    ↓
              Normalize + Deduplicate
                    ↓
              Match + Classify
              ├── Eligible → Queue
              ├── Stretch  → Stretch Log
              └── Not Qualified → Discard
                    ↓
              Return to queue processing
                    ↓
              Tailor CV + Answers
                    ↓
              Validate factual consistency
                    ↓
              Create Execution Request
                    ↓
              Execution Mode Gate
              ├── MANUAL → Approval Service
              │             ├── Email preferred
              │             └── Dashboard fallback
              │             ↓
              │          Candidate decision
              └── AUTONOMOUS → validated executor path
                    ↓
              Browser Use / LinkedIn executor
                    ↓
              Record outcome + exact CV version
                    ↓
              Remaining slots?
              ├── YES → return to queue processing
              └── NO  → preserve leftovers → EOD report
```

### Runtime guarantees

- Queue-first: existing qualifying opportunities are processed before unnecessary discovery.
- Conditional discovery: fresh discovery happens only when the queue cannot fill remaining application slots.
- Repeat-until-target: discovery, matching, queueing, tailoring and execution repeat until the daily target is reached or qualifying work is exhausted.
- Persistent leftovers: unused qualifying opportunities remain queued for later runs.
- Stretch opportunities are retained/reported and do not get used merely to pad the application target.
- Scheduled and manual triggers use the exact same orchestrator.
- The three consequential action types have independent execution modes:
  - `APPLICATION_EXECUTION_MODE`
  - `RECRUITER_DM_EXECUTION_MODE`
  - `LINKEDIN_POST_EXECUTION_MODE`
- All default to `MANUAL` during initial validation.

## Directory Map

```text
ai-talent-manager/
├── .agents/
│   └── permissions.json
├── docs/
│   ├── prd.md
│   ├── architecture.md
│   ├── task-tracker.md
│   ├── testing-playbook.md
│   └── planning/
│       ├── discovery.md
│       ├── prd.md
│       ├── personas.md
│       ├── user-flows.md
│       ├── requirements.md
│       ├── domain-model.md
│       ├── data-flow.md
│       ├── database-schema.md
│       └── planning-state.yaml
├── src/
│   ├── app/
│   │   └── dashboard/
│   ├── agent/
│   │   ├── orchestrator/
│   │   ├── daily-run/
│   │   └── decision-engine/
│   ├── approval/
│   │   ├── service/
│   │   ├── email/
│   │   └── dashboard/
│   ├── discovery/
│   │   ├── agent-reach/
│   │   ├── normalization/
│   │   ├── deduplication/
│   │   └── matcher/
│   ├── queue/
│   │   ├── opportunity-queue/
│   │   └── prioritization/
│   ├── candidate/
│   │   └── profile/
│   ├── generator/
│   │   ├── cv/
│   │   └── application-answers/
│   ├── validation/
│   │   ├── cv/
│   │   └── application/
│   ├── automation/
│   │   └── browser-use/
│   ├── linkedin/
│   │   ├── unipile/
│   │   ├── recruiters/
│   │   ├── messaging/
│   │   └── content/
│   ├── drive/
│   │   └── google-drive/
│   ├── reporting/
│   │   └── eod/
│   ├── db/
│   │   ├── schema.ts
│   │   ├── client.ts
│   │   └── migrations/
│   ├── types/
│   └── config/
├── .env.template
├── AGENTS.md
├── package.json
├── drizzle.config.ts
└── README.md
```

## Schemas

The database is SQLite with Drizzle ORM.

Primary schema/model file: `src/db/schema.ts`

The planning specification for intent and relationships is `docs/planning/database-schema.md`. The implementation schema file is authoritative for actual columns/types once coding begins.

Core entities:
- Candidate/agent configuration: `agent_settings`
- Jobs and opportunity queue: `jobs`, `opportunity_queue`
- Tailored CV versions and applications: `cv_versions`, `applications`
- Recruiters and messages/follow-ups: `recruiters`, `recruiter_messages`
- LinkedIn content: `linkedin_posts`
- Execution and approval audit: `execution_requests`, `approval_events`
- Daily runs: `daily_runs`

## Key Modules

| Module | Path | Responsibility |
|---|---|---|
| **Agent Orchestrator** | `src/agent/orchestrator/` | Coordinates the daily run and shared agent workflows |
| **Daily Run** | `src/agent/daily-run/` | Executes scheduled/manual daily runs and tracks remaining target capacity |
| **Decision Engine** | `src/agent/decision-engine/` | Selects opportunities and enforces classification/target decisions |
| **Approval Service** | `src/approval/` | Provides one approval abstraction for Email and Dashboard and respects execution modes |
| **Job Discovery** | `src/discovery/` | Retrieves LinkedIn job opportunities from supported discovery sources |
| **Normalization & Deduplication** | `src/discovery/normalization/`, `src/discovery/deduplication/` | Normalizes external listings and deduplicates against queue/history |
| **Matcher & Classifier** | `src/discovery/matcher/` | Evaluates fit and classifies eligible/stretch/not-qualified opportunities |
| **Opportunity Queue** | `src/queue/opportunity-queue/` | Persists qualifying unused opportunities for future runs |
| **Candidate Profile** | `src/candidate/profile/` | Maintains verified candidate facts |
| **CV Generator & Versioning** | `src/generator/cv/` | Creates job-specific CV versions without fabricating facts |
| **Application Validation** | `src/validation/` | Checks factual and application consistency |
| **Browser Automation** | `src/automation/browser-use/` | Executes approved browser-based application actions |
| **Unipile Integration** | `src/linkedin/unipile/` | Handles supported LinkedIn messaging/operations |
| **Messaging & Follow-ups** | `src/linkedin/messaging/` | Drafts, queues, tracks and executes recruiter outreach according to mode |
| **Content** | `src/linkedin/content/` | Generates LinkedIn posts approximately every two days |
| **Google Drive** | `src/drive/google-drive/` | Stores master/tailored CVs and application documents |
| **EOD Reporting** | `src/reporting/eod/` | Generates and sends daily reports |
| **Database** | `src/db/` | SQLite persistence, schema, migrations and access |
| **Dashboard** | `src/app/dashboard/` | Candidate configuration, queues, drafts, approvals and visibility |

## External Dependencies

### LinkedIn / Job Discovery
- **Agent Reach**: Primary discovery/crawling integration.
- **Unipile**: Supported LinkedIn operations, especially recruiter messaging.
- **Browser Use**: Browser execution layer for application forms and other approved browser actions; not the primary job-discovery source.

### AI / LLM
The system supports configurable LLM providers (OpenAI / Anthropic / Gemini) for matching, CV tailoring, application answers, recruiter drafting, and LinkedIn content generation.

### Document Storage & Communication
- **Google Drive API**: Stores generated CVs and application documents.
- **SMTP / Email API**: EOD reports, notifications and preferred approval channel.

### Database
- **SQLite**: Application state, queue, configuration, history, execution requests and audit events.
- **Drizzle ORM**: Schema, migrations and database access.

## Security Architecture

Security is a cross-cutting requirement, not a later hardening task.

- No secrets, API keys, OAuth tokens, session data or credentials in source control or logs.
- No LinkedIn password storage.
- Least-privilege integration scopes.
- Sensitive persisted credentials/tokens protected and encrypted where applicable.
- External content and LLM output treated as untrusted input.
- Approval links use scoped, expiring, cryptographically random single-use tokens where feasible.
- Consequential actions use idempotency/duplicate protection.
- Browser automation uses minimum required access and isolated session context.
- Ambiguous authorization/validation states fail closed.
- The agent cannot change its own permissions, security configuration or execution modes.
- All consequential actions have auditable execution/approval history without leaking secrets.

## Update Rule & Separation of Responsibilities

This file is updated in the same commit whenever a module, schema, external dependency, or architectural responsibility changes.

```text
AI Talent Manager    = DECIDES / ORCHESTRATES
Agent Reach          = DISCOVERS JOBS
Matcher              = EVALUATES FIT & CLASSIFIES
Opportunity Queue    = PRESERVES QUALIFYING UNUSED OPPORTUNITIES
CV Generator         = TAILORS & VERSIONS CVs
Validator            = CHECKS FACTUAL / APPLICATION CONSISTENCY
Approval Service     = HANDLES EXECUTION REQUESTS + EMAIL/DASHBOARD APPROVAL
Browser Use          = EXECUTES BROWSER ACTIONS
Unipile              = HANDLES SUPPORTED LINKEDIN OPERATIONS
Google Drive         = STORES DOCUMENTS
SQLite               = STORES SYSTEM STATE, QUEUE, AUDIT & HISTORY
Email                = REPORTS ACTIVITY + DELIVERS APPROVAL REQUESTS
Human Candidate      = CONTROLS SETTINGS + APPROVES ACTIONS IN MANUAL MODE
```

No module should silently absorb another module's responsibility without updating the relevant architecture/planning documentation in the same commit.
