"use server";

import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { err, ok } from "@justmiracle/result";

import { db } from "@/db/drizzle";
import {
  socialsInsertSchema,
  type SocialsFormValues,
} from "@/db/schema/socials.schema";
import { TbSocials } from "@/db/table";
import { withAuthAction } from "@/lib/auth/middleware";

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

/** Authenticated read for the dashboard CMS table (scoped to the current profile). */
export const getSocialsAction = withAuthAction(async (auth) => {
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

      revalidatePath("/dashboard/socials");
      revalidatePath("/");

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

      revalidatePath("/dashboard/socials");
      revalidatePath("/");

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

    revalidatePath("/dashboard/socials");
    revalidatePath("/");

    return { success: true as const, message: "Social deleted" };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false as const, error: error.message };
    }
    return { success: false as const, error: "Failed to delete social" };
  }
});
