---
status: LOCKED
version: 1
approved_by: human
approved_at: 2026-08-22T20:06:27Z
---

# Data Flow Diagram — ai-talent-manager

```text
Job Sources (LinkedIn / Agent Reach / Unipile)
     ↓
Job Normalization & Deduplication
     ↓
LLM Matcher (Candidate Profile + Job Spec)
     ↓
SQLite Opportunity Queue
     ↓
Tailored CV & Answer Generator (Google Drive API + LLM)
     ↓
Candidate Approval Gate (Dashboard / Email)
     ↓
Browser Use Automation Engine → LinkedIn Submission
     ↓
SQLite History & Email EOD Activity Report
```
