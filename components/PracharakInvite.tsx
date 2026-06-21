import Link from "next/link";
import { ChapterMark, Lotus } from "./Ornaments";

/**
 * Two-column editorial invitation. Quiet, dignified — this is a request to
 * spread the Gita, not a marketing offer. The look should feel closer to a
 * letter from the editor than to a referral programme.
 */
export const PracharakInvite = () => {
  return (
    <section
      id="pracharak"
      aria-label="Become a Gita Pracharak"
      className="relative bg-ink py-24 text-parchment-warm lg:py-32"
    >
      {/* Thin gold rules at top/bottom — same treatment as SacredVerse so the
          two dark sections feel like related plates in the same book */}
      <div className="absolute inset-x-0 top-0 h-px bg-gold/30" />
      <div className="absolute inset-x-0 top-2 h-px bg-gold/15" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold/30" />
      <div className="absolute inset-x-0 bottom-2 h-px bg-gold/15" />

      {/* Faint paper grain on dark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-canvas px-6 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          {/* Left — typographic mark and chapter eyebrow */}
          <div className="lg:col-span-5">
            <div className="mb-5 flex items-center gap-3 text-gold-soft">
              <ChapterMark className="h-5 w-auto" />
              <span className="eyebrow text-gold-soft">An Invitation</span>
            </div>
            <h2 className="font-display text-display-md font-bold text-balance text-parchment">
              Become a{" "}
              <span className="italic text-saffron-glow">Gita Pracharak.</span>
            </h2>
            <p className="mt-3 font-deva text-2xl font-bold text-parchment-warm">
              गीता के प्रचारक बनें।
            </p>

            <Lotus className="mt-12 h-10 w-auto text-gold-soft opacity-80" />
          </div>

          {/* Right — body copy + CTA */}
          <div className="lg:col-span-7">
            <p className="dropcap text-xl font-medium leading-relaxed text-parchment md:text-[1.35rem]">
              The Pracharak Program is a quiet partnership for those who carry
              the Gita into their families, sanghs, and neighbourhoods. Bring
              in five or more annual memberships at the special bulk rate, and
              a part returns to you — so the work of spreading the verses is
              also work that sustains you.
            </p>

            <p className="mt-6 text-lg italic leading-relaxed text-parchment-warm md:text-xl">
              This is not a referral scheme. It is a calling for those who feel
              the Gita deserves to reach further than they alone can carry it.
            </p>

            {/* Three-up details */}
            <div className="mt-12 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-3">
              <div>
                <p className="eyebrow mb-1 text-gold-soft">Minimum</p>
                <p className="font-display text-3xl font-bold text-parchment">5 members</p>
              </div>
              <div>
                <p className="eyebrow mb-1 text-gold-soft">Bulk Rate</p>
                <p className="font-display text-3xl font-bold text-parchment">Special</p>
              </div>
              <div>
                <p className="eyebrow mb-1 text-gold-soft">Returns</p>
                <p className="font-display text-3xl font-bold text-parchment">Per Member</p>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/pracharak"
                className="inline-flex items-center gap-2.5 border-2 border-gold-soft bg-transparent px-6 py-3.5 font-display text-base font-semibold tracking-wide text-parchment transition-colors duration-300 hover:bg-gold-soft hover:text-ink-deep"
              >
                Read the Full Invitation
                <svg
                  width="14" height="14" viewBox="0 0 16 16" fill="none"
                  stroke="currentColor" strokeWidth="1.4"
                >
                  <path d="M2 8 H13 M9 4 L13 8 L9 12" />
                </svg>
              </Link>
              <span className="text-sm italic text-parchment-warm/70">
                Applications reviewed personally.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
