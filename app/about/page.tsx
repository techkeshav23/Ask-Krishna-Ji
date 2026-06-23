import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import {
  ChapterMark,
  CornerFlourish,
  Danda,
  DiamondRule,
  Lotus,
} from "@/components/Ornaments";

/**
 * /about — the story behind the app.
 *
 * Editorial single-column treatment: drop-cap lede, a dedicated
 * "Founder" pull-quote in a foil card, "Operating House" block for the
 * company, a numbered "What We Believe" manifesto, a "By the Numbers"
 * strip, and a Sanskrit blessing close.
 *
 * Placeholder copy is intentionally restrained. The user (client) is
 * expected to fine-tune the founder biography and company description
 * once they share fuller bios — the structure here is the long-lived
 * skeleton; the prose is editable in-line below.
 */

const PRINCIPLES = [
  {
    numeral: "i",
    title: "Devotional first",
    body: "The Bhagavad Gita is sacred text, not content. Every translation, every word of guidance, every line of code is chosen with that recognition.",
  },
  {
    numeral: "ii",
    title: "Language matters",
    body: "A reader's mother tongue is the right tongue. Twenty-one Indian scripts are not a feature — they are the floor of respect.",
  },
  {
    numeral: "iii",
    title: "Pace is part of the practice",
    body: "Tick to advance, not infinite-scroll. A verse asks to be received before the next one arrives.",
  },
  {
    numeral: "iv",
    title: "Quiet over flashy",
    body: "Design that gets out of the way. Type that breathes. Ornament where it belongs, restraint everywhere else.",
  },
] as const;

const CONTACT_EMAIL = "askkrishnaji@gmail.com";

export const metadata: Metadata = {
  title: "About — Ask Krishna Ji",
  description:
    "The story behind Ask Krishna Ji — a devotional app founded by Smt. Kalawati Sarupria, built by Monagra Solutions, to keep the Bhagavad Gita within thumb's reach of any reader in any of twenty-one Indian languages.",
};

export default function AboutPage() {
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
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M14 8 H3 M7 4 L3 8 L7 12" />
              </svg>
              Home
            </Link>
          </div>

          {/* Doc header */}
          <header className="mb-10 text-center">
            <div className="mb-5 inline-flex items-center gap-3 text-gold-deep">
              <ChapterMark className="h-4 w-auto" />
              <span className="eyebrow">About · The Story</span>
              <ChapterMark className="h-4 w-auto" />
            </div>
            <h1 className="font-display text-display-md font-bold text-balance text-ink-deep">
              The Bhagavad Gita,{" "}
              <span className="italic text-saffron-deep">in your pocket.</span>
            </h1>
            <p className="mt-4 font-deva text-lg font-semibold text-ink-soft sm:text-xl">
              श्रीमद् भगवद् गीता — आपकी हथेली में।
            </p>
            <div className="mx-auto mt-8 flex items-center justify-center text-gold-deep">
              <DiamondRule className="w-full max-w-sm" />
            </div>
          </header>

          {/* ── Mission lede with drop cap ── */}
          <section className="mx-auto mb-12 max-w-2xl">
            <p className="dropcap text-lg leading-relaxed text-ink-soft md:text-xl">
              Ask Krishna Ji exists for one reason: to keep the Bhagavad Gita
              within thumb's reach of anyone who wants it — in their own
              language, at the pace of their own questions, and without the
              friction of bookshelves or scholar's commentaries.
            </p>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-ink-soft md:text-lg">
              Krishna's answers were given on a battlefield, before a decision.
              Yet today the same answers sit between hard book covers, in a
              language many readers do not speak natively. We wanted to bring
              those answers to where the question is actually being asked —
              on the screen the reader is already holding.
            </p>
          </section>

          {/* ── Founder block — foil card, pull-quote treatment ── */}
          <section aria-label="Founder" className="mx-auto mb-14 max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-gold-deep">
              <span className="h-px flex-1 bg-gold-deep/40" />
              <span className="eyebrow">The Founder</span>
              <span className="h-px flex-1 bg-gold-deep/40" />
            </div>

            <div className="foil-card relative p-6 sm:p-8">
              <CornerFlourish className="absolute left-2 top-2 h-6 w-6 text-gold-deep" />
              <CornerFlourish
                flip
                className="absolute right-2 top-2 h-6 w-6 text-gold-deep"
              />
              <CornerFlourish className="absolute bottom-2 left-2 h-6 w-6 rotate-180 text-gold-deep" />
              <CornerFlourish
                flip
                className="absolute bottom-2 right-2 h-6 w-6 rotate-180 text-gold-deep"
              />

              <p className="eyebrow mb-3 text-gold-deep">
                <Danda className="mr-1.5 text-gold-deep" />
                Founded By
                <Danda className="ml-1.5 text-gold-deep" />
              </p>
              <p className="font-display text-3xl font-bold text-ink-deep sm:text-4xl">
                Smt.{" "}
                <span className="italic text-saffron-deep">
                  Kalawati Sarupria
                </span>
              </p>

              <div className="my-5 flex items-center gap-2 text-gold-deep">
                <span className="h-px w-12 bg-gold-deep/60" />
                <span className="text-xs">◆</span>
                <span className="h-px w-12 bg-gold-deep/60" />
              </div>

              <p className="pullquote text-lg leading-relaxed text-ink-soft md:text-xl">
                &ldquo;Every Indian household should have a Gita that speaks in
                their own tongue.&rdquo;
              </p>
              <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft">
                Ask Krishna Ji is the devotional vision of Smt. Kalawati
                Sarupria — whose conviction shaped the project from its first
                line to its present form. The app's commitment to translation
                across twenty-one Indian languages, and to a reading pace that
                respects the verse, traces directly back to her.
              </p>
            </div>
          </section>

          {/* ── Operating house — Monagra Solutions ── */}
          <section aria-label="Operating house" className="mx-auto mb-14 max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-gold-deep">
              <span className="h-px flex-1 bg-gold-deep/40" />
              <span className="eyebrow">The Operating House</span>
              <span className="h-px flex-1 bg-gold-deep/40" />
            </div>

            <h2 className="font-display text-2xl font-bold text-ink-deep sm:text-3xl">
              Monagra <span className="italic text-saffron-deep">Solutions</span>
            </h2>
            <p className="mt-3 font-deva text-base font-semibold text-ink-soft">
              मनाग्रा सोल्यूशन्स
            </p>
            <p className="mt-5 text-[1.05rem] leading-relaxed text-ink-soft md:text-lg">
              The work of building, hosting, translating, and maintaining the
              app is carried out by Monagra Solutions — a studio that believes
              technology can serve devotion without distorting it. We treat
              translation as a craft, not a button; reading as a practice, not
              a metric.
            </p>
          </section>

          {/* ── What we believe — numbered manifesto ── */}
          <section aria-label="Principles" className="mx-auto mb-14 max-w-2xl">
            <div className="mb-6 flex items-center gap-3 text-gold-deep">
              <span className="h-px flex-1 bg-gold-deep/40" />
              <span className="eyebrow">What We Believe</span>
              <span className="h-px flex-1 bg-gold-deep/40" />
            </div>

            <ol className="space-y-6 border-l-2 border-gold-deep/30 pl-5 sm:pl-6">
              {PRINCIPLES.map((p) => (
                <li key={p.numeral}>
                  <header className="mb-1.5 flex items-baseline gap-3">
                    <span className="font-display text-2xl italic text-saffron-deep sm:text-3xl">
                      {p.numeral}.
                    </span>
                    <h3 className="font-display text-xl font-bold text-ink-deep sm:text-2xl">
                      {p.title}
                    </h3>
                  </header>
                  <p className="text-[1.02rem] leading-relaxed text-ink-soft">
                    {p.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* ── By the numbers — small editorial stats strip ── */}
          <section
            aria-label="By the numbers"
            className="mx-auto mb-14 max-w-2xl"
          >
            <div className="mb-6 flex items-center gap-3 text-gold-deep">
              <span className="h-px flex-1 bg-gold-deep/40" />
              <span className="eyebrow">By the Numbers</span>
              <span className="h-px flex-1 bg-gold-deep/40" />
            </div>

            <dl className="grid grid-cols-2 gap-px overflow-hidden border border-ink/15 bg-ink/15 sm:grid-cols-4">
              <Stat label="Shlokas" value="700" />
              <Stat label="Chapters" value="18" />
              <Stat label="Languages" value="21" />
              <Stat label="Offering" value="One" />
            </dl>
          </section>

          {/* ── Contact ── */}
          <section
            aria-label="Get in touch"
            className="mx-auto mb-12 max-w-2xl text-center"
          >
            <div className="mb-5 flex items-center justify-center text-gold-deep">
              <DiamondRule className="w-full max-w-md" />
            </div>
            <h2 className="font-display text-2xl font-bold text-ink-deep sm:text-3xl">
              Get in <span className="italic text-saffron-deep">touch</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[1.05rem] leading-relaxed text-ink-soft">
              For collaboration, content suggestions, translation feedback, or
              simply to write — we read every letter.
            </p>
            <p className="mt-4 font-display text-lg">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="form-link"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </section>

          {/* ── Sanskrit blessing close ── */}
          <footer className="mt-14 flex flex-col items-center gap-3 border-t border-ink/15 pt-10 text-center">
            <Lotus className="h-7 w-auto text-gold-deep opacity-80" />
            <p className="font-sanskrit text-xl text-ink">
              <Danda className="mr-2 text-gold-deep" />
              सर्वे भवन्तु सुखिनः
              <Danda className="ml-2 text-gold-deep" />
            </p>
            <p className="text-sm italic text-ink-fade">
              May all beings know contentment.
            </p>
          </footer>
        </article>
      </main>
      <Footer />
    </>
  );
}

// ── Small editorial stat cell — used in the "By the Numbers" grid. ──
const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="bg-parchment-ivory p-5 text-center">
    <dd className="font-display text-3xl font-bold text-ink-deep sm:text-4xl">
      {value}
    </dd>
    <dt className="mt-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-gold-deep">
      {label}
    </dt>
  </div>
);
