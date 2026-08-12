# Database Plan

The database plan follows the PRD and is not yet implemented. PostgreSQL through Supabase will be the financial source of truth.

## Required Invariants

- Business-owned tables include a non-null `business_id`.
- Membership is required before reading or writing business data.
- Monetary values use an exact, database-safe representation; floating-point arithmetic is not used for financial totals.
- Successful financial effects are atomic and idempotent.
- Ledger transactions balance: total debits equal total credits.
- Posted ledger entries are not deleted or silently rewritten.

## Planned Tables

`profiles`, `businesses`, `business_members`, `products`, `customers`, `sales`, `sale_items`, `payments`, `receivables`, `receivable_payments`, `accounts`, `ledger_transactions`, `ledger_entries`, and `audit_logs`.

Before adding tables, create a reviewed migration, indexes for tenant and reference lookups, constraints for critical invariants, and RLS policies with tests for authorized and cross-tenant access.
