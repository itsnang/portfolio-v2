import { createRevalidateRoute, type PagesFor } from "@portfolio/db/revalidate-route";
import { env } from "@/utils/env";

// The Main Site's pages for each resource the Admin Site can change.
const pagesFor: PagesFor = {
  // Only the home page's "From the Blog" teaser; Posts live on the Blog Site.
  post: () => [{ path: "/" }],
  project: (ids) => [{ path: "/" }, ...ids.map((id) => ({ path: `/projects/${id}` }))],
  // Theme and maintenance mode affect every page.
  "app-config": () => [{ path: "/", type: "layout" }],
  socials: () => [{ path: "/" }, { path: "/achievement" }],
  profile: () => [{ path: "/" }],
};

export const POST = createRevalidateRoute({ secret: env.REVALIDATE_SECRET, pagesFor });
