---
status: LOCKED
version: 1
approved_by: human
approved_at: 2026-08-22T19:57:42Z
---

# Product Requirements Document (PRD) — ai-talent-manager

## 1. Executive Summary & Objective
- **USER DECISION**: The AI Talent Manager is a personal career automation assistant for a single candidate.
- **USER DECISION**: It autonomously discovers LinkedIn jobs, scores candidates using LLMs, queues top matches, generates tailored CVs and application answers, dispatches Easy Apply applications via Browser Use, conducts recruiter outreach via Unipile, sends daily EOD reports via SMTP, and publishes LinkedIn personal branding content.

## 2. Target Persona & Users
- **USER DECISION**: Single job seeker (candidate).
- **GROUNDED INFERENCE**: Local single-user system requiring no public SaaS multi-user registration or tenant authentication.

## 3. Product Scope & MVP Capabilities
1. **Job Discovery & Matching Engine**:
   - Polling LinkedIn listings via Agent Reach / Unipile.
   - Normalization & deduplication.
   - LLM fit scoring (0–100%) against verified candidate facts.
   - Persistent opportunity queue for unused qualified opportunities.
2. **Tailored Application Engine**:
   - AI-tailored CV generation (PDF/DOCX) saved directly to Google Drive.
   - Customized cover letters & Easy Apply application answers.
   - Human approval workflow in Next.js Control Dashboard.
   - Automated browser form submission via Browser Use.
3. **Recruiter Outreach & EOD Reporting**:
   - Target recruiter discovery at hiring companies.
   - AI personalized LinkedIn DM generation.
   - Human approval queue before sending via Unipile.
   - Daily EOD activity summary email sent via SMTP.
4. **Personal Branding**:
   - Professional LinkedIn post generation (~every 2 days).
   - Content approval workflow via Dashboard and Email.

## 4. Non-Goals (Explicitly Out of Scope)
- **USER DECISION**: Non-LinkedIn job search platforms (Indeed, Glassdoor, ZipRecruiter, etc.).
- **USER DECISION**: Multi-user SaaS authentication and tenant billing.
- **USER DECISION**: Fully autonomous application submission without human review.
- **USER DECISION**: Warm introduction network mapping.

## 5. Success Criteria & Metrics
- [ ] 100% of external actions (application submissions, recruiter DMs, LinkedIn posts) pass human approval gate.
- [ ] 0 factual fabrications in CVs or application answers.
- [ ] Daily run processes existing opportunity queue before discovering new jobs.
- [ ] 100% EOD reports delivered successfully via email.

## 6. Decision Provenance
- **USER DECISION**: Scope features 1-4, non-goals, human approval gate, tech stack.
- **GROUNDED INFERENCE**: Persistent opportunity queue mechanics & single-user local deployment.
- **ASSUMPTION**: Browser Use handles LinkedIn DOM changes with standard form selectors and fallback alerts.
