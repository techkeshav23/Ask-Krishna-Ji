"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Danda, Lotus } from "@/components/Ornaments";

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
      window.location.href = returnDeepLink;
      return;
    }
    const t = setTimeout(() => setCountdown((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, returnDeepLink]);

  return (
    <main className="auth-shell">
      <div className="w-full max-w-md">
        <div className="foil-card relative p-10 text-center">
          <Lotus className="mx-auto mb-3 h-10 w-auto text-saffron-deep" />
          <p className="eyebrow mb-3 text-gold-deep">A Successful Offering</p>
          <h1 className="font-display text-3xl font-bold text-ink-deep sm:text-4xl">
            Premium <span className="italic text-saffron-deep">activated.</span>
          </h1>

          <div className="my-6 flex items-center justify-center gap-2 text-gold-deep">
            <span className="h-px w-12 bg-gold-deep/60" />
            <span className="text-xs">◆</span>
            <span className="h-px w-12 bg-gold-deep/60" />
          </div>

          <p className="font-deva text-lg font-semibold leading-relaxed text-ink-soft">
            🙏 कृष्ण जी की कृपा से आपकी प्रीमियम सदस्यता सक्रिय हो गई है।
          </p>
          <p className="mt-3 text-base leading-relaxed text-ink-soft">
            For the next year you will read the Gita uninterrupted, without a
            single sponsor message between chapters.
          </p>

          {txn ? (
            <p className="mt-6 font-mono text-xs text-ink-fade">
              Order · {txn}
            </p>
          ) : null}

          <div className="mt-8">
            {returnDeepLink ? (
              <>
                <p className="mb-3 text-sm italic text-ink-soft">
                  Opening the app in {countdown}s…
                </p>
                <a href={returnDeepLink} className="btn-solid btn-solid--saffron">
                  <Danda className="text-gold-soft" />
                  Open the App Now
                </a>
              </>
            ) : (
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-solid btn-solid--saffron"
              >
                <Danda className="text-gold-soft" />
                Open the App
              </a>
            )}
          </div>

          <Link
            href="/"
            className="mt-6 inline-block text-sm font-semibold text-ink-soft transition-colors hover:text-saffron-deep"
          >
            ← Return to home
          </Link>

          <p className="form-help mt-8 border-t border-ink/15 pt-5">
            A copy of your invoice has been sent to your email.
          </p>
        </div>
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
