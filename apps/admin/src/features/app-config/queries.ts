import "server-only";

import { cache } from "react";
import * as queries from "@portfolio/db/queries";
import { db } from "@/db/drizzle";

export const getAppConfig = cache(() => queries.getAppConfig(db));
