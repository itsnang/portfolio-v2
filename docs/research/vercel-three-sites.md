# Deploying three Sites from one repo on Vercel

Research for [#135](https://github.com/itsnang/portfolio-v2/issues/135), part of map [#134](https://github.com/itsnang/portfolio-v2/issues/134). Checked 2026-11-09 against Vercel, pnpm, Next.js and Better Auth docs. Nothing was deployed and no Vercel project was changed.

Folder names (`apps/main`, `apps/blog`, `apps/admin`, `packages/*`) are assumed for illustration. The map has not settled them.

## Answer

Create one Vercel project per Site, all connected to this GitHub repo, each with its Root Directory set to its Site folder. Use Vercel's built-in **skip unaffected projects** rather than an Ignored Build Step. Keep env vars at project level, so admin secrets exist only on the Admin Site. All of this fits the Hobby plan, with one real constraint: builds run one at a time.

## Recommended setup

| Vercel project | Root Directory | Production domain | DNS record |
| --- | --- | --- | --- |
| Main Site (reuse the existing project) | `apps/main` | `lornsamnang.com` | A record, already in place |
| Blog Site (new) | `apps/blog` | `blog.lornsamnang.com` | CNAME, value is unique per project |
| Admin Site (new) | `apps/admin` | `admin.lornsamnang.com` | CNAME, value is unique per project |

Settings for all three:

- Leave **Include files outside the root directory in the Build Step** on, because Sites import Shared Packages from outside their folder.
- Leave Git Fork Protection on. This repo is public.
- Turn on **Prioritize Production Builds**, since Hobby queues builds.
- Set Deployment Protection to **Standard Protection** with Vercel Authentication. Decide per Site whether previews stay gated.

## Root directory

- Each directory gets its own project: pick the folder under Root Directory when importing. [monorepos]
- Builds can read files outside the root directory by default. Turning the option off cuts access. [configure-a-build]
- A Root Directory change applies on the next deployment. [configure-a-build]
- Vercel finds the package manager from the lockfile at the repo root. [monorepos]
- Next.js needs no `transpilePackages` for workspace packages: Turbopack transpiles them automatically in both routers, and webpack does for the App Router. [transpilePackages]

## Skipping builds

Vercel treats a project as changed when any of these is true: [monorepos]

1. Its source changed.
2. One of its internal dependencies changed.
3. A lockfile change affects only that project's dependencies.

Requirements, all met by the planned setup: [monorepos]

- The repo is on GitHub.
- Packages are listed in `pnpm-workspace.yaml`.
- Every package has a unique `name`.
- Each package declares its internal dependencies in its own `package.json`. Use `workspace:*`, which pnpm resolves only to a local package. [pnpm-workspaces]

Why this beats an Ignored Build Step:

| | Skip unaffected projects | Ignored Build Step |
| --- | --- | --- |
| Uses a concurrent build slot | No [monorepos] | Yes [project-settings] |
| Counts toward deployment limits | No, since 2026-10-21 [skip-limits] | Yes [project-settings] |
| Knows the dependency graph | Yes, via Turborepo's package graph [skip-2024] | Only if you script it, for example with `pnpm --filter "...[<since>]"` [pnpm-filtering] |

Three things to plan for:

- **Turn it on for the reused project.** The skip setting defaults on only for new projects. Enable it by hand on the Main Site project under Build and Deployment, Root Directory. [skip-default]
- **Root-level changes rebuild everything.** Files outside the workspace definition count as global changes and deploy all Sites. [monorepos] Today the root holds `migrations/`, `scripts/`, `docs/`, `drizzle.config.ts`. Move migrations and the Drizzle config into a Shared Package so a migration is not a global change.
- **Shared Package edits rebuild every dependent Site.** That is correct behaviour, but it means the independence goal holds for changes inside a Site folder, not for changes to Shared Packages.

No Turborepo or Nx is needed for this. The feature uses Turborepo's graph internally, but the requirements list only workspaces. [monorepos]

## pnpm version

- Vercel lists pnpm 6 to 12 as supported, but its version table maps `lockfileVersion: 9.0` only to pnpm 9 or 10. [package-managers]
- Selecting by `packageManager` needs Corepack, enabled per project with `ENABLE_EXPERIMENTAL_COREPACK=1`, and Vercel labels Corepack experimental. [configure-a-build]
- Recommendation: use pnpm 10, which works without Corepack. Set `packageManager` for local pinning, and confirm the version in the first build log, as Vercel's docs suggest. [package-managers]
- Delete `package-lock.json` in the migration, since detection is by lockfile.
- Optional: a filtered install speeds builds, for example `pnpm install --filter <site-name>...`. [monorepos]

## Env vars

Use project-level variables. Three projects is few enough to manage by hand, and the security goal needs the projects to differ.

Shared Environment Variables suit identical values across projects, and a project-level value overrides a shared one. [shared-env] They do not fit here, for three reasons:

- Almost nothing is shared. The sensitive values should differ by Site.
- Vercel's 2022 announcement offered them only to Pro and Enterprise teams. [shared-env-2022] Today's docs state no plan limit, so Hobby access is unverified.
- They do not support branch-specific values. [shared-env]

Proposed allocation, based on what the code reads today:

| Variable | Main | Blog | Admin | Note |
| --- | --- | --- | --- | --- |
| `DATABASE_URL` | Read-only role | Read-only role | Read/write role | Separate roles are the point of the split |
| `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` | No | No | Yes | Auth lives only on the Admin Site |
| `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | No | No | Yes | Upload and media actions are admin work |
| `CLOUDINARY_CLOUD_NAME` | If building image URLs | If building image URLs | Yes | Not secret |
| `IMAGE_FOLDER` | No | No | Yes | Used by media listing |
| `ENCRYPTION_KEY` | No | No | No | Validated in `env.ts` but read nowhere, so it can likely go |

Code that must change for this to work:

- `src/utils/env.ts` validates every variable at startup with `parse`. Moved as-is into a Shared Package, it would force admin secrets onto public Sites. Each Site needs its own schema.
- `src/app/(home)/layout.tsx` imports `toOgImageUrl` from `src/lib/cloudinary.ts`, a module that configures the Cloudinary secret when loaded. Split the pure URL helper from the signed client.

Other facts:

- Env changes apply only to new deployments, so a skipped Site keeps its old values until it is redeployed. [env-vars]
- `NEXT_PUBLIC_` values are inlined at build time. [env-vars]
- Limits are 1000 variables per environment per project and 64 KB per deployment. [limits]
- `vercel env pull` writes `.env.local` for one linked project, and `vercel link --repo` links several at once. [environments] [monorepos]

## Preview deployments

- Each project gets its own previews on non-production branches and PRs, with a branch URL shaped like `<project>-git-<branch>-<scope>.vercel.app`. [environments] [generated-urls]
- Each Site's Preview environment needs its own values.

Three hazards:

1. **An unaffected Site has no preview of that branch.** This is an inference: skipping means no deployment, and the docs do not describe what happens to the branch URL. So cross-Site links in a preview cannot assume the other Site has one. Set `NEXT_PUBLIC_MAIN_URL`, `NEXT_PUBLIC_BLOG_URL` and `NEXT_PUBLIC_ADMIN_URL` to production hosts for Production and Preview. A preview then tests one Site and links out to live ones.
2. **Admin Site previews and the database.** If Preview's `DATABASE_URL` points at production, a preview can write production data. Scope a separate database or role to Preview.
3. **Better Auth on previews.** Preview hosts change per branch. Better Auth's `baseURL` accepts an object with `allowedHosts`, including `*.vercel.app`, and those hosts are added to `trustedOrigins`. [better-auth] A narrower pattern for this project's hosts is safer than the bare wildcard. Separately, `better-auth.ts` passes `url:`, which the options reference does not document; `BETTER_AUTH_URL` is what takes effect today, as a documented fallback. [better-auth]

Related Projects is the built-in alternative for cross-Site hosts. It exposes hosts via `VERCEL_RELATED_PROJECTS` and allows up to 3 linked projects. [monorepos] `withRelatedProject` returns `preview.branch` on previews and falls back to `defaultHost` when the value is empty. [related-projects-src] It is not needed now. Whether `preview.branch` is populated for a skipped project is unverified.

Custom Environments such as `staging` are Pro and Enterprise only. Hobby can use a long-lived preview branch with its own domain and branch-specific variables. [environments]

## Plan limits

The Vercel plan on this account could not be checked from here. The repo is public and owned by a user, so Hobby's ban on connecting repos owned by Git organizations does not apply. [limits]

| Limit | Hobby | Pro | Effect on three Sites |
| --- | --- | --- | --- |
| Projects | 200 | Unlimited | Fine [limits] |
| Projects per Git repo | 25 | 150 | Fine [limits] |
| Deployments per day | 100 | 6000 | At most 3 per push, fewer with skipping [limits] |
| Concurrent builds | 1 | Up to 500 | **A Shared Package change builds three Sites in sequence** [managing-builds] |
| Build time per deployment | 45 min | 45 min | Fine [limits] |
| Build machine | 2 vCPU, 8 GB | Elastic | Fine, no evidence of a problem yet [managing-builds] |
| Domains per project | 50 | Unlimited | Fine [limits] |
| Custom Environments | None | 1 per project | Use a preview branch if needed [environments] |
| Password Protection | Not available | $20/month per project | Use Vercel Authentication [deployment-protection] |

Usage allotments on Hobby are per account, so three projects draw on one pool: for example 100 GB Fast Data Transfer, 4 CPU-hours Active CPU, 1M Function Invocations, 5K image transformations. [hobby] Exceeding one can mean waiting up to 30 days. [hobby]

Hobby is non-commercial personal use only. A portfolio is normally fine, but "advertising the sale of a product or service" counts as commercial. If the Sites solicit paid work, check with Vercel Support. [fair-use]

## Cutover order

1. On the existing project, change Root Directory to `apps/main` just before merging the restructure, so the merge build finds the new path. Enable skipping at the same time.
2. Merge. `/blog` and `/dashboard` leave the Main Site at this point, so do steps 3 and 4 straight away.
3. Import the Blog and Admin projects, setting Root Directory and env vars during import. A new project's first deployment is always Production and uses Production variables. [environments]
4. Add the subdomains and DNS records, then confirm the 301s from old URLs reach live pages.
5. Remove admin secrets from the Main Site project and redeploy it.

## Could not verify

- Whether Shared Environment Variables are available on Hobby today. The only plan statement found is from 2022.
- Which Vercel plan this account is on.
- What happens to a branch URL, and to `preview.branch`, for a skipped project.
- How skip detection treats a push containing several commits, or a first push of a new branch.
- Whether pnpm 11 or 12 are selected without Corepack, and whether lockfile-aware skipping works with them. Turborepo lists pnpm 8+ as stable but says support may lag new majors. [turborepo-support]

## Sources

- [monorepos]: https://vercel.com/docs/monorepos (updated 2026-08-11)
- [configure-a-build]: https://vercel.com/docs/builds/configure-a-build (2026-08-28)
- [project-settings]: https://vercel.com/docs/project-configuration/project-settings (2026-09-21)
- [limits]: https://vercel.com/docs/limits (2026-09-16)
- [hobby]: https://vercel.com/docs/plans/hobby (2026-09-14)
- [fair-use]: https://vercel.com/docs/limits/fair-use-guidelines (2026-09-14)
- [managing-builds]: https://vercel.com/docs/builds/managing-builds (2026-09-17)
- [env-vars]: https://vercel.com/docs/environment-variables (2026-09-17)
- [shared-env]: https://vercel.com/docs/environment-variables/shared-environment-variables (2026-08-28)
- [shared-env-2022]: https://vercel.com/changelog/share-environment-variables-across-your-team-and-projects (2022-11-07)
- [environments]: https://vercel.com/docs/deployments/environments (2026-09-17)
- [generated-urls]: https://vercel.com/docs/deployments/generated-urls (2026-09-08)
- [deployment-protection]: https://vercel.com/docs/deployment-protection (2026-09-15)
- [package-managers]: https://vercel.com/docs/package-managers (2026-08-11)
- [skip-2024]: https://vercel.com/changelog/automatically-skip-unnecessary-deployments-in-monorepos (2024-07-22)
- [skip-default]: https://vercel.com/changelog/new-monorepo-projects-now-skip-builds-with-unchanged-code-by-default (2025-02-24)
- [skip-limits]: https://vercel.com/changelog/skipped-monorepo-deployments-no-longer-count-against-limits (2026-10-21)
- [related-projects-src]: https://github.com/vercel/vercel/blob/main/packages/related-projects/src/with-related-project.ts
- [turborepo-support]: https://turborepo.dev/docs/support-policy
- [pnpm-workspaces]: https://pnpm.io/workspaces
- [pnpm-filtering]: https://pnpm.io/filtering
- [transpilePackages]: https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages
- [better-auth]: https://www.better-auth.com/docs/reference/options

Domain setup (A record for the apex, per-project CNAME for subdomains): https://vercel.com/docs/domains/working-with-domains/add-a-domain
Git Fork Protection: https://vercel.com/docs/project-configuration/security-settings
