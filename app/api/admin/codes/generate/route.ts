import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { getRequestSession, requireRole } from "@/lib/session";
import { generateCode } from "@/lib/codes";
import { sendEmail } from "@/lib/email";
import { FieldValue } from "firebase-admin/firestore";

/**
 * POST /api/admin/codes/generate
 * Body: { pracharakId, qty }
 *
 * Generates `qty` unique codes for the named pracharak. Writes each
 * code as `subscriptionCodes/{code}` with attribution + emails the
 * pracharak a complete list. Returns the codes in the response too
 * for admin's own copy/paste.
 */
export async function POST(req: NextRequest) {
  const session = requireRole(getRequestSession(req), "admin");
  if (!session) {
    return NextResponse.json({ error: "Unauthorised." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const pracharakId = String(body.pracharakId || "").trim();
    const qty = Number(body.qty);

    if (!pracharakId) {
      return NextResponse.json(
        { error: "pracharakId is required." },
        { status: 400 }
      );
    }
    if (!Number.isInteger(qty) || qty < 1 || qty > 500) {
      return NextResponse.json(
        { error: "Quantity must be 1-500." },
        { status: 400 }
      );
    }

    const db = adminDb();
    const pRef = db.collection("pracharaks").doc(pracharakId);
    const pSnap = await pRef.get();
    if (!pSnap.exists) {
      return NextResponse.json(
        { error: "Pracharak not found." },
        { status: 404 }
      );
    }
    const pData = pSnap.data() as {
      name: string;
      email: string;
      status: string;
    };
    if (pData.status !== "approved") {
      return NextResponse.json(
        { error: "Pracharak must be approved before issuing codes." },
        { status: 400 }
      );
    }

    // Generate + write atomically. We dedupe by re-rolling on collision
    // (astronomically unlikely with 12-char Crockford base32 but cheap to verify).
    const codes: string[] = [];
    const batch = db.batch();
    const now = Date.now();
    const oneYearMs = 365 * 24 * 60 * 60 * 1000;

    for (let i = 0; i < qty; i++) {
      let code = generateCode();
      // Quick existence probe — for typical scale this is ~0 collisions.
      // For very high scale, replace with a Cloud Function batched job.
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
        generatedBy: session.email,
        // Codes are unredeemed initially. `redeemedBy` is the user UID
        // who claims the code; nulls remain on issued/unused codes.
        redeemedBy: null,
        redeemedAt: null,
        // 18-month shelf life — gives plenty of time for the pracharak
        // to sell + the user to redeem before forced expiry.
        expiresAt: now + oneYearMs * 1.5,
      });
    }

    batch.update(pRef, {
      totalCodesPurchased: FieldValue.increment(qty),
      lastCodesIssuedAt: now,
    });
    await batch.commit();

    // Email the pracharak with the full list.
    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://askkrishnaji.com";
      await sendEmail({
        to: [{ email: pData.email, name: pData.name }],
        subject: `🎟️ Your ${qty} Subscription Codes — Ask Krishna Ji`,
        htmlContent: renderCodesEmailHtml({
          name: pData.name,
          codes,
          portalUrl: `${siteUrl}/pracharak-portal`,
        }),
      });
    } catch (err) {
      console.warn("[admin codes generate] email failed:", err);
    }

    return NextResponse.json({ ok: true, codes });
  } catch (err) {
    console.error("[admin codes generate] failed:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}

function renderCodesEmailHtml(params: {
  name: string;
  codes: string[];
  portalUrl: string;
}): string {
  const { name, codes, portalUrl } = params;
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#FAF6EE;font-family:Arial,sans-serif;color:#3D1F0A;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:16px;padding:32px;border:1px solid rgba(212,168,71,0.4);">
      <div style="text-align:center;font-size:36px;">🎟️</div>
      <h1 style="text-align:center;color:#CC5500;margin:8px 0 4px;">${codes.length} Codes Ready</h1>
      <p style="text-align:center;color:#7A5F45;margin:0 0 24px;">Issued to ${escapeHtml(name)}</p>

      <p style="color:#3D1F0A;line-height:1.6;">
        Sell these codes to users at your chosen price. Each code activates
        Ask Krishna Ji Premium for 1 year. Users redeem in the app via
        "Have a code? Redeem".
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
