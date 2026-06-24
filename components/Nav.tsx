"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Danda, Diamond, Lotus } from "./Ornaments";

const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.askkrishnaji.app";
const CONTACT_EMAIL = "askkrishnaji@gmail.com";

// ── Link definitions ──────────────────────────────────────────────
// Anchors are absolute (/#section) so they work from any page, not just
// the landing — on /premium or /pracharak the link first lands the user
// back on the home page, then scrolls to the section.
const PRIMARY_LINKS = [
  { href: "/#features", label: "Practice", deva: "अभ्यास" },
  { href: "/#languages", label: "Languages", deva: "भाषाएँ" },
  { href: "/#premium", label: "Membership", deva: "सदस्यता" },
  { href: "/pracharak", label: "Pracharak", deva: "प्रचारक" },
] as const;

// Mobile menu carries a richer surface — primary nav PLUS legal docs +
// contact, since the mobile experience has no top-of-page peek into the
// footer where these live on desktop.
const SECONDARY_LINKS = [
  { href: "/about", label: "About", deva: "परिचय" },
  { href: "/privacy", label: "Privacy Policy", deva: "गोपनीयता" },
  { href: "/terms", label: "Terms of Use", deva: "नियम" },
  { href: "/refund", label: "Refund Policy", deva: "वापसी नीति" },
  { href: "/legal", label: "Legal Index", deva: "प्रकाशन" },
] as const;

export const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  // Body scroll lock + Escape-to-close, both wired together so we don't
  // forget one when adding the other.
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <nav
        aria-label="Primary"
        className="relative z-40 mx-auto flex max-w-canvas items-center justify-between px-6 pt-6 pb-4 lg:px-10 lg:pt-8"
      >
        {/* ── Brand wordmark ── */}
        <Link
          href="/"
          className="group inline-flex items-baseline gap-1.5 sm:gap-2"
          onClick={() => setMenuOpen(false)}
        >
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

        {/* ── Desktop links (lg+) — minimal top-of-page nav, with the
              fuller link set living in the footer + mobile drawer. ── */}
        <ul className="hidden items-center gap-7 lg:flex">
          {PRIMARY_LINKS.map((link, idx) => (
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
              {idx < PRIMARY_LINKS.length - 1 && (
                <Diamond size={4} className="text-gold-deep opacity-70" />
              )}
            </li>
          ))}
        </ul>

        {/* ── Desktop CTA (lg+) ── */}
        <a
          href={PLAY_STORE_URL}
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
            aria-hidden="true"
          >
            <path d="M2 8 H13 M9 4 L13 8 L9 12" />
          </svg>
        </a>

        {/* ── Hamburger button (mobile/tablet only) ── */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="primary-mobile-menu"
          onClick={() => setMenuOpen((o) => !o)}
          className="relative z-50 inline-flex h-10 w-10 items-center justify-center border border-ink-deep/30 text-ink-deep transition-colors hover:border-saffron-deep hover:text-saffron-deep lg:hidden"
        >
          {/* Three lines that transform into an X — pure CSS, no library. */}
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-current transition-transform duration-300 ${
                menuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 right-0 top-1/2 h-[1.5px] -translate-y-1/2 bg-current transition-opacity duration-200 ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 right-0 h-[1.5px] bg-current transition-transform duration-300 ${
                menuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
              }`}
            />
          </span>
        </button>
      </nav>

      {/* ── Mobile drawer + backdrop ── */}
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

// ── Slide-from-right drawer with full link surface ──────────────────
const MobileMenu = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <>
      {/* Backdrop — clicks here close the menu. Fades in/out, never moves
          so click handler stays in the same place visually. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-ink-deep/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Drawer — slides in from the right. Width caps at 22rem on tablets
          and full screen on phones for comfortable reach. */}
      <aside
        id="primary-mobile-menu"
        aria-label="Mobile navigation"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[22rem] flex-col overflow-y-auto bg-parchment-ivory shadow-[0_0_60px_-10px_rgba(26,16,6,0.6)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Decorative double border that echoes the foil-card frame */}
        <div aria-hidden="true" className="absolute inset-0 border-l border-gold/30 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-2 border border-gold/20 pointer-events-none" />

        <div className="relative flex h-full flex-col px-7 py-8">
          {/* Header — close button + brand mark */}
          <header className="mb-8 flex items-start justify-between gap-4">
            <Link
              href="/"
              onClick={onClose}
              className="inline-flex items-baseline gap-1.5"
            >
              <span className="font-display text-xl font-bold leading-none text-ink-deep">
                Ask
              </span>
              <span className="font-display text-xl font-bold italic leading-none text-saffron-deep">
                Krishna
              </span>
              <span className="font-display text-xl font-bold leading-none text-gold-deep">
                Ji
              </span>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="-mt-1 inline-flex h-9 w-9 items-center justify-center border border-ink-deep/30 text-ink-deep transition-colors hover:border-saffron-deep hover:text-saffron-deep"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M3 3 L13 13 M13 3 L3 13" />
              </svg>
            </button>
          </header>

          {/* Devanagari greeting strip */}
          <div className="mb-8 flex items-center gap-3 text-gold-deep">
            <span className="h-px flex-1 bg-gold-deep/30" />
            <span className="font-sanskrit text-base text-ink-soft">
              <Danda className="mr-1.5 text-gold-deep" />
              श्री कृष्णाय नमः
              <Danda className="ml-1.5 text-gold-deep" />
            </span>
            <span className="h-px flex-1 bg-gold-deep/30" />
          </div>

          {/* Primary links — large, generous tap targets */}
          <nav aria-label="Primary mobile" className="mb-8">
            <p className="eyebrow mb-4 text-gold-deep">The Practice</p>
            <ul className="space-y-1">
              {PRIMARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-baseline justify-between gap-4 border-b border-ink/10 py-3 transition-colors hover:border-saffron-deep/60"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-display text-xl font-semibold text-ink-deep transition-colors group-hover:text-saffron-deep">
                        {link.label}
                      </span>
                      <span className="font-deva text-sm font-semibold text-ink-soft">
                        {link.deva}
                      </span>
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      className="text-gold-deep opacity-60 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden="true"
                    >
                      <path d="M2 8 H13 M9 4 L13 8 L9 12" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal links — smaller, in the imprint colour */}
          <nav aria-label="Imprint" className="mb-8">
            <p className="eyebrow mb-4 text-gold-deep">The Imprint</p>
            <ul className="space-y-1">
              {SECONDARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    className="group flex items-baseline justify-between gap-4 py-2 transition-colors"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="text-base font-semibold text-ink-soft transition-colors group-hover:text-saffron-deep">
                        {link.label}
                      </span>
                      <span className="font-deva text-xs font-semibold text-ink-fade">
                        {link.deva}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact + CTA pinned near the bottom */}
          <div className="mt-auto">
            <div className="mb-6 flex items-center gap-3 text-gold-deep">
              <span className="h-px flex-1 bg-gold-deep/30" />
              <Lotus className="h-5 w-auto opacity-80" />
              <span className="h-px flex-1 bg-gold-deep/30" />
            </div>

            <p className="eyebrow mb-2 text-gold-deep">Contact</p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="form-link mb-6 inline-block text-sm"
            >
              {CONTACT_EMAIL}
            </a>

            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="btn-architect w-full justify-center"
            >
              <svg
                width="14"
                height="16"
                viewBox="0 0 16 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                aria-hidden="true"
              >
                <path d="M1 1 L13 9 L1 17 Z" />
              </svg>
              Open on Google Play
            </a>
            <p className="mt-3 text-center text-[0.7rem] italic text-ink-fade">
              Currently on Android · iOS edition coming soon
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
