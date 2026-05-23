import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ask Krishna Ji — Bhagavad Gita Guidance",
  description:
    "Spiritual guidance from Shrimad Bhagavad Gita — personalised conversations with Krishna Ji, 700 shlokas with translations, modern problem-and-solution wisdom.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://askkrishnaji.com"
  ),
  openGraph: {
    title: "Ask Krishna Ji",
    description:
      "Spiritual guidance from the Bhagavad Gita — in your language.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
