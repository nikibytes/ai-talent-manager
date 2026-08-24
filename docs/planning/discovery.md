---
status: LOCKED
version: 2
approved_by: human
approved_at: 2026-08-23T02:53:14Z
---

# Discovery — ai-talent-manager

## Objective & Problem
- **USER DECISION**: Build an AI talent manager that acts as a transparent representative for a single candidate, discovering, evaluating, matching, and applying to relevant LinkedIn job opportunities while managing recruiter outreach, EOD reporting, and professional LinkedIn presence under configurable human approval / autonomous execution modes.
- **USER DECISION**: Target user is a single job seeker (personal local deployment for candidate's own job search).

## Discovery & Execution Responsibilities
1. **Job Discovery**: Polling LinkedIn job sources via Agent Reach / supported LinkedIn discovery APIs (Browser Use is strictly reserved for browser execution, NOT job discovery).
2. **Queue-First Strategy**: At the daily scheduled start (default 10:00 AM), process existing persistent queue first. Perform fresh discovery only if existing qualifying opportunities are less than the remaining daily application target.
3. **Deduplication**: Deduplicate discovered jobs against both active opportunity queue AND historical job/application records in SQLite to prevent rediscovering or reapplying to previously processed jobs.
4. **Matcher & Classification**: Evaluates candidate fit using LLM scoring against verified candidate facts and configurable thresholds:
   - `APPLICATION_ELIGIBLE`: Match score >= `normal_match_threshold` (default `0.70`).
   - `STRETCH`: Match score between `stretch_match_threshold` (default `0.50`) and `normal_match_threshold`. Stretch jobs are logged & reported in EOD summary for candidate insight.
   - `NOT_QUALIFIED`: Match score < `stretch_match_threshold`.
5. **Tailored Application Engine**: Generates tailored CV versions (saved to Google Drive & metadata stored in SQLite) and job-specific application answers from verified candidate facts.
6. **Execution Request & Approval Service**: Applications, recruiter DMs, and LinkedIn posts generate channel-agnostic `Execution Requests`. In `MANUAL` mode, requests require approval via Email or Dashboard; in `AUTONOMOUS` mode, requests pass directly to execution.

## Key Constraints & Guardrails
- **GROUNDED INFERENCE**: Single-user local system; no public SaaS multi-tenant auth required for MVP.
- **USER DECISION**: Factual Integrity — AI must not impersonate candidate or fabricate candidate experience, skills, or achievements beyond verified candidate profile.
- **USER DECISION**: Channel-Agnostic Approval — Email with action links and Next.js Dashboard share the exact same approval backend.

## Provenance Summary
- **USER DECISION**: Stack choice (TypeScript, Node.js, Next.js Dashboard, SQLite, Browser Use, Unipile, Agent Reach, Google Drive API, Email/SMTP).
- **USER DECISION**: Queue-first discovery and configurable stretch thresholds (`0.50` / `0.70`).
- **USER DECISION**: Configurable per-action execution modes (`MANUAL` vs `AUTONOMOUS`).
