import { z } from "zod";

// What the Admin Site sends a public Site after a save. Each public Site maps
// the resource to its own pages.
export const revalidateResources = ["post", "project", "app-config", "socials", "profile"] as const;

export const revalidateMessageSchema = z.object({
  resource: z.enum(revalidateResources),
  // Post slugs or project ids. An edited slug sends both the old and new value.
  slugs: z.array(z.string().min(1)).default([]),
});

export type RevalidateResource = (typeof revalidateResources)[number];
export type RevalidateMessage = z.input<typeof revalidateMessageSchema>;
