---
status: LOCKED
version: 1
approved_by: human
approved_at: 2026-08-22T20:06:27Z
---

# Traceable Requirements Specification — ai-talent-manager

## Functional Requirements (FR)

### Module 1: Job Discovery & Opportunity Queue
- **FR-DISC-01**: The system shall poll configured LinkedIn job sources via Agent Reach / Unipile.
- **FR-DISC-02**: The system shall normalize job listings and eliminate duplicate job postings.
- **FR-MATCH-01**: The system shall evaluate job fit against candidate facts using LLM scoring (0–100%) with explicit gap analysis.
- **FR-QUEUE-01**: The system shall maintain a persistent opportunity queue in SQLite for jobs that exceed the daily target.
- **FR-QUEUE-02**: The daily-run orchestrator shall process existing queued opportunities before initiating fresh discovery.

### Module 2: Tailored CV & Application Generation
- **FR-CV-01**: The system shall generate job-specific tailored CVs (PDF/DOCX) using verified candidate facts.
- **FR-CV-02**: Generated CVs shall be saved to Google Drive and linked in the local database.
- **FR-APP-01**: The system shall generate customized cover letters and Easy Apply form answers.
- **FR-VAL-01**: The system shall validate that no generated CV or application answer introduces unverified skills, metrics, or experiences.

### Module 3: Execution & Human Approval Gate
- **FR-GATE-01**: All external application submissions, recruiter DMs, and LinkedIn posts must enter a pending approval state.
- **FR-AUTO-01**: Upon explicit human approval in the Dashboard, Browser Use shall execute automated LinkedIn Easy Apply submission.
- **FR-AUTO-02**: If Browser Use encounters an unmapped custom form input, it shall halt execution and raise a candidate action request.

### Module 4: Recruiter Outreach & EOD Reporting
- **FR-MSG-01**: The system shall identify target recruiters at hiring companies and draft personalized DMs for approval.
- **FR-MSG-02**: Approved messages shall be dispatched via Unipile API and tracked for inbound replies.
- **FR-RPT-01**: The system shall generate and dispatch a daily EOD summary report via Email/SMTP.

### Module 5: LinkedIn Personal Branding
- **FR-POST-01**: The system shall generate professional LinkedIn posts approximately every 2 days.
- **FR-POST-02**: Post drafts shall be delivered for human approval via Dashboard and Email before publication.

---

## Non-Functional Requirements (NFR)

- **NFR-SEC-01**: LinkedIn credentials and API keys shall be stored locally in `.env` and never logged or exposed.
- **NFR-PERF-01**: Job scoring and CV tailoring shall complete within 30 seconds per opportunity.
- **NFR-REL-01**: In the event of network disruption or API failure, state shall remain safely persisted in SQLite without lost queue items.

---

## Traceability Matrix & Decision Provenance
- **USER DECISION**: FR-GATE-01, FR-VAL-01, FR-QUEUE-02 (Human approval, zero hallucination, queue-first processing).
- **GROUNDED INFERENCE**: NFR-SEC-01 (Single-user local environment security).
