import nodemailer, { type Transporter } from "nodemailer";

/**
 * SMTP transactional email helper using `nodemailer`.
 *
 * Defaults to Gmail SMTP with an App Password (free, no signup beyond
 * a Gmail account). To switch providers later (e.g., Brevo SMTP,
 * SendGrid SMTP, custom domain via cPanel), only the SMTP_* env vars
 * change — the code stays the same.
 *
 * Gmail App Password setup:
 *   1. Enable 2-factor auth on the sending Gmail account.
 *   2. Visit https://myaccount.google.com/apppasswords
 *   3. Create app password named "Ask Krishna Ji"
 *   4. Copy the 16-char password → SMTP_PASS
 *   5. SMTP_USER = your Gmail address
 */

interface SendEmailInput {
  to: { email: string; name?: string }[];
  subject: string;
  htmlContent: string;
  attachments?: { filename: string; content: Buffer | string }[];
}

let cachedTransporter: Transporter | null = null;

const getTransporter = (): Transporter | null => {
  if (cachedTransporter) return cachedTransporter;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn(
      "[email] SMTP_HOST / SMTP_USER / SMTP_PASS not set — email send disabled."
    );
    return null;
  }
  cachedTransporter = nodemailer.createTransport({
    host,
    port,
    // Port 465 = implicit TLS (secure); 587 = STARTTLS (secure: false).
    secure: port === 465,
    auth: { user, pass },
  });
  return cachedTransporter;
};

export const sendEmail = async (input: SendEmailInput): Promise<void> => {
  const transporter = getTransporter();
  if (!transporter) {
    // Graceful skip — we still want the payment flow to succeed even if
    // SMTP is misconfigured. Failures here go to logs, not the user.
    return;
  }

  const senderEmail =
    process.env.SMTP_SENDER_EMAIL ||
    process.env.SMTP_USER ||
    "noreply@askkrishnaji.com";
  const senderName = process.env.SMTP_SENDER_NAME || "Ask Krishna Ji";

  await transporter.sendMail({
    from: { name: senderName, address: senderEmail },
    to: input.to.map((t) =>
      t.name ? `"${t.name}" <${t.email}>` : t.email
    ),
    subject: input.subject,
    html: input.htmlContent,
    attachments: input.attachments,
  });
};

/**
 * Renders the premium subscription invoice HTML. Plain HTML with inline
 * styles renders correctly across Gmail, Apple Mail, Outlook, etc.
 */
export const renderPremiumInvoiceHtml = (params: {
  customerName: string;
  email: string;
  amount: string;
  txnid: string;
  paymentDate: string;
  premiumUntil: string;
}): string => {
  const {
    customerName,
    email,
    amount,
    txnid,
    paymentDate,
    premiumUntil,
  } = params;
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#FAF6EE;font-family:Arial,sans-serif;color:#3D1F0A;">
    <div style="max-width:560px;margin:0 auto;background:#FFFFFF;border-radius:16px;padding:32px;border:1px solid rgba(212,168,71,0.4);">
      <div style="text-align:center;font-size:36px;">🙏</div>
      <h1 style="text-align:center;color:#CC5500;margin:8px 0 4px;">Ask Krishna Ji</h1>
      <p style="text-align:center;color:#7A5F45;margin:0 0 24px;">Premium Subscription · Invoice</p>

      <table cellpadding="8" cellspacing="0" style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="color:#7A5F45;">Name</td><td style="text-align:right;font-weight:700;">${escapeHtml(customerName)}</td></tr>
        <tr><td style="color:#7A5F45;">Email</td><td style="text-align:right;">${escapeHtml(email)}</td></tr>
        <tr><td style="color:#7A5F45;">Order ID</td><td style="text-align:right;font-family:monospace;">${escapeHtml(txnid)}</td></tr>
        <tr><td style="color:#7A5F45;">Payment date</td><td style="text-align:right;">${escapeHtml(paymentDate)}</td></tr>
        <tr><td style="color:#7A5F45;">Valid until</td><td style="text-align:right;font-weight:700;">${escapeHtml(premiumUntil)}</td></tr>
      </table>

      <div style="background:#FBE9D6;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
        <p style="margin:0;color:#8F5429;">Premium Subscription · 1 Year</p>
        <p style="margin:8px 0 0;font-size:28px;font-weight:800;color:#CC5500;">₹${escapeHtml(amount)}</p>
      </div>

      <p style="color:#3D1F0A;line-height:1.6;">
        🌟 आपकी प्रीमियम सदस्यता सक्रिय हो गई है। अब आप विज्ञापन-रहित अनुभव का आनंद ले सकते हैं।
        कृष्ण जी की कृपा सदा बनी रहे।
      </p>

      <p style="color:#7A5F45;font-size:12px;text-align:center;margin-top:32px;">
        Questions? Reply to this email or visit askkrishnaji.com
      </p>
    </div>
  </body>
</html>`;
};

const escapeHtml = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
