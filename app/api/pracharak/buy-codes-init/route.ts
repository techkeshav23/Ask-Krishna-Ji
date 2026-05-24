import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getRequestSession, requireRole } from "@/lib/session";
import {
  buildRequestHash,
  generateTxnId,
  payuCheckoutUrl,
  type PayUOrderInput,
} from "@/lib/payu";

/**
 * POST /api/pracharak/buy-codes-init
 * Body: { qty }
 *
 * Authenticated pracharak only. Creates a PayU order for qty × bulk-price.
 * On successful payment (handled in the shared payu-webhook), the
 * pracharak's `totalCodesPurchased` increments by qty and `qty` codes
 * are auto-generated + emailed.
 */
export async function POST(req: NextRequest) {
  const session = requireRole(getRequestSession(req), "pracharak");
  if (!session || !session.docId) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  try {
    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://askkrishnaji.com";
    const bulkPrice = Number(
      process.env.NEXT_PUBLIC_PRACHARAK_BULK_PRICE_INR || "500"
    );
    const minQty = Number(
      process.env.NEXT_PUBLIC_PRACHARAK_BULK_MIN_QTY || "5"
    );

    if (!key || !salt) {
      return NextResponse.json(
        { error: "Server not configured for payments." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const qty = Number(body.qty);
    if (!Number.isInteger(qty) || qty < minQty || qty > 500) {
      return NextResponse.json(
        { error: `Quantity must be between ${minQty} and 500.` },
        { status: 400 }
      );
    }

    const db = adminDb();
    const pSnap = await db.collection("pracharaks").doc(session.docId).get();
    if (!pSnap.exists) {
      return NextResponse.json(
        { error: "Pracharak not found." },
        { status: 404 }
      );
    }
    const pData = pSnap.data() as {
      name: string;
      email: string;
      phone: string;
      status?: string;
    };

    // Re-check status server-side on every purchase initiation. The
    // session JWT lives 7 days; a pracharak who was revoked yesterday
    // can otherwise still hit this endpoint with a stale cookie and
    // initiate (and complete) a purchase. The protected portal layout
    // does its own status check, but API routes must NOT trust the
    // layout — they're independent entry points.
    const status = pData.status || "";
    if (status !== "approved" && status !== "pending_activation") {
      return NextResponse.json(
        {
          error:
            "Your account is not active. Please contact support.",
        },
        { status: 403 }
      );
    }

    // PayU validates phone format. We refuse to send a fake fallback
    // because a bad phone breaks the entire payment flow — better to
    // surface the error here so the pracharak fixes their profile.
    const phone = (pData.phone || "").replace(/\s/g, "");
    if (!/^\+?[0-9]{10,13}$/.test(phone)) {
      return NextResponse.json(
        {
          error:
            "Your phone number is missing or invalid. Please contact admin to update your profile before purchasing codes.",
        },
        { status: 400 }
      );
    }

    const total = qty * bulkPrice;
    const txnid = generateTxnId("AKJP"); // P = Pracharak bulk

    const order: PayUOrderInput = {
      txnid,
      amount: `${total}.00`,
      // PayU's hash mismatch trap: not just non-ASCII chars are unsafe.
      // Parentheses `(` and `)` get silently rewritten to spaces in the
      // echoed productinfo, but PayU's hash on their end is computed
      // against the ORIGINAL pre-sanitization string — so a productinfo
      // like "Foo (Bulk)" can never verify. Safe character set is just
      // letters, digits, spaces, hyphens, periods.
      productinfo: `Ask Krishna Ji Pracharak Bulk - ${qty} Codes`,
      firstname: pData.name,
      email: pData.email,
      phone,
      surl: `${siteUrl}/api/payu-webhook?result=success`,
      furl: `${siteUrl}/api/payu-webhook?result=failure`,
      udf1: session.docId,                // pracharak id (NOT app uid)
      udf2: `pracharak-bulk-${qty}`,      // tier marker for webhook branching
      udf3: "",                           // no app deep-link for bulk purchase
      udf4: String(qty),                  // quantity for the webhook to act on
    };

    const hash = buildRequestHash(order, key, salt);

    const fields: Record<string, string> = {
      key,
      txnid: order.txnid,
      amount: order.amount,
      productinfo: order.productinfo,
      firstname: order.firstname,
      email: order.email,
      phone: order.phone,
      surl: order.surl,
      furl: order.furl,
      udf1: order.udf1!,
      udf2: order.udf2!,
      udf3: order.udf3!,
      udf4: order.udf4!,
      hash,
      service_provider: "payu_paisa",
    };

    return NextResponse.json({
      action: payuCheckoutUrl(),
      fields,
    });
  } catch (err) {
    console.error("[pracharak buy-codes-init] failed:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}
