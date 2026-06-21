import type { SVGProps } from "react";
import { ChapterMark, DiamondRule } from "./Ornaments";

type Feature = {
  numeral: string;
  eyebrow: string;
  title: string;
  deva: string;
  body: string;
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

const FEATURES: Feature[] = [
  {
    numeral: "i.",
    eyebrow: "Conversation",
    title: "Ask Krishna Ji directly",
    deva: "श्री कृष्ण से सीधा संवाद",
    body: "Put a present-life question into the chamber and receive a reply that names the chapter and verse it grew from.",
    Icon: IconConverse,
  },
  {
    numeral: "ii.",
    eyebrow: "Reader",
    title: "All 700 verses, paced for reading",
    deva: "सात सौ श्लोक, ध्यान से पढ़ने योग्य",
    body: "A devotional reader that asks you to mark each section as read before turning the page — the way a verse is meant to be received.",
    Icon: IconReader,
  },
  {
    numeral: "iii.",
    eyebrow: "Samasya · Samadhan",
    title: "Today's question, Krishna Ji's answer",
    deva: "आज की समस्या, गीता का समाधान",
    body: "Seven hundred modern questions, each one paired with the exact verse that answers it — a thumbed-through index of life.",
    Icon: IconSamasya,
  },
  {
    numeral: "iv.",
    eyebrow: "Notification",
    title: "A verse to wake to",
    deva: "प्रतिदिन एक श्लोक",
    body: "A single shloka delivered each morning, in your chosen language, so the day begins with a steady line from the Gita.",
    Icon: IconBell,
  },
  {
    numeral: "v.",
    eyebrow: "Languages",
    title: "Twenty-one scripts, one Gita",
    deva: "इक्कीस भाषाओं में",
    body: "Read and converse in Hindi, English, Hinglish, Bengali, Tamil, Telugu, Marathi, Gujarati, Punjabi, Sanskrit and twelve more.",
    Icon: IconScripts,
  },
  {
    numeral: "vi.",
    eyebrow: "Quiet",
    title: "Premium: an undisturbed seat",
    deva: "बिना विज्ञापन, बिना रुकावट",
    body: "Members read without interruption. The proceeds support the prachār — keeping the daily verses going for everyone else.",
    Icon: IconCircle,
  },
];

export const Features = () => {
  return (
    <section
      id="features"
      aria-label="Features"
      className="relative py-14 lg:py-20"
    >
      <div className="mx-auto max-w-canvas px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <div className="mb-5 flex items-center gap-3 text-gold-deep">
            <ChapterMark className="h-5 w-auto" />
            <span className="eyebrow">Chapter III · The Practice</span>
          </div>
          <h2 className="font-display text-display-md font-bold text-balance text-ink-deep">
            Six rooms, one{" "}
            <span className="italic text-saffron-deep">scripture.</span>
          </h2>
          <p className="mt-6 max-w-xl text-xl leading-relaxed text-ink-soft">
            The app is laid out the way a manuscript is laid out — with chapter
            heads, marginalia, and a steady rhythm meant to be returned to.
          </p>
        </div>

        {/* Features — editorial 2-column grid with hairline rules */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {FEATURES.map((feature, idx) => {
            // Border discipline: each cell gets a top + right hairline so the
            // grid reads like the pages of a book ledger.
            const isFirstRow = idx < 2;
            const isLeftCol = idx % 2 === 0;
            return (
              <article
                key={feature.numeral}
                className={`group relative px-2 py-10 transition-colors duration-500 hover:bg-parchment-warm/40 md:px-8 ${
                  isFirstRow ? "" : "border-t border-ink/15"
                } ${isLeftCol ? "md:border-r md:border-ink/15" : ""} ${
                  idx >= 2 ? "border-t border-ink/15" : ""
                }`}
              >
                {/* Roman numeral as visual anchor */}
                <div className="absolute right-4 top-6 font-display text-5xl italic text-gold/30 transition-colors duration-500 group-hover:text-saffron/40 md:right-8 md:text-6xl">
                  {feature.numeral}
                </div>

                {/* Icon */}
                <div className="mb-6 inline-flex items-center justify-center text-saffron">
                  <feature.Icon className="h-9 w-auto" />
                </div>

                {/* Eyebrow */}
                <p className="eyebrow mb-2 text-gold-deep">{feature.eyebrow}</p>

                {/* Title (English + Devanagari) */}
                <h3 className="mb-1 max-w-md font-display text-[1.7rem] font-bold leading-tight text-ink">
                  {feature.title}
                </h3>
                <p className="mb-4 font-deva text-lg font-semibold text-ink-soft">
                  {feature.deva}
                </p>

                {/* Body */}
                <p className="max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
                  {feature.body}
                </p>
              </article>
            );
          })}
        </div>

        {/* Footer divider */}
        <div className="mt-10 flex items-center justify-center text-gold">
          <DiamondRule className="w-72 max-w-full" />
        </div>
      </div>
    </section>
  );
};

// ── Custom icon set — line work to match the editorial pen-and-ink look.
//    Each glyph is hand-tuned, not pulled from a stock icon library. ──

function IconConverse(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" {...props}>
      <path d="M6 10 L34 10 Q38 10 38 14 L38 26 Q38 30 34 30 L18 30 L10 38 L10 30 L6 30 Q2 30 2 26 L2 14 Q2 10 6 10 Z" />
      <path d="M44 22 L44 34 Q44 38 40 38 L28 38" strokeOpacity="0.5" />
      <circle cx="14" cy="20" r="1.2" fill="currentColor" />
      <circle cx="22" cy="20" r="1.2" fill="currentColor" />
      <circle cx="30" cy="20" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconReader(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" {...props}>
      <path d="M4 8 L22 8 Q24 8 24 10 L24 40 Q24 38 22 38 L4 38 Z" />
      <path d="M44 8 L26 8 Q24 8 24 10 L24 40 Q24 38 26 38 L44 38 Z" />
      <line x1="8" y1="14" x2="20" y2="14" />
      <line x1="8" y1="18" x2="20" y2="18" />
      <line x1="8" y1="22" x2="16" y2="22" strokeOpacity="0.5" />
      <line x1="28" y1="14" x2="40" y2="14" />
      <line x1="28" y1="18" x2="40" y2="18" />
      <line x1="28" y1="22" x2="36" y2="22" strokeOpacity="0.5" />
      <path d="M24 4 L24 44" strokeOpacity="0.4" />
    </svg>
  );
}

function IconSamasya(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" {...props}>
      <path d="M8 6 L36 6 Q40 6 40 10 L40 38 Q40 42 36 42 L12 42 Q8 42 8 38 Z" />
      <line x1="14" y1="14" x2="30" y2="14" />
      <line x1="14" y1="20" x2="34" y2="20" strokeOpacity="0.5" />
      <line x1="14" y1="26" x2="28" y2="26" strokeOpacity="0.5" />
      <path d="M14 32 L24 32 L24 38 L20 36 L16 38 Z" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

function IconBell(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" {...props}>
      <path d="M10 32 L38 32 Q34 28 34 22 Q34 14 28 12 L28 10 Q28 7 24 7 Q20 7 20 10 L20 12 Q14 14 14 22 Q14 28 10 32 Z" />
      <path d="M20 36 Q20 40 24 40 Q28 40 28 36" />
      <circle cx="24" cy="22" r="2" fill="currentColor" />
    </svg>
  );
}

function IconScripts(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" {...props}>
      <circle cx="24" cy="24" r="20" />
      <ellipse cx="24" cy="24" rx="12" ry="20" strokeOpacity="0.55" />
      <ellipse cx="24" cy="24" rx="20" ry="12" strokeOpacity="0.55" />
      <line x1="4" y1="24" x2="44" y2="24" strokeOpacity="0.35" />
      <line x1="24" y1="4" x2="24" y2="44" strokeOpacity="0.35" />
    </svg>
  );
}

function IconCircle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" {...props}>
      <circle cx="24" cy="24" r="20" />
      <circle cx="24" cy="24" r="14" strokeOpacity="0.55" />
      <circle cx="24" cy="24" r="8" />
      <circle cx="24" cy="24" r="2.5" fill="currentColor" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line
          key={a}
          x1="24" y1="4" x2="24" y2="8"
          transform={`rotate(${a} 24 24)`}
          strokeOpacity="0.65"
        />
      ))}
    </svg>
  );
}
