import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Neon stores the URL at instantiation but only connects on first query.
// DATABASE_URL will be present at runtime; the build step never executes queries.
const sql = neon(
  process.env.DATABASE_URL ??
    "postgresql://user:password@ep-build-placeholder.us-east-2.aws.neon.tech/neondb"
);
export const db = drizzle(sql, { schema });
