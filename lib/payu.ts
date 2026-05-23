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
 * Hash formulas (PayU's official spec):
 *   request  = sha512(KEY|TXNID|AMOUNT|PRODUCTINFO|FIRSTNAME|EMAIL|||||||||||SALT)
 *   response = sha512(SALT|STATUS|||||||||||EMAIL|FIRSTNAME|PRODUCTINFO|AMOUNT|TXNID|KEY)
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
  udf1?: string;          // app uid
  udf2?: string;          // tier: "premium" | "pracharak-bulk-5" | etc.
  udf3?: string;          // optional extra
  udf4?: string;
  udf5?: string;
}

/**
 * Builds the request hash that PayU's checkout form needs.
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 */
export const buildRequestHash = (
  input: PayUOrderInput,
  key: string,
  salt: string
): string => {
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
    "",
    "",
    "",
    "",
    "",
    salt,
  ];
  const raw = parts.join("|");
  return CryptoJS.SHA512(raw).toString(CryptoJS.enc.Hex);
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
   * PayU appends an `additional_charges` field to the response (and
   * prepends it to the hash) when convenience fee / surcharge is in
   * play — most commonly with credit cards. We MUST include it in the
   * verification formula when present, otherwise the recomputed hash
   * won't match and every payment looks invalid.
   *
   * Field name varies between docs (`additionalCharges` vs
   * `additional_charges`) — we accept either at the form-parse layer
   * and normalise to this field.
   */
  additionalCharges?: string;
}

/**
 * Verifies the hash PayU sent back in the success/failure callback.
 * If this returns false, the callback should be REJECTED — could be a
 * spoofed request from someone trying to fake a payment.
 *
 * Response hash formula:
 *   sha512(salt|status|||||||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 *
 * When PayU adds convenience-fee surcharge, an `additionalCharges`
 * field is prepended:
 *   sha512(additionalCharges|salt|status|||||||||||udf5|...|key)
 */
export const verifyResponseHash = (
  cb: PayUCallback,
  salt: string
): boolean => {
  const baseParts = [
    salt,
    cb.status,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    cb.udf5 ?? "",
    cb.udf4 ?? "",
    cb.udf3 ?? "",
    cb.udf2 ?? "",
    cb.udf1 ?? "",
    cb.email,
    cb.firstname,
    cb.productinfo,
    cb.amount,
    cb.txnid,
    cb.key,
  ];
  const parts = cb.additionalCharges
    ? [cb.additionalCharges, ...baseParts]
    : baseParts;
  const hashString = parts.join("|");
  const expected = CryptoJS.SHA512(hashString).toString(CryptoJS.enc.Hex);
  const ok = timingSafeEqualHex(expected, cb.hash);
  if (!ok) {
    // Verbose diagnostic — temporary while integrating. Logs exactly
    // what we hashed (with salt masked) so a mismatch is debuggable
    // without running the salt back through Vercel logs.
    const maskedHashString = hashString.replace(salt, "***SALT***");
    console.warn("[payu] response hash mismatch", {
      txnid: cb.txnid,
      status: cb.status,
      hasAdditionalCharges: !!cb.additionalCharges,
      additionalChargesValue: cb.additionalCharges,
      expectedHashFull: expected,
      receivedHashFull: cb.hash,
      hashStringMasked: maskedHashString,
      hashStringLen: hashString.length,
    });
  }
  return ok;
};

/**
 * Constant-time hex string comparison. A plain `===` against a hash
 * leaks timing information that lets attackers brute-force one nibble
 * at a time. `crypto.timingSafeEqual` runs in time proportional only to
 * length, never short-circuiting on the first mismatch.
 *
 * Both inputs are normalised to lowercase. If lengths differ we return
 * false immediately — timingSafeEqual throws on length mismatch, so
 * the length check has to happen first anyway.
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
