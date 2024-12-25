"use server";
import { lucia, validateRequest } from "./auth";
import { cookies } from "next/headers";
import { getUserByEmail } from "@/db/repositories/user.repository";
import { cache } from "react";
import { AuthenticationError } from "../errors";

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

export const getCurrentUser = cache(async () => {
  const session = await validateRequest();
  if (!session.user) {
    return undefined;
  }
  return session.user;
});

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export async function verifyPassword(email: string, password: string) {
  const user = await getUserByEmail(email);
  if (!user) {
    return false;
  }

  const hash = password;
  return hash === user.password;
}
