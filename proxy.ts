import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If not signed in → redirect to sign-in page
  if (!token) {
    const url = new URL("/api/auth/signin", req.url);
    url.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(url);
  }

  // Signed in → continue to the real route
  return NextResponse.next();
}

// Keep your matcher exactly the same
export const config = {
  // matcher: ["/chat/:path*", "/api/chat/:path*"], // note: :path* is safer than :path
  matcher: [],
};
