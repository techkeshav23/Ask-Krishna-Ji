import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase-admin";
import { hashPassword } from "@/lib/auth";
import { getRequestSession, requireRole } from "@/lib/session";
import { sendEmail } from "@/lib/email";

/**
 * POST /api/admin/pracharaks/[id]
 * Body: { action: "approve" | "reject" | "resend" }
 *
 * approve  → status="approved" + generate password + email login info
 * reject   → status="rejected"
 * resend   → generate NEW password (replaces existing) + re-email
 *
 * Admin-only. Returns the plain password ONCE in the response so admin
 * can copy/paste it (also emailed, but UI fallback is useful if email
 * is delayed or undelivered).
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
    if (!["approve", "reject", "resend"].includes(action)) {
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
    const data = snap.data() as {
      name: string;
      email: string;
      status: string;
    };

    if (action === "reject") {
      await ref.set(
        { status: "rejected", rejectedAt: Date.now() },
        { merge: true }
      );
      return NextResponse.json({
        ok: true,
        message: "Pracharak rejected.",
      });
    }

    if (action === "approve" && data.status === "approved") {
      return NextResponse.json(
        { error: "Already approved. Use 'resend' to issue a new password." },
        { status: 400 }
      );
    }

    // approve OR resend: generate a fresh password + email it.
    const password = generateTempPassword();
    const passwordHash = await hashPassword(password);

    await ref.set(
      {
        status: "approved",
        passwordHash,
        approvedAt: action === "approve" ? Date.now() : (data as { approvedAt?: number }).approvedAt || null,
        passwordSetAt: Date.now(),
        passwordSetBy: session.email,
      },
      { merge: true }
    );

    // Email the pracharak
    try {
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || "https://askkrishnaji.com";
      await sendEmail({
        to: [{ email: data.email, name: data.name }],
        subject:
          action === "approve"
            ? "🙏 Welcome — Your Pracharak Account is Approved"
            : "🔁 Your Pracharak Password Has Been Reset",
        htmlContent: renderPracharakWelcomeHtml({
          name: data.name,
          email: data.email,
          password,
          loginUrl: `${siteUrl}/pracharak-portal/login`,
          isResend: action === "resend",
        }),
      });
    } catch (err) {
      console.warn("[admin pracharak action] email failed:", err);
    }

    return NextResponse.json({
      ok: true,
      message:
        action === "approve"
          ? "Approved + login emailed."
          : "New password generated + emailed.",
      password, // returned ONCE for admin to copy as backup
    });
  } catch (err) {
    console.error("[admin pracharak action] failed:", err);
    return NextResponse.json({ error: "Internal error." }, { status: 500 });
  }
}

/** 12-char alphanumeric password (no confusing chars). */
function generateTempPassword(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) {
    out += alphabet[crypto.randomInt(0, alphabet.length)];
  }
  return out;
}

function renderPracharakWelcomeHtml(params: {
  name: string;
  email: string;
  password: string;
  loginUrl: string;
  isResend: boolean;
}): string {
  const { name, email, password, loginUrl, isResend } = params;
  const greeting = isResend
    ? `Your password has been reset.`
    : `Your application has been approved. 🙏`;
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#FAF6EE;font-family:Arial,sans-serif;color:#3D1F0A;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:16px;padding:32px;border:1px solid rgba(212,168,71,0.4);">
      <div style="text-align:center;font-size:36px;">🪷</div>
      <h1 style="text-align:center;color:#CC5500;margin:8px 0 4px;">Welcome, ${escapeHtml(name)}</h1>
      <p style="text-align:center;color:#7A5F45;margin:0 0 24px;">Geeta Ke Pracharak</p>

      <p style="color:#3D1F0A;line-height:1.6;">${greeting}</p>

      <div style="background:#FBE9D6;border-radius:12px;padding:16px;margin:20px 0;">
        <p style="margin:0 0 8px;color:#8F5429;font-weight:bold;">Your login credentials</p>
        <table cellpadding="6" cellspacing="0" style="width:100%;border-collapse:collapse;">
          <tr><td style="color:#7A5F45;width:80px;">Email</td><td><strong>${escapeHtml(email)}</strong></td></tr>
          <tr><td style="color:#7A5F45;">Password</td><td><code style="background:#FFF;padding:4px 8px;border-radius:4px;font-size:15px;letter-spacing:1px;">${escapeHtml(password)}</code></td></tr>
        </table>
      </div>

      <p style="text-align:center;margin:24px 0;">
        <a href="${escapeHtml(loginUrl)}" style="display:inline-block;background:#CC5500;color:#FFF;padding:12px 24px;border-radius:8px;font-weight:bold;text-decoration:none;">Open Pracharak Portal →</a>
      </p>

      <p style="color:#3D1F0A;line-height:1.6;font-size:14px;">
        At the portal you can buy bulk subscription codes at the Pracharak rate
        (₹500 each, minimum 5 codes) and track redemptions. Sell the codes to
        users at your chosen price and earn your margin.
      </p>

      <p style="color:#7A5F45;font-size:12px;text-align:center;margin-top:32px;">
        🙏 कृष्ण जी की कृपा से आप अनेक जनों तक गीता का संदेश पहुँचाएँगे।
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
