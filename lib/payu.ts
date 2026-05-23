import crypto from "crypto";
import CryptoJS from "crypto-js";

/**
 * PayU "Bolt" / Hosted-Checkout helper.
 *
 * Flow:
 *   1. Server generates a deterministic SHA-512 hash from the order
 *      details + merchant salt.
 *   2. Client submits a form to PayU's checkout URL with all fields
 *      including the hash.
 *   3. PayU presents the payment UI, user pays, PayU POSTs back to
 *      `surl` (success) or `furl` (failure) with a response hash.
 *   4. We verify the response hash to confirm the callback is genuine.
 *
 * Hash formulas:
 *   request  = sha512(KEY|TXNID|AMOUNT|PRODUCTINFO|FIRSTNAME|EMAIL|UDF1|UDF2|UDF3|UDF4|UDF5||||||SALT)
 *   response = sha512(SALT|STATUS||||||UDF5|UDF4|UDF3|UDF2|UDF1|EMAIL|FIRSTNAME|PRODUCTINFO|AMOUNT|TXNID|KEY)
 *
 * Note on the response formula: PayU's docs and various SDK examples
 * disagree on the empty-pipe count between status and udf5 (claims
 * range from 5 to 11). The 5-empty version (six pipes) is what this
 * merchant account actually uses — verified by brute-force matching
 * against a live successful transaction. If PayU silently changes the
 * formula in future, `assertPayuSafe` + diagnostic logs in the
 * webhook will surface it loudly.
 */

export interface PayUOrderInput {
  txnid: string;          // unique per order, 25 char max
  amount: string;         // e.g. "999.00"
  productinfo: string;    // short label e.g. "Ask Krishna Ji Premium"
  firstname: string;
  email: string;
  phone: string;
  surl: string;           // success callback URL
  furl: string;           // failure callback URL
  // Optional user-defined fields (passed back unchanged in callback).
  // We use these to carry app UID + tier so the webhook can attribute
  // the payment without a separate lookup.
  udf1?: string;          // app uid or pracharak id
  udf2?: string;          // tier: "premium-yearly" | "pracharak-bulk-5" | etc.
  udf3?: string;          // optional extra (e.g. return deep link)
  udf4?: string;          // optional extra (e.g. bulk quantity)
  udf5?: string;
}

/**
 * Characters PayU silently rewrites in echoed callback fields,
 * breaking hash verification because the rewrite happens AFTER they
 * computed their hash against the original. Discovered via diagnostic
 * logs from a bulk-purchase test where `(Pracharak Bulk)` came back
 * as ` Pracharak Bulk ` and every payment then failed as a "spoof."
 *
 * Restricting init-time strings to the safe set is the only durable
 * fix — encoding-aware verification can't reverse a substitution
 * that already lost the original chars.
 */
const PAYU_UNSAFE_CHARS = /[()<>{}\[\]"'`\\&]/g;

const assertPayuSafe = (value: string, fieldName: string): void => {
  if (PAYU_UNSAFE_CHARS.test(value)) {
    throw new Error(
      `[payu] ${fieldName} contains characters PayU rewrites in callbacks (one of: () <> {} [] " ' \` \\ &) — these break hash verification. Got: ${JSON.stringify(value)}`
    );
  }
};

/**
 * Builds the request hash that PayU's checkout form needs.
 */
export const buildRequestHash = (
  input: PayUOrderInput,
  key: string,
  salt: string
): string => {
  assertPayuSafe(input.productinfo, "productinfo");
  assertPayuSafe(input.firstname, "firstname");
  const parts = [
    key,
    input.txnid,
    input.amount,
    input.productinfo,
    input.firstname,
    input.email,
    input.udf1 ?? "",
    input.udf2 ?? "",
    input.udf3 ?? "",
    input.udf4 ?? "",
    input.udf5 ?? "",
    "", "", "", "", "",   // 5 reserved empties before salt
    salt,
  ];
  return CryptoJS.SHA512(parts.join("|")).toString(CryptoJS.enc.Hex);
};

export interface PayUCallback {
  status: string;
  email: string;
  firstname: string;
  productinfo: string;
  amount: string;
  txnid: string;
  key: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  hash: string; // PayU's hash; we re-derive and compare
  mihpayid?: string;
  mode?: string;
  bank_ref_num?: string;
  bankcode?: string;
  /**
   * PayU prepends `additional_charges` to the response-hash formula
   * when convenience fee / surcharge is in play (common on credit
   * cards). Field name varies between docs (`additionalCharges` vs
   * `additional_charges`) so the webhook accepts either at the form-
   * parse layer and normalises to this canonical field.
   */
  additionalCharges?: string;
}

/**
 * Verifies the hash PayU sent back in the success/failure callback.
 * Returns false if mismatch — caller should reject as a possible spoof.
 *
 * Two layers of forgiveness to survive PayU's quirks:
 *   1. Echoed string fields (productinfo, firstname, email, udfs) get
 *      HTML-decoded — PayU sometimes rewrites `—` → `&mdash;`, `&` →
 *      `&amp;` etc., but signs against the original.
 *   2. additionalCharges is prepended to the formula when present.
 */
export const verifyResponseHash = (
  cb: PayUCallback,
  salt: string
): boolean => {
  const baseParts = [
    salt,
    cb.status,
    "", "", "", "", "",   // 5 empties between status and udf5
    htmlDecode(cb.udf5 ?? ""),
    htmlDecode(cb.udf4 ?? ""),
    htmlDecode(cb.udf3 ?? ""),
    htmlDecode(cb.udf2 ?? ""),
    htmlDecode(cb.udf1 ?? ""),
    htmlDecode(cb.email),
    htmlDecode(cb.firstname),
    htmlDecode(cb.productinfo),
    cb.amount,
    cb.txnid,
    cb.key,
  ];
  const parts = cb.additionalCharges
    ? [cb.additionalCharges, ...baseParts]
    : baseParts;
  const expected = CryptoJS.SHA512(parts.join("|")).toString(CryptoJS.enc.Hex);
  return timingSafeEqualHex(expected, cb.hash);
};

/**
 * Decode the small set of HTML entities PayU has been observed to
 * inject into echoed fields. Numeric entities (`&#nn;`, `&#xHH;`) and
 * the named entities below cover ~all real-world cases. `&amp;` runs
 * LAST so we don't accidentally double-decode something like
 * `&amp;mdash;` (which should resolve to literal `&mdash;`, not `—`).
 */
const htmlDecode = (s: string): string => {
  if (!s) return s;
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, "&");
};

/**
 * Constant-time hex string comparison. A plain `===` against a hash
 * leaks timing information that lets attackers brute-force one nibble
 * at a time. `crypto.timingSafeEqual` runs in time proportional only to
 * length, never short-circuiting on the first mismatch.
 */
const timingSafeEqualHex = (a: string, b: string): boolean => {
  const aLow = a.toLowerCase();
  const bLow = b.toLowerCase();
  if (aLow.length !== bLow.length) return false;
  try {
    return crypto.timingSafeEqual(
      Buffer.from(aLow, "utf8"),
      Buffer.from(bLow, "utf8")
    );
  } catch {
    return false;
  }
};

/** Returns the PayU checkout base URL (test vs prod) for this environment. */
export const payuCheckoutUrl = (): string => {
  const base = process.env.PAYU_BASE_URL || "https://test.payu.in";
  return `${base}/_payment`;
};

/** Generate a unique-enough transaction ID. PayU caps at 25 chars. */
export const generateTxnId = (prefix = "AKJ"): string => {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `${prefix}${ts}${rand}`.slice(0, 25);
};
