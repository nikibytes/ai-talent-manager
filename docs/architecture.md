# Architecture — ai-talent-manager

## Data Flow (high level)

The AI Talent Manager is a single-user, local-first orchestration system that manages the candidate's LinkedIn-focused job search.

The high-level flow is:

```text
10:00 AM Daily Run Trigger (Configurable daily_run_time & timezone)
        ↓
Create Daily Run Log Entity
        ↓
Inspect Persistent Opportunity Queue (SQLite)
        ↓
┌────────────────────────────────────────────────────────┐
│ Existing Qualifying Jobs >= Daily Target?               │
│                                                        │
│ YES → Select Top Match Jobs up to Daily Target Limit   │
│ NO  → Calculate Remaining Slots Needed                 │
│       ↓                                                │
│       Discover Jobs via Agent Reach / LinkedIn APIs    │
│       (Browser Use NOT used for discovery)             │
│       ↓                                                │
│       Deduplicate against Queue + Historical DB        │
│       ↓                                                │
│       LLM Matcher & Classifier                         │
│       ├── Score >= 0.70 → APPLICATION_ELIGIBLE → Queue │
│       ├── 0.50 - 0.70   → STRETCH → Stretch Log      │
│       └── Score < 0.50  → NOT_QUALIFIED → Discard      │
└────────────────────────────────────────────────────────┘
        ↓
Select Applications up to Configured Daily Application Target
(Unselected qualifying opportunities remain in persistent queue for next day)
        ↓
Generate Tailored CV Version (Google Drive PDF/DOCX) + Application Answers
(Validated against Candidate Profile facts)
        ↓
Create Application & Execution Request Entity
        ↓
Check Action Execution Mode (APPLICATION_EXECUTION_MODE)
        ↓
┌────────────────────────────────────────────────────────┐
│ Execution Mode Gate                                    │
│                                                        │
│ MANUAL → Dispatch Approval Request to Approval Service  │
│          ├── Email Approval Link                       │
│          └── Dashboard Approval Queue                  │
│          Candidate Decision → APPROVED / REJECTED      │
│                                                        │
│ AUTONOMOUS → Auto-Approve & Pass directly to Executor   │
└────────────────────────────────────────────────────────┘
        ↓
Executor Service (Browser Use for Easy Apply Submissions)
        ↓
Record Application History & Update Daily Run Log
        ↓
EOD Report Generator → Email Dispatch via SMTP


Parallel Recruiter Outreach Flow:

Target Company / Job
        ↓
Recruiter Discovery (Agent Reach / LinkedIn)
        ↓
AI Personalized DM Draft
        ↓
Execution Request (RECRUITER_DM_EXECUTION_MODE)
        ↓
Approval Service (Email / Dashboard) → If MANUAL
        ↓
Unipile Integration → Send DM
        ↓
Recruiter Reply Tracking & Follow-up Lifecycle


Parallel Personal Branding Content Flow (~Every 2 Days):

Scheduled Timer / Candidate Activity Log
        ↓
AI Content Generator
        ↓
Execution Request (LINKEDIN_POST_EXECUTION_MODE)
        ↓
Approval Service (Email / Dashboard) → If MANUAL
        ↓
LinkedIn Publishing / Scheduling
```

- **Opportunity Queue**: The opportunity queue is persistent. If the agent discovers more suitable jobs than the configured daily application limit, the unused opportunities remain queued for the next day.
- **Queue-First Execution**: At the beginning of each daily run (10:00 AM), the agent processes the existing queue first. It only performs additional discovery when the queue cannot provide enough qualifying opportunities to meet the configured daily target.
- **Stretch Classification**: Jobs scoring between `stretch_match_threshold` (`0.50`) and `normal_match_threshold` (`0.70`) are logged for candidate insight and EOD reporting rather than applied or silently dropped.
- **Channel-Agnostic Approval**: All external actions create `Execution Requests` evaluated by the `Approval Service` serving both Email action links and Next.js Dashboard. Execution modes (`MANUAL` | `AUTONOMOUS`) are configurable per action type.
- **Factual Integrity**: The AI acts as a transparent talent manager/representative for the candidate. It must not impersonate the candidate or fabricate candidate experience, skills, achievements, or other professional information.

---

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

---

## Schemas

The database is SQLite with Drizzle ORM.

Primary schema/model file: `src/db/schema.ts`
- Candidate & agent config: `agent_settings` table
- Jobs: `jobs` table (`match_classification`: `APPLICATION_ELIGIBLE`, `STRETCH`, `NOT_QUALIFIED`)
- Opportunity queue: `opportunity_queue` table
- CV versions: `cv_versions` table (references Google Drive file ID & content diff)
- Applications: `applications` table (`status`: `DRAFT`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `SUBMITTING`, `SUBMITTED`, `FAILED`)
- Recruiters: `recruiters` table
- Messages & follow-ups: `recruiter_messages` table
- Content posts: `linkedin_posts` table
- Execution requests: `execution_requests` table
- Approval audit trail: `approval_events` table
- Daily runs: `daily_runs` table

---

## Key Modules

| Module | Path | Responsibility |
|---|---|---|
| **Agent Orchestrator** | `src/agent/orchestrator/` | Coordinates discovery, matching, queue processing, applications, outreach, content, and reporting |
| **Daily Run** | `src/agent/daily-run/` | Executes the 10:00 AM daily job-search cycle and respects the configured application target |
| **Decision Engine** | `src/agent/decision-engine/` | Decides which opportunities should be applied to, queued, categorized as stretch, or rejected |
| **Approval Service** | `src/approval/` | Manages `Execution Requests`, handles channel-agnostic approval via Email & Dashboard, and respects `MANUAL`/`AUTONOMOUS` mode switches |
| **Job Discovery** | `src/discovery/` | Retrieves relevant LinkedIn job listings from Agent Reach / supported discovery sources |
| **Normalization & Deduplication** | `src/discovery/normalization/`, `src/discovery/deduplication/` | Converts external job listings and deduplicates against active queue + historical DB records |
| **Matcher & Classifier** | `src/discovery/matcher/` | Evaluates job compatibility against candidate profile facts and `0.50`/`0.70` thresholds |
| **Opportunity Queue** | `src/queue/opportunity-queue/` | Persists useful undispatched opportunities for future daily runs |
| **Candidate Profile** | `src/candidate/profile/` | Maintains verified candidate facts used by the agent |
| **CV Generator & Versioning** | `src/generator/cv/` | Creates tailored CV versions for each selected job without fabricating candidate information |
| **Application Validation** | `src/validation/` | Checks tailored CVs and application answers for factual consistency before use |
| **Browser Automation** | `src/automation/browser-use/` | Uses Browser Use to navigate forms, upload CVs, and execute approved browser-based applications |
| **Unipile Integration** | `src/linkedin/unipile/` | Handles supported LinkedIn operations such as messaging and recruiter outreach |
| **Messaging & Follow-ups** | `src/linkedin/messaging/` | Generates, queues, tracks, and sends approved recruiter outreach and follow-ups |
| **Content** | `src/linkedin/content/` | Generates LinkedIn posts approximately every two days for human approval |
| **Google Drive** | `src/drive/google-drive/` | Stores master CVs, tailored CVs, application documents, and reports |
| **EOD Reporting** | `src/reporting/eod/` | Generates and sends the daily activity report via Email/SMTP |
| **Database** | `src/db/` | Provides SQLite persistence, schema, migrations, and database access |
| **Dashboard** | `src/app/dashboard/` | Provides the candidate with configuration, queues, drafts, approvals, and application visibility |

---

## External Dependencies

### LinkedIn / Job Discovery
- **Agent Reach**: Primary job discovery/crawling integration.
- **Unipile**: LinkedIn integration for supported recruiter messaging and LinkedIn operations.
- **Browser Use**: Browser automation for application forms and LinkedIn actions that cannot be handled through structured integrations.
  *(Note: Browser Use is used as an execution layer rather than as the primary source of application/business decisions.)*

### AI / LLM
The system supports configurable LLM providers (OpenAI / Anthropic / Gemini). LLMs are used for:
- Job requirement extraction & matching
- CV tailoring & application-answer generation
- Recruiter message & response drafting
- LinkedIn content generation & summarization

### Document Storage & Communication
- **Google Drive API**: Persistent storage for generated CV PDFs/DOCX files, application documents, and reports.
- **SMTP / Email API**: Sends EOD activity reports, notifications, and email-based action approval links.

### Database
- **SQLite**: Primary application state, opportunity queue, configuration, application history, recruiter activity, content drafts, execution requests, and audit events.
- **Drizzle ORM**: Schema definition, migrations, and database client access.

---

## Update Rule & Separation of Responsibilities

This file is updated by the agent whenever a new module, schema, or external dependency is added — same commit as the code change, never deferred.

Any architectural change must preserve the strict separation of responsibilities:

```text
AI Talent Manager    = DECIDES / ORCHESTRATES
Agent Reach          = DISCOVERS JOBS
Matcher              = EVALUATES FIT & CLASSIFIES (ELIGIBLE / STRETCH / NOT QUALIFIED)
Opportunity Queue    = PRESERVES QUALIFYING UNUSED OPPORTUNITIES
CV Generator         = TAILORS CANDIDATE MATERIAL & VERSIONS CVs
Validator            = CHECKS FACTUAL / APPLICATION CONSISTENCY
Approval Service     = EVALUATES EXECUTION REQUESTS & DISPATCHES APPROVALS (EMAIL / DASHBOARD)
Browser Use          = EXECUTES BROWSER ACTIONS
Unipile              = HANDLES SUPPORTED LINKEDIN OPERATIONS
Google Drive         = STORES DOCUMENTS
SQLite               = STORES SYSTEM STATE, QUEUE, AUDIT & HISTORY
Email                = REPORTS ACTIVITY & DELIVERS APPROVAL REQUESTS
Human Candidate      = CONTROLS SETTINGS & APPROVES ACTIONS IN MANUAL MODE
```

No module should silently absorb another module's responsibility without updating this document in the same commit.