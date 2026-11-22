"use server";
import { db } from "@/db/drizzle";
import { ProfileInsert, profileInsertSchema, TbProfile } from "@portfolio/db/schema";
import { eq } from "drizzle-orm";
import { withAuthAction } from "@/lib/auth/middleware";
import { revalidatePath } from "next/cache";
import { refreshPublicSites } from "@/lib/refresh-public-sites";

export const updateProfileAction = withAuthAction(
  async (auth, profile: ProfileInsert) => {
    try {
      const isValidate = profileInsertSchema.safeParse(profile);
      if (!isValidate.success) {
        throw new Error("Invalid profile data");
      }
      await db
        .update(TbProfile)
        .set(profile)
        .where(eq(TbProfile.userId, auth.user.id))
        .returning();
      const profileData = await db.query.TbProfile.findFirst({
        where: eq(TbProfile.userId, auth.user.id),
      });

      revalidatePath("/dashboard/profile");
      const warning = await refreshPublicSites({ resource: "profile" });

      return {
        warning,
        success: true,
        data: profileData,
        message: "Profile updated successfully",
      };
    } catch (error) {
      if (error instanceof Error) {
        return { success: false, error: error.message };
      }
      return { success: false, error: "Failed to create showcase" };
    }
  }
);
