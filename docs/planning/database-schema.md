---
status: LOCKED
version: 1
approved_by: human
approved_at: 2026-08-22T20:06:27Z
---

# Database Schema — ai-talent-manager

SQLite Tables (via Drizzle ORM in `src/db/schema.ts`):

- **`candidate_profile`**: `id`, `name`, `email`, `verified_facts_json`
- **`jobs`**: `id`, `job_url`, `title`, `company`, `location`, `description`, `match_score`, `gap_analysis`, `status`, `created_at`
- **`opportunity_queue`**: `id`, `job_id`, `priority_rank`, `status`, `queued_at`
- **`applications`**: `id`, `job_id`, `cv_drive_file_id`, `cover_letter`, `approval_status`, `submitted_at`, `error_log`
- **`recruiters`**: `id`, `name`, `title`, `company`, `linkedin_url`
- **`recruiter_messages`**: `id`, `recruiter_id`, `message_text`, `approval_status`, `sent_at`
- **`linkedin_posts`**: `id`, `topic`, `content_text`, `approval_status`, `scheduled_at`, `published_at`
- **`daily_runs`**: `id`, `run_date`, `jobs_processed`, `applications_sent`, `outreach_sent`
