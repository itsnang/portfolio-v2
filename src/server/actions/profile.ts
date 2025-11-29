"use server";
import { db } from "@/db/drizzle";
import { ProfileInsert, profileInsertSchema } from "@/db/schema/profile.schema";
import { TbProfile } from "@/db/table";
import { eq } from "drizzle-orm";
import { withAuthAction } from "./middleware";

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
      return {
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
