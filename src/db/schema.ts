import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * Candidate-controlled runtime configuration.
 *
 * Source: docs/planning/database-schema.md §1.
 */
export const agentSettings = sqliteTable('agent_settings', {
  id: text('id').primaryKey(),
  candidateName: text('candidate_name').notNull(),
  candidateEmail: text('candidate_email').notNull(),
  dailyRunTime: text('daily_run_time').notNull().default('10:00'),
  timezone: text('timezone').notNull(),
  dailyApplicationTarget: integer('daily_application_target').notNull(),
  normalMatchThreshold: real('normal_match_threshold').notNull().default(0.7),
  stretchMatchThreshold: real('stretch_match_threshold').notNull().default(0.5),
  applicationExecutionMode: text('application_execution_mode', {
    enum: ['MANUAL', 'AUTONOMOUS'],
  }).notNull().default('MANUAL'),
  recruiterDmExecutionMode: text('recruiter_dm_execution_mode', {
    enum: ['MANUAL', 'AUTONOMOUS'],
  }).notNull().default('MANUAL'),
  linkedinPostExecutionMode: text('linkedin_post_execution_mode', {
    enum: ['MANUAL', 'AUTONOMOUS'],
  }).notNull().default('MANUAL'),
  manualTriggerEnabled: integer('manual_trigger_enabled', { mode: 'boolean' })
    .notNull()
    .default(true),
});

/**
 * Discovered job opportunities.
 *
 * Source: docs/planning/database-schema.md §2.
 */
export const jobs = sqliteTable('jobs', {
  id: text('id').primaryKey(),
  jobUrl: text('job_url').notNull().unique(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  location: text('location').notNull(),
  description: text('description').notNull(),
  matchScore: real('match_score').notNull(),
  matchClassification: text('match_classification', {
    enum: ['APPLICATION_ELIGIBLE', 'STRETCH', 'NOT_QUALIFIED'],
  }).notNull(),
  gapAnalysisJson: text('gap_analysis_json').notNull(),
  status: text('status', {
    enum: ['DISCOVERED', 'QUEUED', 'STRETCH_LOGGED', 'REJECTED'],
  }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

/**
 * Persistent queue of qualifying opportunities retained for future runs.
 *
 * Source: docs/planning/database-schema.md §2.
 */
export const opportunityQueue = sqliteTable('opportunity_queue', {
  id: text('id').primaryKey(),
  jobId: text('job_id')
    .notNull()
    .references(() => jobs.id),
  priorityRank: integer('priority_rank').notNull(),
  status: text('status', {
    enum: ['QUEUED', 'SELECTED', 'EXHAUSTED'],
  }).notNull(),
  queuedAt: integer('queued_at', { mode: 'timestamp_ms' }).notNull(),
});

/**
 * Job-specific CV versions stored in Google Drive.
 *
 * Source: docs/planning/database-schema.md §3.
 */
export const cvVersions = sqliteTable('cv_versions', {
  id: text('id').primaryKey(),
  jobId: text('job_id')
    .notNull()
    .references(() => jobs.id),
  versionNumber: integer('version_number').notNull(),
  googleDriveFileId: text('google_drive_file_id').notNull(),
  googleDriveUrl: text('google_drive_url').notNull(),
  contentDiffJson: text('content_diff_json').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp_ms' }).notNull(),
});

/**
 * Prepared and submitted job applications.
 *
 * Source: docs/planning/database-schema.md §3.
 */
export const applications = sqliteTable('applications', {
  id: text('id').primaryKey(),
  jobId: text('job_id')
    .notNull()
    .references(() => jobs.id),
  cvVersionId: text('cv_version_id')
    .notNull()
    .references(() => cvVersions.id),
  coverLetterText: text('cover_letter_text').notNull(),
  applicationAnswersJson: text('application_answers_json').notNull(),
  status: text('status', {
    enum: [
      'DRAFT',
      'PENDING_APPROVAL',
      'APPROVED',
      'REJECTED',
      'SUBMITTING',
      'SUBMITTED',
      'FAILED',
    ],
  }).notNull(),
  submittedAt: integer('submitted_at', { mode: 'timestamp_ms' }),
  errorLog: text('error_log'),
});

/**
 * Recruiters associated with the candidate's job search.
 *
 * Source: docs/planning/database-schema.md §4.
 */
export const recruiters = sqliteTable('recruiters', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  title: text('title').notNull(),
  company: text('company').notNull(),
  linkedinUrl: text('linkedin_url').notNull(),
});

/**
 * Drafted and dispatched recruiter outreach or follow-up messages.
 *
 * Source: docs/planning/database-schema.md §4.
 */
export const recruiterMessages = sqliteTable('recruiter_messages', {
  id: text('id').primaryKey(),
  recruiterId: text('recruiter_id')
    .notNull()
    .references(() => recruiters.id),
  jobId: text('job_id')
    .notNull()
    .references(() => jobs.id),
  messageType: text('message_type', {
    enum: ['OUTREACH', 'FOLLOWUP'],
  }).notNull(),
  messageText: text('message_text').notNull(),
  status: text('status', {
    enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SENDING', 'SENT', 'FAILED'],
  }).notNull(),
  followupDueAt: integer('followup_due_at', { mode: 'timestamp_ms' }),
  followupStatus: text('followup_status', {
    enum: ['NONE', 'DUE', 'DRAFTED', 'APPROVED', 'SENT'],
  }).notNull(),
  sentAt: integer('sent_at', { mode: 'timestamp_ms' }),
});

/**
 * Candidate personal-branding content prepared for LinkedIn.
 *
 * Source: docs/planning/database-schema.md §5.
 */
export const linkedinPosts = sqliteTable('linkedin_posts', {
  id: text('id').primaryKey(),
  topic: text('topic').notNull(),
  contentText: text('content_text').notNull(),
  status: text('status', {
    enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'SCHEDULED', 'PUBLISHED', 'FAILED'],
  }).notNull(),
  scheduledAt: integer('scheduled_at', { mode: 'timestamp_ms' }),
  publishedAt: integer('published_at', { mode: 'timestamp_ms' }),
});

/**
 * Common lifecycle for consequential actions.
 *
 * Source: docs/planning/database-schema.md §6.
 */
export const executionRequests = sqliteTable('execution_requests', {
  id: text('id').primaryKey(),
  actionType: text('action_type', {
    enum: ['APPLICATION_SUBMISSION', 'RECRUITER_DM', 'LINKEDIN_POST'],
  }).notNull(),
  targetEntityId: text('target_entity_id').notNull(),
  executionMode: text('execution_mode', {
    enum: ['MANUAL', 'AUTONOMOUS'],
  }).notNull(),
  status: text('status', {
    enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'EXECUTED', 'FAILED'],
  }).notNull(),
  requestedAt: integer('requested_at', { mode: 'timestamp_ms' }).notNull(),
  idempotencyKey: text('idempotency_key').unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp_ms' }),
});

/**
 * Immutable-style approval decisions for execution requests.
 *
 * Source: docs/planning/database-schema.md §6.
 */
export const approvalEvents = sqliteTable('approval_events', {
  id: text('id').primaryKey(),
  executionRequestId: text('execution_request_id')
    .notNull()
    .references(() => executionRequests.id),
  channel: text('channel', {
    enum: ['EMAIL', 'DASHBOARD', 'SYSTEM_AUTO'],
  }).notNull(),
  decision: text('decision', {
    enum: ['APPROVED', 'REJECTED'],
  }).notNull(),
  decidedBy: text('decided_by').notNull(),
  decidedAt: integer('decided_at', { mode: 'timestamp_ms' }).notNull(),
  notes: text('notes'),
});

/**
 * Scheduled and manually triggered executions of the daily workflow.
 *
 * Source: docs/planning/database-schema.md §7.
 */
export const dailyRuns = sqliteTable('daily_runs', {
  id: text('id').primaryKey(),
  runDate: text('run_date').notNull(),
  triggerType: text('trigger_type', {
    enum: ['SCHEDULED', 'MANUAL'],
  }).notNull(),
  startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp_ms' }),
  dailyTarget: integer('daily_target').notNull(),
  processedFromQueue: integer('processed_from_queue').notNull(),
  discoveredNew: integer('discovered_new').notNull(),
  applicationsSubmitted: integer('applications_submitted').notNull(),
  stretchJobsLogged: integer('stretch_jobs_logged').notNull(),
  status: text('status', {
    enum: ['RUNNING', 'COMPLETED', 'FAILED'],
  }).notNull(),
});

export type AgentSettings = typeof agentSettings.$inferSelect;
export type NewAgentSettings = typeof agentSettings.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type OpportunityQueueItem = typeof opportunityQueue.$inferSelect;
export type NewOpportunityQueueItem = typeof opportunityQueue.$inferInsert;
export type CvVersion = typeof cvVersions.$inferSelect;
export type NewCvVersion = typeof cvVersions.$inferInsert;
export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;
export type Recruiter = typeof recruiters.$inferSelect;
export type NewRecruiter = typeof recruiters.$inferInsert;
export type RecruiterMessage = typeof recruiterMessages.$inferSelect;
export type NewRecruiterMessage = typeof recruiterMessages.$inferInsert;
export type LinkedinPost = typeof linkedinPosts.$inferSelect;
export type NewLinkedinPost = typeof linkedinPosts.$inferInsert;
export type ExecutionRequest = typeof executionRequests.$inferSelect;
export type NewExecutionRequest = typeof executionRequests.$inferInsert;
export type ApprovalEvent = typeof approvalEvents.$inferSelect;
export type NewApprovalEvent = typeof approvalEvents.$inferInsert;
export type DailyRun = typeof dailyRuns.$inferSelect;
export type NewDailyRun = typeof dailyRuns.$inferInsert;
