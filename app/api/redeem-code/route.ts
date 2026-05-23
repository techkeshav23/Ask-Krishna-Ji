import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { isValidCodeFormat, normalizeCode } from "@/lib/codes";
import { FieldValue } from "firebase-admin/firestore";

/**
 * POST /api/redeem-code
 * Body: { code, uid, email }
 *
 * Called from the mobile app's Profile screen. Validates a subscription
 * code, marks it redeemed, and activates premium for the user.
 *
 * Idempotent guard: if the same code is submitted twice, the second
 * call fails cleanly (no double-grant of premium).
 *
 * Atomic via Firestore transaction so two concurrent redemption
 * attempts on the same code can't both succeed.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawCode = String(body.code || "");
    const uid = String(body.uid || "").trim();
    const email = String(body.email || "").trim().toLowerCase();

    const code = normalizeCode(rawCode);
    if (!isValidCodeFormat(code)) {
      return NextResponse.json(
        {
          error:
            "Invalid code format. Codes look like AKJ-XXXX-YYYY-ZZZZ.",
        },
        { status: 400 }
      );
    }
    if (!uid && !email) {
      return NextResponse.json(
        { error: "User identity (uid or email) is required." },
        { status: 400 }
      );
    }

    const db = adminDb();
    const codeRef = db.collection("subscriptionCodes").doc(code);

    const result = await db.runTransaction(async (tx) => {
      const snap = await tx.get(codeRef);
      if (!snap.exists) {
        return { ok: false, status: 404, error: "Code not found." };
      }
      const data = snap.data() as {
        redeemedBy: string | null;
        expiresAt?: number;
        pracharakId: string;
      };
      if (data.redeemedBy) {
        return {
          ok: false,
          status: 409,
          error: "This code has already been redeemed.",
        };
      }
      if (data.expiresAt && Date.now() > data.expiresAt) {
        return { ok: false, status: 410, error: "This code has expired." };
      }

      const now = Date.now();
      const oneYearMs = 365 * 24 * 60 * 60 * 1000;
      const premiumUntil = now + oneYearMs;

      // Mark code redeemed.
      tx.update(codeRef, {
        redeemedBy: uid || `email:${email}`,
        redeemedAt: now,
      });

      // Increment pracharak's redemption counter.
      tx.update(db.collection("pracharaks").doc(data.pracharakId), {
        totalCodesRedeemed: FieldValue.increment(1),
      });

      // Activate premium on the user record. If uid present, write
      // directly. Otherwise drop into pendingPremiumActivations and
      // let the app claim it on next sign-in.
      if (uid) {
        tx.set(
          db.collection("users").doc(uid),
          {
            isPremium: true,
            premiumUntil,
            premiumActivatedAt: now,
            premiumSource: "code",
            premiumCode: code,
            premiumPracharakId: data.pracharakId,
            updatedAt: now,
          },
          { merge: true }
        );
      } else {
        tx.set(db.collection("pendingPremiumActivations").doc(), {
          email,
          premiumUntil,
          source: "code",
          code,
          pracharakId: data.pracharakId,
          createdAt: now,
          claimed: false,
        });
      }

      return { ok: true, premiumUntil };
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      ok: true,
      premiumUntil: result.premiumUntil,
      message:
        "Code redeemed successfully. Premium is active for 1 year. 🙏",
    });
  } catch (err) {
    console.error("[redeem-code] failed:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
