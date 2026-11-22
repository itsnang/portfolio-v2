import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.union([
    z.literal("development"),
    z.literal("production"),
    z.literal("test"),
    z.literal("stage"),
  ]),
  DATABASE_URL: z.string(),
  // Shared with the Admin Site. Unset means the refresh endpoint rejects every call.
  REVALIDATE_SECRET: z.string().min(32).optional(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
