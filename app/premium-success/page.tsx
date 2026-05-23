"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const PLAY_STORE_URL =
  process.env.APP_PLAY_STORE_URL ||
  "https://play.google.com/store/apps/details?id=com.askkrishnaji.app";

function PremiumSuccessInner() {
  const params = useSearchParams();
  const txn = params.get("txn") || "";
  const returnDeepLink = params.get("return") || "";
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!returnDeepLink) return;
    if (countdown <= 0) {
      // Best-effort attempt to deep-link back into the app. Most browsers
      // require a real user gesture; on auto-open this may show a prompt
      // ("Open in app?") which is acceptable UX.
      window.location.href = returnDeepLink;
      return;
    }
    const t = setTimeout(() => setCountdown((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, returnDeepLink]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="card max-w-md w-full text-center border-gold/40">
        <div className="text-6xl mb-4">🌟</div>
        <h1 className="text-3xl font-bold mb-3 text-gold">
          Premium Activated!
        </h1>
        <p className="text-text-secondary mb-6 leading-relaxed">
          🙏 कृष्ण जी की कृपा से आपकी प्रीमियम सदस्यता सक्रिय हो गई है।
          आपको आगामी 1 वर्ष तक विज्ञापन-रहित अनुभव मिलेगा।
        </p>

        {txn ? (
          <p className="text-xs text-text-muted mb-6 font-mono">
            Order: {txn}
          </p>
        ) : null}

        {returnDeepLink ? (
          <>
            <p className="text-sm text-text-secondary mb-2">
              Opening app in {countdown}s...
            </p>
            <a
              href={returnDeepLink}
              className="btn-gold inline-block w-full mb-3"
            >
              Open App Now
            </a>
          </>
        ) : (
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold inline-block w-full mb-3"
          >
            Open App
          </a>
        )}

        <Link
          href="/"
          className="text-sm text-text-secondary hover:text-text-primary block"
        >
          Back to Home
        </Link>

        <p className="text-xs text-text-muted mt-6">
          A copy of your invoice has been sent to your email.
        </p>
      </div>
    </main>
  );
}

export default function PremiumSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <PremiumSuccessInner />
    </Suspense>
  );
}
