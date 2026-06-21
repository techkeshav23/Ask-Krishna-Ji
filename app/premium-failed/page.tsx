"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function PremiumFailedInner() {
  const params = useSearchParams();
  const txn = params.get("txn") || "";
  const reason = params.get("reason") || "";

  const friendlyReason = (() => {
    if (reason === "invalid")
      return "The payment signature could not be verified.";
    if (reason === "server")
      return "A server error occurred. Please try again.";
    if (txn) return "Your payment was not completed.";
    return "The payment was not completed.";
  })();

  return (
    <main className="auth-shell">
      <div className="w-full max-w-md">
        <div className="form-card text-center">
          {/* Alert icon — minimal, in sindoor red */}
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center border-2 border-sindoor">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="text-sindoor"
              aria-hidden="true"
            >
              <line x1="12" y1="7" x2="12" y2="13" />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>
          </div>

          <p className="eyebrow mb-3 text-sindoor">Payment Not Completed</p>
          <h1 className="font-display text-3xl font-bold text-ink-deep">
            Something went wrong
          </h1>

          <p className="mt-5 text-base leading-relaxed text-ink-soft">
            {friendlyReason}
          </p>
          <p className="mt-2 font-deva text-base font-semibold text-ink-soft">
            आपके खाते से कोई शुल्क नहीं काटा गया। कृपया पुनः प्रयास करें।
          </p>

          {txn ? (
            <p className="mt-6 font-mono text-xs text-ink-fade">
              Order · {txn}
            </p>
          ) : null}

          <div className="mt-8">
            <Link href="/premium" className="btn-solid">
              Try Again
            </Link>
          </div>

          <Link
            href="/"
            className="mt-5 inline-block text-sm font-semibold text-ink-soft transition-colors hover:text-saffron-deep"
          >
            ← Return to home
          </Link>

          <p className="form-help mt-8 border-t border-ink/15 pt-5">
            If you were charged but premium is not active in the app, please
            contact{" "}
            <a
              href="mailto:hello@askkrishnaji.com"
              className="form-link"
            >
              hello@askkrishnaji.com
            </a>{" "}
            with your Order ID.
          </p>
        </div>
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
