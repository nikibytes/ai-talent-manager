# Architecture — ai-talent-manager

## Data Flow (high level)

The AI Talent Manager is a single-user, local-first orchestration system that manages the candidate's LinkedIn-focused job search.

The high-level flow is:

```text
LinkedIn Job Sources
        ↓
Job Discovery
(Agent Reach / Unipile / Browser Use where necessary)
        ↓
Normalize + Deduplicate
        ↓
Candidate Profile + LLM Matching
        ↓
┌───────────────────────────────┐
│ Match / Prioritize            │
│                               │
│ Strong/Good → Application     │
│ 50–60%        → Stretch Log   │
│ Low Match     → Reject        │
└───────────────────────────────┘
        ↓
Opportunity Queue (SQLite)
        ↓
Daily Application Target
(configurable by candidate)
        ↓
Tailored CV + Application Answers
        ↓
Validation
        ↓
Human Approval
        ↓
Browser Use
        ↓
LinkedIn / Easy Apply Submission
        ↓
Application History (SQLite)
        ↓
Google Drive
(tailored CVs / documents)
        ↓
EOD Report → Email

Parallel LinkedIn Flow:

Job / Recruiter
        ↓
Recruiter Discovery
        ↓
AI-Personalized DM
        ↓
Human Approval
        ↓
Unipile
        ↓
Message + Follow-up Tracking

Every ~2 days:

Candidate + Recent Activity
        ↓
AI Content Generation
        ↓
Human Approval (via Dashboard / Email)
        ↓
LinkedIn Post
```

- **Opportunity Queue**: The opportunity queue is persistent. If the agent discovers more suitable jobs than the configured daily application limit, the unused opportunities remain queued for the next day.
- **Daily Execution**: At the beginning of each daily run, the agent processes the existing queue first. It only performs additional discovery when the queue cannot provide enough qualifying opportunities to meet the configured daily target.
- **Queue Cleanup**: Completed opportunities are removed from the active queue but retained in historical application/job records.
- **Representation Integrity**: The AI acts as a transparent talent manager/representative for the candidate. It must not impersonate the candidate or fabricate candidate experience, skills, achievements, or other professional information.
- **Human Approval**: Critical external actions such as application submission, recruiter messaging, and LinkedIn publishing require human approval in the MVP.

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
│   └── testing-playbook.md
├── src/
│   ├── app/
│   │   └── dashboard/
│   ├── agent/
│   │   ├── orchestrator/
│   │   ├── daily-run/
│   │   └── decision-engine/
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
- Candidate profile: `candidate_profile` table
- Jobs: `jobs` table
- Opportunity queue: `opportunity_queue` table
- Applications: `applications` table
- CV versions: `cv_versions` table
- Recruiters: `recruiters` table
- Messages: `recruiter_messages` table
- Follow-ups: `recruiter_followups` table
- Content posts: `linkedin_posts` table
- Agent settings: `agent_settings` table
- Agent events/audit log: `audit_logs` table
- Daily runs: `daily_runs` table

### Storage Principles
1. **Queue Separation**: The database separates active opportunity state from historical records. The opportunity queue represents jobs that are still worth pursuing but have not yet been processed. Once a job is applied to, rejected, or otherwise completed, its active queue entry is removed while the underlying job/application history remains available.
2. **Document Traceability**: Applications reference the exact tailored CV version used for that application. CV metadata contains the corresponding Google Drive file ID so the exact generated document can always be retrieved.
3. **Factual Integrity**: The candidate profile is the authoritative source for factual candidate information. LLM-generated CVs, application answers, messages, and posts may rephrase or prioritize this information but must not introduce unsupported claims.
4. **No Vector Database**: A dedicated vector database is not required for the MVP. SQLite is sufficient for structured state, history, queue management, and configuration.

---

## Key Modules

| Module | Path | Responsibility |
|---|---|---|
| **Agent Orchestrator** | `src/agent/orchestrator/` | Coordinates discovery, matching, queue processing, applications, outreach, content, and reporting |
| **Daily Run** | `src/agent/daily-run/` | Executes the daily job-search cycle and respects the configured application target |
| **Decision Engine** | `src/agent/decision-engine/` | Decides which opportunities should be applied to, queued, rejected, or escalated |
| **Job Discovery** | `src/discovery/` | Retrieves relevant LinkedIn job listings from configured sources |
| **Agent Reach Adapter** | `src/discovery/agent-reach/` | Integrates Agent Reach for job discovery/crawling |
| **Normalization** | `src/discovery/normalization/` | Converts external job listings into the internal job representation |
| **Deduplication** | `src/discovery/deduplication/` | Prevents duplicate jobs from entering the system |
| **Matcher** | `src/discovery/matcher/` | Evaluates job compatibility against the verified candidate profile using LLMs |
| **Opportunity Queue** | `src/queue/opportunity-queue/` | Persists useful undispatched opportunities for future daily runs |
| **Prioritization** | `src/queue/prioritization/` | Ranks queued opportunities according to match quality and configured preferences |
| **Candidate Profile** | `src/candidate/profile/` | Maintains verified candidate facts used by the agent |
| **CV Generator** | `src/generator/cv/` | Creates a tailored CV for each selected job without fabricating candidate information |
| **Application Answers** | `src/generator/application-answers/` | Generates job-specific application answers from verified candidate information |
| **CV Validation** | `src/validation/cv/` | Checks tailored CVs for factual consistency before use |
| **Application Validation** | `src/validation/application/` | Validates application data and answers before submission |
| **Browser Automation** | `src/automation/browser-use/` | Uses Browser Use to navigate forms, upload CVs, and execute approved browser-based applications |
| **Unipile Integration** | `src/linkedin/unipile/` | Handles supported LinkedIn operations such as messaging and other available LinkedIn actions |
| **Recruiter Discovery** | `src/linkedin/recruiters/` | Identifies relevant recruiters for suitable job opportunities |
| **Messaging** | `src/linkedin/messaging/` | Generates, queues, tracks, and sends approved recruiter outreach and follow-ups |
| **Content** | `src/linkedin/content/` | Generates LinkedIn posts approximately every two days for human approval via Dashboard / Email |
| **Google Drive** | `src/drive/google-drive/` | Stores master CVs, tailored CVs, application documents, and reports |
| **EOD Reporting** | `src/reporting/eod/` | Generates and sends the daily job-search activity report via Email/SMTP |
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
- Job requirement extraction
- Candidate/job matching & prioritization
- CV tailoring & application-answer generation
- Recruiter message & response drafting
- LinkedIn content generation & summarization

*(Cheaper models are used for routine classification/extraction; stronger models are reserved for high-value CV tailoring, complex matching, and communication.)*

### Document Storage & Communication
- **Google Drive API**: Persistent storage for generated CV PDFs/DOCX files, application documents, and reports. SQLite stores metadata and Google Drive file IDs.
- **SMTP / Email API**: Sends EOD activity reports, notifications, and email-based content approval requests.

### Database
- **SQLite**: Primary application state, opportunity queue, configuration, application history, recruiter activity, content drafts, and audit events.
- **Drizzle ORM**: Schema definition, migrations, and database client access.

---

## Update Rule & Separation of Responsibilities

This file is updated by the agent whenever a new module, schema, or external dependency is added — same commit as the code change, never deferred.

Any architectural change must preserve the strict separation of responsibilities:

```text
AI Talent Manager    = DECIDES / ORCHESTRATES
Agent Reach          = DISCOVERS JOBS
Matcher              = EVALUATES FIT
Opportunity Queue    = PRESERVES QUALIFYING UNUSED OPPORTUNITIES
CV Generator         = TAILORS CANDIDATE MATERIAL
Validator            = CHECKS FACTUAL / APPLICATION CONSISTENCY
Browser Use          = EXECUTES BROWSER ACTIONS
Unipile              = HANDLES SUPPORTED LINKEDIN OPERATIONS
Google Drive         = STORES DOCUMENTS
SQLite               = STORES SYSTEM STATE + HISTORY
Email                = REPORTS ACTIVITY & DISPATCHES APPROVALS
Human Candidate      = APPROVES CRITICAL EXTERNAL ACTIONS
```

No module should silently absorb another module's responsibility without updating this document in the same commit.