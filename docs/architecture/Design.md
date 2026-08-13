# Architecture

## Current Direction

FinLedger is a modular monolith using the Next.js App Router, TypeScript, and Supabase. The application supports two small-business workflows: grocery debt tracking and pulse-business cash/margin tracking.

## Boundaries

- `app/`: routes, layouts, pages, Server Actions, and route handlers.
- `components/`: reusable presentation components only.
- `lib/`: infrastructure clients, auth context, configuration, and shared utilities.
- `services/`: business use cases and domain orchestration.
- `db/`: database queries, generated types, and migration references when introduced.
- `tests/`: unit, integration, and end-to-end tests.

Business logic belongs in `services/` or database functions, not JSX. Every Server Action and Route Handler must authenticate, authorize, validate input, and return safe errors.

## Financial Model

The MVP uses sales, debt records, debt payments, and cash transactions. It does not implement a double-entry ledger. PostgreSQL remains authoritative. Cash balance is derived from persisted cash transactions and distinguishes sale payments, debt payments, expenses, capital, and owner withdrawals.

## Tenant Isolation

All business-owned data carries `business_id`. Server authorization and Supabase RLS must prevent cross-business access. A client-supplied tenant ID is never trusted.

## Infrastructure Scope

Redis, payment gateways, pulse provider integrations, and external notification services are out of MVP scope. Docker is used to learn reproducible packaging and local production execution. GitHub Actions is used for CI checks and Docker image build validation. Supabase remains an external managed dependency.

## Change Process

1. Define behavior and acceptance criteria in the PRD.
2. Implement a vertical slice with server validation and authorization.
3. Add tests for success, failure, tenant isolation, and financial invariants.
4. Run lint, typecheck, tests, and production build.
5. Verify the Docker image separately without including secrets.
