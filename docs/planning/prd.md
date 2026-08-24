---
status: LOCKED
version: 2
approved_by: human
approved_at: 2026-08-24T19:20:00+05:30
---

# Product Requirements Document (PRD) — ai-talent-manager

## 1. Executive Summary & Objective
- **USER DECISION**: The AI Talent Manager is a personal career automation assistant for a single candidate.
- **USER DECISION**: It discovers LinkedIn jobs, scores fit using LLMs, maintains a persistent opportunity queue, generates tailored CVs/application materials, prepares applications for execution, manages recruiter outreach, generates LinkedIn personal-branding content, and sends EOD reports.
- **USER DECISION**: Consequential external actions use configurable execution modes. Initial validation starts in `MANUAL` mode; `AUTONOMOUS` mode may be enabled independently per action after the system proves reliable.
- **USER DECISION**: The AI Talent Manager is a separate, openly disclosed AI identity when representing itself. It must not impersonate the candidate or fabricate candidate facts.

## 2. Target Persona & Users
- **USER DECISION**: Single job seeker (candidate).
- **GROUNDED INFERENCE**: Local single-user system requiring no public SaaS multi-user registration or tenant authentication.

## 3. Product Scope & MVP Capabilities
1. **Job Discovery & Matching Engine**:
   - Discover LinkedIn listings through Agent Reach / supported LinkedIn discovery integrations.
   - Normalize and deduplicate listings.
   - Score fit (0–100%) against verified candidate facts with explicit gap analysis.
   - Classify opportunities as application-eligible, stretch/almost-there, or not qualified.
   - Maintain a persistent queue for qualifying jobs that cannot be processed in the current daily run.
2. **Tailored Application Engine**:
   - Generate job-specific tailored CVs (PDF/DOCX) and application materials using verified candidate facts.
   - Save generated documents to Google Drive and retain the exact CV version used by each application.
   - Generate customized cover letters and Easy Apply answers.
   - Route application submission through the configurable execution-mode gate.
   - Execute approved browser submissions via Browser Use.
3. **Recruiter Outreach & EOD Reporting**:
   - Identify relevant recruiters at hiring companies.
   - Generate personalized LinkedIn DMs and follow-ups.
   - Route DM dispatch through the configurable execution-mode gate and Unipile.
   - Track recruiter interactions and follow-up lifecycle.
   - Send daily EOD activity reports via Email/SMTP.
4. **Personal Branding**:
   - Generate a professional LinkedIn post approximately every two days.
   - Route publication through the configurable execution-mode gate.
   - Prefer email approval links, with the dashboard as the fallback approval channel.

## 4. Daily Run & Scheduling
- **USER DECISION**: Default daily job-search start time is **10:00 AM**, with both time and timezone configurable.
- **USER DECISION**: A manual `Run Now` trigger must be available during initial testing and must invoke the same Daily Run Orchestrator as the scheduled trigger.
- **USER DECISION**: Each run processes the existing persistent queue first and performs fresh discovery only when the queue cannot provide enough qualifying opportunities to fill the remaining daily application slots.
- **USER DECISION**: Discovery/matching/tailoring/application processing repeats until the configured daily application target is reached or no further qualifying work is available.
- **USER DECISION**: Unselected qualifying jobs remain in the queue for subsequent runs.

## 5. Execution Modes & Approval
The following execution modes are independently configurable:

```text
APPLICATION_EXECUTION_MODE=MANUAL
RECRUITER_DM_EXECUTION_MODE=MANUAL
LINKEDIN_POST_EXECUTION_MODE=MANUAL
```

Supported values are `MANUAL` and `AUTONOMOUS`.

- `MANUAL`: create an execution request and obtain candidate approval before the external side effect.
- `AUTONOMOUS`: after all validation and safety checks pass, bypass the human waiting step and execute through the normal executor.
- **USER DECISION**: The agent itself must never be able to change an execution mode or enable autonomy.
- Email is the preferred approval channel where technically feasible; the dashboard is the fallback. Both operate on the same execution-request/approval-event records.

## 6. Non-Goals (Explicitly Out of Scope)
- **USER DECISION**: Non-LinkedIn job search platforms (Indeed, Glassdoor, ZipRecruiter, etc.).
- **USER DECISION**: Multi-user SaaS authentication and tenant billing.
- **USER DECISION**: Warm introduction network mapping.
- Autonomous execution enabled by default during initial validation.

## 7. Success Criteria & Metrics
- [ ] Initial validation period operates with all three consequential execution modes set to `MANUAL`.
- [ ] 0 factual fabrications in CVs or application answers.
- [ ] Daily run processes existing opportunity queue before discovering new jobs.
- [ ] Manual `Run Now` and scheduled 10:00 AM triggers produce the same orchestration behavior.
- [ ] Remaining qualifying opportunities persist for subsequent runs.
- [ ] 100% EOD reports delivered successfully via email.
- [ ] Autonomous mode can be enabled independently per action without changing upstream generation or downstream executor architecture.

## 8. Security Baseline
- Secrets must never be committed or exposed in logs, browser/client code, generated prompts, or reports.
- LinkedIn passwords must not be stored by the application.
- External credentials/tokens must use least-privilege scopes and protected local storage; persisted sensitive tokens must be encrypted where applicable.
- LLM output and external content are untrusted input and must be validated before becoming executable actions.
- Approval links must be cryptographically random, scoped, expiring, and single-use where possible.
- Consequential operations must be idempotent to prevent duplicate submissions/messages/publications.
- The system must fail closed when authorization, validation, or required state is ambiguous.
- The agent must not modify its own permissions, security configuration, or execution-mode settings.

## 9. Decision Provenance
- **USER DECISION**: Scope features 1-4, single-user model, configurable daily target, queue-first processing, manual testing period, independent manual/autonomous modes, separate disclosed AI identity, and security baseline.
- **GROUNDED INFERENCE**: Persistent opportunity queue mechanics & single-user local deployment.
- **ASSUMPTION**: Browser Use handles LinkedIn DOM changes with standard form selectors and fallback alerts.
