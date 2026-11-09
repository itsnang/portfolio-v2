# What happens to installed PWA service workers when /blog and /dashboard move

Research for issue #137, part of the Site split in map #134. Checked 2026-11-09 against `@ducanh2912/next-pwa` 10.2.9, `workbox-strategies` 7.1.0 and Next 16.3.0.

## Answer

- **Production has no service worker today.** `next build` on Next 16 uses Turbopack, which ignores the plugin's `webpack` hook, so no `sw.js` is generated and nothing registers one.
- **Older visitors may still have one.** Anyone who visited during the webpack era (July 2025 to about June 2026) can still have an active worker on `lornsamnang.com`. The 404 on `/sw.js` does not remove it.
- **It will not shadow the 301s for online visitors.** Pages are served NetworkFirst with no timeout, and App Router HTML is not precached. The remaining stale cases need the visitor to be offline, or an old tab to still be open, and are capped at 24 hours.
- **The worker cannot follow the move.** Registrations are per origin, so it has no effect on `blog.` or `admin.lornsamnang.com`.
- **Recommendation:** remove `withPWA`, and ship a committed self-unregistering no-op at `/sw.js` on the Main Site. Make the Blog Site and Admin Site not PWAs: no service worker and no manifest.

## Evidence

### Is a service worker generated today? No.

| Finding | Source |
| --- | --- |
| The plugin works only by adding a `webpack(config, options)` function to the Next config. That function is where the `GenerateSW` plugin and the registration entry are added. | `node_modules/@ducanh2912/next-pwa/dist/index.js` (default export) |
| Next 16's `next build` uses Turbopack by default and ignores `webpack` config. | `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` |
| Next normally fails the build when a plugin adds `webpack` config. The guard only fires if there is no `turbopack` config: `TURBOPACK === 'auto' && hasWebpackConfig && !hasTurboConfig`. | `node_modules/next/dist/lib/turbopack-warning.js:157` |
| This repo has a `turbopack` key for the SVG loader, so the guard stays quiet and the PWA plugin is silently dropped. | `next.config.ts`; `package.json` has `"build": "next build"` with no `--webpack` |
| `https://lornsamnang.com/sw.js` and `/workbox-1.js` return 404. `/manifest.json` returns 200. | `curl`, 2026-11-09 |
| None of the 18 JS chunks referenced by the home page contain `serviceWorker`, `workbox`, `__PWA_` or `/sw.js`. | `curl` and `grep`, 2026-11-09 |

`disable: NODE_ENV === "development"` only affects `next dev` and is not the cause.

**Timeline.** PWA support landed in `24c6c42` (2025-07-02) on Next 15, where `next build` used webpack. The Next 16 bump was `8b4cb7b` (2026-05-31). So workers could have been installed for roughly 11 months, and not since.

### Why the old workers do not go away by themselves

- Browsers re-check the worker script on navigations (`shouldSoftUpdate` in Handle Fetch). A 404 HTML response fails the Update job's JavaScript MIME check, or the fetch fails outright.
- On failure, the registration is removed **only if `newestWorker` is null**, meaning it never had a worker. An installed worker stays active. ([Service Worker spec](https://w3c.github.io/ServiceWorker/), Update and Handle Fetch.)
- So the current 404 leaves old workers running.
- Safari is a partial exception: after 7 days of Safari use without interaction with the site, it deletes script-writable storage, including service worker registrations and caches. Home screen apps have their own day count, driven by use of the app. ([WebKit](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/))

### What the old worker does with moved URLs

Configuration is the plugin defaults: `skipWaiting`, `clientsClaim`, `cleanupOutdatedCaches` all on (`dist/index.js`, `resolveWorkboxPlugin`). Workbox's default runtime rules apply, as follows.

| Request | Rule | Effect after the move |
| --- | --- | --- |
| Navigation to `/blog`, `/blog/x`, `/dashboard` | `pages`, NetworkFirst, **no timeout**, 32 entries, 24 hours | Online: the network answers, so the 301 reaches the browser. Offline: a cached page up to 24 hours old, otherwise a network error. |
| RSC fetch (`RSC: 1` header) | `pages-rsc` / `pages-rsc-prefetch`, NetworkFirst, 24 hours | See "Remaining stale cases". |
| Same-origin `GET /api/*`, except `/api/auth/callback*` | `apis`, NetworkFirst, 10-second timeout, 24 hours | Could return cached API data on a slow connection. Only matters on the admin's own browser. |
| `/_next/static/*.js` | CacheFirst, 24 hours | Unaffected. |
| Precached URLs | Cache-first, no network ([Workbox](https://developer.chrome.com/docs/workbox/modules/workbox-precaching)) | Webpack static assets and `public/` files only. `server/` output is excluded, so App Router HTML for `/blog` and `/dashboard` should not be in the manifest. |

**Why NetworkFirst does not block a redirect.** Navigations use redirect mode `manual` ([HTML](https://html.spec.whatwg.org/multipage/browsing-the-web.html)), and the redirect goes back to the navigation ([Fetch](https://fetch.spec.whatwg.org/), HTTP fetch). `NetworkFirst` only falls back to cache when the network fails (`workbox-strategies/NetworkFirst.js`, `_getNetworkPromise`). `cacheOkAndOpaquePlugin` will store status-0 responses, so a redirect may land in `pages`. It would just replay the redirect, which is harmless.

**The new origins are out of reach.** Scope matching is by storage key and URL prefix (Match Service Worker Registration), so after the 301 the `blog.` hop has no matching registration.

### Remaining stale cases

Both are bounded by the 24-hour expiry, which `ExpirationPlugin` checks against the cached response's `Date` header.

1. **Offline:** a visitor offline sees the cached old page instead of the redirect. Acceptable.
2. **Old tab:** a tab or installed window still running old JS clicks a `next/link` to `/blog`. That is a CORS fetch across a cross-origin 301, which will likely fail, so the worker may return a cached RSC payload. New builds with absolute links avoid this. This is reasoned from the source and untested.

There is also a privacy leftover, not a redirect problem: the `pages`, `pages-rsc` and `apis` rules applied to `/dashboard` and `/api/auth/*` GETs, so admin data may sit in Cache Storage on the admin's own devices. The no-op below deletes it.

## Recommendation

### Retire the worker on the Main Site

Commit this as `public/sw.js`, same URL and scope as the old one:

```js
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(names.map((name) => caches.delete(name)));
      await self.registration.unregister();
    })(),
  );
});
```

Constraints:

- **No `fetch` listener**, and **the URL must not change**. Otherwise the old worker keeps running alongside it. ([Chrome Workbox guidance](https://developer.chrome.com/docs/workbox/remove-buggy-service-workers))
- **It must be served directly** with a JavaScript MIME type. Redirects are not allowed for this fetch (redirect mode `error` in Update).
- **Remove `/public/sw.js` from `.gitignore`**, or the file will not be committed. `/public/workbox-*.js` can go too.
- **Remove `withPWA` and the dependency in the same change.** If anyone ever builds with `--webpack`, the plugin deletes and regenerates `public/sw.js`, which would bring the old worker back.
- **Deploy it before, or with, the 301s.** It does not depend on the split, so it can ship first.
- **Keep it for at least 12 months.** It is a few hundred bytes, so keeping it indefinitely is reasonable. Once removed, any worker that has not yet updated is stranded again.
- **Safe to delete every cache:** the app uses no Cache Storage of its own (no `caches.` or `navigator.serviceWorker` in `src/`).

`Clear-Site-Data: "storage"` is not the primary tool. It also wipes `localStorage` and IndexedDB, and the Chrome guidance says it cannot be relied on alone because support is incomplete.

### Blog Site and Admin Site: not PWAs

- **Plugin:** it does nothing under Turbopack, and its own README recommends migrating to `@serwist/next`.
- **Admin Site:** its default rules would cache authenticated pages and API responses in Cache Storage, which works against the map's security goal. Offline editing has no value here.
- **Blog Site:** 2 Posts do not justify a worker that can serve stale content.
- **No manifest on either.** `src/lib/metadata.ts` currently sets `manifest` and `appleWebApp`, so the split must not carry them into a shared layout for those Sites.

### Main Site: drop the worker, optionally keep the manifest

Offline support has already been absent since about June 2026. The manifest can stay at low cost, since [web.dev's install criteria](https://web.dev/articles/install-criteria) do not list a service worker. Keep `scope: "/"` and `start_url: "/"`.

For installed apps, a cross-Site link stays in the app-like window but shows browser UI such as the URL bar ([MDN](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Manifest/Reference/scope)).

## Not verified

- **Whether a worker was ever live in production.** The Wayback Machine has no capture of `/sw.js`, and Vercel's build history was not available. The webpack-era generation is inferred from Next 15's default and the plugin source.
- **How many browsers still hold a worker.** There is no telemetry.
- **No browser test was run.** The 404-keeps-worker behaviour, the 301 passthrough and the no-op cleanup are read from specs and source. `unregister()` inside `activate` should get a real check in Chrome and Safari at build time.
- **The generated precache manifest was not inspected.** No webpack build was run, so "HTML is not precached" comes from the plugin's config and Workbox's asset handling.
- **The exact `Response` type** script sees for `fetch()` of a navigate-mode request. The conclusion holds for either a raw or opaque redirect.
- **Per-browser `Clear-Site-Data` support.** The MDN page's compatibility table was not readable in the fetched text.
- **Only the home page's chunks** were scanned for registration code. Registration in the plugin goes through a shared entry, so a per-route difference is unlikely.
