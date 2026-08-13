# Architecture

## Current Direction

FinLedger is a modular monolith using the Next.js App Router and TypeScript. The UI, server-side application logic, and route handlers live in one deployable application.

## Boundaries

- `app/`: routes, layouts, pages, loading and error boundaries.
- `components/`: reusable presentation components only.
- `lib/`: infrastructure clients, configuration, and shared utilities.
- `services/`: business use cases and domain orchestration.
- `db/`: database queries, schema types, and migrations when introduced.
- `tests/`: unit, integration, and end-to-end tests.

Business logic belongs in `services/` or database functions, not in JSX. Server Actions and Route Handlers are security boundaries and must authenticate, authorize, validate input, and return safe errors.

## Financial Integrity

PostgreSQL is the source of truth. Financial mutations must be atomic and must create balanced ledger postings. Duplicate-sensitive operations require durable database constraints in addition to any cache-based idempotency lookup.

## Tenant Isolation

All business-owned data carries `business_id`. Server authorization and Supabase Row Level Security must both prevent cross-business access. A client-supplied tenant ID is never trusted.

## Change Process

1. Define the behavior and acceptance criteria in documentation or an issue.
2. Implement a vertical slice with server-side validation and authorization.
3. Add tests for success, failure, authorization, tenant isolation, and duplicate requests where relevant.
4. Run lint, typecheck, tests, and production build.
