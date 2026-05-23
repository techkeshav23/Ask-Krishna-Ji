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
 * Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||salt)
 */
export const buildRequestHash = (
  input: PayUOrderInput,
  key: string,
  salt: string
): string => {
  // Guardrails: catch unsafe chars at init time so a single bad
  // productinfo string can't silently break every payment in prod.
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
/**
 * Helper that returns the verification artifacts so callers can log
 * everything in a single log line when verification fails.
 */
export interface PayUHashDebug {
  ok: boolean;
  expectedHash: string;
  receivedHash: string;
  hashStringMasked: string;
  formulaVariant: string;
}

export const verifyResponseHashDebug = (
  cb: PayUCallback,
  salt: string
): PayUHashDebug => {
  // Try every known formula variant and return the first match. This
  // lets us survive PayU's published-formula disagreements between
  // their docs vs SDK examples, and tells us in the logs WHICH variant
  // matched so we can simplify later.
  const candidates = buildVerificationCandidates(cb, salt);
  for (const c of candidates) {
    const expected = CryptoJS.SHA512(c.hashString).toString(CryptoJS.enc.Hex);
    if (timingSafeEqualHex(expected, cb.hash)) {
      return {
        ok: true,
        expectedHash: expected,
        receivedHash: cb.hash,
        hashStringMasked: c.hashString.replace(salt, "***SALT***"),
        formulaVariant: c.name,
      };
    }
  }
  // No match — return the canonical variant for diagnostic logging.
  const canonical = candidates[0]!;
  const expected = CryptoJS.SHA512(canonical.hashString).toString(
    CryptoJS.enc.Hex
  );
  return {
    ok: false,
    expectedHash: expected,
    receivedHash: cb.hash,
    hashStringMasked: canonical.hashString.replace(salt, "***SALT***"),
    formulaVariant: canonical.name,
  };
};

const buildVerificationCandidates = (
  cb: PayUCallback,
  salt: string
): { name: string; hashString: string }[] => {
  // Decoded vs raw — covers HTML entities like &mdash; / &amp;.
  const fieldSets = [
    {
      tag: "raw",
      productinfo: cb.productinfo,
      firstname: cb.firstname,
      email: cb.email,
      udf1: cb.udf1 ?? "",
      udf2: cb.udf2 ?? "",
      udf3: cb.udf3 ?? "",
      udf4: cb.udf4 ?? "",
      udf5: cb.udf5 ?? "",
    },
    {
      tag: "decoded",
      productinfo: htmlDecode(cb.productinfo),
      firstname: htmlDecode(cb.firstname),
      email: htmlDecode(cb.email),
      udf1: htmlDecode(cb.udf1 ?? ""),
      udf2: htmlDecode(cb.udf2 ?? ""),
      udf3: htmlDecode(cb.udf3 ?? ""),
      udf4: htmlDecode(cb.udf4 ?? ""),
      udf5: htmlDecode(cb.udf5 ?? ""),
    },
  ];
  const candidates: { name: string; hashString: string }[] = [];
  // Amount variants — PayU sometimes strips trailing zeros or treats
  // integer amounts without the decimal portion.
  const amountVariants = [cb.amount];
  if (cb.amount.endsWith(".00")) {
    amountVariants.push(cb.amount.slice(0, -3)); // "2500.00" → "2500"
  }
  if (!cb.amount.includes(".")) {
    amountVariants.push(`${cb.amount}.00`);
  }

  const buildPrefixVariants = (
    prefix: string[],
    prefixLabel: string
  ): void => {
    for (const fs of fieldSets) {
      for (const amt of amountVariants) {
        // Brute-force pipe count between status and udf5: PayU SDKs
        // across versions ship anywhere from 5 to 11 empty fields here;
        // their docs and code disagree, so test every plausible count.
        for (let emptyCount = 4; emptyCount <= 12; emptyCount++) {
          const empties = Array(emptyCount).fill("");
          const parts = [
            ...prefix,
            cb.status,
            ...empties,
            fs.udf5, fs.udf4, fs.udf3, fs.udf2, fs.udf1,
            fs.email, fs.firstname, fs.productinfo,
            amt, cb.txnid, cb.key,
          ];
          candidates.push({
            name: `${prefixLabel}-empties${emptyCount}-${fs.tag}-amt${amt}`,
            hashString: parts.join("|"),
          });
        }
      }
    }
  };

  // Prefix variants — PayU has shipped formulas with cardType,
  // additionalCharges, or both prepended between salt and status.
  buildPrefixVariants([salt], "plain");
  buildPrefixVariants([salt, cb.additionalCharges || ""], "with-charges-empty");
  if (cb.additionalCharges) {
    buildPrefixVariants([cb.additionalCharges, salt], "charges-before-salt");
    buildPrefixVariants([salt, cb.additionalCharges], "charges-after-salt");
  }
  return candidates;
};

export const verifyResponseHash = (
  cb: PayUCallback,
  salt: string
): boolean => {
  // PayU re-encodes HTML entities in some string fields (e.g. an em-
  // dash `—` becomes `&mdash;`, `&` becomes `&amp;`) when it echoes
  // them back in the callback. But the hash on their side is computed
  // against the ORIGINAL pre-encoding values — so we must decode
  // before hashing or every callback fails as a "spoof". Init code
  // should still stick to ASCII as primary defense; this decoder is a
  // safety net for cases like a user's name containing an apostrophe.
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
    .replace(/&nbsp;/g, " ")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, "&");
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
