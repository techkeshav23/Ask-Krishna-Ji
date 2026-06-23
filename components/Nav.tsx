import Link from "next/link";
import { Diamond } from "./Ornaments";

const NAV_LINKS = [
  // Anchors are absolute (/#section) so they work from any page, not
  // just the landing — on /premium or /pracharak the link first lands
  // the user back on the home page, then scrolls to the section.
  { href: "/#features", label: "Practice", deva: "अभ्यास" },
  { href: "/#languages", label: "Languages", deva: "भाषाएँ" },
  { href: "/#premium", label: "Membership", deva: "सदस्यता" },
  { href: "/pracharak", label: "Pracharak", deva: "प्रचारक" },
] as const;

export const Nav = () => {
  return (
    <nav
      aria-label="Primary"
      className="relative z-40 mx-auto flex max-w-canvas items-center justify-between px-6 pt-6 pb-4 lg:px-10 lg:pt-8"
    >
      {/* Mark — full brand wordmark "Ask Krishna Ji" with the honorific
          "Ji" rendered in the burnished-gold accent so it reads as a
          deliberate typographic mark, not an afterthought. */}
      <Link href="/" className="group inline-flex items-baseline gap-1.5 sm:gap-2">
        <span className="font-display text-lg font-bold leading-none text-ink-deep sm:text-2xl lg:text-[1.8rem]">
          Ask
        </span>
        <span className="font-display text-lg font-bold italic leading-none text-saffron-deep sm:text-2xl lg:text-[1.8rem]">
          Krishna
        </span>
        <span className="font-display text-lg font-bold leading-none text-gold-deep sm:text-2xl lg:text-[1.8rem]">
          Ji
        </span>
      </Link>

      {/* Centre links — old-style ornament rhythm */}
      <ul className="hidden items-center gap-7 lg:flex">
        {NAV_LINKS.map((link, idx) => (
          <li key={link.href} className="flex items-center gap-7">
            <Link
              href={link.href}
              className="group relative inline-flex flex-col items-center"
            >
              <span className="text-base font-semibold text-ink-deep transition-colors group-hover:text-saffron-deep">
                {link.label}
              </span>
              <span className="font-deva text-[0.75rem] font-semibold text-ink-soft transition-colors group-hover:text-saffron-deep">
                {link.deva}
              </span>
              <span className="absolute -bottom-1.5 left-1/2 h-px w-0 -translate-x-1/2 bg-saffron-deep transition-[width] duration-500 group-hover:w-8" />
            </Link>
            {idx < NAV_LINKS.length - 1 && (
              <Diamond size={4} className="text-gold-deep opacity-70" />
            )}
          </li>
        ))}
      </ul>

      {/* CTA — sharp gold underline */}
      <a
        href="https://play.google.com/store/apps/details?id=com.askkrishnaji.app"
        target="_blank"
        rel="noopener noreferrer"
        className="group hidden items-center gap-2 border-b-2 border-ink-deep pb-1 text-[0.95rem] font-semibold text-ink-deep transition-colors hover:border-saffron-deep hover:text-saffron-deep lg:inline-flex"
      >
        <span>Open the App</span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          className="transition-transform duration-300 group-hover:translate-x-1"
        >
          <path d="M2 8 H13 M9 4 L13 8 L9 12" />
        </svg>
      </a>

      {/* Mobile — single ornamental link */}
      <a
        href="https://play.google.com/store/apps/details?id=com.askkrishnaji.app"
        target="_blank"
        rel="noopener noreferrer"
        className="border-b-2 border-ink-deep pb-1 text-base font-semibold text-ink-deep lg:hidden"
      >
        Open App →
      </a>
    </nav>
  );
};
