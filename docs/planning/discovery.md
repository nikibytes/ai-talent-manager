---
status: LOCKED
version: 3
approved_by: human
approved_at: 2026-08-24T19:20:00+05:30
---

# Discovery — ai-talent-manager

## Objective & Problem
- **USER DECISION**: Build an AI talent manager that acts as a transparent representative for a single candidate, discovering, evaluating, matching, and preparing relevant LinkedIn job opportunities while managing recruiter outreach, EOD reporting, and professional LinkedIn presence under configurable execution modes.
- **USER DECISION**: Target user is a single job seeker (personal local deployment for candidate's own job search).

## Discovery & Execution Responsibilities
1. **Job Discovery**: Polling LinkedIn job sources via Agent Reach / supported LinkedIn discovery APIs (Browser Use is reserved for browser execution, NOT primary job discovery).
2. **Daily Run Entry**: The daily workflow can begin through the scheduled default `10:00 AM` trigger or the manual `Run Now` trigger. Both invoke the same Daily Run Orchestrator.
3. **Queue-First Strategy**: At the start of each run, process the existing persistent queue first. Calculate the **remaining application slots** for the current run; perform fresh discovery only if the queue cannot fill those remaining slots.
4. **Discovery Loop**: Newly discovered jobs are normalized, deduplicated, matched/classified, and qualifying opportunities are returned to the same persistent queue. The run then returns to queue processing and repeats until the daily target is reached or no further qualifying opportunities are available.
5. **Deduplication**: Deduplicate discovered jobs against both active opportunity queue AND historical job/application records in SQLite to prevent rediscovering or reapplying to previously processed jobs.
6. **Matcher & Classification**: Evaluate candidate fit using LLM scoring against verified candidate facts and configurable thresholds:
   - `APPLICATION_ELIGIBLE`: Match score >= `normal_match_threshold` (default `0.70`).
   - `STRETCH`: Match score between `stretch_match_threshold` (default `0.50`) and `normal_match_threshold`. Stretch jobs are persisted and reported for candidate insight.
   - `NOT_QUALIFIED`: Match score < `stretch_match_threshold`.
7. **Tailored Application Engine**: Generate tailored CV versions (saved to Google Drive with metadata stored in SQLite) and job-specific application answers from verified candidate facts.
8. **Execution Request & Approval Service**: Applications, recruiter DMs, and LinkedIn posts generate channel-agnostic `Execution Requests`. In `MANUAL` mode, requests require approval via Email or Dashboard; in `AUTONOMOUS` mode, validated requests pass directly to the normal executor.

## Key Constraints & Guardrails
- **GROUNDED INFERENCE**: Single-user local system; no public SaaS multi-tenant auth required for MVP.
- **USER DECISION**: Factual Integrity — AI must not impersonate candidate or fabricate candidate experience, skills, or achievements beyond verified candidate profile.
- **USER DECISION**: Channel-Agnostic Approval — Email with action links and Next.js Dashboard share the exact same approval backend.
- **USER DECISION**: The agent cannot change execution modes or enable autonomy itself.
- **GROUNDED INFERENCE**: Stretch opportunities should not be selected merely to satisfy the daily application target.

## Provenance Summary
- **USER DECISION**: Stack choice (TypeScript, Node.js, Next.js Dashboard, SQLite, Browser Use, Unipile, Agent Reach, Google Drive API, Email/SMTP).
- **USER DECISION**: Queue-first discovery, remaining-slot loop, and configurable stretch thresholds (`0.50` / `0.70`).
- **USER DECISION**: Configurable per-action execution modes (`MANUAL` vs `AUTONOMOUS`) with `MANUAL` as the initial validation default.
- **USER DECISION**: Manual `Run Now` trigger for testing without waiting for the scheduled time.
