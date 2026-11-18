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
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
  IMAGE_FOLDER: z.string().optional(),
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  // Shared with the Admin Site. Unset means the refresh endpoint rejects every call.
  REVALIDATE_SECRET: z.string().min(32).optional(),
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
