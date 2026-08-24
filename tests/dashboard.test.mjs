import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');
const contains = (source, value) => assert.ok(source.includes(value), `Expected source to contain: ${value}`);

const page = read('app/page.tsx');
const queuePage = read('app/pages/QueuePage.tsx');
const applicationsPage = read('app/pages/ApplicationsPage.tsx');
const approvalsPage = read('app/pages/ApprovalsPage.tsx');
const contentPage = read('app/pages/ContentPage.tsx');
const settingsPage = read('app/pages/SettingsPage.tsx');
const data = read('app/shared/data.ts');

test('DASH-001 sidebar exposes every dashboard page', () => {
  for (const label of ['Overview', 'Opportunity Queue', 'Applications', 'Approvals', 'Content', 'Settings']) contains(page, label);
  for (const component of ['Overview', 'QueuePage', 'ApplicationsPage', 'ApprovalsPage', 'ContentPage', 'SettingsPage']) contains(page, `<${component}`);
});

test('DASH-001 opportunity queue page exposes filtering and search UI', () => {
  for (const value of ['Opportunity Queue', 'Review and prioritize qualifying roles', 'All', 'Ready', 'Review', 'Search roles or companies', 'Opportunity', 'Fit', 'Status', 'Source', 'Posted']) contains(queuePage, value);
});

test('DASH-001 applications page exposes pipeline controls and row actions', () => {
  for (const value of ['Applications', 'Export view', 'Active', 'Interviews', 'Response rate', 'Application pipeline', 'Draft', 'Applied', 'Interview', 'Edit manually', 'View Details', 'Delete']) contains(applicationsPage, value);
});

test('DASH-001 approvals page exposes review actions and empty state', () => {
  for (const value of ['Approval Center', 'Approvals', 'Review proposed external actions', 'Reject', 'Approve', 'All caught up', 'No pending approvals in the mock queue']) contains(approvalsPage, value);
});

test('DASH-001 content page exposes LinkedIn content workflow', () => {
  for (const value of ['LinkedIn Content', 'Draft, review and schedule professional posts', '+ New draft', 'Needs approval', 'Scheduled', 'Draft', 'Edit', 'Review']) contains(contentPage, value);
});

test('DASH-001 settings page exposes execution, target, schedule and notifications controls', () => {
  for (const value of ['Control Center Settings', 'Execution mode', 'Manual', 'Autonomous', 'Daily application target', 'Daily run schedule', '10:00', 'AM', 'PM', 'Asia/Kolkata', 'America/Los_Angeles', 'UTC', 'Notifications', 'EOD report email', 'Approval alerts', 'Save Changes']) contains(settingsPage, value);
});

test('DASH-001 dashboard mock data covers each new page', () => {
  for (const value of ['export const queue', 'export const applications', 'export const approvals', 'export const posts', 'Opportunity Queue', 'Senior Backend Engineer', 'AI engineering job-search update']) contains(data, value);
});

test('DASH-001 remains frontend-only', () => {
  const frontendSources = [page, queuePage, applicationsPage, approvalsPage, contentPage, settingsPage, data].join('\n');
  assert.doesNotMatch(frontendSources, /from ['\"](?:@\/)?(?:src\/)?(?:db|database)[^'\"]*['\"]/i);
  assert.doesNotMatch(frontendSources, /drizzle|sqlite|prisma|supabase/i);
});
