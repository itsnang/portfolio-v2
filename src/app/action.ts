"use server";
import { db, takeFirstOrThrow } from "@/db/drizzle";
import { TbProfile } from "@/db/table";

export const getProfile = async () => {
  const data = await db
    .select()
    .from(TbProfile)
    .execute()
    .then(takeFirstOrThrow);
  return data;
};
