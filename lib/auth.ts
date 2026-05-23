import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Session-token + password helpers shared by admin and pracharak auth.
 *
 * Sessions are issued as JWTs and persisted in an HTTP-only cookie. The
 * server verifies the JWT on every protected request, so a stolen token
 * is the only attack surface — and that's mitigated by the cookie being
 * HTTP-only + Secure (in production) + SameSite=Lax.
 *
 * Passwords are stored as bcrypt hashes in Firestore. We never compare
 * plaintext.
 */

export type SessionRole = "admin" | "pracharak";

export interface SessionPayload {
  role: SessionRole;
  email: string;
  /** Firestore doc id for pracharak; null for admin (admin is email-keyed). */
  docId: string | null;
  /** Issued-at seconds; jwt also adds `exp` automatically. */
  iat?: number;
  exp?: number;
}

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

const getSecret = (): string => {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 24) {
    throw new Error(
      "JWT_SECRET is not set or is too short (need ≥24 chars). " +
        "Generate a long random string and add it to your env."
    );
  }
  return s;
};

/** Sign a session payload into a JWT string. */
export const signSession = (
  payload: Omit<SessionPayload, "iat" | "exp">
): string => {
  return jwt.sign(payload, getSecret(), {
    expiresIn: SESSION_TTL_SECONDS,
  });
};

/** Returns the decoded session, or null if invalid/expired/tampered. */
export const verifySession = (token: string): SessionPayload | null => {
  try {
    return jwt.verify(token, getSecret()) as SessionPayload;
  } catch {
    return null;
  }
};

/** bcrypt password hash (12 rounds — strong vs reasonable CPU cost). */
export const hashPassword = async (plaintext: string): Promise<string> => {
  return bcrypt.hash(plaintext, 12);
};

export const verifyPassword = async (
  plaintext: string,
  hash: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(plaintext, hash);
  } catch {
    return false;
  }
};

/**
 * Resolve the admin-emails allowlist from env. Lowercase + trimmed for
 * case-insensitive comparison.
 */
export const getAdminEmails = (): Set<string> => {
  const raw = (process.env.ADMIN_EMAILS || "").trim();
  if (!raw) return new Set();
  return new Set(
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  );
};

export const isAdminEmail = (email: string): boolean => {
  return getAdminEmails().has(email.trim().toLowerCase());
};

/** Cookie name kept in one place so we don't drift between routes. */
export const SESSION_COOKIE_NAME = "akj_session";

/**
 * Returns cookie options for the session cookie. `secure` flips off in
 * dev so localhost works without HTTPS.
 */
export const sessionCookieOptions = (maxAgeSeconds = SESSION_TTL_SECONDS) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: maxAgeSeconds,
});
