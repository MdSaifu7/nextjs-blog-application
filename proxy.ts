import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "better-auth", // must match your Better Auth config
    https: process.env.NODE_ENV === "production", // ← ensures secure cookie is read
  });

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/blogs", "/create"], // Specify the routes the middleware applies to
};
