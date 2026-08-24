---
status: LOCKED
version: 2
approved_by: human
approved_at: 2026-08-24T19:20:00+05:30
---

# User Personas — ai-talent-manager

## Primary Persona: Candidate (System Owner)

- **Role**: Software Engineer / Job Seeker
- **Relationship to System**: Single owner and final decision-maker

### Goals

- Maximize the number of **qualified** LinkedIn applications submitted each day.
- Configure a variable daily application target.
- Minimize repetitive job searching, CV tailoring, form filling, recruiter outreach, and follow-up work.
- Maintain a persistent queue of useful jobs that cannot be processed on the current day.
- Receive tailored CVs for relevant roles without fabricated or exaggerated information.
- Identify "almost-there" opportunities where the candidate is reasonably close to the requirements but has an experience or skill gap.
- Maintain consistent recruiter outreach and LinkedIn personal branding.
- Receive concise EOD reports covering applications, queued opportunities, recruiter activity, stretch jobs, and pending approvals.

### Key Behaviors

- Reviews the agent dashboard and/or EOD email once or twice daily.
- Configures the daily application target, run time/timezone, and matching thresholds.
- Uses `Run Now` during testing rather than waiting for the scheduled trigger.
- During the initial validation period, approves applications before submission, recruiter messages before sending, and LinkedIn posts before publication.
- May later enable `AUTONOMOUS` execution independently for individual action types after reliability has been demonstrated.
- Reviews stretch/almost-there opportunities to understand recurring skill or experience gaps.
- Provides corrections when the agent's understanding of the candidate profile is inaccurate.

### Pain Points

- Manual LinkedIn job searching consumes significant time.
- Tailoring a CV for every job is repetitive.
- Filling application forms repeatedly is inefficient.
- Finding and contacting relevant recruiters is time-consuming.
- Important opportunities can be lost when too many suitable jobs are discovered in a single day.
- Maintaining consistent LinkedIn content and recruiter follow-ups is difficult.
- It is difficult to distinguish genuinely suitable roles from jobs that only superficially match.

### Permissions

- Full local owner/admin access.
- Can configure agent behavior and thresholds.
- Can approve or reject consequential external actions in `MANUAL` mode.
- Can explicitly enable `AUTONOMOUS` mode per action type.
- Can inspect the complete application and agent history.
- The agent cannot modify these permissions or execution-mode settings itself.

---

## Secondary Persona: AI Talent Manager (Agent)

- **Role**: AI talent manager / representative for the candidate
- **Identity**: Separate, explicitly disclosed AI identity
- **Relationship to Candidate**: Acts on the candidate's behalf while remaining under the candidate's control

### Responsibilities

- Discover relevant LinkedIn jobs.
- Evaluate job/candidate compatibility.
- Prioritize opportunities.
- Maintain the persistent opportunity queue.
- Process queued opportunities before performing unnecessary fresh discovery.
- Tailor CVs for selected jobs.
- Generate application answers using verified candidate information.
- Prepare applications for execution.
- Identify relevant recruiters.
- Draft personalized recruiter outreach.
- Track recruiter conversations and follow-ups.
- Generate LinkedIn personal-branding posts approximately every two days.
- Generate EOD reports.
- Maintain an auditable history of decisions and actions.

### Constraints

- Must not impersonate the candidate.
- Must clearly identify itself as an AI when representing itself as a separate identity.
- Must never fabricate candidate experience, skills, achievements, certifications, employment history, or other professional facts.
- Must respect the configured execution mode for every consequential action.
- Must not submit applications, send consequential recruiter messages, or publish LinkedIn content while the corresponding action is in `MANUAL` mode without required candidate approval.
- Must never change its own execution modes, permissions, security configuration, or approval requirements.
- Must not apply to low-quality jobs merely to satisfy the daily application target.

---

## Tertiary Persona: Recruiter / Hiring Manager

- **Role**: Recruiter or hiring manager at a target company
- **Relationship to System**: External recipient of AI-managed candidate outreach

### Goals

- Receive relevant, concise, personalized communication.
- Quickly understand why the candidate is relevant to a specific role.
- Avoid generic spam or mass-produced outreach.

### Interaction Model

- Receives personalized recruiter messages drafted by the AI Talent Manager.
- Messages require human approval while `RECRUITER_DM_EXECUTION_MODE=MANUAL`.
- May respond through LinkedIn.
- Responses are retrieved and classified by the agent.
- Important or consequential responses are escalated to the candidate.

---

## Decision Provenance

- **USER DECISION**: Candidate is the sole primary user and system owner.
- **USER DECISION**: AI Talent Manager operates as a separate, openly disclosed AI identity rather than impersonating the candidate.
- **USER DECISION**: Daily application volume and daily run timing are configurable by the candidate.
- **USER DECISION**: A manual `Run Now` trigger exists for initial testing and invokes the same orchestration path as the scheduled run.
- **USER DECISION**: Qualifying jobs exceeding the daily application limit remain in a persistent queue and are processed before fresh discovery on subsequent days.
- **USER DECISION**: Jobs in the approximately 50–60% match range are treated as "almost-there/stretch" opportunities and reported rather than silently discarded.
- **USER DECISION**: Tailored CVs and generated application materials must remain factually grounded in the candidate's verified profile.
- **USER DECISION**: The initial validation period keeps application submission, recruiter DM dispatch, and LinkedIn publication in `MANUAL` mode; autonomous operation may be enabled independently later.
- **GROUNDED INFERENCE**: Recruiter outreach should be personalized and role-specific rather than mass-generated.
- **GROUNDED INFERENCE**: A persistent audit trail is required to explain agent decisions and prevent duplicate applications or outreach.
