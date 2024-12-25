import { z } from "zod";

export const envSchema = z.object({
  NODE_ENV: z.union([
    z.literal("development"),
    z.literal("production"),
    z.literal("test"),
    z.literal("stage"),
  ]),
  DATABASE_URL: z.string(),
  ENCRYPTION_KEY: z.string(),
  UPLOADTHING_TOKEN: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
