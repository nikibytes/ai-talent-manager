CREATE TABLE `cv_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`job_id` text NOT NULL,
	`version_number` integer NOT NULL,
	`google_drive_file_id` text NOT NULL,
	`google_drive_url` text NOT NULL,
	`content_diff_json` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `applications` (
	`id` text PRIMARY KEY NOT NULL,
	`job_id` text NOT NULL,
	`cv_version_id` text NOT NULL,
	`cover_letter_text` text NOT NULL,
	`application_answers_json` text NOT NULL,
	`status` text NOT NULL,
	`submitted_at` integer,
	`error_log` text,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`cv_version_id`) REFERENCES `cv_versions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `recruiters` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`linkedin_url` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `recruiter_messages` (
	`id` text PRIMARY KEY NOT NULL,
	`recruiter_id` text NOT NULL,
	`job_id` text NOT NULL,
	`message_type` text NOT NULL,
	`message_text` text NOT NULL,
	`status` text NOT NULL,
	`followup_due_at` integer,
	`followup_status` text NOT NULL,
	`sent_at` integer,
	FOREIGN KEY (`recruiter_id`) REFERENCES `recruiters`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `linkedin_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`topic` text NOT NULL,
	`content_text` text NOT NULL,
	`status` text NOT NULL,
	`scheduled_at` integer,
	`published_at` integer
);
--> statement-breakpoint
CREATE TABLE `execution_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`action_type` text NOT NULL,
	`target_entity_id` text NOT NULL,
	`execution_mode` text NOT NULL,
	`status` text NOT NULL,
	`requested_at` integer NOT NULL,
	`idempotency_key` text,
	`expires_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `execution_requests_idempotency_key_unique` ON `execution_requests` (`idempotency_key`);
--> statement-breakpoint
CREATE TABLE `approval_events` (
	`id` text PRIMARY KEY NOT NULL,
	`execution_request_id` text NOT NULL,
	`channel` text NOT NULL,
	`decision` text NOT NULL,
	`decided_by` text NOT NULL,
	`decided_at` integer NOT NULL,
	`notes` text,
	FOREIGN KEY (`execution_request_id`) REFERENCES `execution_requests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `daily_runs` (
	`id` text PRIMARY KEY NOT NULL,
	`run_date` text NOT NULL,
	`trigger_type` text NOT NULL,
	`started_at` integer NOT NULL,
	`completed_at` integer,
	`daily_target` integer NOT NULL,
	`processed_from_queue` integer NOT NULL,
	`discovered_new` integer NOT NULL,
	`applications_submitted` integer NOT NULL,
	`stretch_jobs_logged` integer NOT NULL,
	`status` text NOT NULL
);
