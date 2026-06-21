import { DiamondRule } from "./Ornaments";

/**
 * Full-bleed pull quote — the Gita's most-quoted verse, treated like the
 * opening of a chapter in a Penguin Classics edition. The Sanskrit is the
 * art; the English is small and reverent.
 */
export const SacredVerse = () => {
  return (
    <section
      aria-label="Verse from the Bhagavad Gita"
      className="relative bg-ink py-24 lg:py-32"
    >
      {/* Subtle gold border lines top and bottom */}
      <div className="absolute inset-x-0 top-0 h-px bg-gold/30" />
      <div className="absolute inset-x-0 top-2 h-px bg-gold/15" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gold/30" />
      <div className="absolute inset-x-0 bottom-2 h-px bg-gold/15" />

      {/* Faint paper grain stays warm even on dark ink */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-canvas px-6 lg:px-10">
        {/* Eyebrow + chapter mark */}
        <div className="mb-12 flex items-center gap-4 text-gold-soft">
          <DiamondRule className="hidden w-64 sm:block" />
          <span className="eyebrow text-gold-soft">Bhagavad Gita · ii · 47</span>
          <DiamondRule className="hidden flex-1 sm:block" />
        </div>

        {/* The Sanskrit shloka — display Devanagari, generous leading */}
        <blockquote className="mx-auto max-w-4xl">
          <p
            className="font-sanskrit text-3xl leading-[1.55] text-parchment text-balance md:text-4xl lg:text-5xl"
            lang="sa"
          >
            कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।<br />
            मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥
          </p>

          {/* Tiny diamond rule between Sanskrit and English */}
          <div className="my-10 flex items-center justify-center gap-2 text-gold-soft">
            <span className="h-px w-12 bg-gold-soft/60" />
            <span className="text-xs">◆</span>
            <span className="h-px w-12 bg-gold-soft/60" />
          </div>

          {/* English translation — italic, smaller, reverent */}
          <p className="pullquote mx-auto max-w-2xl text-center text-xl leading-relaxed text-parchment-warm md:text-2xl">
            “You have a right to your labour, never to its fruits.
            Let not the fruits be your motive; nor let your attachment
            be to inaction.”
          </p>

          {/* Attribution */}
          <footer className="mt-10 text-center">
            <p className="eyebrow text-gold-soft">
              spoken by Śrī Kṛṣṇa to Arjuna · Kurukṣetra
            </p>
          </footer>
        </blockquote>
      </div>
    </section>
  );
};
