import { LOCAL_DATABASE_URL } from "@portfolio/db/local";

// Seeds the admin account into the local database, whatever .env.local says.
process.env.DATABASE_URL = LOCAL_DATABASE_URL;
void import("./seed-admin");
