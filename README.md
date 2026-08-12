# FinLedger

FinLedger is an educational full-stack finance recording application for small and medium businesses (UMKM). It helps business owners record sales, manage customers and receivables, monitor simulated payments, and inspect simple financial summaries.

> **Simulation only:** FinLedger does not process real money. Transfer, QRIS, and virtual-account payment flows are simulated for learning and portfolio purposes.

## Project Status

The project is currently in the foundation phase. Authentication pages and the initial Supabase integration are in place. Products, customers, sales, receivables, ledger postings, reports, and the admin dashboard are planned MVP vertical slices.

The product requirements are documented in [`docs/product/prd.md`](docs/product/prd.md).

## User Stories

### Business user

- As a business owner, I can register and log in securely.
- As a business owner, I can view a dashboard with sales, balance, and receivable summaries.
- As a business owner, I can manage products and customers.
- As a business owner, I can record cash and simulated digital-payment sales.
- As a business owner, I can create credit sales and track customer receivables.
- As a business owner, I can record partial or full receivable payments.
- As a business owner, I can review transaction history and financial activity.
- As a business owner, I cannot access another business's data.

### Platform administrator

- As an administrator, I can access the platform administration dashboard.
- As an administrator, I can inspect users, businesses, feedback, audit logs, and recent platform activity.
- As an administrator, I do not directly manage a user's financial transactions.

## Planned MVP Capabilities

- Supabase authentication with `ADMIN` and `USER` roles.
- Business profiles and tenant-isolated data.
- Product and customer management.
- Sales with server-authoritative totals and payment states.
- Simulated `CASH`, `TRANSFER`, `QRIS`, `VIRTUAL_ACCOUNT`, and `CREDIT` payments.
- Receivables with due dates, overdue status, and partial or full payments.
- A balanced, auditable ledger backed by PostgreSQL.
- Duplicate-payment protection through idempotent financial operations.
- Dashboard summaries, reports, filters, and CSV export.
- Audit logs for important business and platform actions.

## Non-Goals

The MVP does not process real bank transfers, QRIS, virtual accounts, cards, lending, credit scoring, tax accounting, payroll, bank reconciliation, or multi-currency accounting. It does not store card data or plaintext passwords.

## Technology Stack

- Next.js 16 App Router
- TypeScript and React
- Tailwind CSS and shadcn/ui components
- Supabase Auth and PostgreSQL
- Supabase Row Level Security (RLS)
- Zod for server-boundary validation
- Redis-compatible infrastructure for future caching, idempotency, and rate limiting
- Node.js built-in tests, with integration and end-to-end coverage planned

## Project Structure

```text
app/          Next.js routes, layouts, and pages
components/   Reusable presentation components
lib/          Clients, configuration, and shared utilities
services/     Business use cases and domain orchestration
db/           Database queries, types, and migrations when introduced
tests/        Unit, integration, and end-to-end tests
docs/         Product, architecture, design, and development documentation
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A Supabase project for authenticated features

### Installation

```bash
npm install
```

Create `.env.local` in the project root with the values for the local environment. Never commit this file. Use the variable names required by [`lib/supabase/env.ts`](lib/supabase/env.ts), and expose only publishable Supabase values to browser code.

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

Run the full local checks before opening a pull request:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Architecture and Security Principles

- PostgreSQL is the financial source of truth; Redis is never authoritative.
- Financial writes are atomic, auditable, and idempotent where duplicate effects are possible.
- The server recalculates prices, totals, discounts, balances, roles, and tenant ownership.
- Every business-owned record is scoped by `business_id` and protected by server authorization and RLS.
- Posted ledger entries are immutable; corrections use reversals or compensating entries.
- Payment simulations are visibly labelled as simulation-only.
- Secrets, service-role credentials, passwords, tokens, and sensitive payment data are never committed or logged.
- Business logic belongs in server-side use-case modules or database functions, not presentation components.

More detail is available in [`docs/architecture/Design.md`](docs/architecture/Design.md) and [`docs/architecture/Database.md`](docs/architecture/Database.md).

## Development Workflow

Use `main` as the stable branch and create a feature branch for each change:

```bash
git switch main
```

Review changes in VS Code Source Control, commit with a focused message, and push the feature branch:

```bash
```

Open a pull request from the feature branch to `main`. Do not commit `.env.local`, `node_modules`, `.next`, skills, agent instructions, or credential files.

## Documentation

- [Product requirements](docs/product/prd.md)
- [Architecture](docs/architecture/Design.md)
- [Database plan](docs/architecture/Database.md)
- [Frontend design system](docs/frontend/DesignSystem.md)
- [AI-assisted development workflow](docs/development/AI-Workflow.md)
- [AI coding rules](AGENTS.md)
