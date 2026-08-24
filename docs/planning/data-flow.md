---
status: LOCKED
version: 3
approved_by: human
approved_at: 2026-08-24T19:20:00+05:30
---

# Data Flow Architecture — ai-talent-manager

```text
Scheduled 10:00 AM Trigger (Configurable daily_run_time & timezone)
                 OR
Manual "Run Now" Trigger
                 ↓
        Same Daily Run Orchestrator
                 ↓
        Create Daily Run Log Entity
                 ↓
   Inspect Persistent Opportunity Queue (SQLite)
                 ↓
Calculate Remaining Application Slots
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ Can the existing queue fill the remaining slots?             │
│                                                             │
│ YES → Select highest-priority qualifying jobs up to the     │
│       remaining daily application slots                    │
│                                                             │
│ NO  → Calculate shortage                                    │
│       ↓                                                     │
│       Discover Jobs via Agent Reach / supported sources     │
│       (Browser Use NOT used for primary discovery)           │
│       ↓                                                     │
│       Normalize + Deduplicate against Queue + History       │
│       ↓                                                     │
│       LLM Matcher & Classifier                              │
│       ├── Score >= normal threshold → APPLICATION_ELIGIBLE  │
│       │                                  → Persistent Queue │
│       ├── Stretch threshold range → STRETCH                │
│       │                              → Stretch Log          │
│       └── Score < stretch threshold → NOT_QUALIFIED        │
└─────────────────────────────────────────────────────────────┘
                 ↓
      Return to Queue Processing
                 ↓
Select applications up to remaining daily target
(Unselected qualifying opportunities remain queued)
                 ↓
Generate Tailored CV Version (Google Drive PDF/DOCX)
+ Application Answers / Cover Letter
(Validated against Candidate Profile facts)
                 ↓
Create Application + Execution Request
                 ↓
Check APPLICATION_EXECUTION_MODE
                 ↓
┌─────────────────────────────────────────────────────────────┐
│ Execution Mode Gate                                          │
│                                                             │
│ MANUAL → Approval Service                                   │
│          ├── Preferred: Email approval link                 │
│          └── Fallback: Dashboard approval queue             │
│          Candidate Decision → APPROVED / REJECTED           │
│                                                             │
│ AUTONOMOUS → Validation passes → Executor                   │
└─────────────────────────────────────────────────────────────┘
                 ↓
Executor Service (Browser Use for Easy Apply)
                 ↓
Record application, exact CV version, execution outcome
                 ↓
Are remaining application slots > 0?
        ├── YES → return to queue processing
        └── NO  → preserve leftovers → complete run
                 ↓
EOD Report Generator → Email Dispatch


Parallel Recruiter Outreach Flow:

Target Company / Job
        ↓
Recruiter Discovery (Agent Reach / supported LinkedIn integration)
        ↓
AI Personalized DM Draft
        ↓
Execution Request (RECRUITER_DM_EXECUTION_MODE)
        ↓
MANUAL → Approval Service (Email / Dashboard)
AUTONOMOUS → Validated request directly to executor
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
MANUAL → Approval Service (Email / Dashboard)
AUTONOMOUS → Validated request directly to publisher
        ↓
LinkedIn Publishing / Scheduling
```

## Key Data Flow Guarantees
- **Single Orchestration Path**: Scheduled and manual triggers invoke the same Daily Run Orchestrator; manual testing cannot accidentally use a different workflow.
- **Queue-First Execution**: Every daily run processes existing queued opportunities first.
- **Conditional Discovery**: Fresh discovery occurs only when the queue cannot fill the remaining application slots.
- **Repeat Until Target**: Discovery → normalization → matching → queueing → processing repeats until the configured daily application target is reached or no further qualifying work is available.
- **Daily Target Boundary**: The orchestrator tracks remaining slots, not the original target, and stops selecting applications immediately when the target is reached.
- **Persistent Leftovers**: Unselected qualifying opportunities remain in the persistent queue for future runs.
- **Stretch Preservation**: Stretch jobs are persisted and reported for candidate insight rather than used to pad the application count.
- **Channel-Agnostic Approval**: The Approval Service abstracts human decisions so Email action links and the Next.js Dashboard operate on the same `execution_requests` and `approval_events` records.
- **Autonomy Switch**: Toggling an execution mode to `AUTONOMOUS` bypasses only the human waiting step; generation, validation, idempotency, audit, and executor safeguards remain unchanged.
- **Fail Closed**: Ambiguous authorization, validation failures, unmapped browser inputs, or duplicate-risk conditions stop the action safely rather than guessing.
