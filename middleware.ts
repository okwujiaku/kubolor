import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware((auth, req) => {
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", req.nextUrl.pathname);

  if (!isAdminRoute(req)) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  auth().protect();

  const { sessionClaims } = auth();
  const claims = sessionClaims as
    | {
        publicMetadata?: { role?: string };
        public_metadata?: { role?: string };
      }
    | undefined;
  const role = claims?.publicMetadata?.role ?? claims?.public_metadata?.role;

  if (role && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};
