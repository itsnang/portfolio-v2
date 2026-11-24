import "server-only";

import { headers } from "next/headers";
import { auth } from "./better-auth";

/** For route handlers: a 401 response without a session, or null to carry on. */
export async function unauthorizedWithoutSession(): Promise<Response | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session ? null : Response.json({ error: "Unauthorized" }, { status: 401 });
}
