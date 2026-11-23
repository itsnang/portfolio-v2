"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { IImages } from "@/features/media/types";

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed (${response.status})`);
  return response.json() as Promise<T>;
}

const STALE_TIME = 5 * 60 * 1000;

/**
 * The image library for a folder ("" or undefined means the default folder).
 * Cached across dashboard pages, so switching pages doesn't re-hit Cloudinary.
 */
export function useImages(folder?: string) {
  const key = folder || "all";
  return useQuery({
    queryKey: ["images", key],
    queryFn: () =>
      getJson<IImages[]>(folder ? `/api/images?folder=${encodeURIComponent(folder)}` : "/api/images"),
    staleTime: STALE_TIME,
  });
}

export function useImageFolders() {
  return useQuery({
    queryKey: ["image-folders"],
    queryFn: () => getJson<{ name: string; path: string }[]>("/api/image-folders"),
    staleTime: STALE_TIME,
  });
}

/** Call after an upload or a new folder, so every picker shows it. */
export function useRefreshImageLibrary() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["images"] }),
      queryClient.invalidateQueries({ queryKey: ["image-folders"] }),
    ]);
}
