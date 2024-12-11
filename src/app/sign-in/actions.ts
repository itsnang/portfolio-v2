"use server";
import { userLoginsSchema } from "@/db/schema/user.schma";
import { signInUseCase } from "@/lib/lucia/auth";
import { AuthenticationError } from "@/lib/errors";
import { setSession } from "@/lib/lucia/session";
import { redirect } from "next/navigation";

export const signInAction = async (email: string, password: string) => {
  const validated = userLoginsSchema.safeParse({
    email,
    password,
  });
  if (!validated.success) {
    throw new AuthenticationError();
  }
  const user = await signInUseCase(email, password);
  await setSession(user.id);
  redirect("/dashboard");
};
