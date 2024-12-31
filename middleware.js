import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // Paths that don't require authentication
  const publicPaths = ["/auth/login", "/auth/register"];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // For protected routes, verify role-based access
  if (token && !isPublicPath) {
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    // Check admin routes
    const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
    if (isAdminRoute && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
  ],
};
