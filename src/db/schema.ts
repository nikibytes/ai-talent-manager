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

export type AgentSettings = typeof agentSettings.$inferSelect;
export type NewAgentSettings = typeof agentSettings.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type OpportunityQueueItem = typeof opportunityQueue.$inferSelect;
export type NewOpportunityQueueItem = typeof opportunityQueue.$inferInsert;
