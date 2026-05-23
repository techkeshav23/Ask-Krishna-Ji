import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";

/**
 * POST /api/pracharak-signup
 *
 * Receives the Pracharak signup form. Writes a `pracharaks/{autoId}` doc
 * with status "pending" — admin reviews + flips to "approved" later.
 *
 * Idempotent on email — re-submitting the same email overwrites a pending
 * record but won't downgrade an "approved" record back to "pending".
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

    // Check for an existing record by email to avoid duplicate pending rows.
    const existing = await db
      .collection("pracharaks")
      .where("emailLower", "==", emailLower)
      .limit(1)
      .get();

    const now = Date.now();

    // Profile fields the signup form owns. Counters / status / passwordHash
    // are intentionally NOT in this object so re-submission doesn't
    // overwrite admin-managed state on an existing approved pracharak.
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

    if (!existing.empty) {
      const doc = existing.docs[0]!;
      const current = doc.data() as { status?: string };
      // Preserve approved status + all counters / passwordHash / approvedAt
      // by ONLY merging the profile fields above. If current is pending,
      // ensure status stays pending; if approved, status stays approved.
      await doc.ref.set(profileFields, { merge: true });
      return NextResponse.json({
        ok: true,
        id: doc.id,
        deduped: true,
        status: current.status || "pending",
      });
    }

    const ref = await db.collection("pracharaks").add({
      ...profileFields,
      status: "pending" as const,
      totalCodesPurchased: 0,
      totalCodesRedeemed: 0,
      createdAt: now,
    });

    // Phase 2 polish: send admin a notification email (via sendEmail
    // helper) so they don't have to keep refreshing /admin/pracharaks.
    // Skipping for v1 — admin can poll the dashboard.
    return NextResponse.json({ ok: true, id: ref.id });
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
  return errors;
}
