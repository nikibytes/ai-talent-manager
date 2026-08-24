# Task Tracker — ai-talent-manager

## Backlog

### Foundation & Core Infrastructure
- [ ] Database & Core Configuration
  - [ ] SQLite database setup, Drizzle ORM client, and migration scripts (`src/db/`)
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

### Feature 1: Job Discovery & Intelligent Opportunity Queue Engine
- [ ] Discovery & Normalization
  - [ ] Agent Reach adapter for LinkedIn job discovery (`src/discovery/agent-reach/`)
  - [ ] Listing normalization & deduplication engine against active queue and historical database (`src/discovery/normalization/`, `src/discovery/deduplication/`)
- [ ] LLM Matching, Stretch Classification & Prioritization
  - [ ] Candidate job fit & compatibility matcher with configurable `stretch_match_threshold` (0.50) & `normal_match_threshold` (0.70) (`src/discovery/matcher/`)
  - [ ] Persistent opportunity queue & daily target prioritization (`src/queue/`)
- [ ] Agent Orchestration & Daily Run Cycle
  - [ ] Shared Daily Run Orchestrator for scheduled default 10:00 trigger and manual `Run Now` (`src/agent/daily-run/`)
  - [ ] Queue-first processing with remaining-slot calculation (`src/agent/daily-run/`, `src/queue/`)
  - [ ] Conditional discovery → match → queue → process repeat loop until target reached/exhausted
  - [ ] Agent decision engine for opportunity selection & daily quota tracking (`src/agent/decision-engine/`)

### Feature 2: Tailored CV Generation & Application Automation
- [ ] Generator, Versioning & Storage
  - [ ] Google Drive API integration for storing master & tailored CVs (`src/drive/google-drive/`)
  - [ ] Factual CV tailoring engine & `cv_versions` history tracker (`src/generator/cv/`)
  - [ ] Application answers generator & factual validation check (`src/generator/application-answers/`, `src/validation/`)
- [ ] Submission Automation & Browser Runner
  - [ ] Control Dashboard UI for inspecting pending execution requests & queue (`src/app/dashboard/`)
  - [ ] Browser Use automation runner for Easy Apply form submission (`src/automation/browser-use/`)
  - [ ] Application executor honoring `APPLICATION_EXECUTION_MODE`
  - [ ] Safe halt/candidate action request for unmapped browser inputs

### Feature 3: Recruiter Outreach & EOD Activity Reporting
- [ ] LinkedIn & Recruiter Messaging
  - [ ] Unipile integration for LinkedIn messaging (`src/linkedin/unipile/`)
  - [ ] Target recruiter discovery & personalized DM generator (`src/linkedin/recruiters/`, `src/linkedin/messaging/`)
  - [ ] Recruiter outreach approval/execution lifecycle honoring `RECRUITER_DM_EXECUTION_MODE`
  - [ ] Recruiter reply tracking and follow-up lifecycle
- [ ] EOD Reporting
  - [ ] EOD report compiler & SMTP/email dispatcher (`src/reporting/eod/`)
  - [ ] Include applications, queued leftovers, stretch jobs, recruiter activity, and pending approvals

### Feature 4: Daily LinkedIn Personal Branding & Approval Workflow
- [ ] Content Generation & Scheduling
  - [ ] AI LinkedIn post generator for candidate professional presence (`src/linkedin/content/`)
  - [ ] ~2-day content trigger/scheduler
  - [ ] Publication workflow honoring `LINKEDIN_POST_EXECUTION_MODE`
  - [ ] Email + Dashboard approval using shared Approval Service

## In Progress
(none yet)

## Completed
(none yet)

## Rules
- Agent moves an item `Backlog` → `In Progress` before starting work on it, `In Progress` → `Completed` only after tests pass.
- Every completed item gets one line in `docs/changelog-agent.md`.
- Never delete a completed item — it's the project's history.
- Every implementation change must preserve the locked queue-first daily loop and execution-mode architecture.
- Security controls are implementation requirements, not post-MVP hardening tasks.
