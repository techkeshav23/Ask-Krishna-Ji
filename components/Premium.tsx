import { ChapterMark, CornerFlourish, Danda } from "./Ornaments";

const PREMIUM_PRICE = process.env.NEXT_PUBLIC_PREMIUM_PRICE_INR || "999";
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.askkrishnaji.app";

const TIER_COMMON = {
  label: "Wayfarer",
  deva: "पथिक",
  price: "Free",
  pitch: "Begin the practice. Read the verses, ask Krishna Ji, and receive the daily shloka.",
  includes: [
    "All 700 shlokas in 21 languages",
    "Daily verse delivered each morning",
    "Conversational guidance from the Gita",
    "Brief sponsor messages between chapters",
  ],
};

const TIER_PREMIUM = {
  label: "Pilgrim",
  deva: "तीर्थयात्री",
  pricePrefix: "₹",
  priceUnit: "/year",
  pitch: "An undisturbed seat. The proceeds keep the daily verses going for everyone else.",
  includes: [
    "All Wayfarer benefits",
    "Reading is uninterrupted — no sponsor messages",
    "Faster generation in the chamber",
    "A monthly option at ₹99/month for the open-ended",
    "Quiet contribution to the prachār",
  ],
};

export const Premium = () => {
  return (
    <section
      id="premium"
      aria-label="Premium membership"
      className="relative py-24 lg:py-32"
    >
      <div className="mx-auto max-w-canvas px-6 lg:px-10">
        {/* Header — centred this time, like a printed dedication page */}
        <div className="mb-16 text-center">
          <div className="mb-5 inline-flex items-center gap-3 text-gold-deep">
            <ChapterMark className="h-5 w-auto" />
            <span className="eyebrow">Chapter VI · A Choice of Seat</span>
          </div>
          <h2 className="mx-auto max-w-2xl font-display text-display-md font-bold text-balance text-ink-deep">
            <span className="italic">Begin freely.</span>{" "}
            Step nearer when you wish.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-xl leading-relaxed text-ink-soft">
            Two seats are offered. Both bring the whole Gita; one removes the
            sponsor messages and supports the work of the daily verse.
          </p>
        </div>

        {/* Two-column tier card layout */}
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-ink/15 bg-ink/15 lg:grid-cols-2">
          {/* ── Wayfarer (Free) ── */}
          <article className="bg-parchment-ivory p-8 lg:p-12">
            <header className="mb-8">
              <p className="eyebrow mb-2 text-ink-fade">Common Path</p>
              <h3 className="font-display text-4xl font-bold text-ink-deep">{TIER_COMMON.label}</h3>
              <p className="font-deva text-lg font-semibold text-ink-soft">{TIER_COMMON.deva}</p>
              <div className="my-6 h-px w-12 bg-ink/30" />
              <p className="font-display text-6xl font-bold text-ink-deep">
                {TIER_COMMON.price}
              </p>
              <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
                {TIER_COMMON.pitch}
              </p>
            </header>

            <ul className="space-y-3">
              {TIER_COMMON.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1 w-3 shrink-0 bg-ink/40" />
                  <span className="text-[1.05rem] font-medium text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <a
                href="https://play.google.com/store/apps/details?id=com.askkrishnaji.app"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
              >
                Begin Freely
              </a>
            </div>
          </article>

          {/* ── Pilgrim (Premium) — gold foil ── */}
          <article className="foil-card relative p-8 lg:p-12">
            {/* Corner flourishes — make the card feel embossed */}
            <CornerFlourish className="absolute left-2 top-2 h-7 w-7 text-gold-deep" />
            <CornerFlourish flip className="absolute right-2 top-2 h-7 w-7 text-gold-deep" />
            <CornerFlourish className="absolute bottom-2 left-2 h-7 w-7 rotate-180 text-gold-deep" />
            <CornerFlourish flip className="absolute bottom-2 right-2 h-7 w-7 rotate-180 text-gold-deep" />

            <header className="mb-8">
              <p className="eyebrow mb-2 text-gold-deep">
                <Danda className="mr-1.5 text-gold-deep" />
                Pilgrim's Path
                <Danda className="ml-1.5 text-gold-deep" />
              </p>
              <h3 className="font-display text-4xl font-bold text-ink-deep">{TIER_PREMIUM.label}</h3>
              <p className="font-deva text-lg font-semibold text-ink-soft">{TIER_PREMIUM.deva}</p>
              <div className="my-6 h-px w-12 bg-gold-deep/60" />
              <p className="font-display text-6xl font-bold text-ink-deep">
                <span className="text-4xl align-top">{TIER_PREMIUM.pricePrefix}</span>
                {PREMIUM_PRICE}
                <span className="ml-1 font-body text-base font-medium italic text-ink-soft">
                  {TIER_PREMIUM.priceUnit}
                </span>
              </p>
              <p className="mt-4 max-w-md text-[1.05rem] leading-relaxed text-ink-soft">
                {TIER_PREMIUM.pitch}
              </p>
            </header>

            <ul className="space-y-3">
              {TIER_PREMIUM.includes.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-saffron" />
                  <span className="text-[1.05rem] font-medium text-ink-soft">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-architect"
              >
                <Danda className="text-gold-soft" />
                Take the Pilgrim's Seat
              </a>
            </div>

            <p className="mt-6 text-xs italic text-ink-fade">
              Billed annually via Google Play. Cancel at any time from your Play account.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
};
