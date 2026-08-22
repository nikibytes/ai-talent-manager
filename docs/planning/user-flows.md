---
status: LOCKED
version: 1
approved_by: human
approved_at: 2026-08-22T20:04:19Z
---

# User Flows — ai-talent-manager

## Journey 1: Daily Job Search & Application Flow

### Description
The core daily cycle where the agent evaluates queued/new jobs, generates tailored application materials, requests human approval, and submits applications via Browser Use.

```mermaid
flowchart TD
    Start([Daily Agent Run Triggered]) --> CheckQueue{Check Opportunity Queue}
    CheckQueue -->|Existing Jobs >= Daily Target| SelectJobs[Select Top Match Jobs]
    CheckQueue -->|Existing Jobs < Daily Target| DiscoverJobs[Discover Fresh LinkedIn Jobs via Agent Reach/Unipile]
    DiscoverJobs --> Normalize[Normalize & Deduplicate Jobs]
    Normalize --> Matcher[LLM Match Scoring against Candidate Profile]
    Matcher --> SortQueue[Populate Persistent Queue & Sort]
    SortQueue --> SelectJobs
    SelectJobs --> TailorCV[Generate AI Tailored CV PDF/DOCX to Google Drive]
    TailorCV --> TailorAnswers[Generate Application Answers & Cover Letter]
    TailorAnswers --> Validation[Validate Fact Grounding against Candidate Profile]
    Validation --> QueueApproval[Push Application Draft to Dashboard]
    QueueApproval --> HumanCheck{Candidate Review in Dashboard}
    HumanCheck -->|Approved| SubmitBrowser[Browser Use Executes Easy Apply Submission]
    HumanCheck -->|Rejected| MoveRejected[Mark Job Rejected in History]
    HumanCheck -->|Edit Requested| EditDraft[Candidate Edits Answers/CV in Dashboard]
    EditDraft --> QueueApproval
    SubmitBrowser -->|Submission Success| LogSuccess[Log Application & Update History]
    SubmitBrowser -->|Form Error / Unmapped Input| FallbackAlert[Flag Alert for Candidate Assistance]
```

---

## Journey 2: Recruiter Outreach & Relationship Tracking Flow

### Description
Identifies target recruiters at hiring companies, drafts role-specific DMs, requests approval, and dispatches messages via Unipile.

```mermaid
flowchart TD
    JobMatched[Job Qualified for Application] --> RecruiterSearch[Identify Recruiter/Hiring Manager on LinkedIn]
    RecruiterSearch --> DraftDM[Generate Personalized Outreach DM]
    DraftDM --> PushDashboard[Queue Message Draft in Dashboard]
    PushDashboard --> CandidateReview{Candidate Approval}
    CandidateReview -->|Approved| SendUnipile[Dispatch via Unipile API]
    CandidateReview -->|Rejected| SkipDM[Mark Message Skipped]
    SendUnipile --> TrackReply[Monitor Inbound Replies via Unipile]
    TrackReply -->|Recruiter Replied| NotifyCandidate[Flag Notification in Dashboard & EOD Report]
```

---

## Journey 3: LinkedIn Personal Branding Content Flow (~Every 2 Days)

### Description
Generates insightful professional LinkedIn post drafts based on candidate activity & industry topics for approval.

```mermaid
flowchart TD
    TimerTrigger[2-Day Content Timer] --> InspectActivity[Extract Recent Candidate Trends & Topics]
    InspectActivity --> DraftPost[Generate Professional LinkedIn Post Draft]
    DraftPost --> EmailDashboardAlert[Send Content Approval Request via Email & Dashboard]
    EmailDashboardAlert --> PostApproval{Candidate Approval}
    PostApproval -->|Approved| PublishLinkedIn[Publish / Schedule to LinkedIn]
    PostApproval -->|Regenerate| ReDraft[Request New Draft with User Feedback]
    ReDraft --> DraftPost
```

---

## Decision Provenance
- **USER DECISION**: 4 core workflows (Daily Search, Application Approval, Recruiter Outreach, LinkedIn Content).
- **GROUNDED INFERENCE**: Opportunity queue processed before discovering fresh jobs.
- **GROUNDED INFERENCE**: Fallback to manual assistance when Browser Use encounters unmapped application inputs.
