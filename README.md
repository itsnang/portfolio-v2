## Portfolio v2

Samnang Lorn’s personal portfolio powered by Next.js 15, React 19, and Tailwind CSS 4. This repository exists as a live showcase, not as a template or starter kit.

## Respect This Work

All code are original. Please **do not**:

- Clone or redistribute the UI/UX or component structure
- Repackage any part of the project for client work, templates, or commercial use
- Publish derivatives that could be confused with this site

Learning from the code is encouraged—just build something distinct and credit inspirations. For collaboration or licensing requests, reach out before reusing anything substantial.

See the [`LICENSE`](./LICENSE) for the full legal terms (All Rights Reserved).

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` during development. Main content lives under `src/app/(home)` with shared UI in `src/components/**`.

## Tech Stack

- Next.js App Router with Turbopack
- React Server Components + Suspense patterns
- Tailwind CSS 4 + custom motion tooling
- TipTap v3 editor extensions
- Drizzle ORM, Lucia Auth, and supporting utilities

## Deployment

```bash
npm run build
npm start
```

Deploy via Vercel (recommended) or any platform supporting Next.js 15. Configure required environment variables before promoting to production.
