import "server-only";

import type { RevalidateMessage } from "@portfolio/db/schema";

import { env } from "@/utils/env";

const TIMEOUT_MS = 3000;

const REFRESH_WARNING =
  "Saved, but public pages couldn't be refreshed. They'll update on their own within an hour.";

/**
 * Tells each public Site what changed so it refreshes its own pages. A save
 * always stands: failures come back as a warning, with no retries, and the
 * public pages' timers catch up.
 */
export async function refreshPublicSites(
  message: RevalidateMessage
): Promise<string | undefined> {
  const sites = [env.MAIN_SITE_URL, env.BLOG_SITE_URL];

  const results = await Promise.allSettled(
    sites.map(async (site) => {
      const response = await fetch(new URL("/api/revalidate", site), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.REVALIDATE_SECRET}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
        signal: AbortSignal.timeout(TIMEOUT_MS),
        cache: "no-store",
      });
      if (!response.ok) throw new Error(`${site} responded ${response.status}`);
    })
  );

  const failures = results.filter(
    (result): result is PromiseRejectedResult => result.status === "rejected"
  );
  if (failures.length === 0) return undefined;

  for (const failure of failures) {
    console.warn("Public page refresh failed:", failure.reason);
  }
  return REFRESH_WARNING;
}
