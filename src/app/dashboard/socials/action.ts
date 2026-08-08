"use server";

import { and, desc, eq, isNull } from "drizzle-orm";

import { db } from "@/db/drizzle";
import {
  socialsInsertSchema,
  type SocialsFormValues,
} from "@/db/schema/socials.schme";
import { TbSocials } from "@/db/table";
import { withAuthAction } from "@/server/actions/middleware";

export const getSocials = withAuthAction(async (auth) => {
  if (!auth.profile) return [];
  return db.query.TbSocials.findMany({
    where: and(
      eq(TbSocials.userId, auth.profile.id),
      isNull(TbSocials.deletedAt)
    ),
    orderBy: [desc(TbSocials.createdAt)],
  });
});

export const createSocialAction = withAuthAction(
  async (auth, social: SocialsFormValues) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found. Please create a profile first.");
      }

      const validated = socialsInsertSchema.safeParse({
        ...social,
        userId: auth.profile.id,
      });
      if (!validated.success) {
        throw new Error("Invalid social data");
      }

      const [created] = await db
        .insert(TbSocials)
        .values(validated.data)
        .returning();

      return {
        success: true as const,
        data: created,
        message: "Social added successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return { success: false as const, error: "Failed to add social" };
    }
  }
);

export const updateSocialAction = withAuthAction(
  async (auth, id: string, social: SocialsFormValues) => {
    try {
      if (!auth.profile) {
        throw new Error("Profile not found.");
      }

      const validated = socialsInsertSchema.safeParse({
        ...social,
        userId: auth.profile.id,
      });
      if (!validated.success) {
        throw new Error("Invalid social data");
      }

      const existing = await db.query.TbSocials.findFirst({
        where: and(
          eq(TbSocials.id, id),
          eq(TbSocials.userId, auth.profile.id)
        ),
      });
      if (!existing) {
        throw new Error("Social not found");
      }

      const [updated] = await db
        .update(TbSocials)
        .set(validated.data)
        .where(
          and(eq(TbSocials.id, id), eq(TbSocials.userId, auth.profile.id))
        )
        .returning();

      return {
        success: true as const,
        data: updated,
        message: "Social updated successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false as const, error: error.message };
      }
      return { success: false as const, error: "Failed to update social" };
    }
  }
);

export const deleteSocialAction = withAuthAction(async (auth, id: string) => {
  try {
    if (!auth.profile) {
      throw new Error("Profile not found.");
    }

    const existing = await db.query.TbSocials.findFirst({
      where: and(eq(TbSocials.id, id), eq(TbSocials.userId, auth.profile.id)),
    });
    if (!existing) {
      throw new Error("Social not found");
    }

    await db
      .update(TbSocials)
      .set({ deletedAt: new Date() })
      .where(and(eq(TbSocials.id, id), eq(TbSocials.userId, auth.profile.id)));

    return { success: true as const, message: "Social deleted" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Failed to delete social" };
  }
});
