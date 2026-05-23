import { NextRequest } from "next/server";
import { verifyResponseHash, type PayUCallback } from "@/lib/payu";
import { adminDb } from "@/lib/firebase-admin";
import { sendEmail, renderPremiumInvoiceHtml } from "@/lib/email";
import { generateCode } from "@/lib/codes";
import { FieldValue } from "firebase-admin/firestore";

/**
 * POST /api/payu-webhook
 *
 * Single PayU callback endpoint that fans out by `udf2` (tier marker):
 *   • "premium-yearly"         → activate premium for an app user
 *   • "pracharak-bulk-N"       → generate N codes, attribute to pracharak
 *
 * Steps:
 *   1. Verify the response hash (reject spoofs).
 *   2. Branch by tier.
 *   3. Persist the order row regardless of tier.
 *   4. Side-effects (premium activation OR code generation) only on success.
 *   5. Redirect to the appropriate success/failure page.
 *
 * PayU POSTs form-encoded data, not JSON.
 */
export async function POST(req: NextRequest) {
  try {
    const salt = process.env.PAYU_MERCHANT_SALT;
    if (!salt) {
      console.error("[payu-webhook] PAYU_MERCHANT_SALT not set");
      return htmlRedirect("/premium-failed?reason=server");
    }

    const form = await req.formData();
    const cb = formDataToCallback(form);

    if (!verifyResponseHash(cb, salt)) {
      // Verbose diagnostic — temporary while integrating. Lists every
      // form field PayU sent (names + lengths only, no values) so we
      // can spot a missing or unexpected field driving the mismatch.
      const fieldSummary: Record<string, number> = {};
      form.forEach((value, key) => {
        fieldSummary[key] = String(value).length;
      });
      console.warn("[payu-webhook] hash mismatch — possible spoof", {
        txnid: cb.txnid,
        status: cb.status,
        keyPresent: !!cb.key,
        emailLen: cb.email?.length,
        firstnameLen: cb.firstname?.length,
        productinfoLen: cb.productinfo?.length,
        productinfoFirst20: cb.productinfo?.slice(0, 20),
        amountValue: cb.amount,
        udf1Len: cb.udf1?.length ?? 0,
        udf2Len: cb.udf2?.length ?? 0,
        udf3Len: cb.udf3?.length ?? 0,
        udf4Len: cb.udf4?.length ?? 0,
        udf5Len: cb.udf5?.length ?? 0,
        receivedHashFull: cb.hash,
        allFormFields: fieldSummary,
      });
      return htmlRedirect("/premium-failed?reason=invalid");
    }

    const tier = (cb.udf2 || "premium-yearly").trim();
    const isBulk = tier.startsWith("pracharak-bulk-");
    const failureUrl = isBulk
      ? `/pracharak-portal/buy-codes?failed=${encodeURIComponent(cb.txnid)}`
      : `/premium-failed?txn=${encodeURIComponent(cb.txnid)}`;

    if (cb.status.toLowerCase() !== "success") {
      console.warn(
        `[payu-webhook] payment status=${cb.status} txn=${cb.txnid} tier=${tier}`
      );
      // Persist the failed order too — useful for analytics + manual recovery.
      await recordOrder(cb, tier, /*premiumUntil*/ null);
      return htmlRedirect(failureUrl);
    }

    if (isBulk) {
      return handleBulkSuccess(cb);
    }
    return handlePremiumSuccess(cb);
  } catch (err) {
    console.error("[payu-webhook] failed:", err);
    return htmlRedirect("/premium-failed?reason=server");
  }
}

// ─── Premium subscription branch ─────────────────────────────────
async function handlePremiumSuccess(cb: PayUCallback): Promise<Response> {
  const db = adminDb();

  // Idempotency: if PayU retries the success webhook (network blip,
  // dashboard reprocess), we must NOT re-activate premium or re-email.
  // The order doc is keyed by txnid — its prior success means we've
  // already done the work. Re-emailing or double-processing creates
  // accounting drift and user confusion.
  const existing = await db.collection("orders").doc(cb.txnid).get();
  if (existing.exists && (existing.data() as { status?: string }).status === "success") {
    console.info(`[payu-webhook premium] duplicate success ignored: ${cb.txnid}`);
    const returnDeepLink = (cb.udf3 || "").trim();
    const successUrl =
      `/premium-success?txn=${encodeURIComponent(cb.txnid)}` +
      (returnDeepLink ? `&return=${encodeURIComponent(returnDeepLink)}` : "");
    return htmlRedirect(successUrl);
  }

  const now = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const premiumUntil = now + oneYearMs;
  const uid = (cb.udf1 || "").trim();
  const returnDeepLink = (cb.udf3 || "").trim();

  // ORDER OF WRITES MATTERS for retry safety:
  //   - The order doc is the idempotency marker at the top of this
  //     handler. If we wrote it BEFORE the premium activation and the
  //     activation failed (network, quota, permission), the next
  //     webhook retry would see status=success and bail out — the
  //     user would never get premium despite paying.
  //   - So: do the side-effect writes FIRST, then record the order
  //     at the end. If anything mid-flight throws, the order isn't
  //     recorded with success status and the retry will redo the work.
  if (uid) {
    await db.collection("users").doc(uid).set(
      {
        isPremium: true,
        premiumUntil,
        premiumActivatedAt: now,
        premiumSource: "direct",
        premiumLastTxnId: cb.txnid,
        updatedAt: now,
      },
      { merge: true }
    );
  } else if (cb.email) {
    const snap = await db
      .collection("users")
      .where("email", "==", cb.email)
      .limit(1)
      .get();
    if (!snap.empty) {
      await snap.docs[0]!.ref.set(
        {
          isPremium: true,
          premiumUntil,
          premiumActivatedAt: now,
          premiumSource: "direct",
          premiumLastTxnId: cb.txnid,
          updatedAt: now,
        },
        { merge: true }
      );
    } else {
      // No app account yet — drop a pending activation row that the
      // app claims on first sign-in.
      await db.collection("pendingPremiumActivations").add({
        email: cb.email,
        premiumUntil,
        source: "direct",
        txnid: cb.txnid,
        createdAt: now,
        claimed: false,
      });
    }
  }

  // Record the order LAST so its existence with status=success means
  // the work is actually done. Idempotency check at top of this
  // handler can then trust the order doc as the durable receipt.
  await recordOrder(cb, "premium-yearly", premiumUntil);

  // Invoice email (best-effort)
  try {
    await sendEmail({
      to: [{ email: cb.email, name: cb.firstname }],
      subject: "🙏 Invoice — Ask Krishna Ji Premium",
      htmlContent: renderPremiumInvoiceHtml({
        customerName: cb.firstname,
        email: cb.email,
        amount: cb.amount,
        txnid: cb.txnid,
        paymentDate: new Date(now).toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
          timeStyle: "short",
        }),
        premiumUntil: new Date(premiumUntil).toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
          dateStyle: "medium",
        }),
      }),
    });
  } catch (err) {
    console.warn("[payu-webhook premium] invoice email failed:", err);
  }

  const successUrl =
    `/premium-success?txn=${encodeURIComponent(cb.txnid)}` +
    (returnDeepLink ? `&return=${encodeURIComponent(returnDeepLink)}` : "");
  return htmlRedirect(successUrl);
}

// ─── Pracharak bulk-codes branch ─────────────────────────────────
async function handleBulkSuccess(cb: PayUCallback): Promise<Response> {
  const db = adminDb();

  // Idempotency — far more important here than for premium because the
  // side effect is creating N new code records + an email. A duplicate
  // webhook would double-issue codes and email twice. The order doc is
  // the authoritative once-per-txnid marker; if it's already success,
  // bail out cleanly without re-processing.
  const existing = await db.collection("orders").doc(cb.txnid).get();
  if (existing.exists && (existing.data() as { status?: string }).status === "success") {
    console.info(`[payu-webhook bulk] duplicate success ignored: ${cb.txnid}`);
    const qty0 = (cb.udf4 || "").trim();
    return htmlRedirect(
      `/pracharak-portal?bulkSuccess=${encodeURIComponent(cb.txnid)}${qty0 ? `&qty=${qty0}` : ""}`
    );
  }

  const now = Date.now();
  const oneYearMs = 365 * 24 * 60 * 60 * 1000;
  const pracharakId = (cb.udf1 || "").trim();
  const qty = Math.max(1, Math.min(500, parseInt(cb.udf4 || "0", 10) || 0));

  if (!pracharakId || qty < 1) {
    console.error(
      "[payu-webhook bulk] missing pracharakId or qty",
      { pracharakId, qty }
    );
    return htmlRedirect(
      `/pracharak-portal?bulkError=${encodeURIComponent(cb.txnid)}`
    );
  }

  const pRef = db.collection("pracharaks").doc(pracharakId);
  const pSnap = await pRef.get();
  if (!pSnap.exists) {
    console.error("[payu-webhook bulk] pracharak missing:", pracharakId);
    return htmlRedirect(
      `/pracharak-portal?bulkError=${encodeURIComponent(cb.txnid)}`
    );
  }
  const pData = pSnap.data() as { name: string; email: string };

  // Generate `qty` unique codes. Same dedup pattern as admin generation.
  const codes: string[] = [];
  const batch = db.batch();
  for (let i = 0; i < qty; i++) {
    let code = generateCode();
    // eslint-disable-next-line no-await-in-loop
    while ((await db.collection("subscriptionCodes").doc(code).get()).exists) {
      code = generateCode();
    }
    codes.push(code);
    batch.set(db.collection("subscriptionCodes").doc(code), {
      code,
      pracharakId,
      pracharakName: pData.name,
      pracharakEmail: pData.email,
      generatedAt: now,
      generatedBy: "payu-webhook",
      generatedTxnId: cb.txnid,
      redeemedBy: null,
      redeemedAt: null,
      expiresAt: now + oneYearMs * 1.5,
    });
  }
  // First successful paid batch auto-activates a pending_activation
  // pracharak — that's the whole self-service model. Don't downgrade
  // existing approved/revoked statuses on subsequent purchases.
  const currentStatus = (pSnap.data() as { status?: string })?.status || "";
  const statusUpdate =
    currentStatus === "pending_activation" || currentStatus === "pending"
      ? { status: "approved", approvedAt: now, approvedVia: "first-purchase" }
      : {};

  batch.update(pRef, {
    totalCodesPurchased: FieldValue.increment(qty),
    lastCodesIssuedAt: now,
    ...statusUpdate,
  });
  await batch.commit();

  // Record the order LAST (same atomicity reasoning as the premium
  // branch — the order doc is the idempotency marker, so it must only
  // exist with status=success once all side effects are durable).
  await recordOrder(cb, cb.udf2 || "pracharak-bulk", null);

  // Email the pracharak with the new codes
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "https://askkrishnaji.com";
    await sendEmail({
      to: [{ email: pData.email, name: pData.name }],
      subject: `🎟️ Your ${qty} Subscription Codes — Ask Krishna Ji`,
      htmlContent: renderBulkCodesEmailHtml({
        name: pData.name,
        codes,
        amount: cb.amount,
        portalUrl: `${siteUrl}/pracharak-portal`,
      }),
    });
  } catch (err) {
    console.warn("[payu-webhook bulk] codes email failed:", err);
  }

  return htmlRedirect(
    `/pracharak-portal?bulkSuccess=${encodeURIComponent(cb.txnid)}&qty=${qty}`
  );
}

// ─── Helpers ─────────────────────────────────────────────────────
async function recordOrder(
  cb: PayUCallback,
  tier: string,
  premiumUntil: number | null
): Promise<void> {
  const db = adminDb();
  await db.collection("orders").doc(cb.txnid).set({
    txnid: cb.txnid,
    mihpayid: cb.mihpayid || null,
    status: cb.status,
    amount: cb.amount,
    productinfo: cb.productinfo,
    firstname: cb.firstname,
    email: cb.email,
    uid: tier === "premium-yearly" ? cb.udf1 || null : null,
    pracharakId: tier.startsWith("pracharak-") ? cb.udf1 || null : null,
    tier,
    qty: cb.udf4 ? parseInt(cb.udf4, 10) || null : null,
    mode: cb.mode || null,
    bankRef: cb.bank_ref_num || null,
    paidAt: Date.now(),
    premiumUntil,
  });
}

function formDataToCallback(form: FormData): PayUCallback {
  const s = (key: string) => (form.get(key) || "").toString();
  // PayU has shipped both `additionalCharges` and `additional_charges`
  // in the wild — accept either spelling so we don't end up tripping
  // on a docs/SDK inconsistency.
  const additionalCharges =
    s("additionalCharges") || s("additional_charges") || "";
  return {
    status: s("status"),
    email: s("email"),
    firstname: s("firstname"),
    productinfo: s("productinfo"),
    amount: s("amount"),
    txnid: s("txnid"),
    key: s("key"),
    udf1: s("udf1"),
    udf2: s("udf2"),
    udf3: s("udf3"),
    udf4: s("udf4"),
    udf5: s("udf5"),
    hash: s("hash"),
    mihpayid: s("mihpayid"),
    mode: s("mode"),
    bank_ref_num: s("bank_ref_num"),
    bankcode: s("bankcode"),
    additionalCharges: additionalCharges || undefined,
  };
}

function htmlRedirect(path: string): Response {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://askkrishnaji.com";
  const url = path.startsWith("http") ? path : `${siteUrl}${path}`;
  const body = `<!doctype html><html><head><meta http-equiv="refresh" content="0;url=${url}"></head><body>Redirecting...</body></html>`;
  return new Response(body, {
    status: 200,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function renderBulkCodesEmailHtml(params: {
  name: string;
  codes: string[];
  amount: string;
  portalUrl: string;
}): string {
  const { name, codes, amount, portalUrl } = params;
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#FAF6EE;font-family:Arial,sans-serif;color:#3D1F0A;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:16px;padding:32px;border:1px solid rgba(212,168,71,0.4);">
      <div style="text-align:center;font-size:36px;">🎟️</div>
      <h1 style="text-align:center;color:#CC5500;margin:8px 0 4px;">${codes.length} Codes Issued</h1>
      <p style="text-align:center;color:#7A5F45;margin:0 0 24px;">Payment of ₹${escapeHtml(amount)} received · Thank you, ${escapeHtml(name)}!</p>

      <p style="color:#3D1F0A;line-height:1.6;">
        Below are your ${codes.length} subscription codes. Each code activates
        Ask Krishna Ji Premium for 1 year. Sell at your chosen price.
      </p>

      <div style="background:#F5EBDA;border-radius:12px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#8F5429;font-weight:bold;">Your codes</p>
        <pre style="margin:0;padding:12px;background:#FFF;border-radius:6px;font-family:Menlo,Consolas,monospace;font-size:13px;line-height:1.6;letter-spacing:0.5px;overflow-x:auto;color:#3D1F0A;">${escapeHtml(codes.join("\n"))}</pre>
      </div>

      <p style="text-align:center;margin:24px 0;">
        <a href="${escapeHtml(portalUrl)}" style="display:inline-block;background:#CC5500;color:#FFF;padding:12px 24px;border-radius:8px;font-weight:bold;text-decoration:none;">Open Pracharak Portal →</a>
      </p>

      <p style="color:#7A5F45;font-size:12px;text-align:center;margin-top:32px;">
        🙏 कृष्ण जी का संदेश और अधिक लोगों तक पहुँचेगा।
      </p>
    </div>
  </body>
</html>`;
}

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
