import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getRequestSession, requireRole } from "@/lib/session";

/**
 * POST /api/admin/pracharaks/[id]
 * Body: { action: "revoke" | "restore" }
 *
 * Self-service onboarding means admin doesn't approve or set passwords
 * anymore — pracharaks sign up + choose their own password + activate
 * by paying for their first batch. The admin's only lever here is the
 * ability to revoke (block) or restore (un-block) a pracharak account.
 *
 *   revoke  → status="revoked"   (login blocked, codes still valid for users
 *                                 who already redeemed them)
 *   restore → status="approved"  (un-block — does not refund or reset)
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = requireRole(getRequestSession(req), "admin");
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const action = String(body.action || "");
    const id = params.id;
    if (!["revoke", "restore"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action." },
        { status: 400 }
      );
    }

    const db = adminDb();
    const ref = db.collection("pracharaks").doc(id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json(
        { error: "Pracharak not found." },
        { status: 404 }
      );
    }

    if (action === "revoke") {
      await ref.set(
        {
          status: "revoked",
          revokedAt: Date.now(),
          revokedBy: session.email,
        },
        { merge: true }
      );
      return NextResponse.json({
        ok: true,
        message: "Pracharak revoked. They can no longer log in.",
      });
    }

    // restore — flip back to approved (not pending_activation, because
    // they were active enough to warrant a revoke).
    await ref.set(
      {
        status: "approved",
        restoredAt: Date.now(),
        restoredBy: session.email,
      },
      { merge: true }
    );
    return NextResponse.json({
      ok: true,
      message: "Pracharak restored.",
    });
  } catch (err) {
    console.error("[admin pracharak action] failed:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
