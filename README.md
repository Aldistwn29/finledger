# FinLedger

FinLedger is a simple full-stack application for small family businesses to record sales, customer debts, cash movements, and business performance. The MVP supports warung sembako (`GROCERY`) and usaha jual beli pulsa (`PULSE`).

The project is also a learning project for Docker packaging and CI/CD delivery with GitHub Actions.

## Product Story

FinLedger addresses two practical situations:

- A warung owner may forget customer debt records and needs to understand sales, cash, and when additional stock or capital is reasonable to evaluate.
- A student running a pulse business needs to record frequent transactions, track capital used per week or month, and remember which customers have not paid.

FinLedger provides evaluation indicators only. It is not accounting software or professional financial advice.

## MVP Capabilities

- Supabase registration, login, logout, and protected sessions.
- Exactly two platform roles: `ADMIN` and `USER`.
- One business profile per `USER` account.
- Business types: `GROCERY` and `PULSE`.

`ADMIN` and `USER` control access. `GROCERY` and `PULSE` only determine the business workflow and relevant fields.
- Customer management.
- Sales with `PAID`, `CREDIT`, or `PARTIAL` payment status.
- Customer debt and partial or full debt payments.
- Expenses, capital contributions, and owner withdrawals.
- Dashboard for cash, sales, debt, payments, and expenses.
- Weekly and monthly evaluation reports.
- Pulse cost, selling amount, and margin tracking.
- Tenant isolation with server authorization and Supabase RLS.

## Explicitly Out of Scope

- Redis.
- Payment gateways and real payment processing.
- Pulse provider integration.
- Full inventory or POS features.
- Supplier debt and double-entry accounting.
- WhatsApp notifications and automatic financial advice.

## Technology Stack

- Next.js 16 App Router
- TypeScript and React
- Tailwind CSS and shadcn/ui components
- Supabase Auth and PostgreSQL
- Supabase Row Level Security
- Zod for server-boundary validation
- Docker for reproducible production packaging
- GitHub Actions for continuous integration
- Node.js built-in tests

## Project Structure

```text
app/          Next.js routes, layouts, pages, and server boundaries
components/   Reusable presentation components
lib/          Supabase clients, auth context, configuration, utilities
services/     Business use cases and domain orchestration
db/           Database queries, types, and migrations when introduced
tests/        Unit, integration, and end-to-end tests
docs/         Product, architecture, design, and delivery documentation
```

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A Supabase project

### Installation

```bash
npm install
```

Create `.env.local` in the project root. Never commit it. Use the variables required by `lib/supabase/env.ts` and expose only publishable Supabase values to browser code.

Start development:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

Run the local checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Docker

Docker instructions are documented in [`docs/development/Docker-CI-CD.md`](docs/development/Docker-CI-CD.md). The application image contains only the Next.js application. Supabase remains an external managed service, and secrets are supplied at runtime.

## Architecture and Security Principles

- PostgreSQL is the source of truth for sales, debts, and cash movements.
- Every business-owned record is scoped by `business_id` and protected by server authorization and RLS.
- The server recalculates monetary values and never trusts client totals or tenant IDs.
- Credit and partial sales require customers and create debt records.
- Debt overpayment is rejected.
- Cash balance distinguishes payments, expenses, capital, and owner withdrawals.
- Secrets, service-role credentials, passwords, and tokens are never committed or logged.

More detail is available in [`docs/product/prd.md`](docs/product/prd.md), [`docs/architecture/Design.md`](docs/architecture/Design.md), and [`docs/architecture/Database.md`](docs/architecture/Database.md).

## Development Workflow

Use focused branches and review changes before staging. Keep `.env.local`, `node_modules`, `.next`, credentials, and generated output out of commits.

The CI workflow runs lint, typecheck, tests, build, and Docker image build validation.
