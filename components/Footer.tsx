import Link from "next/link";
import { Danda, DiamondRule, Lotus } from "./Ornaments";

/**
 * Editorial footer. Treats the bottom of the page like the colophon of a
 * printed book: imprint, sections, blessing, and a centred mark below the
 * last page rule.
 */

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.askkrishnaji.app";

const COLUMNS = [
  {
    title: "The Practice",
    deva: "अभ्यास",
    links: [
      { href: "#features", label: "What's inside" },
      { href: "#languages", label: "Languages" },
      { href: "#premium", label: "Membership" },
      { href: "/pracharak", label: "Pracharak Program" },
    ],
  },
  {
    title: "The Imprint",
    deva: "प्रकाशन",
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/refund", label: "Refunds" },
      { href: "mailto:hello@askkrishnaji.com", label: "Contact" },
    ],
  },
  {
    title: "The Page",
    deva: "पृष्ठ",
    links: [
      { href: PLAY_STORE_URL, label: "Google Play", external: true },
      { href: "/about", label: "About" },
      { href: "/blog", label: "Notes" },
    ],
  },
] as const;

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-ink text-parchment-warm">
      {/* Faint paper grain on dark */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* ── Headline strip ── */}
      <div className="relative border-b border-gold/20">
        <div className="mx-auto grid max-w-canvas grid-cols-1 gap-8 px-6 py-10 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-14">
          <div className="lg:col-span-7">
            <p className="eyebrow mb-4 text-gold-soft">A Closing Word</p>
            <p className="font-display text-3xl font-semibold text-balance text-parchment lg:text-[2.6rem] lg:font-bold lg:leading-[1.15]">
              The day you begin is the day{" "}
              <span className="italic text-saffron-glow">the Gita begins to live with you.</span>
            </p>
          </div>
          <div className="flex flex-col items-start gap-3 lg:col-span-5 lg:items-end lg:justify-end">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 border-2 border-gold-soft bg-transparent px-6 py-3.5 font-display text-base font-semibold tracking-wide text-parchment transition-colors duration-300 hover:bg-gold-soft hover:text-ink-deep"
            >
              <Danda className="text-gold-soft" />
              Open on Google Play
            </a>
            <p className="text-sm italic text-parchment-warm/75">
              An iOS edition is in preparation.
            </p>
          </div>
        </div>
      </div>

      {/* ── Columns ── */}
      <div className="relative mx-auto max-w-canvas px-6 py-10 lg:px-10 lg:py-14">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-12">
          {/* Imprint mark — full brand wordmark with the "Ji" honorific
              picked out in burnished gold to match the navigation bar. */}
          <div className="col-span-2 md:col-span-3">
            <p className="font-display text-3xl font-bold leading-none text-parchment">
              Ask{" "}
              <span className="italic text-saffron-glow">Krishna</span>{" "}
              <span className="text-gold-soft">Ji</span>
            </p>
            <p className="mt-2 font-deva text-lg font-semibold text-parchment-warm/90">
              श्री कृष्ण से बात
            </p>
            <p className="mt-6 max-w-xs text-base leading-relaxed text-parchment-warm/85">
              A devotional companion to the Bhagavad Gita, designed to be
              returned to slowly, in any of the twenty-one tongues of India.
            </p>
          </div>

          {/* Three columns */}
          {COLUMNS.map((col) => (
            <div key={col.title} className="md:col-span-3">
              <p className="eyebrow mb-1 text-gold-soft">{col.title}</p>
              <p className="mb-4 font-deva text-sm font-semibold text-parchment-warm/70">
                {col.deva}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => {
                  const isExternal = "external" in link && link.external;
                  return (
                    <li key={link.href}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group inline-flex items-center gap-1.5 text-base font-medium text-parchment-warm transition-colors duration-300 hover:text-saffron-glow"
                        >
                          {link.label}
                          <span className="opacity-60 transition-transform duration-300 group-hover:translate-x-0.5">↗</span>
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-base font-medium text-parchment-warm transition-colors duration-300 hover:text-saffron-glow"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Colophon: blessing + copyright + imprint mark ── */}
      <div className="relative border-t border-gold/15">
        <div className="mx-auto max-w-canvas px-6 py-8 lg:px-10 lg:py-10">
          <div className="mb-8 flex items-center justify-center text-gold-soft">
            <DiamondRule className="w-full max-w-md opacity-80" />
          </div>

          <div className="flex flex-col items-center gap-4">
            <Lotus className="h-7 w-auto text-gold opacity-80" />
            <p className="font-sanskrit text-2xl text-parchment">
              <Danda className="mr-2 text-gold-soft" />
              सर्वे भवन्तु सुखिनः
              <Danda className="ml-2 text-gold-soft" />
            </p>
            <p className="text-sm italic text-parchment-warm/80">
              May all beings know contentment.
            </p>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-3 text-sm text-parchment-warm/70 sm:flex-row">
            <p>© {year} Ask Krishna Ji · An offering of the prachār.</p>
            <p className="font-mono text-xs font-semibold uppercase tracking-widest">
              Printed for the screen · Adhyāya 1.0.3
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
