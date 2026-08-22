# Testing Playbook — ai-talent-manager

## How to run tests
```bash
npm test
```

## Before marking any task-tracker item Completed
1. Run `npm test` — must pass with zero failures.
2. Run `npm run lint` if configured.
3. Manually verify the feature against its PRD acceptance line.
4. Update `docs/task-tracker.md` and `docs/changelog-agent.md` in the same commit.

## Adding new tests
Place new tests following the existing convention in `tests/` or `__tests__/`. One test file per module/feature; name it after the module (e.g. `tests/discovery.test.ts`).

## What "done" means
A task is not Completed until it has a passing automated test. "It works when I tried it manually" is not sufficient for anything in the MVP scope.
