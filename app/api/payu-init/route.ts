import { NextRequest, NextResponse } from "next/server";
import { verifyAuthHeader } from "@/lib/firebase-admin";
import {
  buildRequestHash,
  generateTxnId,
  payuCheckoutUrl,
  type PayUOrderInput,
} from "@/lib/payu";

/**
 * POST /api/payu-init
 *
 * Generates a signed PayU order for the premium yearly subscription.
 * Returns the fields the client should submit to PayU's checkout URL.
 *
 * Auth model:
 *   - When called from the app (Authorization: Bearer <id-token>) we
 *     bind udf1 to the verified uid — prevents a logged-in user from
 *     paying with someone else's uid in the body.
 *   - When called from the website (browser, no header) we accept the
 *     form-supplied uid/email as best-effort attribution. Failed
 *     attribution drops into pendingPremiumActivations to be claimed
 *     later — see /api/payu-webhook for the fallback path.
 *
 * We never expose PAYU_MERCHANT_SALT to the browser — the hash is
 * computed server-side. The client just POSTs the returned fields.
 */
export async function POST(req: NextRequest) {
  try {
    const key = process.env.PAYU_MERCHANT_KEY;
    const salt = process.env.PAYU_MERCHANT_SALT;
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://askkrishnaji.com";

    if (!key || !salt) {
      return NextResponse.json(
        {
          error:
            "Server not configured for payments. Contact support.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const errors = validate(body);
    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
    }

    // If an Authorization: Bearer token is present, trust it as the
    // authoritative uid (and email) — the body's uid field is then
    // IGNORED. Without this, a logged-in user could put any victim's
    // uid in the body and credit the victim's account with their
    // payment (gift, not theft, but also not what we want for clean
    // attribution + analytics). The website flow without a token still
    // falls back to body.uid as best-effort attribution.
    const decoded = await verifyAuthHeader(req.headers.get("authorization"));
    const trustedUid = decoded?.uid;
    const trustedEmail = decoded?.email?.toLowerCase().trim();

    const price = process.env.NEXT_PUBLIC_PREMIUM_PRICE_INR || "999";
    const txnid = generateTxnId();
    const surl = `${siteUrl}/api/payu-webhook?result=success`;
    const furl = `${siteUrl}/api/payu-webhook?result=failure`;

    const order: PayUOrderInput = {
      txnid,
      amount: `${price}.00`,
      productinfo: "Ask Krishna Ji Premium - 1 Year",
      firstname: String(body.name).trim(),
      email: trustedEmail || String(body.email).trim(),
      phone: String(body.phone).replace(/\s/g, ""),
      surl,
      furl,
      udf1: trustedUid || String(body.uid || "").trim(),    // app UID for attribution
      // Tier is hard-coded server-side. We do NOT accept a tier from the
      // client — otherwise a malicious caller could trick the webhook
      // into treating a ₹999 premium payment as a pracharak-bulk order.
      udf2: "premium-yearly",
      udf3: String(body.returnUrl || ""),      // deep-link back to app
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
      hash,
      service_provider: "payu_paisa",
    };

    return NextResponse.json({
      action: payuCheckoutUrl(),
      fields,
    });
  } catch (err) {
    console.error("[payu-init] failed:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}

function validate(body: unknown): string[] {
  if (!body || typeof body !== "object") return ["Invalid payload."];
  const b = body as Record<string, unknown>;
  const errors: string[] = [];
  const isStr = (v: unknown): v is string =>
    typeof v === "string" && v.trim().length > 0;
  if (!isStr(b.name)) errors.push("Name is required.");
  if (!isStr(b.email)) errors.push("Email is required.");
  if (!isStr(b.phone)) errors.push("Phone is required.");
  return errors;
}
