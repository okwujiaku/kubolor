import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateAuthorId(): Promise<string> {
  const { userId } = auth();
  if (!userId) {
    throw new Error("Missing authenticated user.");
  }

  const user = await clerkClient.users.getUser(userId);
  const email =
    user.emailAddresses?.[0]?.emailAddress ?? `${userId}@clerk.local`;

  const record = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: "clerk-managed",
      role: "admin",
    },
  });

  return record.id;
}
