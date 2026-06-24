import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ChapterMark, Danda, DiamondRule, Lotus } from "@/components/Ornaments";

/**
 * /refund — Refund, Cancellation & Transfer Policy.
 *
 * Mirrors the structure of /terms and /privacy so the three legal docs
 * read as paired documents. Content provided verbatim by the client on
 * 24 June 2026.
 *
 * To update: edit SECTIONS array + bump LAST_UPDATED. Markup is the
 * same numbered-section pattern (LegalSection wrapper) used elsewhere.
 */

const LAST_UPDATED = "24 June 2026";
const CONTACT_EMAIL = "askkrishnaji@gmail.com";

type Section = {
  number: string;
  title: string;
  body: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    number: "1",
    title: "Subscription Purchases",
    body: (
      <p>
        Ask Krishna Ji offers annual premium subscriptions that provide access
        to premium features and an ad-free experience. All subscriptions are
        valid for the duration specified at the time of purchase.
      </p>
    ),
  },
  {
    number: "2",
    title: "Geeta Pracharak Purchases",
    body: (
      <p>
        Under the Geeta Pracharak Program, users may purchase a minimum of
        five (5) annual subscriptions at a discounted rate for gifting or
        distribution purposes.
      </p>
    ),
  },
  {
    number: "3",
    title: "No Refund Policy",
    body: (
      <>
        <p>
          All purchases made through Ask Krishna Ji, including but not limited
          to Premium Subscriptions and Geeta Pracharak Subscriptions, are
          final.
        </p>
        <p>
          Once a purchase has been successfully completed,{" "}
          <strong>no refund, whether full or partial, will be issued</strong>{" "}
          under any circumstances, including but not limited to:
        </p>
        <ul className="legal-list">
          <li>Change of mind</li>
          <li>Accidental purchase</li>
          <li>Non-usage of the service</li>
          <li>Partial usage of the subscription period</li>
          <li>Dissatisfaction after activation</li>
        </ul>
      </>
    ),
  },
  {
    number: "4",
    title: "No Cancellation Policy",
    body: (
      <>
        <p>
          All subscriptions and Geeta Pracharak purchases are non-cancellable.
        </p>
        <p>
          Once a subscription or subscription package has been purchased and
          activated, it cannot be cancelled before the expiry of its validity
          period.
        </p>
      </>
    ),
  },
  {
    number: "5",
    title: "Non-Transferable Policy",
    body: (
      <>
        <p>
          Premium subscriptions purchased through Ask Krishna Ji are intended
          solely for the registered user account and are non-transferable.
        </p>
        <p>A subscription cannot be:</p>
        <ul className="legal-list">
          <li>Transferred to another user</li>
          <li>Assigned to another account</li>
          <li>Exchanged for cash, credit, or any other benefit</li>
        </ul>
        <p>
          Geeta Pracharak subscriptions may only be assigned by the purchaser
          at the time of distribution and, once activated by a recipient,
          become permanently linked to that recipient&apos;s account and
          cannot be transferred thereafter.
        </p>
      </>
    ),
  },
  {
    number: "6",
    title: "Service Availability",
    body: (
      <p>
        Ask Krishna Ji strives to maintain uninterrupted service; however,
        temporary interruptions may occur due to maintenance, technical
        issues, internet connectivity, or circumstances beyond our control.
        Such interruptions shall not constitute grounds for refund,
        cancellation, or compensation.
      </p>
    ),
  },
  {
    number: "7",
    title: "Policy Acceptance",
    body: (
      <p>
        By completing a purchase on Ask Krishna Ji, you acknowledge that you
        have read, understood, and agreed to this Refund, Cancellation and
        Transfer Policy.
      </p>
    ),
  },
];

export const metadata: Metadata = {
  title: "Refund, Cancellation & Transfer Policy — Ask Krishna Ji",
  description:
    "All purchases on Ask Krishna Ji — including Premium subscriptions and Geeta Pracharak packages — are final, non-cancellable, and non-transferable.",
};

export default function RefundPage() {
  return (
    <>
      <Nav />
      <main className="relative">
        <article className="mx-auto max-w-3xl px-6 py-10 lg:px-10 lg:py-14">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-saffron-deep"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M14 8 H3 M7 4 L3 8 L7 12" />
              </svg>
              Home
            </Link>
          </div>

          {/* Doc header */}
          <header className="mb-10 text-center">
            <div className="mb-5 inline-flex items-center gap-3 text-gold-deep">
              <ChapterMark className="h-4 w-auto" />
              <span className="eyebrow">Legal · The Imprint</span>
              <ChapterMark className="h-4 w-auto" />
            </div>
            <h1 className="font-display text-display-md font-bold text-balance text-ink-deep">
              Refund, Cancellation{" "}
              <span className="italic text-saffron-deep">&amp; Transfer Policy</span>
            </h1>
            <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-ink-fade">
              Last updated · {LAST_UPDATED}
            </p>
            <div className="mx-auto mt-8 flex items-center justify-center text-gold-deep">
              <DiamondRule className="w-full max-w-sm" />
            </div>
          </header>

          {/* Lede */}
          <div className="mx-auto mb-10 max-w-2xl">
            <p className="dropcap text-lg leading-relaxed text-ink-soft md:text-xl">
              Please read this policy carefully before completing any purchase
              on Ask Krishna Ji. All Premium subscriptions and Geeta Pracharak
              packages are sold on a final-sale basis — no refunds, no
              cancellations, no transfers after activation.
            </p>
          </div>

          {/* Numbered sections */}
          <div className="space-y-10">
            {SECTIONS.map((section) => (
              <LegalSection
                key={section.number}
                number={section.number}
                title={section.title}
              >
                {section.body}
              </LegalSection>
            ))}

            {/* Contact — set apart as a foil card to match /privacy */}
            <section className="foil-card relative mt-12 p-6 lg:p-8">
              <p className="eyebrow mb-3 text-gold-deep">
                <Danda className="mr-1.5 text-gold-deep" />
                Contact
                <Danda className="ml-1.5 text-gold-deep" />
              </p>
              <p className="text-base leading-relaxed text-ink-soft">
                For any questions regarding this policy:
              </p>
              <p className="mt-3 font-display text-lg text-ink-deep">
                <strong className="font-semibold">Email:</strong>{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="form-link"
                >
                  {CONTACT_EMAIL}
                </a>
              </p>
            </section>
          </div>

          {/* Cross-links */}
          <footer className="mt-14 border-t border-ink/15 pt-8 text-center">
            <Lotus className="mx-auto mb-4 h-6 w-auto text-gold-deep opacity-80" />
            <p className="text-base text-ink-soft">
              See also our{" "}
              <Link href="/terms" className="form-link">
                Terms of Use
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="form-link">
                Privacy Policy
              </Link>
              .
            </p>
            <p className="mt-3 text-sm italic text-ink-fade">
              Contact ·{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="form-link"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}

const LegalSection = ({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) => (
  <section id={`s-${number}`} className="scroll-mt-20">
    <header className="mb-4 flex items-baseline gap-4">
      <span className="font-display text-3xl italic text-gold-deep">
        <Danda className="mr-1 text-gold-deep" />
        {number}.
      </span>
      <h2 className="font-display text-2xl font-bold text-ink-deep md:text-[1.7rem]">
        {title}
      </h2>
    </header>
    <div className="space-y-3 pl-12 text-[1.02rem] leading-relaxed text-ink-soft">
      {children}
    </div>
  </section>
);
