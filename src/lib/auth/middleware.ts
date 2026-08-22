import { db } from "@/db/drizzle";
import { auth } from "@/lib/auth/better-auth";
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
    const sessionData = await auth.api.getSession({
      headers: await headers(),
    });

    let profile: typeof schema.TbProfile.$inferSelect | undefined;
    let session: typeof schema.TbSession.$inferSelect | undefined;
    let user: typeof schema.TbUser.$inferSelect | undefined;

    if (sessionData?.user) {
      user = sessionData.user as typeof schema.TbUser.$inferSelect;

      // Fetch session from database using the session ID from better-auth
      if (sessionData.session?.id) {
        const dbSession = await db.query.TbSession.findFirst({
          where: (session, { eq }) => eq(session.id, sessionData.session.id),
        });
        session = dbSession;
      }

      // Fetch profile
      profile = await db.query.TbProfile.findFirst({
        where: (profile, { eq }) => eq(profile.userId, sessionData.user.id),
      });
    }

    return await callback(
      {
        db,
        profile,
        session,
        user,
      },
      ...args
    );
  };
}
