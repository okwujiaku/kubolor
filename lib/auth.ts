import "server-only";

export type AuthUser = {
  id: string;
  email: string;
  role: "admin";
};

export async function requireAdmin(): Promise<AuthUser> {
  // TODO: Replace with real auth integration.
  throw new Error("Admin authentication is not configured.");
}
