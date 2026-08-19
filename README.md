# FinLedger - Small Business Financial Tracker

_Disclaimer: Some parts of this README were intentionally generated with ChatGPT and reviewed against the project implementation._

## Overview

FinLedger is a full-stack financial tracking application for small businesses. It helps business owners record sales, manage customer debt, monitor cash flow, and review business performance from a single workspace.

The current working vertical slice focuses on `PULSE` businesses such as phone credit, data package, and electricity token sellers. A `GROCERY` business type is available during onboarding, with its complete operational workflow planned for future development.

FinLedger is an evaluation tool for business owners. It is not professional accounting software or financial advice.

## Features

- Register, log in, log out, and maintain secure sessions with Supabase Auth.
- Create a business workspace as either `PULSE` or `GROCERY`.
- Keep business data isolated with server-side authorization and Row Level Security.
- Create, update, search, filter, view, and deactivate customers.
- Record pulse sales as `PAID`, `CREDIT`, or `PARTIAL`.
- Calculate selling amount, paid amount, outstanding debt, and margin on the server.
- Automatically create debt and cash records through atomic PostgreSQL functions.
- Record partial or full debt payments and reject overpayments.
- Review sales, cash, margin, and receivable indicators on the Pulse dashboard.
- View weekly and monthly Pulse sales reports.
- Update profile and business settings.
- Submit product feedback.
- Use a responsive interface with light and dark themes.

## Technologies Used

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS
- Supabase Auth and PostgreSQL
- Supabase Row Level Security
- Zod
- Recharts
- Docker
- GitHub Actions
- Node.js built-in test runner

## Setup Instructions

### Prerequisites

- Node.js 22 recommended
- npm
- Git
- A Supabase project
- Docker Desktop, optional for container-based usage

### Clone the Repository

```bash
git clone https://github.com/Aldistwn29/finledger.git
cd finledger
```

### Install Dependencies

```bash
npm ci
```

### Configure Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Use a Supabase publishable key. Never expose or commit a service-role key.

### Configure the Database

For a fresh Supabase project:

1. Apply [`docs/database/mvp-schema.sql`](docs/database/mvp-schema.sql).
2. Apply the migrations in `supabase/migrations/` in filename order.

```text
20260815000000_create_pulse_sale.sql
20260815000001_add_feedback_and_settings.sql
20260815000002_add_customer_management.sql
```

### Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

There is no default user. Create an account from `/register`, then complete the business setup flow.

## Application Routes

| Route                | Description                          |
| -------------------- | ------------------------------------ |
| `/login`             | Sign in with Supabase Auth           |
| `/register`          | Create a new account                 |
| `/setup/business`    | Create a business workspace          |
| `/app/dashboard`     | View the Pulse business dashboard    |
| `/app/customers`     | Search and manage customers          |
| `/app/customers/new` | Create a customer                    |
| `/app/sales`         | View recent Pulse sales              |
| `/app/sales/new`     | Record a Pulse sale                  |
| `/app/receivables`   | Review and pay customer debt         |
| `/app/reports`       | View weekly or monthly Pulse reports |
| `/app/settings`      | Update profile and business settings |
| `/app/feedback`      | Submit feedback                      |

The current dashboard, sales, receivables, and reports provide an unavailable state for non-`PULSE` businesses.

## Docker

Supabase remains an external service and is not included in the application image. Public Supabase configuration must be provided during the build because Next.js compiles `NEXT_PUBLIC_*` values into the browser bundle.

### Build Locally

```bash
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co \
  --build-arg NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key \
  -t finledger:local .
```

### Run Locally

```bash
docker run --rm \
  --name finledger-local \
  -p 3000:3000 \
  --env-file .env.local \
  finledger:local
```

### Run the Docker Hub Image

```bash
docker pull aldistwn29/finledger:main

docker run -d \
  --name finledger-main \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file .env.local \
  aldistwn29/finledger:main
```

## CI/CD

GitHub Actions validates pull requests and pushes to `main` with the following pipeline:

```text
npm ci -> lint -> typecheck -> test -> build -> Docker build
```

Pull requests build the Docker image without publishing it. A successful push to `main` publishes branch and commit SHA tags to Docker Hub.

The workflow requires these GitHub repository variables:

```text
DOCKERHUB_USERNAME
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
```

It also requires this GitHub repository secret:

```text
DOCKERHUB_TOKEN
```

## Validation

Run the checks before opening a pull request:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Project Structure

```text
app/          Next.js routes, pages, layouts, and Server Actions
components/   Reusable UI and feature components
db/           Database queries and shared database types
lib/          Authentication, Supabase clients, and utilities
services/     Business use cases and report orchestration
supabase/     Database migrations and PostgreSQL functions
tests/        Automated tests
docs/         Product, architecture, database, and delivery documentation
```

## Current Limitations

- Grocery-specific dashboard, sales, receivables, and reporting workflows are not implemented yet.
- Expense and capital entry pages are currently placeholders.
- Platform administration and CSV export are not available.
- The Pulse sale form does not yet collect destination phone, custom sale date, due date, or notes.
- Automated test coverage is still limited and must be expanded.

## Future Enhancements

- Build a complete Grocery workspace with product and category management.
- Add real-time inventory tracking for stock-in, sales, damaged items, and manual adjustments.
- Provide low-stock alerts and data-driven restocking recommendations.
- Support barcode scanning and a faster point-of-sale workflow.
- Add supplier and purchase-order management.
- Track product-level cost, selling price, profit margin, and sales performance.
- Provide daily, weekly, and monthly Grocery reports.
- Add best-selling, slow-moving, and high-margin product insights.
- Introduce customer purchase history and Grocery-specific debt tracking.
- Expand automated tests for financial rules, tenant isolation, and Grocery workflows.

## Documentation

- [Product requirements](docs/product/prd.md)
- [Architecture](docs/architecture/Design.md)
- [Database plan](docs/architecture/Database.md)
- [Docker and CI/CD guide](docs/development/Docker-CI-CD.md)
