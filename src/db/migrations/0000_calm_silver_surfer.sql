CREATE TABLE `agent_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`candidate_name` text NOT NULL,
	`candidate_email` text NOT NULL,
	`daily_run_time` text DEFAULT '10:00' NOT NULL,
	`timezone` text NOT NULL,
	`daily_application_target` integer NOT NULL,
	`normal_match_threshold` real DEFAULT 0.7 NOT NULL,
	`stretch_match_threshold` real DEFAULT 0.5 NOT NULL,
	`application_execution_mode` text DEFAULT 'MANUAL' NOT NULL,
	`recruiter_dm_execution_mode` text DEFAULT 'MANUAL' NOT NULL,
	`linkedin_post_execution_mode` text DEFAULT 'MANUAL' NOT NULL,
	`manual_trigger_enabled` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`job_url` text NOT NULL,
	`title` text NOT NULL,
	`company` text NOT NULL,
	`location` text NOT NULL,
	`description` text NOT NULL,
	`match_score` real NOT NULL,
	`match_classification` text NOT NULL,
	`gap_analysis_json` text NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `jobs_job_url_unique` ON `jobs` (`job_url`);
--> statement-breakpoint
CREATE TABLE `opportunity_queue` (
	`id` text PRIMARY KEY NOT NULL,
	`job_id` text NOT NULL,
	`priority_rank` integer NOT NULL,
	`status` text NOT NULL,
	`queued_at` integer NOT NULL,
	FOREIGN KEY (`job_id`) REFERENCES `jobs`(`id`) ON UPDATE no action ON DELETE no action
);
