"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const BULK_PRICE = Number(process.env.NEXT_PUBLIC_PRACHARAK_BULK_PRICE_INR || "500");
const MIN_QTY = Number(process.env.NEXT_PUBLIC_PRACHARAK_BULK_MIN_QTY || "5");

export default function BuyCodesPage() {
  const [qty, setQty] = useState(MIN_QTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [payuFields, setPayuFields] = useState<Record<string, string> | null>(null);
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
      setError("Network error.");
      setSubmitting(false);
    }
  };

  return (
    <div>
      <Link
        href="/pracharak-portal"
        className="text-text-secondary hover:text-text-primary text-sm"
      >
        ← Dashboard
      </Link>

      <div className="text-center my-6">
        <div className="text-4xl mb-2">🎟️</div>
        <h1 className="text-2xl font-bold mb-1">Buy Codes in Bulk</h1>
        <p className="text-text-secondary text-sm">
          Pracharak rate: ₹{BULK_PRICE} each · minimum {MIN_QTY} codes
        </p>
      </div>

      <form onSubmit={onSubmit} className="card max-w-md mx-auto space-y-5">
        <label className="block">
          <span className="text-sm font-semibold mb-1 block">
            Quantity
          </span>
          <input
            type="number"
            value={qty}
            min={MIN_QTY}
            max={500}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-full bg-bg-primary border border-saffron/30 rounded-lg px-3 py-2 text-text-primary text-lg font-bold focus:outline-none focus:border-saffron"
          />
          <p className="text-xs text-text-muted mt-1">
            Min {MIN_QTY}, max 500. Each code activates 1 year of Premium for a user.
          </p>
        </label>

        <div className="bg-bg-primary border border-gold/30 rounded-xl p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-text-secondary">
              {qty} × ₹{BULK_PRICE}
            </span>
            <span className="font-bold text-text-primary">₹{total}</span>
          </div>
          <div className="border-t border-saffron/10 mt-3 pt-3 flex items-center justify-between">
            <span className="font-bold">Total</span>
            <span className="text-2xl font-bold text-gold">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

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
          {submitting ? "Redirecting to PayU..." : `Pay ₹${total} & Get Codes`}
        </button>

        <p className="text-xs text-text-muted text-center">
          Payment is securely processed by PayU. Codes are auto-generated
          and emailed to you within 30 seconds of successful payment.
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
