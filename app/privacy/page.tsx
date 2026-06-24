import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ChapterMark, Danda, DiamondRule, Lotus } from "@/components/Ornaments";

/**
 * /privacy — Privacy Policy.
 *
 * Content ported faithfully from the earlier standalone legal site at
 * _archive/legal-site/privacy.html (last revised 3 May 2026). The
 * substantive copy is unchanged — only the layout, typography, and
 * ornaments have been re-set in the "Manuscript Modernism" voice the
 * rest of askkrishnaji.com uses, so the policy reads as part of the
 * brand rather than a tacked-on legal sheet.
 *
 * To update the policy, edit the SECTIONS array (or the contact block)
 * and bump LAST_UPDATED below — both are kept inline for fast diffing.
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
    number: "10",
    title: "Information We Collect",
    body: (
      <>
        <p>We may collect:</p>
        <ul className="legal-list">
          <li>
            Account information from Google sign-in: full name and email
            address (provided by your Google account).
          </li>
          <li>
            Profile details you optionally add: city, state, language
            preference, and an &ldquo;about&rdquo; note.
          </li>
          <li>
            User queries: questions you ask the app and your conversation
            history.
          </li>
          <li>
            Usage data: app screens visited, features used, language
            preferences.
          </li>
          <li>
            Basic device information: model, operating system version, app
            version.
          </li>
          <li>
            Advertising identifier (Android): used by AdMob for ad
            personalisation; you can reset or limit this in your device
            settings.
          </li>
        </ul>
        <p>
          We do not collect passwords (authentication is handled via Google
          Sign-In), banking details, or financial information.
        </p>
      </>
    ),
  },
  {
    number: "11",
    title: "How We Use Data",
    body: (
      <>
        <p>We use collected data to:</p>
        <ul className="legal-list">
          <li>Provide relevant spiritual guidance responses.</li>
          <li>
            Maintain your conversation history and language preferences across
            sessions.
          </li>
          <li>Improve app performance and user experience.</li>
          <li>Serve appropriate advertisements to free-tier users.</li>
          <li>Detect and prevent abuse.</li>
        </ul>
      </>
    ),
  },
  {
    number: "12",
    title: "Third-Party Services",
    body: (
      <>
        <p>
          We use the following service providers, each governed by their own
          privacy policies:
        </p>
        <ul className="legal-list">
          <li>
            <strong>Firebase / Google Cloud</strong> (Google LLC) —
            Authentication, Firestore database, Cloud Functions, and hosting.
          </li>
          <li>
            <strong>Google Generative AI</strong> (Google LLC) — generates AI
            responses for your queries.
          </li>
          <li>
            <strong>Google AdMob</strong> (Google LLC) — serves advertisements
            to free-tier users.
          </li>
          <li>
            <strong>Google Sign-In</strong> (Google LLC) — provides sign-in
            identity (name and email) when you authenticate.
          </li>
        </ul>
      </>
    ),
  },
  {
    number: "13",
    title: "Data Sharing",
    body: (
      <ul className="legal-list">
        <li>We do not sell user data.</li>
        <li>
          Data is shared only with the necessary service providers listed above
          to operate the app.
        </li>
        <li>
          We may disclose data when required by law, court order, or to protect
          the rights and safety of users or the public.
        </li>
      </ul>
    ),
  },
  {
    number: "14",
    title: "Data Security",
    body: (
      <p>
        We take reasonable steps to protect your data using industry-standard
        security practices, including encrypted transmission (HTTPS) and
        Firebase security rules. No system can be guaranteed 100% secure; you
        use the app at your own risk.
      </p>
    ),
  },
  {
    number: "15",
    title: "Your Rights",
    body: (
      <>
        <p>You may:</p>
        <ul className="legal-list">
          <li>Stop using the app at any time.</li>
          <li>Request access, correction, or deletion of your data.</li>
          <li>
            Permanently delete your account from within the app: Profile →
            Delete Account → type &ldquo;DELETE&rdquo; to confirm. This
            permanently erases your profile, all conversations, and all
            associated data from our servers.
          </li>
          <li>Withdraw consent for data processing by deleting your account.</li>
          <li>Contact us with questions or concerns at the email below.</li>
        </ul>
      </>
    ),
  },
  {
    number: "16",
    title: "Children's Policy",
    body: (
      <p>
        This app is not intended for users under the age of 18. We do not
        knowingly collect data from minors. If you believe a minor has used the
        app, please contact us so we can delete their data.
      </p>
    ),
  },
  {
    number: "17",
    title: "Updates to Privacy Policy",
    body: (
      <p>
        We may update this privacy policy from time to time. The &ldquo;Last
        Updated&rdquo; date at the top will reflect the latest version.
        Continued use of the app after such updates means you accept the
        revised policy.
      </p>
    ),
  },
];

export const metadata: Metadata = {
  title: "Privacy Policy — Ask Krishna Ji",
  description:
    "How Ask Krishna Ji collects, uses, and protects your data. Devotional, transparent, and yours to control.",
};

export default function PrivacyPage() {
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
              Privacy <span className="italic text-saffron-deep">Policy</span>
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
              Your trust is part of the practice. This page lays out — plainly
              and without hedging — what data Ask Krishna Ji collects, how it
              is used, and what control you keep over it.
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

            {/* Contact — set apart as a foil card */}
            <section className="foil-card relative mt-12 p-6 lg:p-8">
              <p className="eyebrow mb-3 text-gold-deep">
                <Danda className="mr-1.5 text-gold-deep" />
                18 · Contact Information
                <Danda className="ml-1.5 text-gold-deep" />
              </p>
              <p className="text-base leading-relaxed text-ink-soft">
                For any questions, concerns, or data-related requests:
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

          {/* Cross-link */}
          <footer className="mt-14 border-t border-ink/15 pt-8 text-center">
            <Lotus className="mx-auto mb-4 h-6 w-auto text-gold-deep opacity-80" />
            <p className="text-base text-ink-soft">
              See also our{" "}
              <Link href="/terms" className="form-link">
                Terms of Use
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

// ── Reusable numbered section block — keeps the markup readable in the
//    SECTIONS array above by isolating the chapter-style heading + body
//    rhythm here. Body accepts arbitrary JSX so each section can mix
//    paragraphs and <ul className="legal-list"> lists freely.
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
