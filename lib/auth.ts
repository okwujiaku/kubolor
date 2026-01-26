import "server-only";
import { auth, clerkClient } from "@clerk/nextjs/server";

type AdminStatus = {
  isSignedIn: boolean;
  isAdmin: boolean;
  userId: string | null;
};

export async function getAdminStatus(): Promise<AdminStatus> {
  const { userId, sessionClaims } = auth();

  if (!userId) {
    return { isSignedIn: false, isAdmin: false, userId: null };
  }

  const claims = sessionClaims as
    | {
        publicMetadata?: { role?: string };
        public_metadata?: { role?: string };
      }
    | undefined;
  const roleFromClaims = claims?.publicMetadata?.role ?? claims?.public_metadata?.role;

  if (roleFromClaims === "admin") {
    return { isSignedIn: true, isAdmin: true, userId };
  }

  const user = await clerkClient.users.getUser(userId);
  const roleFromUser = user.publicMetadata?.role;

  return {
    isSignedIn: true,
    isAdmin: roleFromUser === "admin",
    userId,
  };
}

export async function requireAdminApi(): Promise<
  | { ok: true; userId: string }
  | { ok: false; status: number; error: string }
> {
  const { isSignedIn, isAdmin, userId } = await getAdminStatus();

  if (!isSignedIn) {
    return { ok: false, status: 401, error: "Unauthorized" };
  }

  if (!isAdmin || !userId) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, userId };
}
