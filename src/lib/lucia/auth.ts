import { Lucia } from "lucia";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { db } from "@/db/drizzle";
import { TbSession } from "@/db/table/token.table";
import { TbUser } from "@/db/table/user.table";
import { env } from "../env";

import { User } from "@/db/schema/user.schma";
import { getUserByEmail } from "@/db/repositories/user.repository";
import { LoginError } from "./errors";
import { verifyPassword } from "./session";

export const adapter = new DrizzlePostgreSQLAdapter(db, TbSession, TbUser);
export const SESSION_COOKIE_NAME = "auth" as const;

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: SESSION_COOKIE_NAME,
    attributes: {
      path: "/",
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
    },
  } as const,

  getUserAttributes: (attributes) => {
    return {
      id: attributes.id,
      email: attributes.email,
      role: attributes.role,
      deletedAt: attributes.deletedAt ?? null,
      password: attributes.password ?? null,
      salt: attributes.salt ?? null,
      createdAt: attributes.createdAt,
      updatedAt: attributes.updatedAt,
    };
  },
});

export async function signInUseCase(email: string, password: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    throw new LoginError();
  }

  const isPasswordCorrect = await verifyPassword(email, password);

  if (!isPasswordCorrect) {
    throw new LoginError();
  }

  return { id: user.id };
}

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: User;
  }
}
