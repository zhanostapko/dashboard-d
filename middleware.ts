import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith("/api");
  const isAuthApiRoute = pathname.startsWith("/api/auth");
  const isProtectedPage = pathname.startsWith("/auth");

  if (isAuthApiRoute) {
    return NextResponse.next();
  }

  if (!token && isApiRoute) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!token && isProtectedPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/auth/invoices", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/auth/:path*", "/api/:path*"],
};
