# Ask Krishna Ji — Website

The companion web app for the [Ask Krishna Ji](https://play.google.com/store/apps/details?id=com.askkrishnaji.app) mobile app.

Built with **Next.js 14** (App Router) + **Tailwind** + **Firebase Admin SDK** + **PayU** + **Nodemailer SMTP** (Gmail App Password by default — easily swappable to any SMTP provider).

---

## What this site does

| Page | Purpose |
|------|---------|
| `/` | Landing page — pitch + Play Store link + entry points |
| `/premium` | Premium subscription checkout (₹999/year via PayU) |
| `/premium-success` | Post-payment success — deep-links back into the app |
| `/premium-failed` | Friendly failure page with retry CTA |
| `/pracharak` | Pracharak (promoter) signup form — free |

### API routes
| Route | Purpose |
|-------|---------|
| `POST /api/pracharak-signup` | Stores new pracharak applications in Firestore (`pracharaks/{id}`) |
| `POST /api/payu-init` | Signs a PayU order, returns checkout fields |
| `POST /api/payu-webhook` | Receives PayU success/failure → updates Firestore user record + sends invoice email |

---

## Local development

```bash
cd website
npm install
cp .env.example .env.local
# Fill in real values in .env.local (see below)
npm run dev
```

Site runs at `http://localhost:3001`.

### Required environment variables

Copy `.env.example` to `.env.local` and fill:

| Var | Where to get |
|-----|--------------|
| `PAYU_MERCHANT_KEY`, `PAYU_MERCHANT_SALT` | https://merchant.payu.in/account/api-credentials |
| `PAYU_BASE_URL` | `https://test.payu.in` for testing, `https://secure.payu.in` for production |
| `FIREBASE_SERVICE_ACCOUNT_JSON` | Firebase Console → Project Settings → Service Accounts → "Generate new private key". **Paste the full JSON as a single-line string.** |
| `SMTP_HOST`, `SMTP_PORT` | Gmail = `smtp.gmail.com`, port `587` |
| `SMTP_USER` | The sending Gmail address |
| `SMTP_PASS` | 16-char [Gmail App Password](https://myaccount.google.com/apppasswords) (NOT your regular password) |
| `SMTP_SENDER_EMAIL`, `SMTP_SENDER_NAME` | What recipients see in "From" |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for PayU return URLs + email links) |

---

## Deployment (Vercel)

1. Push this folder to a GitHub repo (or use the existing project repo with `website/` as the root).
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo.
3. Set **Root Directory** to `website/`.
4. Add all environment variables from `.env.example` in Vercel's project settings.
5. Deploy.
6. Add your custom domain (`askkrishnaji.com`) in Vercel → Domains.

Vercel free tier is enough until you cross ~100K monthly page views.

---

## Email / SMTP setup

### Quickest: Gmail App Password (free, 5 min setup)

1. Use a dedicated Gmail account for sending (e.g., `askkrishnaji.invoices@gmail.com`).
2. Enable **2-Step Verification** on the Google account (Account → Security).
3. Visit **https://myaccount.google.com/apppasswords**
4. Select app: "Mail", device: "Other (Custom)" → name it `Ask Krishna Ji`.
5. Google generates a 16-character password — copy it (you won't see it again).
6. In `.env.local`:
   ```env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=askkrishnaji.invoices@gmail.com
   SMTP_PASS=<the 16-char app password>
   SMTP_SENDER_EMAIL=noreply@askkrishnaji.com
   SMTP_SENDER_NAME=Ask Krishna Ji
   ```
7. **Gmail limit**: ~500 emails/day per account. Plenty for launch — switch to Brevo SMTP, SendGrid SMTP, or your domain SMTP later if you cross that.

### Switching SMTP providers later

Code is provider-agnostic. Just change `SMTP_HOST/PORT/USER/PASS` env vars:

| Provider | SMTP_HOST | Port | Notes |
|----------|-----------|------|-------|
| Gmail | `smtp.gmail.com` | 587 | Free 500/day |
| Brevo SMTP | `smtp-relay.brevo.com` | 587 | Free 300/day, dedicated reputation |
| SendGrid SMTP | `smtp.sendgrid.net` | 587 | Free 100/day |
| Amazon SES | `email-smtp.<region>.amazonaws.com` | 587 | Cheapest at scale ($0.10 / 1000) |
| Custom domain (cPanel) | `mail.askkrishnaji.com` | 465 | Best branding, depends on hosting |

### What about PayU's own email?

PayU sends its **own** payment confirmation email automatically — that's transactional proof. Our SMTP invoice is the *branded* one with Krishna Ji theme + premium expiry. Both go to the user; they complement each other.

If you want to disable our branded invoice (only PayU's email), leave `SMTP_PASS` blank — the code gracefully skips and logs a warning.

---

## PayU setup

### 1. Register
Sign up at https://merchant.payu.in → complete KYC (business proof, PAN, bank details).

### 2. Get credentials
After approval (~1-2 business days), go to **Account → API Credentials**:
- Copy `Merchant Key` → `PAYU_MERCHANT_KEY`
- Copy `Merchant Salt` → `PAYU_MERCHANT_SALT`

### 3. Test first
Use https://test.payu.in with test credentials. Test card: `5123 4567 8901 2346` (any CVV, future expiry).

### 4. Configure surl/furl (success/failure URLs)
In PayU dashboard → **Account → My Account → Surl/Furl Settings**:
- Success: `https://askkrishnaji.com/api/payu-webhook?result=success`
- Failure: `https://askkrishnaji.com/api/payu-webhook?result=failure`

### 5. Flip to production
Change `PAYU_BASE_URL` to `https://secure.payu.in` and swap the merchant key/salt.

---

## Firestore schema

The webhook writes to these collections:

### `orders/{txnid}`
Every PayU transaction (success + failure) — accounting record.
```ts
{
  txnid: string;          // unique
  mihpayid: string | null; // PayU's internal ID
  status: string;          // "success" | "failure" | etc
  amount: string;          // "999.00"
  productinfo: string;
  firstname: string;
  email: string;
  uid: string | null;      // app user UID
  tier: string;            // "premium-yearly" | "pracharak-bulk-5" | ...
  mode: string | null;     // payment method
  bankRef: string | null;
  paidAt: number;          // ms epoch
  premiumUntil: number;    // ms epoch when premium expires
}
```

### `users/{uid}` (merged into existing doc)
```ts
{
  isPremium: boolean;
  premiumUntil: number;    // ms epoch
  premiumActivatedAt: number;
  premiumSource: "direct" | "code" | "admin";
  premiumLastTxnId: string;
}
```

### `pendingPremiumActivations/{autoId}`
Fallback record when payment email doesn't match any existing user.
The app reads this on first sign-in and claims the premium activation.
```ts
{
  email: string;
  premiumUntil: number;
  txnid: string;
  createdAt: number;
  claimed: boolean;
}
```

### `pracharaks/{autoId}`
Pracharak signup applications + approved profiles.
```ts
{
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  emailLower: string;      // for case-insensitive dedup
  city: string;
  state: string;
  reference: string;
  status: "pending" | "approved" | "rejected";
  totalCodesPurchased: number;
  totalCodesRedeemed: number;
  createdAt: number;
  updatedAt: number;
}
```

---

## Admin dashboard (`/admin`)

Email + password login (gated by `ADMIN_EMAILS` env var allowlist).
Bootstrap with `INITIAL_ADMIN_PASSWORD` for the first login, then
clear the env var.

Pages:
- `/admin` — overview cards (pending pracharaks, orders, codes, revenue)
- `/admin/pracharaks` — approve/reject applicants, auto-emails login on approval
- `/admin/orders` — every PayU transaction, filterable by status
- `/admin/codes` — issued codes + generator form (manual issuance to any approved pracharak)

API:
- `POST /api/admin/pracharaks/[id]` — body `{ action: "approve" | "reject" | "resend" }`
- `POST /api/admin/codes/generate` — body `{ pracharakId, qty }`

## Pracharak portal (`/pracharak-portal`)

Self-service portal for approved pracharaks.

Pages:
- `/pracharak-portal/login` — email + password (admin-issued on approval)
- `/pracharak-portal` — dashboard (purchased / redeemed / available counts + recent codes)
- `/pracharak-portal/buy-codes` — PayU checkout to buy more codes (₹500 × N, min 5)

API:
- `POST /api/pracharak/buy-codes-init` — signs PayU bulk-purchase order

The shared PayU webhook (`/api/payu-webhook`) branches on the `udf2`
tier marker to handle both premium subscription payments and pracharak
bulk-code purchases.

## App code redemption (`/api/redeem-code`)

Called by the mobile app's Profile screen when a user enters a code.

```http
POST /api/redeem-code
{
  "code": "AKJ-XXXX-YYYY-ZZZZ",
  "uid": "firebase-uid",
  "email": "user@example.com"
}
```

Atomic via a Firestore transaction so concurrent redemption attempts
on the same code can't both succeed. Returns `premiumUntil` on success.

## Daily premium expiry checker (Cloud Function)

`functions/src/handlers/dailyPremiumExpiryCheck.ts` — a scheduled
function that runs daily at 00:05 IST. Sweeps `users` where
`isPremium === true && premiumUntil < now` and flips
`isPremium = false`. Up to 500 expirations per run; for higher
scale, paginate.

---

## Security notes

1. `FIREBASE_SERVICE_ACCOUNT_JSON` and `PAYU_MERCHANT_SALT` are **server-only secrets**. Never expose in client code.
2. The PayU webhook **always** verifies the response hash before trusting the callback. Without this, anyone could fake a payment success.
3. `pracharak-signup` does basic validation but accepts any input — for v2, add CAPTCHA + rate limiting.
4. Firestore rules should be tight — clients should **never** be able to write `isPremium` directly (only Cloud Functions / Admin SDK).

---

## Mapping back to the mobile app

The mobile app at [com.askkrishnaji.app](https://play.google.com/store/apps/details?id=com.askkrishnaji.app):

1. Profile screen → "Upgrade to Premium" button → opens
   `https://askkrishnaji.com/premium?uid=ABC&email=foo@bar&return=askkrishnaji://premium-success`
2. After payment, this site redirects to `askkrishnaji://premium-success`
3. Profile screen → "Have a code? Redeem" → app calls `/api/redeem-code` (Phase 2)
4. Home screen → "Geeta Ke Pracharak Bane" card → opens `https://askkrishnaji.com/pracharak`
