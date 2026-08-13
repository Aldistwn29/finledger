# FinLedger

FinLedger is a focused full-stack application for small family businesses to record sales, customer debts, cash movements, and business performance. The MVP supports two business types:

- `GROCERY`: warung sembako.
- `PULSE`: usaha jual beli pulsa.

The product is also a learning project for Docker packaging and CI/CD with GitHub Actions. FinLedger is an evaluation aid, not accounting software or professional financial advice.

## Product Story

FinLedger addresses two practical situations:

- A warung owner may forget customer debt records and needs to understand sales, cash, and when additional stock or capital is reasonable to evaluate.
- A student running a pulse business needs to record frequent transactions, track capital used per week or month, and remember which customers have not paid.

The product turns those needs into a simple flow:

```text
Record activity -> monitor debt and cash -> review reports -> evaluate the next business decision
```

## Project Status

The project is in the MVP foundation phase. The current foundation includes Supabase authentication, business onboarding, tenant context, a pulse dashboard read model, responsive application shell, reusable sidebar navigation, and light/dark theme support.

Customers, sales entry, debt payments, cash-movement writes, reports, and platform administration are still being implemented according to the development phases below.

## MVP Scope

### Authentication and Business

- Supabase registration, login, logout, and secure sessions.
- Exactly two platform roles: `ADMIN` and `USER`.
- `ADMIN` is for platform administration; `USER` is for business owners.
- `GROCERY` and `PULSE` are business types, not roles or permission levels.
- Each `USER` owns one business in the MVP.
- Business data is isolated with server authorization and Supabase RLS.

### Business Operations

- Customer management.
- Sales with `PAID`, `CREDIT`, or `PARTIAL` payment status.
- Customer debt and partial or full debt payments.
- Expenses, capital contributions, and owner withdrawals.
- Dashboard for cash, sales, debt, payments, and expenses.
- Weekly and monthly evaluation reports.
- Pulse cost, selling amount, and margin tracking.

For `PULSE`, a sale can include service type, destination phone, cost amount, selling amount, and calculated margin. The server is authoritative for totals, balances, tenant ownership, and financial calculations.

### Evaluation

Reports and dashboard indicators can show increasing debt, higher expenses, or cash below recent operating needs. They must not claim that spending or expansion is definitely safe and do not replace professional financial advice.

## Out of Scope for MVP

- Redis.
- Payment gateways, real payment processing, and simulated payment workflows.
- Pulse provider integration.
- Full inventory or point-of-sale management.
- Supplier debt.
- Double-entry accounting ledger.
- Tax accounting, payroll, lending, credit scoring, and multi-currency accounting.
- WhatsApp or automatic notification integrations.
- Automatic financial advice or expansion decisions.

## Technology Stack

- Next.js 16 App Router
- TypeScript and React
- Tailwind CSS and reusable UI components
- Supabase Auth and PostgreSQL
- Supabase Row Level Security
- Zod for server-boundary validation
- Recharts for dashboard visualization
- Docker for reproducible production packaging
- GitHub Actions for continuous integration
- Node.js built-in tests

## Project Structure

```text
app/          Next.js routes, layouts, pages, and server boundaries
components/   Reusable UI, layout, dashboard, and theme components
lib/          Supabase clients, auth context, configuration, and utilities
services/     Business use cases and report orchestration
db/           Database queries, types, and migration references
supabase/     Supabase migration directory
tests/        Unit, integration, and end-to-end tests
docs/         Product, architecture, design, database, and delivery docs
```

## Supabase Configuration

Create `.env.local` in the project root. Never commit this file or expose service-role credentials to browser code.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The manual MVP schema is documented in [`docs/database/mvp-schema.sql`](docs/database/mvp-schema.sql). Review existing objects before running destructive cleanup or schema changes in Supabase.

## Getting Started

### Prerequisites

- Node.js 20 or newer
- npm
- A Supabase project with the required Auth and database configuration

### Installation

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Validation

Run the local checks before opening a pull request:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

The current test suite is still small. Business rules and cross-tenant authorization tests must be expanded as customers, sales, debt, cash, and admin flows are implemented.

## Docker and CI/CD

Docker is used for reproducible production packaging and local learning. Supabase remains an external managed service and is not placed inside the application image. Redis is intentionally not part of the MVP.

Build and run locally:

```bash
docker build -t finledger:local .
docker run --rm -p 3000:3000 --env-file .env.local finledger:local
```

Never bake secrets into the image. Delivery guidance is documented in [`docs/development/Docker-CI-CD.md`](docs/development/Docker-CI-CD.md).

The GitHub Actions CI workflow validates:

```text
npm ci -> lint -> typecheck -> test -> build -> docker build
```

CD remains optional until a deployment target is selected.

## Architecture and Security Principles

- Keep the application as a modular monolith.
- Prefer Server Components for reads and Server Actions or Route Handlers for writes.
- Authenticate, authorize, and validate every server write.
- PostgreSQL is the source of truth for sales, debts, and cash records.
- Every business-owned record is scoped by `business_id` and protected by server authorization and RLS.
- Never trust client-calculated prices, totals, balances, roles, or tenant IDs.
- Credit and partial sales require a customer and create debt records.
- Debt overpayment is rejected.
- Cash balance distinguishes sale payments, debt payments, expenses, capital, and owner withdrawals.
- Financial writes that change multiple records must be atomic.
- Use exact database-safe monetary representations; do not use floating-point financial arithmetic.
- Never commit or log passwords, tokens, service-role credentials, environment files, or sensitive payment data.

## Development Workflow

Read the relevant PRD and architecture documentation before implementing a feature. Use focused branches, keep changes small, add regression tests, and review the diff before staging.

Suggested branch names:

```text
feature/foundation-dashboard-pulse
feature/customers-and-sales
feature/debt-and-cash
feature/reports-and-evaluation
```

Use focused conventional commit messages, for example:

```text
feat: add authenticated app shell and pulse dashboard
```

Keep `.env.local`, `node_modules/`, `.next/`, credentials, skills, and generated local output out of commits.

## Documentation

- [Product requirements](docs/product/prd.md)
- [Architecture](docs/architecture/Design.md)
- [Database plan](docs/architecture/Database.md)
- [Manual MVP schema](docs/database/mvp-schema.sql)
- [Frontend design system](docs/frontend/DesignSystem.md)
- [Docker and CI/CD guide](docs/development/Docker-CI-CD.md)
- [AI-assisted development workflow](docs/development/AI-Workflow.md)
