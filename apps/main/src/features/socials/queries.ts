import "server-only";

import { cache } from "react";
import { db } from "@/db/drizzle";

/** Active socials, for the home page, the achievement page and the dock. */
export const getSocials = cache(() =>
  db.query.TbSocials.findMany({
    where: (social, { eq, and, isNull }) => and(eq(social.isActive, true), isNull(social.deletedAt)),
  })
);
