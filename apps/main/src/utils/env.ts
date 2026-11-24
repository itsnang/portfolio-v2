import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  // Shared with the Admin Site. Unset means the refresh endpoint rejects every call.
  REVALIDATE_SECRET: z.string().min(32).optional(),
  NEXT_PUBLIC_MAIN_URL: z.string().url(),
  NEXT_PUBLIC_BLOG_URL: z.string().url(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
