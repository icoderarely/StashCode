import { prisma } from "@/lib/prisma";

// Auth.js is not wired up yet, so "signed in" means the seeded demo user.
// Replace this with the session lookup once authentication lands.
const DEMO_USER_EMAIL = "demo@devstash.io";

export async function getCurrentUserId(): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    select: { id: true },
  });

  return user?.id ?? null;
}
