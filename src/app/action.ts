"use server";
import { db, takeFirstOrThrow } from "@/db/drizzle";

export const getProfile = async () => {
  try {
    const data = await db.query.TbProfile.findMany({
      with: {
        skills: true,
      },
    }).then(takeFirstOrThrow);

    return data;
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw new Error("Failed to fetch profile data");
  }
};
