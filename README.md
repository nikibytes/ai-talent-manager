# AI Talent Manager ![CI](https://github.com/nikibytes/ai-talent-manager/actions/workflows/ci.yml/badge.svg)

AI-assisted talent operations dashboard for managing the recruiting workflow from candidate intake through applications, approvals, content, and settings.

> **Status:** Active development
>
> The repository currently contains the Next.js/React dashboard foundation and supporting project documentation. Product capabilities are being implemented incrementally.

## Overview

AI Talent Manager is designed as a centralized workspace for talent-management operations. The current frontend is a Next.js application with dashboard views for:

- **Overview** — high-level workspace/dashboard experience
- **Queue** — work awaiting processing
- **Applications** — application workflow
- **Approvals** — approval workflow
- **Content** — talent-related content workflow
- **Settings** — application configuration

The dashboard entry point is implemented in `app/page.tsx`, with individual views organized under `app/pages/` and shared frontend utilities under `app/shared/`.

## Technology Stack

- **Next.js 14**
- **React 18**
- **TypeScript 5**
- **Node.js**
- **Node test runner** for the current automated dashboard test

## Repository Structure

```text
ai-talent-manager/
├── app/                    # Frontend application
│   ├── pages/              # Dashboard views/pages
│   ├── shared/             # Shared frontend data and hooks
│   └── page.tsx            # Main dashboard entry point
├── docs/                   # Project documentation
├── tests/                  # Automated tests
├── .env.template           # Environment-variable template
├── AGENTS.md               # Repository/agent engineering guidance
├── package.json            # Scripts and dependencies
├── package-lock.json       # Locked npm dependency versions
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

### Where UI code lives

The UI is currently stored under **`app/`** rather than a separate `ui/` or `frontend/` directory. Page-level UI is under `app/pages/`, shared UI/application logic is under `app/shared/`, and the main dashboard shell is in `app/page.tsx`.

## Getting Started

### Prerequisites

Install a current LTS version of Node.js and npm.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Then open the local URL printed by Next.js in your browser.

### Production Build

```bash
npm run build
npm start
```

## Testing

Run the current automated test suite:

```bash
npm test
```

The test command executes `tests/dashboard.test.mjs` through Node's built-in test runner.

## Linting

```bash
npm run lint
```

## Environment Configuration

Use `.env.template` as the starting point for local environment configuration. Create the appropriate local environment file and provide the required values.

**Never commit secrets, API keys, tokens, or production credentials.**

## Engineering Principles

- Keep frontend concerns organized under `app/`.
- Prefer small, composable React components and shared utilities.
- Preserve TypeScript type safety.
- Add or update tests when behavior changes.
- Keep generated artifacts and local environment files out of source control.
- Make changes small, reviewable, and easy to verify.

## Development Workflow

1. Read the relevant existing code and project guidance before changing behavior.
2. Implement the smallest coherent change.
3. Run the relevant tests and build/lint checks.
4. Review the resulting UI and behavior when frontend code changes.
5. Update documentation when architecture, commands, or project conventions change.

## Project Documentation

Additional project documentation belongs in `docs/`. Engineering planning and tracker artifacts should remain aligned with implementation so planned work, UI requirements, and delivered functionality do not drift apart.

## Contributing

Use normal Git workflows with clear commit messages and focused pull requests. Before merging, verify relevant tests/build checks and documentation.

## License

No project license is currently declared in the repository. Until one is added, treat the source as **all rights reserved**.
