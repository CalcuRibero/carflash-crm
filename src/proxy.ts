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

  // 1. Validar expiración si el token existe
  if (token) {
    const timestamp = getTimestampValue(tokenTimestamp);
    const isExpired = timestamp === null || Date.now() - timestamp > TOKEN_EXPIRY_MS;

    if (isExpired) {
      // Si expiró, limpiamos cookies y redirigimos a login (a menos que ya esté en /auth)
      const response = isAuthPath
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/auth/login", request.url));

      clearAuthCookies(response);
      return response;
    }
  }

  // 2. Si no hay token y la ruta no es pública, redirigir a login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 3. Si hay token válido y está intentando ir al login/auth, redirigir al dashboard
  if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/dashboard/kanban", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|manifest.webmanifest).*)",
  ],
};