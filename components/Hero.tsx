import { Chakra, ChapterMark, Danda, Yantra } from "./Ornaments";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.askkrishnaji.app";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Yantra watermark — sacred geometry whispering behind the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-8 h-[640px] w-[640px] text-gold opacity-[0.08] lg:-right-16 lg:top-0"
      >
        <Yantra className="h-full w-full" />
      </div>

      {/* Chakra wheel — the iconic spinner. Tucked at top-right, slowly turning. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 hidden h-[520px] w-[520px] text-saffron opacity-30 animate-rotate-slow lg:block"
      >
        <Chakra className="h-full w-full" />
      </div>

      <div className="relative mx-auto grid max-w-canvas grid-cols-1 gap-8 px-6 pb-14 pt-8 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:pb-20 lg:pt-12">
        {/* ── LEFT COLUMN — editorial text block ── */}
        <div className="lg:col-span-7">
          {/* Chapter ornament */}
          <div className="mb-6 flex items-center gap-4 text-gold-deep animate-fade-in">
            <ChapterMark className="h-6 w-auto" />
            <span className="eyebrow">Adhyāya · One</span>
          </div>

          {/* Sanskrit superscription — heads the page like a manuscript opening */}
          <p
            className="mb-6 font-sanskrit text-2xl leading-snug text-ink lg:text-[1.85rem] animate-fade-in-up"
            style={{ animationDelay: "0.05s" }}
          >
            <Danda className="mr-2 text-gold-deep" /> श्री कृष्णाय नमः{" "}
            <Danda className="ml-2 text-gold-deep" />
          </p>

          {/* Display headline — fluid serif, italic emphasis on Krishna,
              honorific "Ji" picked out in burnished gold to mirror the
              navigation wordmark and never drop the brand-name suffix. */}
          <h1
            className="mb-6 font-display text-display-lg font-bold text-balance text-ink-deep animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            Conversations with{" "}
            <span className="italic text-saffron-deep">Krishna</span>{" "}
            <span className="text-gold-deep">Ji</span>,
            <br className="hidden sm:block" />
            carried in your{" "}
            <span className="italic">pocket.</span>
          </h1>

          {/* Lede paragraph */}
          <p
            className="mb-3 max-w-xl text-lg font-medium leading-relaxed text-ink animate-fade-in-up lg:text-xl"
            style={{ animationDelay: "0.25s" }}
          >
            A devotional companion to the{" "}
            <em className="text-saffron-deep">Bhagavad Gita</em> — read all{" "}
            <span className="font-display font-semibold text-saffron-deep">700 shlokas</span>,
            put a present-life question to Krishna Ji, and receive a reply
            rooted in the verse that fits the moment.
          </p>
          <p
            className="mb-7 font-deva text-base font-semibold text-ink-soft animate-fade-in-up lg:text-lg"
            style={{ animationDelay: "0.32s" }}
          >
            जो प्रश्न आज आप साथ लिए चल रहे हैं, उसका उत्तर गीता से लीजिए।
          </p>

          {/* CTAs */}
          <div
            className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener noreferrer" className="btn-architect">
              <svg width="16" height="18" viewBox="0 0 16 18" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                <path d="M1 1 L13 9 L1 17 Z" />
                <path d="M1 1 L10 12" />
                <path d="M1 17 L10 6" />
              </svg>
              Open on Google Play
            </a>
            <a href="#features" className="btn-ghost">
              Read the chapters
            </a>
          </div>

          {/* Meta strip — gold rule, three editorial credits */}
          <div
            className="rule-gold w-32 mb-5 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          />
          <dl
            className="grid max-w-md grid-cols-3 gap-x-6 gap-y-1 text-sm animate-fade-in"
            style={{ animationDelay: "0.55s" }}
          >
            <div>
              <dt className="eyebrow text-gold-deep">Shlokas</dt>
              <dd className="font-display text-3xl font-bold text-ink">700</dd>
            </div>
            <div>
              <dt className="eyebrow text-gold-deep">Languages</dt>
              <dd className="font-display text-3xl font-bold text-ink">21</dd>
            </div>
            <div>
              <dt className="eyebrow text-gold-deep">Chapters</dt>
              <dd className="font-display text-3xl font-bold text-ink">18</dd>
            </div>
          </dl>
        </div>

        {/* ── RIGHT COLUMN — composed art panel ── */}
        <div className="relative lg:col-span-5">
          <HeroArtPanel />
        </div>
      </div>

      {/* Bottom rule with verse */}
      <div className="border-y border-ink/25 bg-parchment-warm/60 backdrop-blur-sm">
        <div className="mx-auto flex max-w-canvas items-center gap-6 overflow-hidden px-6 py-4 lg:px-10">
          <span className="eyebrow shrink-0 text-gold-deep">
            From Chapter II · Verse 47
          </span>
          <div className="rule-gold hidden flex-1 sm:block" />
          <p className="shrink-0 font-deva text-base font-semibold text-ink lg:text-lg">
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।
          </p>
        </div>
      </div>
    </section>
  );
};

// ── Composed hero art: a parchment frame with a stylised chariot scene
//    illustrated entirely in SVG so the page has zero asset dependencies.
//    Replace this with a real Krishna+Arjuna illustration when ready —
//    see the TODO list returned to the user.
const HeroArtPanel = () => {
  return (
    <div className="relative aspect-[3/4] w-full">
      {/* Outer ornament frame */}
      <div className="absolute inset-0 border border-ink/25" />
      <div className="absolute inset-3 border border-gold/40" />

      {/* Composed scene */}
      <div className="absolute inset-6 overflow-hidden bg-parchment-ivory">
        {/* Soft horizon wash */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-saffron/15 via-saffron/5 to-transparent" />
        {/* Distant sun-disc */}
        <div className="absolute left-1/2 top-[28%] h-28 w-28 -translate-x-1/2 rounded-full bg-saffron/25 blur-2xl" />
        <div className="absolute left-1/2 top-[31%] h-16 w-16 -translate-x-1/2 rounded-full bg-saffron/60" />

        {/* Chariot scene SVG — stylised, monochrome ink line */}
        <svg
          viewBox="0 0 300 400"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 h-full w-full text-ink"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinecap="round"
          aria-hidden="true"
        >
          {/* Ground line */}
          <line x1="0" y1="320" x2="300" y2="320" strokeOpacity="0.35" />
          <line x1="0" y1="324" x2="300" y2="324" strokeOpacity="0.15" />

          {/* Distant temple silhouettes */}
          <g strokeOpacity="0.25" fill="currentColor" fillOpacity="0.08">
            <path d="M20 320 L20 280 L26 260 L32 280 L32 320 Z" />
            <path d="M260 320 L260 270 L268 245 L276 270 L276 320 Z" />
            <path d="M40 320 L40 300 L50 300 L50 320 Z" />
            <path d="M250 320 L250 296 L258 296 L258 320 Z" />
          </g>

          {/* Chariot wheels */}
          <g transform="translate(110 286)">
            <circle r="22" />
            <circle r="18" strokeOpacity="0.5" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2="0"
                y2="-22"
                transform={`rotate(${i * 45})`}
              />
            ))}
            <circle r="3" fill="currentColor" />
          </g>
          <g transform="translate(190 286)">
            <circle r="22" />
            <circle r="18" strokeOpacity="0.5" />
            {Array.from({ length: 8 }).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="0"
                x2="0"
                y2="-22"
                transform={`rotate(${i * 45})`}
              />
            ))}
            <circle r="3" fill="currentColor" />
          </g>

          {/* Chariot box */}
          <path d="M88 286 L212 286 L212 246 Q212 232 198 232 L102 232 Q88 232 88 246 Z" />
          {/* Decorative panel */}
          <path d="M100 270 L200 270 M100 254 L200 254" strokeOpacity="0.4" />
          <path
            d="M150 250 L156 258 L150 266 L144 258 Z"
            fill="currentColor"
            fillOpacity="0.3"
          />
          {/* Chariot pole forward */}
          <line x1="212" y1="266" x2="276" y2="262" />

          {/* Horses — four, suggested with arched necks */}
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${228 + i * 12} ${280 - i * 6})`}>
              <path d="M0 0 Q10 -22 22 -18 Q22 -10 14 -8 L8 6 L4 12 L0 6 Z" />
              <line x1="6" y1="12" x2="6" y2="22" />
              <line x1="14" y1="6" x2="16" y2="22" />
            </g>
          ))}

          {/* Banner-stave on the chariot */}
          <line x1="200" y1="232" x2="200" y2="170" />
          <path
            d="M200 174 L226 184 L200 196 Z"
            fill="currentColor"
            fillOpacity="0.4"
          />

          {/* Two figures — Krishna (front) holding reins, Arjuna (behind) */}
          {/* Krishna */}
          <g transform="translate(180 236)">
            <circle cx="0" cy="-10" r="6" />
            <path d="M-2 -6 Q-4 4 -6 14 L-12 22" /> {/* arm forward */}
            <path d="M-6 -4 L-10 14" />
            <path d="M-2 -4 L-2 16" />
          </g>
          {/* Arjuna */}
          <g transform="translate(140 234)">
            <circle cx="0" cy="-10" r="6" />
            <path d="M-2 -4 L-8 16" />
            <path d="M3 -4 L8 14" />
            {/* Gandiva bow held low */}
            <path
              d="M-12 18 Q-2 30 12 18"
              strokeOpacity="0.5"
              fill="none"
            />
          </g>

          {/* Faint shloka in the sky */}
          <text
            x="150"
            y="80"
            textAnchor="middle"
            fontFamily="var(--font-sanskrit), serif"
            fontSize="11"
            fill="currentColor"
            fillOpacity="0.4"
            stroke="none"
          >
            यदा यदा हि धर्मस्य
          </text>
          <text
            x="150"
            y="98"
            textAnchor="middle"
            fontFamily="var(--font-sanskrit), serif"
            fontSize="11"
            fill="currentColor"
            fillOpacity="0.4"
            stroke="none"
          >
            ग्लानिर्भवति भारत
          </text>
        </svg>

        {/* Corner monogram */}
        <div className="absolute right-3 top-3 font-sanskrit text-base text-saffron">
          ॐ
        </div>
        {/* Plate caption */}
        <div className="absolute inset-x-3 bottom-2 flex items-center justify-between text-[0.65rem] uppercase tracking-widest text-ink-fade">
          <span>Plate i.</span>
          <span>The Counsel</span>
        </div>
      </div>
    </div>
  );
};
