import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Tiro_Devanagari_Hindi,
  Noto_Serif_Devanagari,
  Lora,
} from "next/font/google";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#F6EBD0",
  width: "device-width",
  initialScale: 1,
};

// ── Cormorant Garamond — kept for display headings only. Its delicate
//    high-contrast strokes give the page its editorial character, but it
//    is too thin to use as body copy on a cream background. Loaded at
//    heavier weights (600/700) for confident headline presence. ──
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

// ── Lora — purpose-built screen serif, used as the body face. Far more
//    substantial than Cormorant at small sizes — readable across the
//    25-65 devotee demographic without losing the editorial register. ──
const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-body",
  display: "swap",
});

// ── Tiro Devanagari Hindi — single-weight calligraphic display face,
//    used only for the largest Sanskrit moments (the chapter mantra,
//    the full shloka). Body Devanagari uses Noto Serif (heavier). ──
const tiroSanskrit = Tiro_Devanagari_Hindi({
  subsets: ["devanagari"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-sanskrit",
  display: "swap",
});

// ── Noto Serif Devanagari — body Devanagari. Loaded with 700 for the
//    heavier accents that the Hindi-speaking audience expects. ──
const notoDeva = Noto_Serif_Devanagari({
  subsets: ["devanagari"],
  weight: ["500", "600", "700"],
  variable: "--font-deva",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ask Krishna Ji — Conversations with the Bhagavad Gita",
  description:
    "A devotional companion to the Bhagavad Gita: chat with Krishna, read all 700 shlokas in 21 Indian languages, and find a Gita-rooted answer to the question you are carrying today.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://askkrishnaji.com"
  ),
  openGraph: {
    title: "Ask Krishna Ji",
    description:
      "Conversations with the Bhagavad Gita, in your language.",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ask Krishna Ji",
    description: "Conversations with the Bhagavad Gita, in your language.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${lora.variable} ${tiroSanskrit.variable} ${notoDeva.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
