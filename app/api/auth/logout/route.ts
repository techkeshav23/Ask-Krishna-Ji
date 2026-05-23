import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, sessionCookieOptions } from "@/lib/auth";

/**
 * Clears the session cookie and redirects.
 *
 * POST keeps it CSRF-resistant. We accept an optional `redirect` form
 * field so the calling form can specify where to land — defaults to "/".
 *
 * Returning a 303 (See Other) is the correct response status for a
 * POST-then-redirect handshake (RFC 7231). 302 also works in practice
 * but 303 is semantically right.
 */
const ALLOWED_REDIRECT_PATHS = [
  "/",
  "/admin/login",
  "/pracharak-portal/login",
];

const sanitizeRedirect = (raw: string): string => {
  // Only allow same-origin paths from our allowlist. This blocks
  // open-redirect abuse (e.g., ?redirect=https://evil.com).
  if (ALLOWED_REDIRECT_PATHS.includes(raw)) return raw;
  return "/";
};

export async function POST(req: NextRequest) {
  let redirectTo = "/";
  try {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const form = await req.formData();
      const raw = String(form.get("redirect") || "/");
      redirectTo = sanitizeRedirect(raw);
    } else if (contentType.includes("application/json")) {
      const body = await req.json().catch(() => ({}));
      const raw = String(body.redirect || "/");
      redirectTo = sanitizeRedirect(raw);
    }
  } catch {
    // Body parsing failed — fall through with default redirect.
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001";
  const url = new URL(redirectTo, siteUrl);
  const res = NextResponse.redirect(url, { status: 303 });
  res.cookies.set(SESSION_COOKIE_NAME, "", { ...sessionCookieOptions(0) });
  return res;
}
