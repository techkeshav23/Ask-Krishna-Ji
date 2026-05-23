import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import {
  SESSION_COOKIE_NAME,
  type SessionPayload,
  verifySession,
} from "./auth";

/**
 * Read the current session from the request cookies (server-side).
 * Returns null if no cookie, invalid token, or expired.
 *
 * Use one of two variants depending on context:
 *  - `getServerSession()`      — for page server components
 *  - `getRequestSession(req)`  — for API route handlers with NextRequest
 */
export const getServerSession = (): SessionPayload | null => {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
};

export const getRequestSession = (req: NextRequest): SessionPayload | null => {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
};

/** Convenience: returns the session only if the role matches; else null. */
export const requireRole = (
  session: SessionPayload | null,
  role: SessionPayload["role"]
): SessionPayload | null => {
  if (!session || session.role !== role) return null;
  return session;
};
