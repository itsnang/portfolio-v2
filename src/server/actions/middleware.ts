import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth/better-auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import * as schema from "@/db/table";
import { PostgresJsDatabase } from "drizzle-orm/postgres-js";

export function withAuthAction<
  ParamsType extends unknown[] = unknown[],
  ReturnType = unknown,
>(
  callback: (
    auth: {
      profile?: typeof schema.TbProfile.$inferSelect;
      session: typeof schema.TbSession.$inferSelect;
      user: typeof schema.TbUser.$inferSelect;
      db: PostgresJsDatabase<typeof schema>;
    },
    ...args: ParamsType
  ) => Promise<ReturnType>
) {
  return withOptionalAuthAction(
    async (auth, ...args: ParamsType): Promise<ReturnType> => {
      if (!auth.session || !auth.user) {
        throw new Error("Unauthorized");
      }

      return await callback(
        {
          ...auth,
          session: auth.session,
          user: auth.user,
        },
        ...args
      );
    }
  );
}

export function withOptionalAuthAction<
  ParamsType extends unknown[] = unknown[],
  ReturnType = unknown,
>(
  callback: (
    auth: {
      profile?: typeof schema.TbProfile.$inferSelect;
      session?: typeof schema.TbSession.$inferSelect;
      user?: typeof schema.TbUser.$inferSelect;
      db: PostgresJsDatabase<typeof schema>;
    },
    ...args: ParamsType
  ) => Promise<ReturnType>
) {
  return async function (...args: ParamsType): Promise<ReturnType> {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const profile = session
      ? await db.query.TbProfile.findFirst({
          where: eq(schema.TbProfile.userId, session.user.id),
        })
      : undefined;

    return await callback(
      {
        db,
        profile,
        session: session?.session as typeof schema.TbSession.$inferSelect,
        user: session?.user as typeof schema.TbUser.$inferSelect,
      },
      ...args
    );
  };
}
