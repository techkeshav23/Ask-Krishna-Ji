import { ChapterMark } from "./Ornaments";

/**
 * The language parade. Twenty-one Indian scripts displayed at large size,
 * each rendered in its own native font. This is the most visually
 * distinctive section of the site — a typographic showcase that no
 * stock template would ever produce.
 *
 * The endonym (name of the language in its own script) is the primary
 * mark; the English exonym sits beneath as quiet caption.
 */

type Language = {
  endonym: string;       // name in its own script — the visual mark
  exonym: string;        // name in English
  code: string;          // ISO-like code (matches the app's i18n keys)
  fontClass: string;     // tailwind class that swaps to the native font
};

const LANGUAGES: Language[] = [
  { endonym: "हिन्दी",       exonym: "Hindi",     code: "hi",       fontClass: "font-deva" },
  { endonym: "English",     exonym: "English",   code: "en",       fontClass: "font-display" },
  { endonym: "Hinglish",    exonym: "Hinglish",  code: "hinglish", fontClass: "font-display italic" },
  { endonym: "বাংলা",        exonym: "Bengali",   code: "bn",       fontClass: "font-bengali" },
  { endonym: "অসমীয়া",       exonym: "Assamese",  code: "as",       fontClass: "font-bengali" },
  { endonym: "संस्कृतम्",      exonym: "Sanskrit",  code: "sa",       fontClass: "font-sanskrit" },
  { endonym: "नेपाली",       exonym: "Nepali",    code: "ne",       fontClass: "font-deva" },
  { endonym: "मैथिली",       exonym: "Maithili",  code: "mai",      fontClass: "font-deva" },
  { endonym: "कोंकणी",       exonym: "Konkani",   code: "kok",      fontClass: "font-deva" },
  { endonym: "كٲشُر",        exonym: "Kashmiri",  code: "ks",       fontClass: "font-nastaliq" },
  { endonym: "डोगरी",        exonym: "Dogri",     code: "doi",      fontClass: "font-deva" },
  { endonym: "سنڌي",        exonym: "Sindhi",    code: "sd",       fontClass: "font-nastaliq" },
  { endonym: "ગુજરાતી",      exonym: "Gujarati",  code: "gu",       fontClass: "font-gujarati" },
  { endonym: "ಕನ್ನಡ",        exonym: "Kannada",   code: "kn",       fontClass: "font-kannada" },
  { endonym: "മലയാളം",       exonym: "Malayalam", code: "ml",       fontClass: "font-malayalam" },
  { endonym: "मराठी",        exonym: "Marathi",   code: "mr",       fontClass: "font-deva" },
  { endonym: "ଓଡ଼ିଆ",         exonym: "Odia",      code: "or",       fontClass: "font-oriya" },
  { endonym: "ਪੰਜਾਬੀ",        exonym: "Punjabi",   code: "pa",       fontClass: "font-gurmukhi" },
  { endonym: "தமிழ்",        exonym: "Tamil",     code: "ta",       fontClass: "font-tamil" },
  { endonym: "తెలుగు",       exonym: "Telugu",    code: "te",       fontClass: "font-telugu" },
  { endonym: "اُردُو",         exonym: "Urdu",      code: "ur",       fontClass: "font-nastaliq" },
];

export const Languages = () => {
  return (
    <section
      id="languages"
      aria-label="Supported languages"
      className="relative bg-parchment-warm/40 py-24 lg:py-32"
    >
      {/* Top + bottom faint rules */}
      <div className="absolute inset-x-0 top-0 h-px bg-ink/15" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-ink/15" />

      <div className="mx-auto max-w-canvas px-6 lg:px-10">
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <div className="mb-5 flex items-center gap-3 text-gold-deep">
              <ChapterMark className="h-5 w-auto" />
              <span className="eyebrow">Chapter IV · The Tongues</span>
            </div>
            <h2 className="font-display text-display-md font-bold text-balance text-ink-deep">
              The Gita meets you in the language{" "}
              <span className="italic text-saffron">you pray in.</span>
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="text-lg font-medium leading-relaxed text-ink-soft md:text-right md:text-xl">
              Twenty-one scripts. Each verse retranslated for the modern reader
              in your own tongue. Below — the name of each language, set in its
              own letters.
            </p>
          </div>
        </div>

        {/* The parade — a tight grid of endonyms, each in native font */}
        <ul className="grid grid-cols-2 gap-px overflow-hidden border border-ink/15 bg-ink/15 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {LANGUAGES.map((lang, idx) => (
            <li
              key={lang.code}
              className="group relative flex flex-col items-center justify-center gap-1 bg-parchment-ivory px-4 py-7 transition-colors duration-500 hover:bg-parchment"
            >
              <span
                className={`block text-balance text-center text-[1.85rem] font-semibold leading-tight text-ink-deep transition-colors duration-500 group-hover:text-saffron-deep ${lang.fontClass}`}
                lang={lang.code}
              >
                {lang.endonym}
              </span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-ink-soft">
                {lang.exonym}
              </span>
              {/* Tiny ordinal marker — numbered like a list */}
              <span className="absolute left-2 top-2 font-mono text-[0.5rem] text-gold/60">
                {String(idx + 1).padStart(2, "0")}
              </span>
            </li>
          ))}
        </ul>

        {/* Footnote */}
        <p className="mt-10 text-center text-base italic text-ink-soft">
          Each translation is read, reviewed, and refreshed — never machine-dropped without care.
        </p>
      </div>
    </section>
  );
};
