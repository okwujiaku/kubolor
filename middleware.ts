import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (!isAdminRoute(req)) {
    return NextResponse.next();
  }

  auth().protect();

  const { sessionClaims } = auth();
  const role =
    sessionClaims?.publicMetadata?.role ?? sessionClaims?.public_metadata?.role;

  if (role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
