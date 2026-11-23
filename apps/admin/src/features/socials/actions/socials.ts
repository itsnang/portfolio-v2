"use server";

import { and, eq, isNull } from "drizzle-orm";
import { socialsInsertSchema, type SocialsFormValues, TbSocials } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { ActionError, adminAction, parseInput } from "@/lib/admin-action";

const dashboardPath = "/dashboard/socials";
// Socials appear on the home page, the achievement page and the dock.
const refresh = { resource: "socials" } as const;

const ownSocial = (id: string, profileId: string) =>
  and(eq(TbSocials.id, id), eq(TbSocials.userId, profileId), isNull(TbSocials.deletedAt));

export const createSocialAction = adminAction(
  "Failed to add social",
  async ({ profile }, input: SocialsFormValues) => {
    const values = parseInput(socialsInsertSchema, { ...input, userId: profile.id }, "Invalid social data");
    const [created] = await db.insert(TbSocials).values(values).returning();
    return { data: created, message: "Social added successfully", dashboardPath, refresh };
  }
);

export const updateSocialAction = adminAction(
  "Failed to update social",
  async ({ profile }, id: string, input: SocialsFormValues) => {
    const values = parseInput(socialsInsertSchema, { ...input, userId: profile.id }, "Invalid social data");
    const [updated] = await db.update(TbSocials).set(values).where(ownSocial(id, profile.id)).returning();
    if (!updated) throw new ActionError("Social not found");
    return { data: updated, message: "Social updated successfully", dashboardPath, refresh };
  }
);

export const deleteSocialAction = adminAction("Failed to delete social", async ({ profile }, id: string) => {
  const [deleted] = await db
    .update(TbSocials)
    .set({ deletedAt: new Date() })
    .where(ownSocial(id, profile.id))
    .returning({ id: TbSocials.id });
  if (!deleted) throw new ActionError("Social not found");
  return { data: undefined, message: "Social deleted", dashboardPath, refresh };
});
