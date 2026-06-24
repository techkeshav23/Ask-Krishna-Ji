import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ChapterMark, Danda, DiamondRule, Lotus } from "@/components/Ornaments";

/**
 * /terms — Terms of Use.
 *
 * Content ported faithfully from the earlier standalone legal site at
 * _archive/legal-site/terms.html (last revised 3 May 2026). Substantive
 * copy is unchanged — only the layout, typography, and ornaments have
 * been re-set in the editorial "Manuscript Modernism" voice the rest
 * of askkrishnaji.com uses.
 *
 * Mirrors /privacy in structure so they read as paired documents.
 */

const LAST_UPDATED = "3 May 2026";
const CONTACT_EMAIL = "askkrishnaji@gmail.com";

type Section = {
  number: string;
  title: string;
  body: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    number: "1",
    title: "About the App",
    body: (
      <>
        <p>
          Ask Krishna Ji is a spiritual guidance application that provides
          responses inspired by teachings from the Bhagavad Gita.
        </p>
        <p>
          The app is intended for informational and spiritual purposes only.
          It does not provide medical, legal, psychological, or financial
          advice. Always consult qualified professionals for serious decisions.
        </p>
      </>
    ),
  },
  {
    number: "2",
    title: "AI-Generated Content Disclaimer",
    body: (
      <>
        <p>
          Responses provided by the app are generated using artificial
          intelligence based on Bhagavad Gita teachings. AI responses may
          occasionally contain inaccuracies, misinterpretations, or omissions.
        </p>
        <p>
          Always verify important spiritual or practical guidance with a
          qualified teacher (guru), scholar, or appropriate professional. The
          app is a supplemental aid, not a substitute for human wisdom.
        </p>
      </>
    ),
  },
  {
    number: "3",
    title: "User Responsibility",
    body: (
      <>
        <p>By using this app, you agree that:</p>
        <ul className="legal-list">
          <li>You are solely responsible for your own decisions and actions.</li>
          <li>
            You will not rely solely on the app for serious life situations.
          </li>
          <li>You will seek professional or medical help where necessary.</li>
        </ul>
      </>
    ),
  },
  {
    number: "4",
    title: "Use of the App",
    body: (
      <ul className="legal-list">
        <li>The app currently offers free features supported by advertisements.</li>
        <li>
          Daily usage limits may apply, such as a limited number of free chats
          per app install.
        </li>
        <li>
          Watching short rewarded video ads may unlock additional features.
        </li>
        <li>
          We may modify features, limits, or future pricing at any time with
          reasonable notice.
        </li>
      </ul>
    ),
  },
  {
    number: "5",
    title: "Content Usage",
    body: (
      <p>
        All content including shlokas, explanations, modern stories, and
        lessons is for personal spiritual use only. Reproduction,
        redistribution, modification, or commercial use without prior written
        permission is strictly prohibited.
      </p>
    ),
  },
  {
    number: "6",
    title: "Limitation of Liability",
    body: (
      <p>
        The app provides general spiritual guidance only. We are not
        responsible for any actions, decisions, losses, injuries, or outcomes
        arising from use of the content. Use of the app is entirely at your
        own risk.
      </p>
    ),
  },
  {
    number: "7",
    title: "Misuse of Service",
    body: (
      <>
        <p>
          We reserve the right to suspend or terminate access without notice
          if a user:
        </p>
        <ul className="legal-list">
          <li>Misuses the platform.</li>
          <li>
            Engages in harmful, abusive, illegal, or inappropriate behaviour.
          </li>
          <li>
            Attempts to reverse-engineer, scrape, or automate access to the app.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "8",
    title: "Changes to Terms",
    body: (
      <p>
        We may update or modify these terms at any time. Material changes will
        be reflected by updating the &ldquo;Last Updated&rdquo; date at the
        top of this document. Continued use of the app after changes means you
        accept the updated terms.
      </p>
    ),
  },
  {
    number: "9",
    title: "Governing Law & Jurisdiction",
    body: (
      <p>
        These terms are governed by the laws of India. Any disputes arising
        under these terms shall be subject to the exclusive jurisdiction of
        the courts of Delhi, India.
      </p>
    ),
  },
];

export const metadata: Metadata = {
  title: "Terms of Use — Ask Krishna Ji",
  description:
    "Terms of Use for the Ask Krishna Ji app — a spiritual guidance companion rooted in the Bhagavad Gita.",
};

export default function TermsPage() {
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
              Terms of <span className="italic text-saffron-deep">Use</span>
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
              Before you read further: this app is a devotional companion, not
              a substitute for human judgment. The terms below set the
              boundary between what the app offers and what remains your own
              responsibility.
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
          </div>

          {/* Cross-link */}
          <footer className="mt-14 border-t border-ink/15 pt-8 text-center">
            <Lotus className="mx-auto mb-4 h-6 w-auto text-gold-deep opacity-80" />
            <p className="text-base text-ink-soft">
              See also our{" "}
              <Link href="/privacy" className="form-link">
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link href="/refund" className="form-link">
                Refund Policy
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
