# Product Requirements — ai-talent-manager

`purpose:AI talent manager for LinkedIn job discovery, tailored applications, recruiter outreach, and personal branding`
`target_audience:Single job seeker (personal deployment)`

## Value Proposition
The AI Talent Manager continuously discovers and evaluates relevant LinkedIn opportunities, maintains a persistent application queue, tailors candidate materials, prepares applications, manages recruiter outreach and personal branding, and reports activity while keeping the candidate in control of consequential actions.

## Target Audience
Single job seeker — initially self-hosted for the candidate's own job search.

## MVP Scope (v1)
1. Job discovery + intelligent matching + persistent opportunity queue
2. Tailored CV generation + application automation with configurable execution/approval workflow
3. Recruiter outreach + EOD reporting + LinkedIn personal-branding content workflow

## Daily Run Behavior
- Default scheduled start: `10:00` in the configured user/deployment timezone.
- Manual `Run Now` trigger is available for testing and operational use.
- Scheduled and manual triggers invoke the same Daily Run Orchestrator.
- Every run processes the existing opportunity queue first.
- Fresh discovery occurs only when the queue cannot fill the remaining application slots for the configured daily target.
- The discovery → match → queue → tailor → execute loop repeats until the target is reached or qualifying work is exhausted.
- Unselected qualifying opportunities remain queued for subsequent runs.

## Execution Modes
Each consequential action has an independent execution mode:

```text
APPLICATION_EXECUTION_MODE=MANUAL
RECRUITER_DM_EXECUTION_MODE=MANUAL
LINKEDIN_POST_EXECUTION_MODE=MANUAL
```

Supported values: `MANUAL` and `AUTONOMOUS`.

- `MANUAL`: candidate approval is required before the external side effect.
- `AUTONOMOUS`: validated actions can proceed without human waiting.
- Initial validation keeps all three modes `MANUAL`; autonomy is enabled later only by the candidate and never by the agent itself.
- Email approval is preferred where feasible; Dashboard is the fallback. Both use the same execution-request/approval records.

## Explicitly Out of Scope (v1)
- Non-LinkedIn job sources & multi-platform job search
- Warm introductions network mapping
- Public SaaS / multi-user authentication
- Advanced analytics dashboard beyond the control/approval UI needed by the MVP
- Autonomous execution enabled by default during initial validation

## Stack
- Tech Stack: TypeScript + Node.js (Core), Next.js (Dashboard), Browser Use (Automation)
- Database: SQLite (Local metadata/state), Google Drive API (CVs, documents & reports)
- Authentication: Local single-user control surface; external integrations use their own OAuth/credential mechanisms. No public multi-user auth for MVP.
- Hosting/Deploy: Self-hosted / Local
- APIs/Integrations: Agent Reach, Unipile, Browser Use, Google Drive API, LLM APIs (OpenAI/Anthropic/Gemini), Email API / SMTP

## Security Baseline
- Never commit or log secrets, API keys, OAuth tokens, session data, or credentials.
- Do not store LinkedIn passwords.
- Use least-privilege integration scopes and protected credential storage.
- Treat external content and LLM output as untrusted input.
- Use expiring, scoped, cryptographically random approval links and duplicate protection for consequential actions.
- Fail closed on ambiguous authorization/validation state.
- The agent cannot modify its own permissions, security settings, or execution modes.

## Success Criteria
- [ ] All MVP workflows pass their test cases in `docs/testing-playbook.md`.
- [ ] No item in "Out of Scope" is present in shipped code.
- [ ] Daily run is queue-first and supports both scheduled and manual triggers.
- [ ] No factual fabrication in candidate-facing materials.
- [ ] Consequential actions honor their configured execution mode.
- [ ] EOD reports are delivered successfully.

## Change Log
| Date | Change | Reason |
|------|--------|--------|
| 2026-08-23 | Initial PRD created | Project init via GroundWork --plan |
| 2026-08-24 | Synchronized daily loop, execution modes, approval channels, and security baseline | Align implementation-facing PRD with locked planning architecture |
