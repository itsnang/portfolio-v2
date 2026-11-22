import "server-only";

import { err, ok } from "@justmiracle/result";

import { db } from "@/db/drizzle";

/** Public, unauthenticated read used by the public site (home page, achievement page, dock nav). */
export const getSocials = async () => {
  const socials = await db.query.TbSocials.findMany({
    where: (social, { eq, and, isNull }) =>
      and(eq(social.isActive, true), isNull(social.deletedAt)),
  })
    .then(ok)
    .catch(err);
  if (socials.error) {
    throw new Error("Failed to fetch socials data");
  }
  return socials.value;
};
