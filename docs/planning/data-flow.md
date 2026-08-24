---
status: LOCKED
version: 2
approved_by: human
approved_at: 2026-08-23T02:53:14Z
---

# Data Flow Architecture — ai-talent-manager

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

## Key Data Flow Guarantee
- **Queue-First Execution**: The 10:00 AM run always processes existing queued opportunities first, ensuring discovery is only executed when necessary to fulfill the daily target.
- **Daily Target Boundary**: Once the configured daily application target is reached, selecting new applications stops immediately, preserving remaining queued opportunities for subsequent daily runs.
- **Channel-Agnostic Approval**: The Approval Service abstracts human decisions so both Email one-click links and Next.js Dashboard operate on the exact same `execution_requests` and `approval_events` database records.
- **Autonomy Switch**: Toggling an execution mode to `AUTONOMOUS` simply bypasses human waiting steps in the Approval Service without altering any upstream generation or downstream execution logic.
