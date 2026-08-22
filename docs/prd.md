# Product Requirements — ai-talent-manager

`purpose:AI talent manager for LinkedIn job discovery, application automation, recruiter outreach, and personal branding`
`target_audience:Single job seeker (personal deployment)`

## Value Proposition
Autonomously discovers, evaluates, matches, and applies to relevant LinkedIn job opportunities while managing recruiter outreach, EOD reporting, and professional content sharing under candidate approval.

## Target Audience
Single job seeker — initially self-hosted for candidate's own job search.

## MVP Scope (v1)
1. Job discovery + intelligent matching/queue engine
2. Tailored CV generation + application automation with human approval workflow
3. Recruiter outreach + EOD reporting/content approval workflow 
4. Daily LinkedIn posting post user's spproval via email

## Explicitly Out of Scope (v1)
- Non-LinkedIn job sources & multi-platform job search
- Warm introductions network mapping
- Public SaaS / multi-user authentication
- Advanced analytics dashboard
- Fully autonomous application submission without human approval

## Stack
- Tech Stack: TypeScript + Node.js (Core), Next.js (Dashboard), Browser Use (Automation)
- Database: SQLite (Local metadata), Google Drive API (CVs, documents & reports)
- Authentication: None for MVP (Local single-user). Secure LinkedIn credentials within automation context.
- Hosting/Deploy: Self-hosted / Local
- APIs/Integrations: Agent Reach, Unipile, Browser Use, Google Drive API, LLM APIs (OpenAI/Anthropic/Gemini), Email API / SMTP

## Success Criteria
- [ ] All 3 MVP features pass their test cases in `docs/testing-playbook.md`
- [ ] No item in "Out of Scope" is present in the shipped code
- [ ] `docs/task-tracker.md` backlog is fully checked off

## Change Log
| Date | Change | Reason |
|------|--------|--------|
| 2026-08-23 | Initial PRD created | Project init via GroundWork --plan |
