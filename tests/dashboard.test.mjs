import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (path) => fs.readFileSync(path, 'utf8');

const page = read('app/page.tsx');
const queuePage = read('app/pages/QueuePage.tsx');
const applicationsPage = read('app/pages/ApplicationsPage.tsx');
const approvalsPage = read('app/pages/ApprovalsPage.tsx');
const contentPage = read('app/pages/ContentPage.tsx');
const settingsPage = read('app/pages/SettingsPage.tsx');
const data = read('app/shared/data.ts');

test('DASH-001 sidebar exposes every dashboard page', () => {
  for (const label of [
    'Overview',
    'Opportunity Queue',
    'Applications',
    'Approvals',
    'Content',
    'Settings',
  ]) {
    assert.match(page, new RegExp(label));
  }

  for (const component of [
    'Overview',
    'QueuePage',
    'ApplicationsPage',
    'ApprovalsPage',
    'ContentPage',
    'SettingsPage',
  ]) {
    assert.match(page, new RegExp(`<${component}`));
  }
});

test('DASH-001 opportunity queue page exposes filtering and search UI', () => {
  assert.match(queuePage, /Opportunity Queue/);
  assert.match(queuePage, /Review and prioritize qualifying roles/);
  assert.match(queuePage, /All/);
  assert.match(queuePage, /Ready/);
  assert.match(queuePage, /Review/);
  assert.match(queuePage, /Search roles or companies/);
  assert.match(queuePage, /Opportunity/);
  assert.match(queuePage, /Fit/);
  assert.match(queuePage, /Status/);
  assert.match(queuePage, /Source/);
  assert.match(queuePage, /Posted/);
});

test('DASH-001 applications page exposes pipeline controls and row actions', () => {
  assert.match(applicationsPage, /Applications/);
  assert.match(applicationsPage, /Export view/);
  assert.match(applicationsPage, /Active/);
  assert.match(applicationsPage, /Interviews/);
  assert.match(applicationsPage, /Response rate/);
  assert.match(applicationsPage, /Application pipeline/);
  assert.match(applicationsPage, /Draft/);
  assert.match(applicationsPage, /Applied/);
  assert.match(applicationsPage, /Interview/);
  assert.match(applicationsPage, /Edit manually/);
  assert.match(applicationsPage, /View Details/);
  assert.match(applicationsPage, /Delete/);
});

test('DASH-001 approvals page exposes review actions and empty state', () => {
  assert.match(approvalsPage, /Approval Center/);
  assert.match(approvalsPage, /Approvals/);
  assert.match(approvalsPage, /Review proposed external actions/);
  assert.match(approvalsPage, /Reject/);
  assert.match(approvalsPage, /Approve/);
  assert.match(approvalsPage, /All caught up/);
  assert.match(approvalsPage, /No pending approvals in the mock queue/);
});

test('DASH-001 content page exposes LinkedIn content workflow', () => {
  assert.match(contentPage, /LinkedIn Content/);
  assert.match(contentPage, /Draft, review and schedule professional posts/);
  assert.match(contentPage, /\+ New draft/);
  assert.match(contentPage, /Needs approval/);
  assert.match(contentPage, /Scheduled/);
  assert.match(contentPage, /Draft/);
  assert.match(contentPage, /Edit/);
  assert.match(contentPage, /Review/);
});

test('DASH-001 settings page exposes execution, target, schedule and notifications controls', () => {
  assert.match(settingsPage, /Control Center Settings/);
  assert.match(settingsPage, /Execution mode/);
  assert.match(settingsPage, /Manual/);
  assert.match(settingsPage, /Autonomous/);
  assert.match(settingsPage, /Daily application target/);
  assert.match(settingsPage, /Daily run schedule/);
  assert.match(settingsPage, /10:00/);
  assert.match(settingsPage, /AM/);
  assert.match(settingsPage, /PM/);
  assert.match(settingsPage, /Asia\/Kolkata/);
  assert.match(settingsPage, /America\/Los_Angeles/);
  assert.match(settingsPage, /UTC/);
  assert.match(settingsPage, /Notifications/);
  assert.match(settingsPage, /EOD report email/);
  assert.match(settingsPage, /Approval alerts/);
  assert.match(settingsPage, /Save Changes/);
});

test('DASH-001 dashboard mock data covers each new page', () => {
  assert.match(data, /export const queue/);
  assert.match(data, /export const applications/);
  assert.match(data, /export const approvals/);
  assert.match(data, /export const posts/);
  assert.match(data, /Opportunity Queue/);
  assert.match(data, /Senior Backend Engineer/);
  assert.match(data, /AI engineering job-search update/);
});

test('DASH-001 remains frontend-only', () => {
  const frontendSources = [
    page,
    queuePage,
    applicationsPage,
    approvalsPage,
    contentPage,
    settingsPage,
    data,
  ].join('\n');

  assert.doesNotMatch(
    frontendSources,
    /from ['\"](?:@\/)?(?:src\/)?(?:db|database)[^'\"]*['\"]/i,
  );
  assert.doesNotMatch(frontendSources, /drizzle|sqlite|prisma|supabase/i);
});
