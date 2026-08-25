import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import Database from 'better-sqlite3';

const migrationFiles = [
  'src/db/migrations/0000_calm_silver_surfer.sql',
  'src/db/migrations/0001_complete_schema.sql',
];

const expectedTables = [
  'agent_settings',
  'applications',
  'approval_events',
  'cv_versions',
  'daily_runs',
  'execution_requests',
  'jobs',
  'linkedin_posts',
  'opportunity_queue',
  'recruiter_messages',
  'recruiters',
];

test('database migrations create every locked schema table and relationship', () => {
  const temporaryDirectory = mkdtempSync(join(tmpdir(), 'ai-talent-manager-db-'));
  const database = new Database(join(temporaryDirectory, 'verification.db'));

  try {
    for (const migrationFile of migrationFiles) {
      const statements = readFileSync(migrationFile, 'utf8')
        .split('--> statement-breakpoint')
        .map((statement) => statement.trim())
        .filter(Boolean);

      for (const statement of statements) {
        database.exec(statement);
      }
    }

    const tables = database
      .prepare("select name from sqlite_master where type = 'table' order by name")
      .all()
      .map(({ name }) => name);

    assert.deepEqual(tables, expectedTables);
    assert.equal(database.pragma('foreign_key_list(applications)').length, 2);
    assert.equal(database.pragma('foreign_key_list(recruiter_messages)').length, 2);
    assert.equal(database.pragma('foreign_key_list(approval_events)').length, 1);

    const idempotencyIndex = database
      .prepare(
        "select name from sqlite_master where type = 'index' and name = 'execution_requests_idempotency_key_unique'",
      )
      .all();

    assert.equal(idempotencyIndex.length, 1);
  } finally {
    database.close();
    rmSync(temporaryDirectory, { force: true, recursive: true });
  }
});
