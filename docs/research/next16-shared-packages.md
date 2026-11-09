# How Next 16.3 with Turbopack consumes Shared Packages

Research for [#136](https://github.com/itsnang/portfolio-v2/issues/136), part of map [#134](https://github.com/itsnang/portfolio-v2/issues/134). Checked 2026-11-09 against the installed docs for Next 16.3.0 (`node_modules/next/dist/docs/`, cited below as `docs/...`), the Next and Tailwind 4.1.17 source in `node_modules`, and official Tailwind, pnpm, next-pwa and Serwist docs.

Package names (`@portfolio/ui`, `apps/main`) are illustrative. The map has not settled them.

Claims marked **Tested** come from a throwaway fixture built outside this repo: a workspace with `apps/main` and `packages/ui` (symlinked into `node_modules`), using this repo's exact installed dependencies, built with `next build`. See [What was not verified](#what-was-not-verified) for the fixture's limits.

## Answer

Turbopack consumes workspace packages with almost no configuration. A package can export raw `.ts`/`.tsx` with no build step and no `transpilePackages` entry. `'use server'` and `'use client'` files, `next/font`, and `.scss` all work from inside a package.

Four things do need action:

1. **Security: `'use server'` files expose every export.** If a Server Component in a public Site imports one export from a `'use server'` file, every other export in that file becomes a callable endpoint on that Site.
2. **Tailwind does not scan packages by default.** It needs an explicit `@source`.
3. **`@/` inside a package silently resolves against the consuming app's `tsconfig`.** 198 files here use `@/`.
4. **Removing the `turbopack` key while keeping `withPWA` breaks the build.** Each Site's `next.config.ts` must account for this.

## Recommendation

- Export TypeScript source from Shared Packages. Skip `transpilePackages` and a package build step.
- **Keep write Server Actions in the Admin Site, not a Shared Package.** Put public reads in plain modules marked `import 'server-only'`, with no `'use server'` directive.
- Replace `@/` with relative imports or package imports for anything that moves into a package.
- Put the Tailwind entry, tokens and `@source` in one shared stylesheet. Split `globals.css` as described [below](#globalscss).
- Drop the `*.svg` rule. It is dead config today.
- Do not carry `withPWA` forward as is. It is inert under Turbopack. The PWA decision belongs to its own ticket.

## Findings by topic

### `transpilePackages`: not needed

- `docs/01-app/03-api-reference/05-config/01-next-config-js/transpilePackages.md`: "Turbopack transpiles workspace packages (npm, pnpm, or Yarn workspaces) in your monorepo automatically under both routers." The option is only needed for a `node_modules` dependency that ships raw TS/JSX, and for two webpack/Pages Router cases.
- **Tested:** a package exporting `.tsx` and `.ts` through `package.json` `exports`, with no `transpilePackages`, builds and renders.
- `transpilePackages` still exists, so it has no replacement. A package also cannot appear in both it and `serverExternalPackages`, or Next throws at build start (same doc).

### Workspace root

- Turbopack does not resolve files outside its root (`docs/.../next-config-js/turbopack.md`, "Root directory").
- The docs list only lockfiles for root detection. The source goes further: `next/dist/lib/find-root.js` also treats `pnpm-workspace.yaml` as a marker, and a marker takes precedence over lockfiles. So `turbopack.root` need not be set under pnpm workspaces.
- **Tested:** no `turbopack.root`, with `pnpm-workspace.yaml` at the workspace root. The package resolved.
- Keep exactly one lockfile at the repo root. The repo's `package-lock.json` goes away with the pnpm move.

### `'use server'` in a package: works, but mind what it exposes

No special config is needed. Actions are compiled into each consuming Site's own build. `filename` in the manifest points at the package file. **Tested.**

Exposure is what matters for the map's security goal. `docs/01-app/02-guides/data-security.md` says unused actions are removed and create no public endpoint. The fixture shows that this depends on where the import happens:

| Import of a `'use server'` file | What ended up in `server-reference-manifest.json` |
| --- | --- |
| From a Client Component, one named export | Only that export |
| From a Server Component, direct named import of one export | **Every export in the file** |
| From a Server Component, through a barrel (`export *` or named re-export) | **Every export in the file** |

**Tested end to end:** with `adminDelete` never imported anywhere, a `POST /` with its `Next-Action` ID against `next start` returned HTTP 200 and the function's return value.

This repo has that exact shape. `src/features/blog/actions/blog.ts` exports `deleteBlogPostAction` beside `getPublishedBlogPosts`, and `src/features/*/actions/index.ts` are barrels. `withAuthAction` would still reject unauthenticated callers, but the write code and endpoint would sit on a public Site, which the map's security goal rules out.

Implications:

- A read called only from Server Components does not need `'use server'`. Use a plain function with `import 'server-only'`.
- `docs/01-app/02-guides/data-security.md` still advises treating every action as reachable by direct POST and checking auth inside each one.
- Admin Site writes and Main or Blog reads should not share a `'use server'` file, whichever package it lives in.
- `serverActions.bodySizeLimit` (8mb today) is per-app config. Only the Site that hosts `uploadStagedFile` needs it.

### `@/` path alias: the trap when moving code

Turbopack reads `tsconfig` `paths` (`docs/01-app/03-api-reference/08-turbopack.md`), but the docs do not say which `tsconfig` applies to a package.

**Tested:** a package file importing `@/local`, where both `apps/main/src/local.ts` and `packages/ui/src/local.ts` exist, resolved to the **app's** file. Adding a `tsconfig.json` with `paths` to the package did not change that.

So an un-rewritten `@/` import can bind to a same-named file in the app with no build error. Rewrite those imports when code moves.

### Tailwind v4 scanning across packages

- Automatic detection scans from a base path and skips `.gitignore`d files and `node_modules` (Tailwind docs, [Detecting classes in source files](https://tailwindcss.com/docs/detecting-classes-in-source-files)). In `@tailwindcss/postcss` the base is `opts.base ?? process.cwd()` (source: `dist/index.js`), so it is the app's directory when building with `apps/<site>` as the working directory.
- **Tested:** a class used only in `packages/ui` was absent from the CSS with no `@source`.
- Two fixes both **Tested** and working:
  - In the shared stylesheet: `@source "./";` (paths are relative to the stylesheet, so this works wherever the package is consumed).
  - In the app stylesheet: `@source "../../../packages/ui/src";`.
- Recommend the first. It is a single line, and the app's own files are still scanned automatically (**Tested**).
- `@import "tailwindcss"` inside a package stylesheet works when pulled in by `@import` from the app, or by direct JS import. The app's `postcss.config.mjs` applied in both cases. **Tested.** By default Turbopack checks the project root's PostCSS config first (`turbopackLocalPostcssConfig.md`, new in 16.3). No package-level `postcss.config` is needed.

Each Site still needs its own `postcss.config.mjs`.

### `*.svg` Turbopack rule: dead today, and per app if ever needed

- `next.config.ts` maps `*.svg` to `@svgr/webpack`, but no `src/` file imports an `.svg` and `@svgr/webpack` is neither in `package.json` nor in `package-lock.json`. Drop it.
- If SVG components come back: rules live in each app's `next.config.ts`, and a rule in the app applies to `.svg` files inside a Shared Package. **Tested** with an equivalent local loader. Each consuming Site needs the rule.
- Rule globs match by file name unless they contain `/`, and the built-in `foreign` condition matches `node_modules` code (`turbopack.md`). Do not add `{ not: 'foreign' }` without testing it against a workspace package.

### `next/font`

- Today: three `next/font/google` calls in `src/app/layout.tsx`, exposed as CSS variables.
- Both `next/font/google` and `next/font/local` called from a package file **Tested** and working. Font files are emitted into the consuming app's `static/media`.
- Local `src` paths resolve relative to the calling file (`docs/.../components/font.md`).
- Each font call is one hosted instance, so load once and import the object (`font.md`, "Using a font definitions file").
- Recommend a font definitions module in a Shared Package, with each root layout applying `.variable`. Each root layout stays per-Site.

### `globals.css`

The 1233 lines are not one thing:

| Lines | Content | Used by |
| --- | --- | --- |
| 1-250 | Tailwind entry, `@theme` tokens, base and utility layers, imports of the two `.scss` files | All three Sites |
| 252-1233 | `.sketch-page` wireframe system, including the blog body (638-753) and blog nav (754 on) | Main and Blog Sites only (`src/components/wireframe/`, project and blog detail) |

Recommendation: two stylesheets in a Shared Package. A base stylesheet holds lines 1-250. A wireframe stylesheet holds the rest, and is imported only by Main and Blog. The Admin Site then ships no wireframe CSS. Admin Site changes also stop being able to affect public styles, which suits the first goal.

Notes:

- `globals.css` `@import`s `_variables.scss` and `_keyframe-animations.scss`. Those imports work from inside a package (**Tested**). A `grep` found no Sass-only syntax in those two files.
- `.scss` imported from JS in a package, with real Sass syntax, compiled correctly (**Tested**). This is the tiptap component pattern. Sites that consume those components need `sass` installed.
- Turbopack orders CSS by JS import order (`08-turbopack.md`, "CSS Module Ordering"). Import the base stylesheet first in each root layout.

### `@ducanh2912/next-pwa`: inert under Turbopack

- Turbopack does not support webpack plugins (`08-turbopack.md`, "Webpack plugins"). `next build` uses Turbopack by default since 16 (`docs/01-app/02-guides/upgrading/version-16.md`).
- **Tested** with this repo's config shape:
  - `withPWA` plus a `turbopack` key, plain `next build`: succeeds and emits **no** `sw.js`. The wrapper does nothing.
  - `withPWA` plus `next build --webpack`: emits `sw.js` and a workbox file.
  - `withPWA` with **no** `turbopack` key, plain `next build`: **fails** with "This build is using Turbopack, with a `webpack` config and no `turbopack` config."
- The trap: deleting the dead `*.svg` rule and leaving `turbopack` absent, while keeping `withPWA`, breaks the build. Remove `withPWA` or keep `turbopack: {}`.
- Implication: the repo's plain `next build` likely ships no service worker now. `public/sw.js` is gitignored and nothing in `src/` registers one. Not checked against the live site.
- The package's own docs and README recommend `@serwist/next` instead. Serwist documents a Turbopack path through `@serwist/turbopack`. Next's PWA guide also names Serwist (`docs/01-app/02-guides/progressive-web-apps.md`).

## pnpm requirements for Shared Packages

From the [pnpm docs](https://pnpm.io/settings/node-modules): the default `nodeLinker` is `isolated`, so each project sees only what it declares, and `workspace:*` links local packages (pnpm [Workspaces](https://pnpm.io/workspaces)).

Each Shared Package must declare what it imports, for example `react` and `next` as peer dependencies and `tailwindcss` for a stylesheet that imports it. Code that relied on root hoisting today will fail to resolve.

## What was not verified

- **pnpm's isolated layout.** pnpm is not installed here and the fixture used a hoisted `node_modules` with a symlinked package. Turbopack's handling of the `.pnpm` store was not exercised, nor was peer resolution.
- **`next dev`.** All tests used `next build` and `next start`. HMR across packages was not tested.
- **Vercel.** Nothing was deployed. Behaviour with Root Directory set to `apps/<site>` is inferred (see [#135](https://github.com/itsnang/portfolio-v2/issues/135) for that side).
- **Real repo code.** The fixture copied this repo's dependencies and config shape, not its source. No real component was moved.
- **Why Server Component imports register every export.** Observed in Next 16.3.0's output, and at odds with the plain reading of `data-security.md`. It could change between Next versions, so the recommendation does not depend on it staying this way.
- **Tailwind docs gaps.** They do not state how `@source` paths behave outside the base path. The fixture shows `../../../` paths work.
- **Maintenance status of `@ducanh2912/next-pwa`.** No archive notice on the repo, and the last-activity date was not available.
