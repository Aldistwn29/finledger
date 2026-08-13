# FinLedger

FinLedger is an educational full-stack finance recording application for UMKM. Payment features are simulations only; the application does not process real money.

Product requirements are in [`docs/product/prd.md`](docs/product/prd.md). Architecture, database rules, frontend rules, and AI workflow guidance are in [`docs/`](docs/).

## Getting Started

Install dependencies and run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Validation

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

AI coding rules are defined in [`AGENTS.md`](AGENTS.md). Read it before making changes.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
