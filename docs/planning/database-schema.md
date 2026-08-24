---
status: LOCKED
version: 3
approved_by: human
approved_at: 2026-08-24T19:20:00+05:30
---

# Database Schema Specification — ai-talent-manager

SQLite Database Schema defined via Drizzle ORM (`src/db/schema.ts`).

## 1. Candidate & System Configuration (`agent_settings`)
- `id` (text, primary key)
- `candidate_name` (text)
- `candidate_email` (text)
- `daily_run_time` (text, default `'10:00'`)
- `timezone` (text, default to configured deployment/user timezone; explicit configuration required rather than assuming UTC)
- `daily_application_target` (integer, configurable)
- `normal_match_threshold` (real, default `0.70`)
- `stretch_match_threshold` (real, default `0.50`)
- `application_execution_mode` (text, `'MANUAL'` | `'AUTONOMOUS'`, default `'MANUAL'`)
- `recruiter_dm_execution_mode` (text, `'MANUAL'` | `'AUTONOMOUS'`, default `'MANUAL'`)
- `linkedin_post_execution_mode` (text, `'MANUAL'` | `'AUTONOMOUS'`, default `'MANUAL'`)
- `manual_trigger_enabled` (boolean, default `true`)

## 2. Jobs & Opportunity Queue (`jobs`, `opportunity_queue`)
- **`jobs`**:
  - `id` (text, primary key)
  - `job_url` (text, unique)
  - `title` (text), `company` (text), `location` (text), `description` (text)
  - `match_score` (real)
  - `match_classification` (text: `'APPLICATION_ELIGIBLE'`, `'STRETCH'`, `'NOT_QUALIFIED'`)
  - `gap_analysis_json` (text)
  - `status` (text: `'DISCOVERED'`, `'QUEUED'`, `'STRETCH_LOGGED'`, `'REJECTED'`)
  - `created_at` (timestamp)
- **`opportunity_queue`**:
  - `id` (text, primary key)
  - `job_id` (text, foreign key → `jobs.id`)
  - `priority_rank` (integer)
  - `status` (text: `'QUEUED'`, `'SELECTED'`, `'EXHAUSTED'`)
  - `queued_at` (timestamp)

## 3. Tailored CVs & Applications (`cv_versions`, `applications`)
- **`cv_versions`**:
  - `id` (text, primary key)
  - `job_id` (text, foreign key → `jobs.id`)
  - `version_number` (integer)
  - `google_drive_file_id` (text)
  - `google_drive_url` (text)
  - `content_diff_json` (text)
  - `created_at` (timestamp)
- **`applications`**:
  - `id` (text, primary key)
  - `job_id` (text, foreign key → `jobs.id`)
  - `cv_version_id` (text, foreign key → `cv_versions.id`)
  - `cover_letter_text` (text)
  - `application_answers_json` (text)
  - `status` (text: `'DRAFT'`, `'PENDING_APPROVAL'`, `'APPROVED'`, `'REJECTED'`, `'SUBMITTING'`, `'SUBMITTED'`, `'FAILED'`)
  - `submitted_at` (timestamp)
  - `error_log` (text)

## 4. Recruiter Outreach & Follow-ups (`recruiters`, `recruiter_messages`)
- **`recruiters`**:
  - `id` (text, primary key), `name` (text), `title` (text), `company` (text), `linkedin_url` (text)
- **`recruiter_messages`**:
  - `id` (text, primary key)
  - `recruiter_id` (text, foreign key → `recruiters.id`)
  - `job_id` (text, foreign key → `jobs.id`)
  - `message_type` (text: `'OUTREACH'`, `'FOLLOWUP'`)
  - `message_text` (text)
  - `status` (text: `'DRAFT'`, `'PENDING_APPROVAL'`, `'APPROVED'`, `'REJECTED'`, `'SENDING'`, `'SENT'`, `'FAILED'`)
  - `followup_due_at` (timestamp)
  - `followup_status` (text: `'NONE'`, `'DUE'`, `'DRAFTED'`, `'APPROVED'`, `'SENT'`)
  - `sent_at` (timestamp)

## 5. Personal Branding Content (`linkedin_posts`)
- `id` (text, primary key), `topic` (text), `content_text` (text)
- `status` (text: `'DRAFT'`, `'PENDING_APPROVAL'`, `'APPROVED'`, `'REJECTED'`, `'SCHEDULED'`, `'PUBLISHED'`, `'FAILED'`)
- `scheduled_at` (timestamp), `published_at` (timestamp)

## 6. Execution Requests & Approval Audit (`execution_requests`, `approval_events`)
- **`execution_requests`**:
  - `id` (text, primary key)
  - `action_type` (text: `'APPLICATION_SUBMISSION'`, `'RECRUITER_DM'`, `'LINKEDIN_POST'`)
  - `target_entity_id` (text)
  - `execution_mode` (text: `'MANUAL'`, `'AUTONOMOUS'`)
  - `status` (text: `'PENDING_APPROVAL'`, `'APPROVED'`, `'REJECTED'`, `'EXECUTED'`, `'FAILED'`)
  - `requested_at` (timestamp)
  - `idempotency_key` (text, unique where applicable)
  - `expires_at` (timestamp, for pending approval requests)
- **`approval_events`**:
  - `id` (text, primary key)
  - `execution_request_id` (text, foreign key → `execution_requests.id`)
  - `channel` (text: `'EMAIL'`, `'DASHBOARD'`, `'SYSTEM_AUTO'`)
  - `decision` (text: `'APPROVED'`, `'REJECTED'`)
  - `decided_by` (text)
  - `decided_at` (timestamp)
  - `notes` (text)

## 7. Daily Execution Runs (`daily_runs`)
- `id` (text, primary key)
- `run_date` (text)
- `trigger_type` (text: `'SCHEDULED'`, `'MANUAL'`)
- `started_at` (timestamp)
- `completed_at` (timestamp)
- `daily_target` (integer)
- `processed_from_queue` (integer)
- `discovered_new` (integer)
- `applications_submitted` (integer)
- `stretch_jobs_logged` (integer)
- `status` (text: `'RUNNING'`, `'COMPLETED'`, `'FAILED'`)

## Schema Intent Notes
- `agent_settings` stores candidate-controlled runtime behavior; execution modes are configuration, not agent-owned state.
- `execution_requests` provides one common lifecycle for application submission, recruiter DM dispatch, and LinkedIn publication.
- `approval_events` is an immutable-style audit history of decisions and channels; email and dashboard approvals operate on the same request.
- `idempotency_key` and `expires_at` support duplicate protection and expiring approval actions.
- `daily_runs.trigger_type` distinguishes scheduled production behavior from manual testing without creating a separate workflow.
