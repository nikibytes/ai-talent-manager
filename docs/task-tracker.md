# Task Tracker — ai-talent-manager

## Backlog

### Foundation & Core Infrastructure
- [ ] Database & Core Configuration
  - [ ] SQLite database setup, Drizzle ORM client, and migration scripts (`src/db/`)
  - [ ] Complete database schema definition for settings, jobs, queue, cv_versions, applications, recruiters, messages, posts, execution_requests, approval_events, and daily_runs (`src/db/schema.ts`)
  - [ ] Candidate profile store for verified facts (`src/candidate/profile/`)
- [ ] Execution Request & Channel-Agnostic Approval Service
  - [ ] Channel-agnostic Approval Service backend handling `Execution Requests` and `MANUAL` / `AUTONOMOUS` mode switches (`src/approval/service/`)
  - [ ] Email action links handler for one-click email approval (`src/approval/email/`)

### Feature 1: Job Discovery & Intelligent Opportunity Queue Engine
- [ ] Discovery & Normalization
  - [ ] Agent Reach adapter for LinkedIn job discovery (`src/discovery/agent-reach/`)
  - [ ] Listing normalization & deduplication engine against active queue and historical database (`src/discovery/normalization/`, `src/discovery/deduplication/`)
- [ ] LLM Matching, Stretch Classification & Prioritization
  - [ ] Candidate job fit & compatibility matcher with configurable `stretch_match_threshold` (0.50) & `normal_match_threshold` (0.70) (`src/discovery/matcher/`)
  - [ ] Persistent opportunity queue & daily target prioritization (`src/queue/`)
- [ ] Agent Orchestration & 10:00 AM Daily Run Cycle
  - [ ] 10:00 AM daily run cycle orchestrator with queue-first processing (`src/agent/daily-run/`)
  - [ ] Agent decision engine for opportunity selection & daily quota tracking (`src/agent/decision-engine/`)

### Feature 2: Tailored CV Generation & Application Automation
- [ ] Generator, Versioning & Storage
  - [ ] Google Drive API integration for storing master & tailored CVs (`src/drive/google-drive/`)
  - [ ] Factual CV tailoring engine & `cv_versions` history tracker (`src/generator/cv/`)
  - [ ] Application answers generator & factual validation check (`src/generator/application-answers/`, `src/validation/`)
- [ ] Submission Automation & Browser Runner
  - [ ] Browser Use automation runner for Easy Apply form submission (`src/automation/browser-use/`)

### Feature 3: Recruiter Outreach & EOD Activity Reporting
- [ ] LinkedIn & Recruiter Messaging
  - [ ] Unipile integration for LinkedIn messaging (`src/linkedin/unipile/`)
  - [ ] Target recruiter discovery & personalized DM generator (`src/linkedin/recruiters/`, `src/linkedin/messaging/`)
  - [ ] Recruiter outreach approval queue & follow-up status lifecycle (`src/linkedin/messaging/`)
- [ ] EOD Reporting
  - [ ] EOD report compiler & SMTP/email dispatcher (`src/reporting/eod/`)

### Feature 4: Daily LinkedIn Personal Branding & Email Approval Workflow
- [ ] Content Generation & Scheduling
  - [ ] AI LinkedIn post generator for candidate professional presence (`src/linkedin/content/`)
  - [ ] Email & Dashboard post approval workflow with scheduling trigger (`src/linkedin/content/`, `src/app/dashboard/`)

---

## In Progress
- [ ] DASH-001_002 — Control Dashboard UI for inspecting pending execution requests & queue (`app/page.tsx`, frontend-only; no database implementation)

---

## Completed
(none yet)

---

## Rules
- Agent moves an item `Backlog` → `In Progress` before starting work on it, `In Progress` → `Completed` only after tests pass.
- Every completed item gets one line in `docs/changelog-agent.md`.
- Never delete a completed item — it's the project's history.
