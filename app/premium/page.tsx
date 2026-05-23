"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PREMIUM_PRICE = process.env.NEXT_PUBLIC_PREMIUM_PRICE_INR || "999";

function PremiumCheckoutInner() {
  const params = useSearchParams();
  const prefillUid = params.get("uid") || "";
  const prefillEmail = params.get("email") || "";
  const prefillName = params.get("name") || "";
  const prefillPhone = (params.get("phone") || "").replace(/\s/g, "");
  const returnUrl = params.get("return") || "";

  const [name, setName] = useState(prefillName);
  const [email, setEmail] = useState(prefillEmail);
  const [phone, setPhone] = useState(prefillPhone);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hidden form ref we use to auto-POST to PayU after we've fetched
  // the signed order fields from our backend.
  const payuFormRef = useRef<HTMLFormElement>(null);
  const [payuFields, setPayuFields] = useState<Record<string, string> | null>(
    null
  );
  const [payuAction, setPayuAction] = useState<string>("");

  useEffect(() => {
    if (payuFields && payuFormRef.current) {
      // Submit immediately to PayU.
      payuFormRef.current.submit();
    }
  }, [payuFields]);

  // Auto-submit path: when the app launches checkout it already knows
  // the user's name/email/phone, so we can skip the form entirely and
  // go straight to PayU. Triggered only when ALL three prefills are
  // present and pass basic validation — otherwise we render the form
  // for the user to fill in / correct.
  const canAutoSubmit =
    prefillName.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(prefillEmail) &&
    /^\+?[0-9]{10,13}$/.test(prefillPhone);

  useEffect(() => {
    if (!canAutoSubmit) return;
    // Fire once on mount when we have full prefills.
    void startPayU(prefillName, prefillEmail, prefillPhone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canAutoSubmit]);

  const startPayU = async (
    nameVal: string,
    emailVal: string,
    phoneVal: string
  ) => {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/payu-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameVal,
          email: emailVal,
          phone: phoneVal,
          uid: prefillUid,
          returnUrl,
          tier: "premium-yearly",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start payment. Try again.");
        setSubmitting(false);
        return;
      }
      setPayuAction(data.action as string);
      setPayuFields(data.fields as Record<string, string>);
    } catch {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!/^\+?[0-9]{10,13}$/.test(phone.replace(/\s/g, ""))) {
      setError("Please enter a valid Indian phone number.");
      return;
    }

    await startPayU(name, email, phone);
  };

  // Auto-submit branch: show a "Redirecting to PayU" splash instead of
  // the form. Once `payuFields` lands, the hidden form auto-POSTs.
  if (canAutoSubmit && !error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="card max-w-md w-full text-center">
          <div className="text-5xl mb-4">⭐</div>
          <h1 className="text-2xl font-bold mb-3">Opening secure checkout…</h1>
          <p className="text-text-secondary mb-6">
            Connecting you to PayU for ₹{PREMIUM_PRICE} payment.
          </p>
          <div className="flex justify-center mb-2">
            <div className="w-8 h-8 border-2 border-saffron border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-xs text-text-muted mt-4">
            कृपया प्रतीक्षा करें · Don't close this page.
          </p>
          {payuFields ? (
            <form
              ref={payuFormRef}
              action={payuAction}
              method="POST"
              className="hidden"
            >
              {Object.entries(payuFields).map(([k, v]) => (
                <input key={k} name={k} defaultValue={v} type="hidden" />
              ))}
            </form>
          ) : null}
        </div>
      </main>
    );
  }

  // Manual-entry branch: someone visited /premium directly in a
  // browser (no prefills) OR the auto-submit failed. Render the form
  // with any prefills the URL provided, locking the prefilled fields
  // so we don't silently drift from the app's source of truth.
  return (
    <main className="min-h-screen px-6 py-12">
      <div className="max-w-md mx-auto">
        <Link
          href="/"
          className="text-text-secondary hover:text-text-primary text-sm"
        >
          ← Home
        </Link>

        <div className="text-center mt-4 mb-8">
          <div className="text-4xl mb-2">⭐</div>
          <h1 className="text-3xl font-bold mb-2">Go Premium</h1>
          <p className="text-text-secondary text-sm">
            Ad-free experience · Krishna Ji ki seva mein
          </p>
        </div>

        <div className="card border-gold/40 text-center mb-6">
          <p className="text-text-secondary mb-1">Annual subscription</p>
          <p className="text-4xl font-bold text-gold my-2">
            ₹{PREMIUM_PRICE}
            <span className="text-base font-normal text-text-secondary">
              {" "}/ year
            </span>
          </p>
          <p className="text-xs text-text-muted">
            One-time payment · Auto-activates in app
          </p>
        </div>

        <form onSubmit={onSubmit} className="card space-y-4">
          <label className="block">
            <span className="text-sm font-semibold mb-1 block">
              पूरा नाम / Full name *
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              readOnly={!!prefillName}
              placeholder="आपका नाम"
              className={`w-full bg-bg-primary border border-saffron/30 rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-saffron ${
                prefillName ? "opacity-70 cursor-not-allowed" : ""
              }`}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold mb-1 block">
              ईमेल / Email *
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              readOnly={!!prefillEmail}
              placeholder="you@example.com"
              autoCapitalize="none"
              className={`w-full bg-bg-primary border border-saffron/30 rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-saffron ${
                prefillEmail ? "opacity-70 cursor-not-allowed" : ""
              }`}
            />
            {prefillEmail ? (
              <p className="text-xs text-text-muted mt-1">
                Locked — payment is linked to your app account
                ({prefillEmail}).
              </p>
            ) : null}
          </label>

          <label className="block">
            <span className="text-sm font-semibold mb-1 block">
              फ़ोन / Phone *
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              readOnly={!!prefillPhone}
              placeholder="10-digit mobile"
              inputMode="tel"
              className={`w-full bg-bg-primary border border-saffron/30 rounded-lg px-3 py-2 text-text-primary placeholder:text-text-muted focus:outline-none focus:border-saffron ${
                prefillPhone ? "opacity-70 cursor-not-allowed" : ""
              }`}
            />
          </label>

          {error ? (
            <p className="text-sm text-red-300 bg-red-900/20 border border-red-500/40 rounded-lg p-3">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="btn-gold w-full"
          >
            {submitting ? "Redirecting to PayU..." : `Pay ₹${PREMIUM_PRICE}`}
          </button>

          <p className="text-xs text-text-muted text-center">
            Payment is securely processed by PayU. Your premium activates
            instantly after successful payment.
          </p>
        </form>

        {/* Hidden form auto-submitted to PayU once we have the signed
            order. We don't render the fields visibly. */}
        {payuFields ? (
          <form
            ref={payuFormRef}
            action={payuAction}
            method="POST"
            className="hidden"
          >
            {Object.entries(payuFields).map(([k, v]) => (
              <input key={k} name={k} defaultValue={v} type="hidden" />
            ))}
          </form>
        ) : null}
      </div>
    </main>
  );
}

export default function PremiumCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PremiumCheckoutInner />
    </Suspense>
  );
}
