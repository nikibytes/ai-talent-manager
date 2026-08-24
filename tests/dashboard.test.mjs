import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const page = fs.readFileSync('app/page.tsx', 'utf8');

 test('DASH-001 sidebar exposes every frontend page', () => {
  assert.match(page, /Opportunity Queue/);
  assert.match(page, /Applications/);
  assert.match(page, /Approvals/);
  assert.match(page, /Content/);
  assert.match(page, /Settings/);
});

test('DASH-001 page UI contains the core dashboard controls', () => {
  assert.match(page, /Opportunity Queue page UI|Opportunity Queue/);
  assert.match(page, /Run Now/);
  assert.match(page, /Execution mode/);
  assert.match(page, /Daily application target/);
  assert.match(page, /Approval center|Approval Center/);
  assert.match(page, /LinkedIn Content/);
});

test('DASH-001 remains frontend-only', () => {
  assert.doesNotMatch(page, /from ['\"](?:@\/)?(?:src\/)?(?:db|database)[^'\"]*['\"]/i);
  assert.doesNotMatch(page, /drizzle|sqlite|prisma|supabase/i);
});
