---
status: LOCKED
version: 1
approved_by: human
approved_at: 2026-08-22T19:52:42Z
---

# Discovery — ai-talent-manager

## Objective & Problem
**USER DECISION**: Build an AI talent manager that autonomously finds, evaluates, matches, and applies to relevant LinkedIn job opportunities while managing recruiter outreach, daily EOD reporting, and professional LinkedIn presence under explicit human approval.

**USER DECISION**: Target user is a single job seeker (personal local deployment for the candidate's own job search).

## MVP Capabilities (v1 Scope)
1. **Job Discovery & Matching**: Polls LinkedIn job sources via Agent Reach / Unipile / Browser Use, normalizes & deduplicates listings, scores candidate fit with LLM, and populates a persistent SQLite opportunity queue.
2. **Tailored Application Engine**: Generates tailored CVs (stored on Google Drive) and job-specific application answers from verified candidate facts. Executes Easy Apply submissions via Browser Use after human approval.
3. **Recruiter Outreach & EOD Reporting**: Discovers relevant recruiters, generates personalized outreach DMs via Unipile, and dispatches daily EOD activity summary reports via Email/SMTP.
4. **Personal Branding**: Generates professional LinkedIn posts (~every 2 days) dispatched for approval via Dashboard and Email.

## Key Constraints & Guardrails
- **GROUNDED INFERENCE**: Single-user local system; no public SaaS multi-tenant auth required for MVP.
- **USER DECISION**: Human Approval Gate — all application submissions, recruiter messages, and LinkedIn posts require explicit human approval.
- **GROUNDED INFERENCE**: Factual Integrity — LLM must not fabricate candidate experience, skills, or achievements beyond verified candidate profile.

## Provenance Summary
- **USER DECISION**: Stack choice (TypeScript, Node.js, Next.js Dashboard, SQLite, Browser Use, Unipile, Agent Reach, Google Drive API, Email/SMTP).
- **GROUNDED INFERENCE**: Persistent opportunity queue carries unused qualified jobs across daily runs.
- **ASSUMPTION**: Local SQLite database handles state, queue, and audit logs without requiring a vector DB for MVP.
