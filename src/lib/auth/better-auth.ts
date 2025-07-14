import { TbAccount, TbSession, TbUser, TbVerificationToken } from "@/db/table";
import { env } from "@/utils/env";
import { db } from "@/db/drizzle";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: TbUser,
      account: TbAccount,
      verificationToken: TbVerificationToken,
      session: TbSession,
    },
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  url: env.BETTER_AUTH_URL,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "admin",
        input: false,
      },
    },
  },
});
