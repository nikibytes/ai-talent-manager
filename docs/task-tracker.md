# Task Tracker — ai-talent-manager

## Backlog

### Foundation & Core Infrastructure
- [ ] Database & Core Configuration
  - [ ] Complete database schema definition for settings, jobs, queue, cv_versions, applications, recruiters, messages, posts, execution_requests, approval_events, and daily_runs (`src/db/schema.ts`)
  - [ ] Candidate profile store for verified facts (`src/candidate/profile/`)
  - [ ] Config loader for daily run time/timezone, daily target, thresholds, manual trigger, and per-action execution modes (`src/config/`)
- [ ] Execution Request & Channel-Agnostic Approval Service
  - [ ] Channel-agnostic Approval Service backend handling `Execution Requests` and `MANUAL` / `AUTONOMOUS` mode switches (`src/approval/service/`)
  - [ ] Email action links with expiring/single-use approval tokens where feasible (`src/approval/email/`)
  - [ ] Dashboard approval fallback using the same execution-request/approval-event records (`src/approval/dashboard/`, `src/app/dashboard/`)
  - [ ] Idempotency and duplicate-execution protection for consequential actions
- [ ] Security Foundation
  - [ ] Secrets/config handling with no credentials in source control or logs
  - [ ] Least-privilege integration scopes and protected credential storage
  - [ ] Input validation, fail-closed authorization, audit logging, and safe error handling
  - [ ] Agent permission allowlist preventing self-modification of execution/security configuration

## In Progress
- [ ] Database & Core Configuration — SQLite database setup, Drizzle ORM client, and migration scripts (`src/db/`)
- [ ] DASH-001_002 — Control Dashboard UI for inspecting pending execution requests & queue (`app/page.tsx`, frontend-only; no database implementation)

## Completed
(none yet)

## Rules
- Agent moves an item `Backlog` → `In Progress` before starting work on it, `In Progress` → `Completed` only after tests pass.
- Every completed item gets one line in `docs/changelog-agent.md`.
- Never delete a completed item — it's the project's history.
- Every implementation change must preserve the locked queue-first daily loop and execution-mode architecture.
- Security controls are implementation requirements, not post-MVP hardening tasks.
