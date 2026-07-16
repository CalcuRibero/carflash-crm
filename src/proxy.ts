import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "accessToken";
const PUBLIC_PATHS = ["/auth", "/unauthorized"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Check if the path is public
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user is authenticated and trying to access auth page, redirect to dashboard
  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard/kanban", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
