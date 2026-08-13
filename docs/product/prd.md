# FinLedger Product Requirements

Document status: MVP v1

## 1. Product Overview

FinLedger is a simple web application for small family businesses to record sales, customer debts, cash movements, and business performance. The MVP supports two business types:

- `GROCERY`: warung sembako.
- `PULSE`: usaha jual beli pulsa.

The product is inspired by two real situations: a warung owner who forgets customer debts and needs to understand when to add stock or capital, and a student running a pulse business who needs to track frequent transactions, capital, and customers who have not paid.

FinLedger is an evaluation aid, not accounting software or professional financial advice.

## 2. Product Goals

The MVP must allow a business owner to:

- Register and log in securely.
- Create one business profile and select its business type.
- Manage customers.
- Record sales as paid, credit, or partially paid.
- Record customer debt and partial or full debt payments.
- Record expenses, capital contributions, and owner withdrawals.
- View a dashboard of cash, sales, debt, payments, and expenses.
- Review weekly and monthly reports to evaluate the business.
- Keep data isolated between businesses.

## 3. Target Users

### 3.1 Warung Sembako Owner

The owner needs fast debt entry, a list of customers who owe money, payment history, sales summaries, and indicators for stock or capital decisions.

### 3.2 Pulse Business Owner

The owner needs fast transaction entry while studying, records of destination numbers and service types, capital tracking, customer debt tracking, and simple margin reports.

## 4. MVP Scope

### 4.1 Authentication and Business

- Supabase registration, login, logout, and secure sessions.
- The system has exactly two platform roles: `ADMIN` and `USER`.
- `ADMIN` is for platform administration and `USER` is for business owners.
- `GROCERY` and `PULSE` are business types, not roles or permission levels.
- Each `USER` owns one business in the MVP.
- Business types: `GROCERY` and `PULSE`.
- Business data is protected by server authorization and Supabase RLS.

### 4.2 Customers

Customers contain a name, phone number, optional address and notes, active status, and `business_id`.

Users can create, edit, deactivate, search, and view customer debt history.

### 4.3 Sales

A sale records the customer when applicable, description, amount, payment status, date, and note.

Payment statuses:

- `PAID`: fully paid at sale time.
- `CREDIT`: fully unpaid and recorded as debt.
- `PARTIAL`: partly paid and the remainder is recorded as debt.

For `PULSE`, a sale also records:

- `service_type`, such as phone credit, data package, or electricity token.
- `destination_phone`.
- `cost_amount`.
- `selling_amount`.
- `margin_amount`, calculated as `selling_amount - cost_amount`.

The server validates and calculates authoritative amounts. Client totals are never trusted.

### 4.4 Customer Debt

A credit or partially paid sale creates a debt record. A debt requires a customer, total amount, outstanding amount, and optional due date.

Debt statuses:

- `NOT_DUE`
- `DUE`
- `OVERDUE`
- `PAID`

Users can record partial or full payments. Overpayment is rejected. Every debt payment belongs to the same business as its debt.

### 4.5 Cash Movements

Cash movements record the events needed to understand actual business cash:

- `SALE_PAYMENT`
- `DEBT_PAYMENT`
- `EXPENSE`
- `CAPITAL_IN`
- `OWNER_WITHDRAWAL`

Capital is not revenue. Owner withdrawals are not operating expenses. A credit sale is not cash received until its debt is paid.

The cash balance is derived from persisted cash movements, not from total sales alone.

### 4.6 Dashboard

The dashboard displays:

- Current business cash balance.
- Sales for the selected week or month.
- Actual cash received.
- Active and overdue debt.
- Recent debt payments.
- Expenses.
- Capital contributions.
- Owner withdrawals.
- Pulse margin when the business type is `PULSE`.

Dashboard values are read models and are not the financial source of truth.

### 4.7 Reports and Evaluation

Reports include:

- Weekly and monthly sales.
- Actual cash received.
- Expenses.
- Capital contributions.
- Owner withdrawals.
- Active and overdue debt.
- Debt payments.
- Customers with the largest outstanding debt.
- Pulse cost, selling amount, and margin.

Evaluation indicators may say that debt is increasing, expenses exceed a previous period, or operating cash is below recent average needs. The application must not claim that expansion or spending is definitely safe. Indicators are informational only.

## 5. Out of Scope for MVP

- Redis.
- Payment gateway or real payment processing.
- Simulated payment workflows.
- Pulse provider integration.
- Full inventory or point-of-sale management.
- Supplier debt.
- Double-entry accounting ledger.
- Tax accounting, payroll, lending, credit scoring, and multi-currency accounting.
- WhatsApp or automatic notification integrations.
- Automatic financial advice or expansion decisions.

## 6. Data Entities

The initial entities are:

```text
profiles
businesses
business_members
customers
sales
debt_records
debt_payments
cash_transactions
audit_logs
```

Every business-owned entity includes `business_id` and is protected by authorization and RLS.

## 7. Non-Functional Requirements

- Server-side authorization for every protected read and write.
- Zod validation at server boundaries.
- Exact database-safe monetary representation; no floating-point financial totals.
- Atomic sales, debt-payment, and cash-movement writes.
- Cross-business reads and writes are denied.
- Secrets are never committed, logged, or exposed to browser code.
- Responsive desktop, tablet, and mobile UI.
- Explicit loading, empty, error, and success states.

## 8. Development Order

### Phase 1: Foundation

Next.js, TypeScript, Supabase authentication, roles, business onboarding, tenant isolation, and documentation.

### Phase 2: Customers and Sales

Customers, paid/credit/partial sales, pulse-specific fields, and server-side calculations.

### Phase 3: Debt and Cash

Debt records, debt payments, expenses, capital, owner withdrawals, and atomic cash updates.

### Phase 4: Dashboard and Reports

Dashboard read models, weekly/monthly reports, filters, CSV export, and evaluation indicators.

### Phase 5: Engineering Delivery

Docker image, local production run, GitHub Actions CI, image build validation, deployment documentation, and an optional CD target.

## 9. MVP Success Criteria

The MVP is successful when:

- Both business types can be configured.
- Owners can record paid, credit, and partial sales.
- Credit and partial sales create accurate customer debt.
- Partial and full debt payments work without overpayment.
- Cash balance distinguishes revenue, debt payments, expenses, capital, and withdrawals.
- Pulse cost, selling price, and margin are recorded correctly.
- Dashboard and reports support weekly/monthly evaluation.
- Cross-business data access is denied.
- CI runs lint, typecheck, tests, and build.
- The application can be built and run in Docker without committed secrets.
