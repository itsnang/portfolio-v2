import { lucia, validateRequest } from "@/lib/lucia/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(): Promise<Response> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { session } = await validateRequest();
  if (!session) {
    redirect("/sign-in");
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  redirect("/");
}
