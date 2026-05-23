import crypto from "crypto";

/**
 * Subscription-code helpers.
 *
 * Code format: AKJ-XXXX-YYYY-ZZZZ
 *   - AKJ prefix for branding + quick visual ID
 *   - 12 char body, base32 (Crockford) over [0-9 A-Z minus I L O U]
 *   - Split by hyphens for readability
 *
 * Crockford base32 avoids easily-confused chars (1/I, 0/O) so when a
 * user reads a code over the phone it survives the transcription.
 */

const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"; // Crockford base32 (32 chars)

const randomChar = (): string => {
  // crypto.randomInt with the alphabet length keeps the distribution
  // uniform — no modulo bias.
  const idx = crypto.randomInt(0, ALPHABET.length);
  return ALPHABET[idx]!;
};

const randomBlock = (size = 4): string => {
  let out = "";
  for (let i = 0; i < size; i++) out += randomChar();
  return out;
};

/**
 * Generates a unique code. Caller should still check Firestore for
 * existence — astronomically unlikely to collide but better safe.
 * 32^12 = ~10^18 possibilities, vs ~thousands of codes expected.
 */
export const generateCode = (): string => {
  return `AKJ-${randomBlock()}-${randomBlock()}-${randomBlock()}`;
};

/** Canonicalise a code typed by a human: uppercase, strip spaces/hyphens, re-hyphenate. */
export const normalizeCode = (raw: string): string => {
  const clean = raw.toUpperCase().replace(/[^0-9A-Z]/g, "");
  // Expected length: "AKJ" (3) + 12 = 15. Anything else is rejected upstream.
  if (clean.length !== 15) return clean;
  return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7, 11)}-${clean.slice(11, 15)}`;
};

export const isValidCodeFormat = (code: string): boolean => {
  return /^AKJ-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/.test(code);
};
