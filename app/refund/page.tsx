import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ChapterMark, Danda, DiamondRule, Lotus } from "@/components/Ornaments";

/**
 * /refund — Refund, Cancellation & Transfer Policy.
 *
 * Revised by the client on 25 June 2026 to introduce a 24-hour refund
 * window. Previous v1 (24 June 2026) was a flat "no refunds under any
 * circumstance" — this v2 narrows that to a 24-hour grace window
 * (request via email; processed within 7-10 business days), after which
 * the original final-sale rules apply.
 *
 * Mirrors the structure of /terms and /privacy so the three legal docs
 * read as paired documents. To update: edit SECTIONS array + bump
 * LAST_UPDATED.
 */

const LAST_UPDATED = "25 June 2026";
const CONTACT_EMAIL = "askkrishnaji@gmail.com";

type Section = {
  number: string;
  title: string;
  body: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    number: "1",
    title: "Premium Subscription",
    body: (
      <>
        <p>
          The Ask Krishna Ji Premium Subscription provides users with premium
          features, including an ad-free experience and access to premium
          content, for a period of one (1) year from the date of activation.
        </p>
        <p>
          Each subscription is valid only for the account through which it was
          activated.
        </p>
      </>
    ),
  },
  {
    number: "2",
    title: "Geeta Pracharak Subscription Package",
    body: (
      <>
        <p>
          Under the Geeta Pracharak Program, users may purchase a minimum of
          five (5) annual subscriptions at a discounted rate.
        </p>
        <p>These subscriptions may be used for:</p>
        <ul className="legal-list">
          <li>Gifting to family, friends, students, or other individuals.</li>
          <li>
            Distribution by Geeta Pracharaks as permitted by the program.
          </li>
        </ul>
        <p>
          Once a gifted subscription is activated by the recipient, it becomes
          permanently linked to that recipient&apos;s account.
        </p>
      </>
    ),
  },
  {
    number: "3",
    title: "Refund Policy",
    body: (
      <>
        <p>
          All purchases made through Ask Krishna Ji are considered final.
        </p>
        <p>
          However, a customer may request a refund by sending an email to our
          official support email address within{" "}
          <strong>twenty-four (24) hours</strong> of the successful purchase.
        </p>
        <p>To be eligible for a refund:</p>
        <ul className="legal-list">
          <li>The refund request must be received within 24 hours of purchase.</li>
          <li>
            The request must include the registered email address and
            transaction details.
          </li>
        </ul>
        <p>If the refund request is approved:</p>
        <ul className="legal-list">
          <li>The subscription or purchased package may be deactivated.</li>
          <li>The refund will be processed through the original payment method.</li>
          <li>
            The refunded amount will generally be credited within seven (7) to
            ten (10) working days, depending on the payment gateway, bank, or
            financial institution.
          </li>
        </ul>
        <p>
          Refund requests received after the 24-hour refund window will not be
          eligible for any refund.
        </p>
      </>
    ),
  },
  {
    number: "4",
    title: "No Cancellation Policy",
    body: (
      <>
        <p>
          Once a Premium Subscription or Geeta Pracharak Subscription Package
          has been purchased and activated, it cannot be cancelled.
        </p>
        <p>
          Users who do not request a refund within the 24-hour refund period
          shall not be eligible for cancellation of their purchase.
        </p>
      </>
    ),
  },
  {
    number: "5",
    title: "Non-Transferable Policy",
    body: (
      <>
        <p>Premium Subscriptions are strictly non-transferable.</p>
        <p>A Premium Subscription:</p>
        <ul className="legal-list">
          <li>Cannot be transferred to another person.</li>
          <li>Cannot be transferred to another account.</li>
          <li>Cannot be exchanged for cash, credit, or any other benefit.</li>
        </ul>
        <p>
          For Geeta Pracharak subscriptions, transfer is permitted only before
          activation for the purpose of gifting or distribution. Once a
          subscription has been activated by a recipient, it becomes
          permanently associated with that recipient&apos;s account and cannot
          be transferred further.
        </p>
      </>
    ),
  },
  {
    number: "6",
    title: "No Refund in the Following Cases",
    body: (
      <>
        <p>Refunds will not be provided in the following situations:</p>
        <ul className="legal-list">
          <li>Refund request submitted after 24 hours of purchase.</li>
          <li>Partial or complete use of the subscription after the refund period.</li>
          <li>Failure to use the service.</li>
          <li>Change of mind after the refund window has expired.</li>
          <li>Violation of the application&apos;s terms and policies.</li>
          <li>Suspension or termination of an account due to misuse.</li>
        </ul>
      </>
    ),
  },
  {
    number: "7",
    title: "Service Availability",
    body: (
      <>
        <p>
          Ask Krishna Ji strives to provide uninterrupted access to its
          services. However, temporary interruptions may occur due to
          maintenance, software updates, technical issues, internet
          connectivity problems, or circumstances beyond our control.
        </p>
        <p>
          Such interruptions shall not constitute grounds for a refund,
          cancellation, compensation, or credit.
        </p>
      </>
    ),
  },
  {
    number: "8",
    title: "Policy Changes",
    body: (
      <>
        <p>
          Ask Krishna Ji reserves the right to modify, update, or replace this
          Refund, Cancellation &amp; Transfer Policy at any time without prior
          notice.
        </p>
        <p>
          Any changes will become effective immediately upon publication within
          the application or on the official website.
        </p>
      </>
    ),
  },
  {
    number: "9",
    title: "Acceptance of Policy",
    body: (
      <>
        <p>
          By purchasing a Premium Subscription or Geeta Pracharak Subscription
          Package, you acknowledge that:
        </p>
        <ul className="legal-list">
          <li>You have read and understood this policy.</li>
          <li>You agree to be bound by this policy.</li>
          <li>
            You consent to the refund, cancellation, and transfer conditions
            described herein.
          </li>
        </ul>
      </>
    ),
  },
];

export const metadata: Metadata = {
  title: "Refund, Cancellation & Transfer Policy — Ask Krishna Ji",
  description:
    "Refunds may be requested by email within 24 hours of purchase. After the 24-hour window, all Premium and Geeta Pracharak purchases are final, non-cancellable, and non-transferable.",
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

          {/* Lede — opens with the client's gratitude line + policy framing */}
          <div className="mx-auto mb-10 max-w-2xl">
            <p className="dropcap text-lg leading-relaxed text-ink-soft md:text-xl">
              Thank you for choosing Ask Krishna Ji. This Refund, Cancellation
              &amp; Transfer Policy governs all purchases made through the Ask
              Krishna Ji application, including Premium Subscriptions and
              Geeta Pracharak Subscription Packages.
            </p>
            <p className="mt-5 text-[1.02rem] leading-relaxed text-ink-soft md:text-lg">
              In summary: refunds may be requested by email within{" "}
              <strong className="text-ink-deep">twenty-four (24) hours</strong>{" "}
              of purchase. After that window, all subscriptions are final,
              non-cancellable, and non-transferable.
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

            {/* Contact — set apart as a foil card to match /privacy + /terms */}
            <section className="foil-card relative mt-12 p-6 lg:p-8">
              <p className="eyebrow mb-3 text-gold-deep">
                <Danda className="mr-1.5 text-gold-deep" />
                10 · Contact Us
                <Danda className="ml-1.5 text-gold-deep" />
              </p>
              <p className="text-base leading-relaxed text-ink-soft">
                For refund requests or policy-related inquiries, please contact:
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
              <p className="mt-4 text-sm italic text-ink-soft">
                Refund requests must be submitted within{" "}
                <strong className="not-italic text-ink-deep">24 hours</strong>{" "}
                of the original purchase.
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
