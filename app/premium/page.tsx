import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import {
  ChapterMark,
  CornerFlourish,
  Danda,
  DiamondRule,
} from "@/components/Ornaments";

/**
 * /premium — a deliberate single-channel bridge page.
 *
 * Premium subscriptions are sold exclusively through Google Play Billing.
 * The earlier PayU consumer flow on this page was retired to remove the
 * email-matching risk: a user paying on the web with one email but signed
 * into the app with another (or signed in via phone OTP with no email)
 * would never see their premium activate, requiring manual support.
 *
 * The PayU webhook + Pracharak bulk-codes path remain wired up under
 * /api/payu-webhook and /pracharak-portal; only this consumer premium
 * page redirects users to the Play Store.
 */

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.askkrishnaji.app";

export const metadata: Metadata = {
  title: "Premium — Ask Krishna Ji",
  description:
    "Ask Krishna Ji Premium is offered through the Play Store. Tap to open Google Play and subscribe.",
};

export default function PremiumBridgePage() {
  return (
    <>
      <Nav />
      <main className="relative">
        <section className="relative overflow-hidden py-14 lg:py-20">
          <div className="mx-auto max-w-canvas px-6 lg:px-10">
            <div className="mx-auto max-w-3xl">
              {/* Chapter eyebrow */}
              <div className="mb-6 flex items-center justify-center gap-3 text-gold-deep">
                <ChapterMark className="h-5 w-auto" />
                <span className="eyebrow">A Note on Membership</span>
                <ChapterMark className="h-5 w-auto" />
              </div>

              {/* Display headline */}
              <h1 className="mb-6 text-center font-display text-display-lg font-bold text-balance text-ink-deep">
                Premium is offered through the{" "}
                <span className="italic text-saffron-deep">Play Store.</span>
              </h1>

              {/* Lede */}
              <p className="mx-auto mb-3 max-w-xl text-center text-xl font-medium leading-relaxed text-ink-soft lg:text-2xl">
                Tap below to open Google Play and subscribe. The membership
                activates inside the app as soon as the purchase clears —
                no codes, no waiting, no email matching to get wrong.
              </p>
              <p className="mx-auto mb-8 max-w-xl text-center font-deva text-lg font-semibold text-ink-soft lg:text-xl">
                सदस्यता Play Store के माध्यम से उपलब्ध है।
              </p>

              {/* Centred foil card */}
              <div className="foil-card relative mx-auto max-w-xl p-10 text-center lg:p-8">
                <CornerFlourish className="absolute left-2 top-2 h-7 w-7 text-gold-deep" />
                <CornerFlourish flip className="absolute right-2 top-2 h-7 w-7 text-gold-deep" />
                <CornerFlourish className="absolute bottom-2 left-2 h-7 w-7 rotate-180 text-gold-deep" />
                <CornerFlourish flip className="absolute bottom-2 right-2 h-7 w-7 rotate-180 text-gold-deep" />

                <p className="eyebrow mb-4 text-gold-deep">
                  <Danda className="mr-1.5 text-gold-deep" />
                  Pilgrim's Path
                  <Danda className="ml-1.5 text-gold-deep" />
                </p>
                <p className="font-display text-3xl font-bold text-ink-deep">
                  Ad-free reading
                </p>
                <p className="mt-1 font-deva text-base font-semibold text-ink-soft">
                  बिना विज्ञापन, बिना रुकावट
                </p>

                <div className="my-6 flex items-center justify-center gap-2 text-gold-deep">
                  <span className="h-px w-12 bg-gold-deep/60" />
                  <span className="text-xs">◆</span>
                  <span className="h-px w-12 bg-gold-deep/60" />
                </div>

                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-architect"
                >
                  <svg
                    width="16"
                    height="18"
                    viewBox="0 0 16 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    aria-hidden="true"
                  >
                    <path d="M1 1 L13 9 L1 17 Z" />
                    <path d="M1 1 L10 12" />
                    <path d="M1 17 L10 6" />
                  </svg>
                  Open on Google Play
                </a>

                <p className="mt-6 text-sm italic text-ink-fade">
                  Open the app and tap{" "}
                  <em className="not-italic font-semibold text-ink-soft">
                    Become a Member
                  </em>
                  &nbsp;to complete the purchase. Activation is instant.
                </p>
              </div>

              {/* Why Play Store — short editorial reassurance */}
              <div className="mx-auto mt-10 max-w-2xl">
                <div className="mb-8 flex items-center justify-center text-gold-deep">
                  <DiamondRule className="w-full max-w-md" />
                </div>

                <h2 className="mb-6 text-center font-display text-2xl font-bold text-ink-deep lg:text-3xl">
                  Why through the Play Store?
                </h2>

                <ul className="mx-auto max-w-xl space-y-4 text-[1.05rem] leading-relaxed text-ink-soft">
                  <li className="flex items-start gap-4">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-saffron-deep" />
                    <span>
                      <strong className="text-ink-deep">Activation is automatic.</strong>{" "}
                      The purchase is tied directly to your app account — no
                      separate code to redeem, no email matching to get wrong.
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-saffron-deep" />
                    <span>
                      <strong className="text-ink-deep">Refunds are Google's responsibility.</strong>{" "}
                      Any billing issue can be raised inside the Play Store and
                      Google handles the resolution.
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rotate-45 bg-saffron-deep" />
                    <span>
                      <strong className="text-ink-deep">UPI, cards, net-banking — all supported</strong>{" "}
                      inside Google Play. The same options you already use for
                      other apps.
                    </span>
                  </li>
                </ul>

                <p className="mt-12 text-center">
                  <Link
                    href="/"
                    className="font-display text-base font-semibold text-ink-soft underline decoration-gold-deep decoration-1 underline-offset-4 transition-colors hover:text-saffron-deep"
                  >
                    ← Return to the home page
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
