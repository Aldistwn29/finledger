# Database Plan

Supabase PostgreSQL is the source of truth for identity, business data, debt, sales, and cash movements. This plan describes the simplified MVP and must be implemented through reviewed migrations.

## Required Invariants

- Every business-owned table has a non-null `business_id`.
- Membership is required before reading or writing business data.
- Monetary values use an exact database-safe representation, such as integer minor units or numeric with fixed scale; floating-point arithmetic is not used.
- A `CREDIT` or `PARTIAL` sale has a customer and a debt record.
- A debt payment cannot exceed the outstanding debt.
- A debt becomes `PAID` when outstanding amount reaches zero.
- Cash movements belong to the same business as their source record.
- Financial writes that create multiple records are atomic.
- Posted history is not silently rewritten or hard-deleted.

## Planned Tables

### Identity

`profiles`, `businesses`, and `business_members`.

The only platform roles are `ADMIN` and `USER`. Each `USER` has one business in the MVP. Business type is `GROCERY` or `PULSE` and is independent from the platform role.

### Business Data

`customers` contains customer details and `business_id`.

`sales` contains sale status, customer reference, description, total amount, date, and business reference. Pulse-specific fields include service type, optional destination phone, cost amount, selling amount, and margin amount. The initial MVP form does not collect the destination phone.

`debt_records` references a customer and source sale, and contains total, paid, outstanding, due date, and status.

`debt_payments` references a debt and contains amount, timestamp, payment note, responsible user, and business reference.

`cash_transactions` contains the business, type, amount, optional source entity, date, note, and responsible user. Types are `SALE_PAYMENT`, `DEBT_PAYMENT`, `EXPENSE`, `CAPITAL_IN`, and `OWNER_WITHDRAWAL`.

`audit_logs` records important business actions without secrets or credentials.

## Indexes and Constraints

Add indexes for `business_id`, customer lookups, debt status/due date, sale date, and cash transaction date. Add checks for positive amounts, valid statuses, and pulse selling amount not being lower than cost when the product rules require it. Add unique constraints for business membership and any durable duplicate reference.

## RLS

Enable RLS on every business-owned table. Policies must authorize through `business_members` and `auth.uid()`, never through a client-supplied tenant ID. Integration tests must cover both authorized access and cross-business denial.

## Atomic Operations

Sales that create debt and cash records, and debt payments that update debt and create cash records, should use a server-side use case and database transaction or RPC. The client never determines the business, totals, outstanding balance, or margin.
