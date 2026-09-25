import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 no longer reads .env automatically, and connection URLs moved out of
// schema.prisma into this file.
//
// Migrations run over DIRECT_URL (Neon's unpooled endpoint) because the pooled
// endpoint runs PgBouncer in transaction mode, which can't hold the session-level
// advisory locks the schema engine takes. The app itself uses the pooled
// DATABASE_URL — see src/lib/prisma.ts.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
});
