import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  // Allow only the login route to be public
  const isLoginPath = request.nextUrl.pathname === "/auth/login";

  // Redirect to login if no token is present and the path is not the login route
  if (!token && !isLoginPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Redirect logged-in users trying to access the login page to the dashboard
  if (token && isLoginPath) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If a token exists, validate it for protected routes
  if (token) {
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Allow access to the route if all checks pass
  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*"], // Apply middleware to all routes, including "/"
};
