# Task Tracker — ai-talent-manager

## Backlog

### Foundation & Core Infrastructure
- [ ] Database & Core Configuration
  - [ ] SQLite database setup, Drizzle ORM client, and migration scripts (`src/db/`)
  - [ ] Complete database schema definition for jobs, queue, applications, CVs, recruiters, messages, posts, and settings (`src/db/schema.ts`)
  - [ ] Candidate profile store for verified facts (`src/candidate/profile/`)

### Feature 1: Job Discovery & Intelligent Opportunity Queue Engine
- [ ] Discovery & Normalization
  - [ ] Agent Reach adapter for LinkedIn job discovery (`src/discovery/agent-reach/`)
  - [ ] Listing normalization & deduplication engine (`src/discovery/normalization/`, `src/discovery/deduplication/`)
- [ ] LLM Matching & Prioritization
  - [ ] Candidate job fit & compatibility matcher using LLM (`src/discovery/matcher/`)
  - [ ] Persistent opportunity queue & daily target prioritization (`src/queue/`)
- [ ] Agent Orchestration & Daily Run
  - [ ] Agent decision engine & daily-run execution orchestrator (`src/agent/`)

### Feature 2: Tailored CV Generation & Application Automation
- [ ] Generator & Storage
  - [ ] Google Drive API integration for storing master & tailored CVs (`src/drive/google-drive/`)
  - [ ] Factual CV tailoring engine & application answers generator (`src/generator/`)
  - [ ] CV & application answer validation check against candidate profile (`src/validation/`)
- [ ] Human Approval & Submission Automation
  - [ ] Single-user Control Dashboard UI for inspecting & approving applications (`src/app/dashboard/`)
  - [ ] Browser Use automation runner for form navigation & Easy Apply submission (`src/automation/browser-use/`)

### Feature 3: Recruiter Outreach & EOD Activity Reporting
- [ ] LinkedIn & Recruiter Messaging
  - [ ] Unipile integration for LinkedIn messaging (`src/linkedin/unipile/`)
  - [ ] Target recruiter discovery & personalized DM generator (`src/linkedin/recruiters/`, `src/linkedin/messaging/`)
  - [ ] Recruiter message approval & follow-up tracking queue (`src/app/dashboard/`, `src/linkedin/messaging/`)
- [ ] EOD Reporting
  - [ ] EOD report compiler & SMTP/email dispatcher (`src/reporting/eod/`)

### Feature 4: Daily LinkedIn Personal Branding & Email Approval Workflow
- [ ] Content Generation & Scheduling
  - [ ] AI LinkedIn post generator for candidate professional presence (`src/linkedin/content/`)
  - [ ] Email-based post approval workflow & Dashboard publishing trigger (`src/linkedin/content/`, `src/app/dashboard/`)

---

## In Progress
(none yet)

---

## Completed
(none yet)

---

## Rules
- Agent moves an item `Backlog` → `In Progress` before starting work on it, `In Progress` → `Completed` only after tests pass.
- Every completed item gets one line in `docs/changelog-agent.md`.
- Never delete a completed item — it's the project's history.
