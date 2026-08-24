---
status: LOCKED
version: 2
approved_by: human
approved_at: 2026-08-24T19:20:00+05:30
---

# Traceable Requirements Specification — ai-talent-manager

## Functional Requirements (FR)

### Module 1: Scheduling, Daily Run & Opportunity Queue
- **FR-RUN-01**: The system shall support a configurable scheduled daily-run time, defaulting to `10:00`, with a configurable timezone.
- **FR-RUN-02**: The system shall provide a manual `Run Now` trigger for testing and operational use.
- **FR-RUN-03**: Scheduled and manual triggers shall invoke the same Daily Run Orchestrator implementation.
- **FR-DISC-01**: The system shall discover configured LinkedIn job sources via Agent Reach / supported LinkedIn discovery integrations.
- **FR-DISC-02**: Browser Use shall not be required as the primary job-discovery mechanism.
- **FR-DISC-03**: The system shall normalize job listings and eliminate duplicate job postings.
- **FR-MATCH-01**: The system shall evaluate job fit against verified candidate facts using LLM scoring (0–100%) with explicit gap analysis.
- **FR-MATCH-02**: The system shall classify opportunities using configurable normal and stretch thresholds.
- **FR-QUEUE-01**: The system shall maintain a persistent opportunity queue in SQLite for qualifying jobs that cannot be processed in the current daily run.
- **FR-QUEUE-02**: The Daily Run Orchestrator shall process existing queued opportunities before initiating fresh discovery.
- **FR-QUEUE-03**: Fresh discovery shall occur only when the existing queue cannot fill the remaining application slots for the configured daily target.
- **FR-QUEUE-04**: The discovery → match → queue → process cycle shall repeat until the daily target is reached or no further qualifying work is available.
- **FR-QUEUE-05**: Unselected qualifying opportunities shall remain queued for subsequent daily runs.
- **FR-STRETCH-01**: Stretch/almost-there jobs shall be persisted for candidate insight and EOD reporting rather than silently discarded.
- **FR-DEDUPE-01**: Discovery shall deduplicate against active queue records and historical application/outcome records to prevent duplicate processing.

### Module 2: Tailored CV & Application Generation
- **FR-CV-01**: The system shall generate job-specific tailored CVs (PDF/DOCX) using verified candidate facts.
- **FR-CV-02**: Generated CVs shall be saved to Google Drive and linked in the local database.
- **FR-CV-03**: The exact CV version used for an application shall be traceable from the application record.
- **FR-APP-01**: The system shall generate customized cover letters and Easy Apply form answers.
- **FR-VAL-01**: The system shall validate that no generated CV or application answer introduces unverified skills, metrics, or experiences.

### Module 3: Execution & Configurable Approval Gate
- **FR-GATE-01**: Application submission, recruiter DM dispatch, and LinkedIn publication shall each pass through an execution-mode gate.
- **FR-GATE-02**: Each consequential action shall independently support `MANUAL` and `AUTONOMOUS` execution modes, defaulting to `MANUAL`.
- **FR-GATE-03**: In `MANUAL` mode, an execution request shall enter a pending approval state before the external side effect occurs.
- **FR-GATE-04**: Approval shall be channel-agnostic: Email action links are preferred where feasible and the Next.js Dashboard is the fallback; both shall operate on the same execution-request and approval-event records.
- **FR-GATE-05**: In `AUTONOMOUS` mode, the validated execution request may bypass human waiting and pass directly to the normal executor.
- **FR-GATE-06**: The agent shall not be able to change execution modes, enable autonomy, or modify its own permissions.
- **FR-AUTO-01**: Upon an approved application execution request, Browser Use shall execute the automated LinkedIn Easy Apply submission.
- **FR-AUTO-02**: If Browser Use encounters an unmapped custom form input, it shall halt execution and raise a candidate action request rather than guessing.
- **FR-IDEMP-01**: Consequential execution shall be idempotent or protected against duplicate submission/message/publication caused by retries.

### Module 4: Recruiter Outreach & EOD Reporting
- **FR-MSG-01**: The system shall identify target recruiters at hiring companies and draft personalized DMs.
- **FR-MSG-02**: Recruiter DM drafts shall pass through `RECRUITER_DM_EXECUTION_MODE` before dispatch.
- **FR-MSG-03**: Approved/authorized messages shall be dispatched via Unipile and tracked for inbound replies.
- **FR-MSG-04**: Recruiter follow-ups shall have an explicit lifecycle and shall not be dispatched outside the configured execution mode.
- **FR-RPT-01**: The system shall generate and dispatch a daily EOD summary report via Email/SMTP.

### Module 5: LinkedIn Personal Branding
- **FR-POST-01**: The system shall generate professional LinkedIn posts approximately every 2 days.
- **FR-POST-02**: Post publication shall pass through `LINKEDIN_POST_EXECUTION_MODE`.
- **FR-POST-03**: In `MANUAL` mode, post drafts shall be delivered for human approval via Email and/or Dashboard before publication.

## Non-Functional Requirements (NFR)

### Security
- **NFR-SEC-01**: Secrets, API keys, OAuth tokens, session data, and credentials shall never be committed to source control or written to application logs.
- **NFR-SEC-02**: The application shall not store LinkedIn passwords and shall use least-privilege external integration scopes.
- **NFR-SEC-03**: Persisted sensitive credentials/tokens shall use protected local storage and encryption where applicable.
- **NFR-SEC-04**: LLM output and external content shall be treated as untrusted input and validated before becoming executable actions.
- **NFR-SEC-05**: Email approval links shall use cryptographically random, scoped, expiring, single-use tokens where feasible.
- **NFR-SEC-06**: Dashboard approval endpoints shall enforce authentication/authorization, CSRF protection where applicable, input validation, and rate limiting.
- **NFR-SEC-07**: The system shall fail closed when authorization, validation, or required state is ambiguous.
- **NFR-SEC-08**: The agent shall not modify its own permissions, security configuration, or execution-mode settings.
- **NFR-SEC-09**: Browser automation shall run with the minimum required access and isolated session context.
- **NFR-SEC-10**: Consequential actions shall produce an auditable record of request, decision, execution outcome, and failure reason without leaking secrets.

### Performance & Reliability
- **NFR-PERF-01**: Job scoring and CV tailoring should complete within 30 seconds per opportunity under normal service conditions, excluding external provider latency.
- **NFR-REL-01**: In the event of network disruption or API failure, state shall remain safely persisted in SQLite without lost queue items.
- **NFR-REL-02**: Retries shall use bounded retry/backoff behavior and shall not bypass approval or idempotency safeguards.

## Traceability Matrix & Decision Provenance
- **USER DECISION**: Queue-first processing, configurable daily target, 10:00 default scheduled run, manual `Run Now`, independent execution modes, initial `MANUAL` operation, email approval preference with dashboard fallback, and zero-fabrication requirement.
- **GROUNDED INFERENCE**: Persistent queue, single-user local deployment, idempotency and auditability requirements.
