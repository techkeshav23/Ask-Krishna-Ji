import { NextRequest, NextResponse } from "next/server";
import {
  SESSION_COOKIE_NAME,
  isAdminEmail,
  sessionCookieOptions,
  signSession,
  verifyPassword,
} from "@/lib/auth";
import { adminDb } from "@/lib/firebase-admin";

/**
 * POST /api/auth/login
 * Body: { email, password, role: "admin" | "pracharak" }
 *
 * Validates credentials and sets an HTTP-only session cookie.
 *
 * Admin auth:
 *   - Email must be in ADMIN_EMAILS env var
 *   - Password is checked against `admins/{emailLower}.passwordHash` OR the
 *     INITIAL_ADMIN_PASSWORD env var as a bootstrap fallback (so the very
 *     first admin can log in before any admin doc exists).
 *
 * Pracharak auth:
 *   - Pracharak must exist in `pracharaks/` collection
 *   - Status must be "approved"
 *   - Password is checked against `pracharaks/{id}.passwordHash`
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const role = String(body.role || "");

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }
    if (role !== "admin" && role !== "pracharak") {
      return NextResponse.json(
        { error: "Invalid role." },
        { status: 400 }
      );
    }

    const db = adminDb();

    if (role === "admin") {
      if (!isAdminEmail(email)) {
        return NextResponse.json(
          { error: "Not authorised as admin." },
          { status: 403 }
        );
      }

      const docRef = db.collection("admins").doc(email);
      const doc = await docRef.get();
      const data = doc.data();
      const storedHash = (data?.passwordHash as string | undefined) || null;

      let ok = false;
      if (storedHash) {
        ok = await verifyPassword(password, storedHash);
      } else if (process.env.INITIAL_ADMIN_PASSWORD) {
        // Bootstrap path — only works before an admin doc exists.
        ok = password === process.env.INITIAL_ADMIN_PASSWORD;
        if (ok) {
          // Persist the bootstrap password as a hashed admin record so
          // future logins go through the normal verifyPassword path.
          const { hashPassword } = await import("@/lib/auth");
          const newHash = await hashPassword(password);
          await docRef.set(
            {
              email,
              passwordHash: newHash,
              createdAt: Date.now(),
              bootstrapped: true,
            },
            { merge: true }
          );
        }
      }

      if (!ok) {
        return NextResponse.json(
          { error: "Incorrect email or password." },
          { status: 401 }
        );
      }

      const token = signSession({ role: "admin", email, docId: null });
      const res = NextResponse.json({ ok: true, role: "admin" });
      res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
      return res;
    }

    // ── Pracharak login ──
    // Three timing-defense layers stacked here:
    //   1. Always run bcrypt against SOMETHING so the password-check
    //      step has uniform timing whether the email exists or not.
    //   2. Enforce a minimum total response time so the Firestore
    //      query+bcrypt+round-trip can't leak email-existence via
    //      "fast no-match" vs "slow match" patterns.
    //   3. Only AFTER a successful password match do we differentiate
    //      "pending approval" vs "approved" — wrong password always
    //      returns the generic credentials error.
    const loginStartedAt = Date.now();
    const MIN_PRACHARAK_LOGIN_MS = 350; // bcrypt-12 alone is ~200-300ms

    const snap = await db
      .collection("pracharaks")
      .where("emailLower", "==", email)
      .limit(1)
      .get();

    const pdoc = snap.empty ? null : snap.docs[0]!;
    const pdata = pdoc?.data() as
      | { status?: string; passwordHash?: string }
      | undefined;

    // Dummy hash for the no-record / no-password case so timing matches.
    // The compare against this can never succeed — bcrypt will return false.
    const DUMMY_HASH =
      "$2a$12$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTU1234567";
    const hashToCheck = pdata?.passwordHash || DUMMY_HASH;
    const passwordOk = await verifyPassword(password, hashToCheck);

    // Pad to minimum response time before returning — closes the
    // timing side-channel that distinguishes registered vs unregistered
    // emails. Must run BEFORE both the failure and success returns.
    const padTiming = async () => {
      const elapsed = Date.now() - loginStartedAt;
      if (elapsed < MIN_PRACHARAK_LOGIN_MS) {
        await new Promise((r) => setTimeout(r, MIN_PRACHARAK_LOGIN_MS - elapsed));
      }
    };

    if (!passwordOk || !pdoc || !pdata?.passwordHash) {
      await padTiming();
      return NextResponse.json(
        { error: "Incorrect email or password." },
        { status: 401 }
      );
    }

    // Password matched. Now we can safely tell the user about their
    // account state without leaking account existence to attackers.
    // Self-service signup model: pending_activation is a valid login
    // state (the portal shows an activation CTA). Only revoked/rejected
    // accounts and legacy "pending" admin-review records are blocked
    // here — legacy pending users must re-signup to set a password.
    const status = pdata.status || "";
    if (status === "revoked" || status === "rejected") {
      await padTiming();
      return NextResponse.json(
        {
          error: "This account is not active. Please contact support.",
        },
        { status: 403 }
      );
    }
    if (status !== "approved" && status !== "pending_activation") {
      await padTiming();
      return NextResponse.json(
        {
          error:
            "Your account isn't fully set up. Please re-register to continue.",
        },
        { status: 403 }
      );
    }

    const token = signSession({
      role: "pracharak",
      email,
      docId: pdoc.id,
    });
    await padTiming();
    const res = NextResponse.json({ ok: true, role: "pracharak" });
    res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("[auth/login] failed:", err);
    return NextResponse.json(
      { error: "Internal error. Please try again." },
      { status: 500 }
    );
  }
}
