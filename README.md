## Portfolio v2

Samnang Lorn’s personal portfolio powered by Next.js 15, React 19, and Tailwind CSS 4. This repository exists as a live showcase, not as a template or starter kit.

## Respect This Work

All design, layout, copy, and code are original. Feel free to use the UI as **inspiration**, but please **do not**:

- Copy the interface, sections, or component structure verbatim
- Repackage any part of the project for client work, templates, or commercial use
- Publish derivatives that could be mistaken for this site

Learn from the ideas, then create something unmistakably yours. Credit is appreciated if you reference concepts from this repository. For collaboration or licensing requests, reach out before reusing anything substantial.

See the [`LICENSE`](./LICENSE) for the full legal terms (All Rights Reserved).

## Getting Started

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` during development. Main content lives under `src/app/(home)` with shared UI in `src/components/**`.

## Portfolio CMS

A password-protected dashboard (`/dashboard`, gated by Better Auth) lets the site owner manage every piece of content shown on the public portfolio, no redeploy required.

|                                            |                                            |
| ------------------------------------------ | ------------------------------------------ |
| **Sign In**<br>![Sign in](docs/screenshots/cms-sign-in.png) | **Projects**<br>![Projects](docs/screenshots/dashboard-projects.png) |
| **Experience**<br>![Experience](docs/screenshots/dashboard-experience.png) | **Profile**<br>![Profile](docs/screenshots/dashboard-profile.png) |
| **Education**<br>![Education](docs/screenshots/dashboard-education.png) | **Recommendations**<br>![Recommendations](docs/screenshots/dashboard-recommendations.png) |
| **Image Library**<br>![Images](docs/screenshots/dashboard-images.png) | **App Config**<br>![App Config](docs/screenshots/dashboard-app-config.png) |

Content types managed from the CMS:

- **Profile** — availability status and profile photo
- **Skills** — categorized skill entries with logos
- **Experience** — work history with company, role, and period
- **Education** — schools, degrees, and dates
- **Projects** — title, description, tech stack, thumbnail, and active/inactive status
- **Socials** — social links with logos
- **Recommendations** — testimonials with reviewer photo and details
- **Images** — a Cloudinary-backed media library (folder-organized) used across all the forms above
- **App Config** — maintenance mode banner and portfolio theme (Modern / Wireframe)

## Tech Stack

- Next.js App Router with Turbopack
- React Server Components + Suspense patterns
- Tailwind CSS 4 + custom motion tooling
- TipTap v3 editor extensions
- Drizzle ORM, Better Auth, and supporting utilities

## Deployment

```bash
npm run build
npm start
```

Deploy via Vercel (recommended) or any platform supporting Next.js 15. Configure required environment variables before promoting to production.
