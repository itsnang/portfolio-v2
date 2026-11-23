"use server";

import { eq } from "drizzle-orm";
import { type ProfileInsert, profileInsertSchema, TbProfile } from "@portfolio/db/schema";

import { db } from "@/db/drizzle";
import { adminAction, parseInput } from "@/lib/admin-action";

export const updateProfileAction = adminAction(
  "Failed to update profile",
  async ({ profile }, input: ProfileInsert) => {
    // The owning user never changes.
    const { userId: _user, ...values } = parseInput(profileInsertSchema, input, "Invalid profile data");
    const [updated] = await db.update(TbProfile).set(values).where(eq(TbProfile.id, profile.id)).returning();
    return {
      data: updated,
      message: "Profile updated successfully",
      dashboardPath: "/dashboard/profile",
      refresh: { resource: "profile" },
    };
  }
);
