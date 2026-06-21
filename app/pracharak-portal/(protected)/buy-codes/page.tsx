"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Danda } from "@/components/Ornaments";

const BULK_PRICE = Number(
  process.env.NEXT_PUBLIC_PRACHARAK_BULK_PRICE_INR || "500"
);
const MIN_QTY = Number(process.env.NEXT_PUBLIC_PRACHARAK_BULK_MIN_QTY || "5");

export default function BuyCodesPage() {
  const [qty, setQty] = useState(MIN_QTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [payuFields, setPayuFields] = useState<Record<string, string> | null>(
    null
  );
  const [payuAction, setPayuAction] = useState<string>("");
  const payuFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (payuFields && payuFormRef.current) {
      payuFormRef.current.submit();
    }
  }, [payuFields]);

  const total = qty * BULK_PRICE;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (qty < MIN_QTY) {
      setError(`Minimum quantity is ${MIN_QTY}.`);
      return;
    }
    if (qty > 500) {
      setError("Maximum 500 codes per order.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/pracharak/buy-codes-init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not start payment.");
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

  const presets = [MIN_QTY, 10, 25, 50];

  return (
    <div className="mx-auto max-w-xl">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          href="/pracharak-portal"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-saffron-deep"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M14 8 H3 M7 4 L3 8 L7 12" />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 text-center">
        <span className="eyebrow text-gold-deep">Bulk Codes</span>
        <h1 className="mt-2 font-display text-display-md font-bold text-balance text-ink-deep">
          Buy codes for{" "}
          <span className="italic text-saffron-deep">your sangh.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
          Pracharak rate:{" "}
          <strong className="text-ink-deep">₹{BULK_PRICE} per code</strong> ·
          minimum{" "}
          <strong className="text-ink-deep">{MIN_QTY} codes</strong> per order.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="form-card">
        {/* Quick-select chips */}
        <div className="mb-6">
          <label className="form-label">Choose Quantity</label>
          <div className="mb-3 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setQty(p)}
                className={`border px-4 py-1.5 font-display text-base font-semibold transition-colors ${
                  qty === p
                    ? "border-saffron-deep bg-saffron-deep text-parchment"
                    : "border-ink/25 bg-transparent text-ink-soft hover:border-saffron-deep hover:text-saffron-deep"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setQty(100)}
              className={`border px-4 py-1.5 font-display text-base font-semibold transition-colors ${
                qty >= 100
                  ? "border-saffron-deep bg-saffron-deep text-parchment"
                  : "border-ink/25 bg-transparent text-ink-soft hover:border-saffron-deep hover:text-saffron-deep"
              }`}
            >
              100+
            </button>
          </div>
          <input
            id="qty"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={qty === 0 ? "" : String(qty)}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "");
              const normalized = digits.replace(/^0+(?=\d)/, "");
              setQty(normalized === "" ? 0 : Number(normalized));
            }}
            onBlur={() => {
              if (qty < MIN_QTY) setQty(MIN_QTY);
              if (qty > 500) setQty(500);
            }}
            className="form-input text-center font-display text-3xl font-bold"
          />
          <span className="form-help">
            Type any quantity from {MIN_QTY} to 500. Each code activates 1 year
            of Premium for one user.
          </span>
        </div>

        {/* Total card */}
        <div className="my-6 border border-gold-deep/40 bg-parchment/50 p-5">
          <div className="mb-3 flex items-center justify-between text-base">
            <span className="font-medium text-ink-soft">
              {qty} × ₹{BULK_PRICE}
            </span>
            <span className="font-display text-lg font-bold text-ink">
              ₹{(qty * BULK_PRICE).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="flex items-end justify-between border-t border-gold-deep/40 pt-3">
            <span className="eyebrow text-gold-deep">Total</span>
            <span className="font-display text-4xl font-bold text-ink-deep">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {error ? (
          <div role="alert" className="form-alert mb-5">
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="btn-solid btn-solid--saffron"
        >
          {submitting ? (
            <>
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-parchment border-t-transparent" />
              Redirecting to PayU…
            </>
          ) : (
            <>
              <Danda className="text-gold-soft" />
              Pay ₹{total.toLocaleString("en-IN")} &amp; Get Codes
            </>
          )}
        </button>

        <p className="form-help mt-4 text-center">
          Securely processed by PayU. Codes are auto-generated and emailed to
          you within 30 seconds of a successful payment.
        </p>
      </form>

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
  );
}
