"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PremiumFailedInner() {
  const params = useSearchParams();
  const txn = params.get("txn") || "";
  const reason = params.get("reason") || "";

  const friendlyReason = (() => {
    if (reason === "invalid") return "Payment signature could not be verified.";
    if (reason === "server") return "A server error occurred. Please try again.";
    if (txn) return "Your payment was not completed.";
    return "Payment was not completed.";
  })();

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="card max-w-md w-full text-center border-red-500/40">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-3">Payment Not Completed</h1>
        <p className="text-text-secondary mb-2">{friendlyReason}</p>
        <p className="text-text-secondary mb-6 text-sm">
          आपके खाते से कोई शुल्क नहीं काटा गया। कृपया पुनः प्रयास करें।
        </p>

        {txn ? (
          <p className="text-xs text-text-muted mb-6 font-mono">
            Order: {txn}
          </p>
        ) : null}

        <Link href="/premium" className="btn-primary inline-block w-full mb-3">
          Try Again
        </Link>
        <Link
          href="/"
          className="text-sm text-text-secondary hover:text-text-primary block"
        >
          Back to Home
        </Link>

        <p className="text-xs text-text-muted mt-6">
          If you were charged but don&apos;t see premium active in your app,
          please contact support with your Order ID.
        </p>
      </div>
    </main>
  );
}

export default function PremiumFailedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PremiumFailedInner />
    </Suspense>
  );
}
