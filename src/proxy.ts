import { type NextRequest, NextResponse } from "next/server";
import { PROTECTED_PREFIXES, ROLE_HOME } from "@/constants/role.constant";
import type { UserRole } from "@/types";

/**
 * Optimistic route protection (runs before the page renders, so there is no
 * flash of protected UI). The backend remains the source of truth: every API
 * call is authorised again server-side and the client guards re-check /auth/me.
 *
 * Only active when the API is proxied through this origin (relative
 * NEXT_PUBLIC_API_BASE_URL), because only then are the auth cookies readable here.
 */
const COOKIES_VISIBLE = (
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1"
).startsWith("/");

function readRole(token: string | undefined): UserRole | null {
  if (!token) {
    return null;
  }
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as { role?: UserRole };
    return json.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  if (!COOKIES_VISIBLE) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const rule = PROTECTED_PREFIXES.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!rule) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // No session at all -> login (remember where the user was going).
  if (!accessToken && !refreshToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  // Valid-looking token for the wrong role -> send to their own dashboard.
  const role = readRole(accessToken);
  if (role && !rule.roles.includes(role)) {
    return NextResponse.redirect(new URL(ROLE_HOME[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/rider/:path*", "/dashboard/:path*"],
};
