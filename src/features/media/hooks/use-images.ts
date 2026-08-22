"use client";

import { useQuery } from "@tanstack/react-query";
import { getImages } from "@/features/media/actions";

/**
 * Cloudinary's image library rarely changes between dashboard navigations, but
 * every dashboard page (skills/education/experience/socials/recommendations/
 * project/blog/profile) needs the same image picker data. Previously each
 * page's Server Component called getImages() itself, so switching between
 * dashboard tabs re-hit the Cloudinary API on every single navigation.
 *
 * Routing the fetch through TanStack Query instead means the first dashboard
 * page you land on pays the cost once; every other page reuses the cached
 * result for `staleTime`, since the QueryClient (mounted in the root layout's
 * ReactQueryProvider) persists across client-side navigations.
 */
export function useImages(folderPath?: string) {
  // getImages()/getCloudinaryImages() treat "" the same as undefined (both fall
  // back to the default IMAGE_FOLDER expression) — || instead of ?? here keeps
  // that same folder mapped to one cache entry instead of two.
  const folderKey = folderPath || "all";
  return useQuery({
    queryKey: ["images", folderKey],
    queryFn: () => getImages(folderPath),
    staleTime: 5 * 60 * 1000,
  });
}
