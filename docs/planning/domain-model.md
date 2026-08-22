---
status: LOCKED
version: 1
approved_by: human
approved_at: 2026-08-22T20:06:27Z
---

# Domain Model — ai-talent-manager

## Key Domain Entities
- **Candidate Profile**: Verified facts (skills, experience, education, achievements).
- **Job Opportunity**: Metadata, job description, company, URL, fit match score, gap notes, and queue status (`queued`, `applied`, `rejected`).
- **Tailored CV**: Derived tailored resume content referencing master Google Drive document ID.
- **Application**: Submission record linking job, tailored CV, application answers, approval status, and execution timestamp.
- **Recruiter Contact & Message**: Recruiter profile, generated DM draft, approval status, and interaction history.
- **LinkedIn Post**: Personal branding post draft, topic, scheduled time, and approval status.
- **Daily Run & Audit Log**: Daily execution statistics and event tracking.
