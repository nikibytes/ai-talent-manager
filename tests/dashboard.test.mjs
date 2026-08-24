import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const page = fs.readFileSync('app/page.tsx', 'utf8');

test('DASH-001_002 exposes the control dashboard UI', () => {
  assert.match(page, /Opportunity Queue/);
  assert.match(page, /Needs your approval/);
  assert.match(page, /Run Now/);
  assert.match(page, /Execution mode/);
});

test('DASH-001_002 remains frontend-only', () => {
  assert.doesNotMatch(page, /from ['\"](?:@\/)?(?:src\/)?(?:db|database)[^'\"]*['\"]/i);
  assert.doesNotMatch(page, /drizzle|sqlite|prisma|supabase/i);
});
