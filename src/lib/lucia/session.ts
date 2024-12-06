"use server";
import { lucia } from "./auth";
import { cookies } from "next/headers";
import { getUserByEmail } from "@/db/repositories/user.repository";

export const setSession = async (userId: string) => {
  const session = await lucia.createSession(userId, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
};

export async function verifyPassword(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return false;
  }

  const hash = password;
  return hash === user.password;
}
