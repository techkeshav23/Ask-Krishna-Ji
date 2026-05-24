import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth, type Auth } from "firebase-admin/auth";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

/**
 * Single shared Firebase Admin instance. Next.js may import this from
 * multiple API routes that run in the same serverless function instance —
 * `getApps()` keeps us idempotent so we don't re-init and crash.
 *
 * Service-account JSON is read from FIREBASE_SERVICE_ACCOUNT_JSON. In
 * Vercel/local-dev set this as a single-line JSON-encoded string env var.
 */
let cachedApp: App | null = null;

const getApp = (): App => {
  if (cachedApp) return cachedApp;
  const existing = getApps();
  if (existing.length > 0) {
    cachedApp = existing[0]!;
    return cachedApp;
  }
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON is not set. " +
        "Add the service account JSON to your environment variables."
    );
  }
  let serviceAccount: Record<string, unknown>;
  try {
    serviceAccount = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_JSON failed to parse as JSON. " +
        "Ensure it's a single-line JSON string."
    );
  }
  cachedApp = initializeApp({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    credential: cert(serviceAccount as any),
  });
  return cachedApp;
};

export const adminDb = (): Firestore => getFirestore(getApp());

export const adminAuth = (): Auth => getAuth(getApp());

/**
 * Verify a Firebase ID token from an Authorization: Bearer header.
 * Returns the decoded token (uid, email, etc.) or null if the header
 * is missing, malformed, or the token can't be verified.
 *
 * Use on any API route that needs to trust the calling user — e.g.
 * /api/redeem-code, where without this an attacker could submit any
 * uid in the body and redeem codes against another user's account.
 */
export const verifyAuthHeader = async (
  authHeader: string | null
): Promise<import("firebase-admin/auth").DecodedIdToken | null> => {
  if (!authHeader) return null;
  const match = /^Bearer\s+(.+)$/i.exec(authHeader);
  if (!match) return null;
  const token = match[1]!.trim();
  if (!token) return null;
  try {
    return await adminAuth().verifyIdToken(token);
  } catch {
    return null;
  }
};
