import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ChapterMark, Danda, Lotus } from "@/components/Ornaments";

/**
 * /legal — landing index for the two legal documents.
 *
 * Mirrors the role of _archive/legal-site/index.html: a tiny editorial
 * sign-post that lists the canonical Privacy Policy and Terms of Use
 * pages. Useful for sharing one short URL (e.g., on a Play Store
 * listing or footer link) that routes the user to the document they
 * actually want.
 */

const LAST_UPDATED = "3 May 2026";
const CONTACT_EMAIL = "askkrishnaji@gmail.com";

export const metadata: Metadata = {
  title: "Legal — Ask Krishna Ji",
  description:
    "Privacy Policy and Terms of Use for the Ask Krishna Ji app.",
};

export default function LegalIndexPage() {
  return (
    <>
      <Nav />
      <main className="relative">
        <article className="mx-auto max-w-3xl px-6 py-10 lg:px-10 lg:py-14">
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

          <header className="mb-10 text-center">
            <div className="mb-5 inline-flex items-center gap-3 text-gold-deep">
              <ChapterMark className="h-4 w-auto" />
              <span className="eyebrow">The Imprint</span>
              <ChapterMark className="h-4 w-auto" />
            </div>
            <h1 className="font-display text-display-md font-bold text-balance text-ink-deep">
              Legal <span className="italic text-saffron-deep">Documents</span>
            </h1>
            <p className="mt-3 text-base italic text-ink-soft">
              Terms of Use &amp; Privacy Policy
            </p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-widest text-ink-fade">
              Last updated · {LAST_UPDATED}
            </p>
          </header>

          <div className="grid grid-cols-1 gap-px overflow-hidden border border-ink/15 bg-ink/15 md:grid-cols-3">
            <DocCard
              href="/terms"
              eyebrow="The Conduct"
              title="Terms of Use"
              description="App usage terms, AI disclaimer, user responsibility, governing law."
            />
            <DocCard
              href="/privacy"
              eyebrow="The Custody"
              title="Privacy Policy"
              description="What data we collect, how we use it, and the controls you keep over it."
            />
            <DocCard
              href="/refund"
              eyebrow="The Ledger"
              title="Refund Policy"
              description="Subscription purchases are final, non-cancellable, and non-transferable."
            />
          </div>

          <footer className="mt-14 border-t border-ink/15 pt-8 text-center">
            <Lotus className="mx-auto mb-4 h-6 w-auto text-gold-deep opacity-80" />
            <p className="text-sm italic text-ink-fade">
              For any questions, write to us at{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="form-link"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}

const DocCard = ({
  href,
  eyebrow,
  title,
  description,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
}) => (
  <Link
    href={href}
    className="group flex flex-col gap-3 bg-parchment-ivory p-8 transition-colors duration-300 hover:bg-parchment-warm/60"
  >
    <p className="eyebrow text-gold-deep">{eyebrow}</p>
    <h2 className="font-display text-2xl font-bold text-ink-deep transition-colors group-hover:text-saffron-deep">
      {title}
    </h2>
    <p className="text-[1rem] leading-relaxed text-ink-soft">{description}</p>
    <span className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-saffron-deep">
      <Danda className="text-gold-deep" />
      Read the document
      <svg
        width="14"
        height="14"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M2 8 H13 M9 4 L13 8 L9 12" />
      </svg>
    </span>
  </Link>
);
