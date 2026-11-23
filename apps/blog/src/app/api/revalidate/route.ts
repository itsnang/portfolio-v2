import { createRevalidateRoute, type PagesFor } from "@portfolio/db/revalidate-route";
import { env } from "@/utils/env";

// The Blog Site's pages for each resource the Admin Site can change. Resources
// that only appear on the Main Site refresh nothing here.
const pagesFor: PagesFor = {
  // An edited slug arrives as both the old and new values, so both pages refresh.
  post: (slugs) => [{ path: "/" }, { path: "/sitemap.xml" }, ...slugs.map((slug) => ({ path: `/${slug}` }))],
  // Theme and maintenance mode affect every page.
  "app-config": () => [{ path: "/", type: "layout" }],
  project: () => [],
  socials: () => [],
  profile: () => [],
};

export const POST = createRevalidateRoute({ secret: env.REVALIDATE_SECRET, pagesFor });
