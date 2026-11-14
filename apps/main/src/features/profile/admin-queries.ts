import "server-only";

import { eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { TbProfile } from "@portfolio/db/schema";
import { requireAuth } from "@/lib/auth/get-current-user";
import { NotFoundError } from "@/lib/errors";

/** The signed-in admin's own profile fields, for the dashboard's profile form. */
export const getEditableProfile = async () => {
  const user = await requireAuth();
  const profile = await db.query.TbProfile.findFirst({
    where: eq(TbProfile.userId, user.id),
    columns: {
      name: true,
      imageUrl: true,
      bio: true,
      abouts: true,
      aboutImages: true,
      isAvailable: true,
    },
  });
  if (!profile) throw new NotFoundError();
  return profile;
};
