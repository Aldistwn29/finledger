FinLedger — Product Requirements Document (PRD)

Document Status: MVP v1Product Type: Full-stack web applicationTarget User: UMKMPrimary Stack: Next.js, TypeScript, SupabasePurpose: Portfolio project and practical software engineering learning project

1. Product Overview

FinLedger is a full-stack web application for helping small and medium businesses (UMKM) record sales, manage customer receivables, monitor payments, and view simple financial reports.

FinLedger does not process real money. Payment methods such as transfer, QRIS, and virtual account are implemented as simulations for educational and portfolio purposes.

The project is designed to demonstrate practical software engineering concepts relevant to fintech systems, including transaction processing, relational database design, payment state management, receivables management, ledger recording, idempotency, multi-tenant data isolation, role-based access control, audit logging, caching, rate limiting, testing, Docker-based development, and deployment.

All simulated payment-related features must clearly display:

Simulation Only

2. Product Problem

Many small businesses still record sales, customer debt, and payments using paper notes, spreadsheets, messaging applications, or memory.

This creates several common problems:

transaction records are inconsistent;

customer receivables are difficult to track;

payment history is fragmented;

business owners have limited visibility into cash flow;

duplicate or incorrect transaction records can occur;

there is no structured audit trail;

financial data may be mixed between different business users.

FinLedger provides a simple financial recording workflow without attempting to become a complete accounting system.

3. Product Goals

The MVP must allow an UMKM to:

Record sales transactions.

Manage products and customers.

Record cash and simulated digital payments.

Create customer receivables for credit sales.

Record partial or full receivable payments.

View transaction and receivable history.

Maintain a simple transaction ledger.

Display business balances and financial summaries.

Prevent duplicate payment processing.

Maintain an audit trail for important activities.

Isolate data between different businesses.

Run the application in a reproducible development environment.

4. Non-Goals

The MVP does not provide:

real bank transfers;

real QRIS transactions;

real virtual account payments;

payment gateway integration;

card processing;

storage of card information;

official KYC;

real lending;

credit scoring;

tax accounting;

payroll;

full accounting software;

bank reconciliation;

multi-currency accounting.

5. Target Users

5.1 USER

Main capabilities:

view dashboard;

view business balance;

manage products;

manage customers;

create sales;

record payments;

manage receivables;

view reports;

inspect financial activity.

Every USER owns one business in the MVP. USER data is isolated to that
business and USER cannot access platform administration routes.

5.2 ADMIN

Main capabilities:

access the platform administration dashboard;

view users;

view businesses;

view and manage feedback;

inspect audit logs;

view recent platform activity.

ADMIN is the sole platform administrator in the MVP. ADMIN does not manage
USER financial transactions directly.

6. Product Scope

6.1 Authentication

The application must support:

registration;

login;

logout;

secure session management;

authenticated routes;

role-based authorization.

Authentication uses Supabase Auth.

Passwords must never be stored directly by FinLedger.

After login, ADMIN is redirected to `/admin/dashboard` and USER is redirected
to `/app/dashboard`. Protected routes must enforce the user's platform role on
the server.

6.2 Business and Membership

FinLedger is a multi-tenant application.

Minimum identity entities:

business;

user profile;

platform role (`ADMIN` or `USER`).

Each USER has exactly one business in the MVP. A business profile includes a
business name, business type, and optional phone number and address.

Business-owned data must always be associated with a business_id.

A USER must not access data belonging to another business.

Supabase Row Level Security (RLS) should be used as one of the main data-isolation mechanisms.

6.3 Dashboard

The dashboard displays:

total sales today;

total sales for the current month;

simulated business balance;

active receivables;

pending transactions;

overdue receivables;

recent transactions.

Dashboard values are read models and must not become the financial source of truth.

6.4 Product Management

Authorized users can:

create products;

edit products;

deactivate products;

search products;

view product information.

Product data:

name;

optional SKU;

selling price;

unit;

active status;

created timestamp;

updated timestamp;

owning business.

Products should normally be deactivated instead of hard-deleted when historical transactions depend on them.

6.5 Customer Management

Authorized users can:

create customers;

edit customer information;

deactivate customers;

view customer transaction history;

view active receivables;

view payment history.

Customer data:

name;

phone number;

optional address;

optional notes;

active status;

owning business.

6.6 Sales

A sale may contain one or more sale items.

Input may include:

customer;

products;

quantities;

discount;

payment method;

transaction note.

Supported payment methods:

CASH;

TRANSFER;

QRIS;

VIRTUAL_ACCOUNT;

CREDIT.

Digital payment methods are simulations only.

The server must calculate authoritative transaction totals.

The client must never be the source of truth for product price, subtotal, discount result, final total, or payment balance.

6.7 Sale Status

Recommended sale lifecycle:

PENDING;

COMPLETED;

CANCELLED.

Payment settlement state must be represented separately where required:

UNPAID;

PARTIALLY_PAID;

PAID.

Sale state and payment state are different concepts.

6.8 Payment Simulation

Payment flow:

A sale is created.

A payment record is created with status PENDING.

The system generates a unique payment reference.

The user selects a simulation result.

The payment transitions to SUCCEEDED or FAILED.

A successful payment creates the required financial effects.

A failed payment must not update business financial balances.

Important state changes are written to the audit log.

Example reference:

PAY-20260810-000001

Payment statuses:

PENDING;

SUCCEEDED;

FAILED;

CANCELLED.

A completed payment must not be processed successfully more than once.

6.9 Receivables

When payment method is CREDIT:

a customer is mandatory;

the user must define a due date;

the system creates a receivable;

the outstanding amount is tracked;

the receivable remains associated with its original sale.

Receivable states:

NOT_DUE;

DUE;

OVERDUE;

PAID.

6.10 Receivable Payments

Users can record:

partial payment;

full payment.

Each receivable payment records:

receivable reference;

amount;

payment method;

payment timestamp;

responsible user;

transaction reference.

Business rule:

Outstanding Receivable
=
Receivable Total
-
Total Successful Receivable Payments

When outstanding amount reaches zero, the receivable becomes PAID.

The MVP rejects overpayment.

7. Financial Ledger

FinLedger maintains a simple ledger for portfolio and educational purposes.

Financial effects must be persisted in PostgreSQL.

Redis must never be the financial source of truth.

7.1 Minimum Accounts

The MVP may include:

Cash;

Accounts Receivable;

Sales Revenue.

7.2 Ledger Model

Recommended structure:

ledger transaction;

ledger entries;

account;

debit or credit direction;

monetary amount;

reference;

timestamp.

A financial posting must satisfy:

Total Debit = Total Credit

Example cash sale:

Debit  : Cash
Credit : Sales Revenue

Example credit sale:

Debit  : Accounts Receivable
Credit : Sales Revenue

7.3 Immutability

Posted ledger entries must not be deleted or silently rewritten.

Financial corrections should use reversal or compensating entries.

8. Business Balance

Business balances must be derived from or reconciled with persisted PostgreSQL financial data.

The application may maintain account balances for efficient reads, but any balance mutation must remain consistent with ledger postings.

Financial state changes must occur atomically.

9. Idempotency

Operations that can create financial effects must support duplicate protection.

Examples:

successful payment processing;

receivable payment recording.

Requests may include:

Idempotency-Key: checkout-abc-123

Repeated requests using the same valid key must not create duplicate financial effects.

Redis may be used for fast idempotency lookup.

PostgreSQL constraints should provide durable duplicate protection where appropriate.

10. Audit Log

The application records important actions such as:

login activity where appropriate;

sale creation;

payment state changes;

transaction cancellation;

receivable payment;

product modification;

customer modification;

feedback creation.

Audit log data:

actor;

action;

entity;

entity ID;

business ID where applicable;

timestamp;

relevant metadata.

Audit logs must not contain secrets or sensitive credentials.

11. Reports

MVP reports:

daily sales;

weekly sales;

monthly sales;

sales by payment method;

active receivables;

overdue receivables;

balance movements;

transaction history.

Filters:

date range;

transaction status;

payment method.

The MVP supports CSV export for selected reports.

12. Redis Usage

Redis is supporting infrastructure, not the primary database.

Planned use cases:

Dashboard Cache

cache dashboard summaries;

short TTL;

invalidate affected cache after relevant financial operations.

Idempotency

store or resolve idempotency keys;

return a previous completed result for duplicate requests.

Rate Limiting

Apply limits to:

login;

registration;

payment simulation;

report export.

Temporary OTP

If OTP simulation is implemented, Redis may store:

OTP value;

expiration;

retry count.

Notification Jobs

Redis may later support reminder or notification jobs.

Redis-dependent features may be implemented after the core financial flow is stable.

13. Technology Stack

Application

Next.js App Router;

TypeScript;

React;

Tailwind CSS;

shadcn/ui.

Backend

FinLedger uses Next.js backend capabilities through:

Server Components;

Server Actions;

Route Handlers;

service-layer modules.

Data and Authentication

Supabase PostgreSQL;

Supabase Auth;

Supabase Row Level Security;

Supabase JavaScript client;

PostgreSQL functions/RPC where atomic database operations are appropriate.

Validation

Zod.

Caching and Reliability

Redis or managed Redis-compatible service.

Testing

unit tests;

integration tests;

end-to-end tests.

Development and Deployment

Git;

Docker;

Docker Compose where applicable;

environment-based configuration;

documented production deployment.

14. Architecture Principles

PostgreSQL is the financial source of truth.

Business logic must not live inside React presentation components.

Financial writes must be atomic.

Client-calculated totals are never authoritative.

Ledger postings must remain internally balanced.

Posted financial history must be auditable.

Business data must be isolated by tenant.

Server-side authorization is mandatory.

Secrets must never be exposed to the browser.

New infrastructure must solve a concrete problem.

The MVP remains a modular monolith unless a real requirement justifies otherwise.

Detailed architecture decisions belong in docs/architecture/Design.md.

15. UI/UX Direction

FinLedger uses a dedicated design system defined in:

docs/frontend/DesignSystem.md

The interface prioritizes:

financial readability;

trust;

clear transaction states;

clear form validation;

responsive layouts;

low cognitive load;

consistent component behavior.

The UI must not introduce arbitrary visual styles outside the documented design system.

16. Non-Functional Requirements

Security

authenticated access for protected functionality;

role-based authorization;

tenant isolation;

Supabase RLS where applicable;

no plaintext password storage;

no payment-card storage;

no secrets exposed to frontend code;

safe error messages;

rate limiting for sensitive operations.

Data Integrity

financial mutations must be atomic;

duplicate financial effects must be prevented;

authoritative calculations happen server-side;

database constraints should enforce critical invariants where possible.

Performance

normal application pages should target an initial load below 3 seconds under expected MVP conditions;

expensive dashboard reads may be cached;

unnecessary client-side fetching should be avoided.

Maintainability

TypeScript must be used consistently;

modules should have clear responsibilities;

business logic should remain testable independently from UI;

implementation should follow documented coding standards.

Responsiveness

The application must support:

desktop;

tablet;

mobile.

17. High-Level Data Entities

Initial entities:

profiles;

businesses;

products;

customers;

sales;

sale_items;

payments;

receivables;

receivable_payments;

accounts;

ledger_transactions;

ledger_entries;

audit_logs;

notifications.

Detailed schema belongs in:

docs/architecture/Database.md

18. Core Acceptance Criteria

Authentication and Authorization

users can authenticate;

protected pages require authentication;

users cannot access another business's data;

ADMIN users can access only platform administration routes;

USER users can access only their business application routes;

ADMIN users are redirected to `/admin/dashboard` after login;

USER users are redirected to `/app/dashboard` after login.

Products

authorized users can create products;

product data is scoped to a business;

invalid product data is rejected.

Sales

users can create a sale with one or more products;

prices and totals are recalculated server-side;

a sale is associated with the active business.

Payments

a pending simulated payment can transition to success or failure;

successful payment produces financial effects exactly once;

failed payment does not update financial balances;

every payment has a unique reference.

Receivables

credit sales require a customer;

a credit sale creates a receivable;

partial payments reduce outstanding balance;

full payment closes the receivable;

overdue state can be identified.

Ledger

successful financial operations create ledger postings;

every posting remains balanced;

posted entries are not hard-deleted.

Audit

important financial and administrative changes are traceable.

Deployment

environment secrets are not committed;

the repository contains setup documentation;

the application can be built and run using the documented process.

19. MVP Development Order

Development should prioritize vertical slices.

Phase 1 — Foundation

Next.js;

TypeScript;

Git;

Supabase;

authentication;

platform roles (`ADMIN` and `USER`);

business profile creation;

tenant isolation;

project context documentation.

Phase 2 — Basic Business Data

products;

customers.

Phase 3 — First Financial Vertical Slice

create sale;

create pending payment;

simulate successful payment;

ledger posting;

account/balance update;

audit log;

tests.

Phase 4 — Credit Flow

credit sale;

receivable;

partial payment;

full payment;

overdue state.

Phase 5 — Reliability

idempotency;

Redis;

rate limiting;

cache;

transaction integrity tests.

Phase 6 — Presentation and Reporting

dashboard;

financial summaries;

reports;

CSV export;

responsive refinement.

Phase 7 — Production Readiness

Docker;

deployment;

documentation;

portfolio README;

architecture diagrams.

20. Definition of MVP Success

The MVP is functionally successful when:

authentication and roles work;

business data is isolated;

products and customers can be managed;

sales can be created;

simulated payments can succeed or fail;

successful payments produce correct ledger effects;

credit sales create receivables;

receivables support partial and full payment;

duplicate payment processing is prevented;

financial state is stored in PostgreSQL;

important activity is audited;

dashboard displays core financial information;

main business flows have automated tests;

the application can be deployed;

repository documentation explains architecture and setup.

21. Portfolio Value

FinLedger should demonstrate practical understanding of:

Next.js full-stack development;

TypeScript;

Supabase;

PostgreSQL relational modelling;

authentication and authorization;

multi-tenancy;

RLS;

financial transaction processing;

ledger concepts;

atomic database operations;

idempotency;

Redis;

rate limiting;

audit trails;

UI architecture;

testing;

Docker;

deployment;

context engineering;

AI-assisted development without surrendering engineering decisions to the coding agent.
