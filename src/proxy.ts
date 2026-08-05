import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "accessToken";
const TOKEN_TIMESTAMP_COOKIE = "tokenTimestamp";
const PUBLIC_PATHS = ["/auth", "/unauthorized"];
const TOKEN_EXPIRY_MS = 12 * 60 * 60 * 1000; // 12 hours

function clearAuthCookies(response: NextResponse) {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set(TOKEN_TIMESTAMP_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

function getTimestampValue(value?: string): number | null {
  if (!value) {
    return null;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const tokenTimestamp = request.cookies.get(TOKEN_TIMESTAMP_COOKIE)?.value;

  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  const isAuthPath = pathname === "/auth" || pathname.startsWith("/auth/");

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const timestamp = getTimestampValue(tokenTimestamp);
  const isExpired = Boolean(
    token && (timestamp === null || Date.now() - timestamp > TOKEN_EXPIRY_MS),
  );

  if (isExpired) {
    const response = isAuthPath
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/auth/login", request.url));

    clearAuthCookies(response);
    return response;
  }

  if (token && isAuthPath) {
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
    "/((?!api|_next/static|_next/image|favicon.ico|public|manifest.webmanifest).*)",
  ],
};
