import { createAuthClient } from "better-auth/react";

// Same origin as the Admin Site, so no baseURL: BETTER_AUTH_URL isn't exposed to the browser anyway.
export const authClient = createAuthClient();

export const { signIn, signOut, useSession } = authClient;
