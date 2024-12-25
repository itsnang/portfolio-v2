import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { TbSession, TbUser } from "../table";

export async function getUserByEmail(email: string) {
  const user = await db.query.TbUser.findFirst({
    where: eq(TbUser.email, email),
  });
  return user;
}

export async function getTokenByUserId(userId: string) {
  const token = await db.query.TbSession.findFirst({
    where: eq(TbSession.userId, userId),
  });
  return token;
}
