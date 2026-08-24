---
status: LOCKED
version: 2
approved_by: human
approved_at: 2026-08-24T19:20:00+05:30
---

# User Flows — ai-talent-manager

## Journey 1: Daily Job Search & Application Flow

### Description
The daily cycle starts automatically at the configured time (default `10:00`) or manually through `Run Now`. Both entry points invoke the same Daily Run Orchestrator. The run processes the persistent opportunity queue first, discovers only when additional qualifying opportunities are required, repeatedly matches/tailors/processes applications until the daily target is reached, and preserves unused qualifying jobs for future runs.

```mermaid
flowchart TD
    Start([Scheduled 10:00 Trigger OR Manual Run Now]) --> CreateRun[Create Daily Run Log]
    CreateRun --> CheckQueue{Enough queued qualifying jobs for remaining slots?}
    CheckQueue -->|YES| SelectJobs[Select Top Match Jobs up to Remaining Daily Slots]
    CheckQueue -->|NO| Remaining[Calculate Remaining Slots]
    Remaining --> DiscoverJobs[Discover Fresh LinkedIn Jobs via Agent Reach / Supported Sources]
    DiscoverJobs --> Normalize[Normalize & Deduplicate against Queue + History]
    Normalize --> Matcher[LLM Match Scoring + Gap Analysis]
    Matcher --> Classify{Classification}
    Classify -->|>= Normal Threshold| QueueEligible[Add APPLICATION_ELIGIBLE to Persistent Queue]
    Classify -->|Stretch Threshold Range| LogStretch[Persist STRETCH / Almost-There Opportunity]
    Classify -->|Below Stretch Threshold| Discard[Mark NOT_QUALIFIED]
    QueueEligible --> CheckQueue
    SelectJobs --> TailorCV[Generate Tailored CV Version to Google Drive]
    TailorCV --> TailorAnswers[Generate Application Answers & Cover Letter]
    TailorAnswers --> Validation[Validate Facts & Application Consistency]
    Validation --> ExecGate{APPLICATION_EXECUTION_MODE}
    ExecGate -->|MANUAL| ApprovalRequest[Create Execution Request + Approval Request]
    ExecGate -->|AUTONOMOUS| Execute[Pass Validated Request to Executor]
    ApprovalRequest --> ApprovalChannel{Approval Channel}
    ApprovalChannel -->|Email| EmailApproval[Email Approve / Reject Action]
    ApprovalChannel -->|Fallback| DashboardApproval[Dashboard Approval Queue]
    EmailApproval --> Decision{Candidate Decision}
    DashboardApproval --> Decision
    Decision -->|Approved| Execute
    Decision -->|Rejected| Reject[Mark Application Rejected]
    Execute --> Browser[Browser Use Executes Easy Apply]
    Browser -->|Success| LogSuccess[Log Application + Exact CV Version + Outcome]
    Browser -->|Unmapped Input / Failure| Halt[Stop Safely + Candidate Action Request]
    LogSuccess --> TargetCheck{Daily Target Reached?}
    Reject --> TargetCheck
    Halt --> TargetCheck
    TargetCheck -->|NO| CheckQueue
    TargetCheck -->|YES| Preserve[Leave Remaining Qualifying Jobs in Queue]
    Preserve --> EOD[EOD Report]
```

### Run semantics
- The daily application target is configurable.
- The run counts **remaining slots**, not the full target, after applications have already been processed during that run.
- Discovery is conditional and occurs only when the queue cannot fill the remaining slots.
- The loop continues through discovery → match → queue → tailor → execution until the target is reached or no further qualifying work exists.
- Jobs discovered but not selected remain in the persistent queue.
- Stretch/almost-there jobs are retained for reporting/learning and are not automatically applied merely to satisfy the target.

## Journey 2: Recruiter Outreach & Relationship Tracking Flow

### Description
The agent identifies relevant recruiters, drafts personalized role-specific DMs, and routes dispatch through the same configurable execution architecture used for applications.

```mermaid
flowchart TD
    JobMatched[Job Qualified for Application] --> RecruiterSearch[Identify Recruiter / Hiring Manager]
    RecruiterSearch --> DraftDM[Generate Personalized Outreach DM]
    DraftDM --> ExecGate{RECRUITER_DM_EXECUTION_MODE}
    ExecGate -->|MANUAL| ApprovalRequest[Create Execution Request + Approval Request]
    ExecGate -->|AUTONOMOUS| SendUnipile[Dispatch via Unipile]
    ApprovalRequest --> ApprovalChannel{Approval Channel}
    ApprovalChannel -->|Email| EmailApproval[Email Approve / Reject Action]
    ApprovalChannel -->|Fallback| DashboardApproval[Dashboard Approval Queue]
    EmailApproval --> Decision{Candidate Decision}
    DashboardApproval --> Decision
    Decision -->|Approved| SendUnipile
    Decision -->|Rejected| SkipDM[Mark Message Rejected / Skipped]
    SendUnipile --> TrackReply[Monitor Inbound Replies via Unipile]
    TrackReply --> Followup[Follow-up Lifecycle]
    Followup --> NextGate[Future Follow-up Uses Same Execution Mode]
```

## Journey 3: LinkedIn Personal Branding Content Flow (~Every 2 Days)

### Description
Generates professional LinkedIn content based on candidate activity and approved themes. Publication uses the same execution-mode gate.

```mermaid
flowchart TD
    TimerTrigger[~2-Day Content Timer / Candidate Activity] --> InspectActivity[Extract Recent Candidate Trends & Topics]
    InspectActivity --> DraftPost[Generate Professional LinkedIn Post Draft]
    DraftPost --> ExecGate{LINKEDIN_POST_EXECUTION_MODE}
    ExecGate -->|MANUAL| ApprovalRequest[Create Execution Request + Approval Request]
    ExecGate -->|AUTONOMOUS| PublishLinkedIn[Publish / Schedule to LinkedIn]
    ApprovalRequest --> ApprovalChannel{Approval Channel}
    ApprovalChannel -->|Email| EmailApproval[Email Approve / Reject Action]
    ApprovalChannel -->|Fallback| DashboardApproval[Dashboard Approval Queue]
    EmailApproval --> Decision{Candidate Decision}
    DashboardApproval --> Decision
    Decision -->|Approved| PublishLinkedIn
    Decision -->|Rejected| Stop[Discard / Revise Later]
    Decision -->|Regenerate| ReDraft[Request New Draft with User Feedback]
    ReDraft --> DraftPost
```

## Shared Approval Model

```text
Action
  ↓
Execution Request
  ↓
Execution Mode Gate
  ├── MANUAL → Approval Service → Email / Dashboard → Decision → Executor
  └── AUTONOMOUS → Validation → Executor
```

Email and Dashboard are two channels for the same approval record; they are not separate approval implementations.

## Decision Provenance
- **USER DECISION**: Daily Search, Application Execution, Recruiter Outreach, and LinkedIn Content are the core workflows.
- **USER DECISION**: Scheduled default is 10:00 AM and a manual `Run Now` trigger must use the same orchestrator.
- **USER DECISION**: Existing queue is processed first; discovery is conditional; the cycle repeats until the daily target is reached or qualifying work is exhausted.
- **USER DECISION**: Email approval is preferred where feasible, with Dashboard as fallback.
- **USER DECISION**: Application submission, recruiter DM dispatch, and LinkedIn publication each support independent `MANUAL` / `AUTONOMOUS` execution modes, initially `MANUAL`.
- **GROUNDED INFERENCE**: Fallback to manual assistance when Browser Use encounters unmapped application inputs.
