import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import {
  SESSION_COOKIE_NAME,
  hashPassword,
  sessionCookieOptions,
  signSession,
} from "@/lib/auth";

/**
 * POST /api/pracharak-signup
 *
 * Self-service pracharak onboarding. The user chooses their own password
 * at signup and is immediately logged into the portal with status
 * `pending_activation` — they unlock the full pracharak experience by
 * paying for their first bulk-code batch (PayU webhook flips status to
 * `approved` on success). No admin involvement; no auth emails.
 *
 * Email dedup rules:
 *   - approved              → reject ("already registered, please login")
 *   - revoked               → reject ("account suspended, contact admin")
 *   - pending_activation    → overwrite password + profile, re-issue session
 *   - pending (legacy)      → upgrade to pending_activation, set password
 *   - no record             → create fresh
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors = validateBody(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    const db = adminDb();
    const emailLower = String(body.email).trim().toLowerCase();

    const existing = await db
      .collection("pracharaks")
      .where("emailLower", "==", emailLower)
      .limit(1)
      .get();

    const now = Date.now();
    const passwordHash = await hashPassword(String(body.password));

    const profileFields = {
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      whatsapp: String(body.whatsapp || "").trim(),
      email: String(body.email).trim(),
      emailLower,
      city: String(body.city || "").trim(),
      state: String(body.state || "").trim(),
      reference: String(body.reference || "").trim(),
      updatedAt: now,
    };

    let pracharakId: string;

    if (!existing.empty) {
      const doc = existing.docs[0]!;
      const current = doc.data() as { status?: string };
      const status = current.status || "pending";

      if (status === "approved") {
        return NextResponse.json(
          {
            error:
              "This email is already registered. Please log in instead.",
          },
          { status: 409 }
        );
      }
      if (status === "revoked" || status === "rejected") {
        return NextResponse.json(
          {
            error:
              "This account is not active. Please contact support.",
          },
          { status: 403 }
        );
      }

      // pending / pending_activation → overwrite password + profile,
      // promote legacy "pending" docs to the new status name.
      await doc.ref.set(
        {
          ...profileFields,
          passwordHash,
          status: "pending_activation",
          passwordSetAt: now,
        },
        { merge: true }
      );
      pracharakId = doc.id;
    } else {
      const ref = await db.collection("pracharaks").add({
        ...profileFields,
        passwordHash,
        status: "pending_activation",
        totalCodesPurchased: 0,
        totalCodesRedeemed: 0,
        createdAt: now,
        passwordSetAt: now,
      });
      pracharakId = ref.id;
    }

    // Issue session cookie so the signup form can redirect straight to
    // the portal — no email round-trip, no admin gate. Status check on
    // the portal side handles the pending_activation vs approved fork.
    const token = signSession({
      role: "pracharak",
      email: emailLower,
      docId: pracharakId,
    });
    const res = NextResponse.json({
      ok: true,
      id: pracharakId,
      status: "pending_activation",
    });
    res.cookies.set(SESSION_COOKIE_NAME, token, sessionCookieOptions());
    return res;
  } catch (err) {
    console.error("[pracharak-signup] failed:", err);
    return NextResponse.json(
      { error: "Internal error. Please try again." },
      { status: 500 }
    );
  }
}

function validateBody(body: unknown): string[] {
  if (!body || typeof body !== "object") return ["Invalid payload."];
  const b = body as Record<string, unknown>;
  const errors: string[] = [];

  const isStr = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0;

  if (!isStr(b.name)) errors.push("Name is required.");
  if (!isStr(b.phone)) errors.push("Phone is required.");
  if (!isStr(b.email)) errors.push("Email is required.");
  if (!isStr(b.password)) errors.push("Password is required.");

  if (isStr(b.phone)) {
    const stripped = b.phone.replace(/\s/g, "");
    if (!/^\+?[0-9]{10,13}$/.test(stripped)) {
      errors.push("Phone number is invalid.");
    }
  }
  if (isStr(b.email)) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) {
      errors.push("Email is invalid.");
    }
  }
  if (isStr(b.password)) {
    if (b.password.length < 8) {
      errors.push("Password must be at least 8 characters.");
    }
    if (b.password.length > 128) {
      errors.push("Password is too long.");
    }
  }
  return errors;
}
