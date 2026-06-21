import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { SacredVerse } from "@/components/SacredVerse";
import { AppShowcase } from "@/components/AppShowcase";
import { Features } from "@/components/Features";
import { Languages } from "@/components/Languages";
import { HowItWorks } from "@/components/HowItWorks";
import { Premium } from "@/components/Premium";
import { PracharakInvite } from "@/components/PracharakInvite";
import { Testimonials } from "@/components/Testimonials";
import { Faq } from "@/components/Faq";
import { Footer } from "@/components/Footer";

/**
 * Ask Krishna Ji — Production Landing.
 *
 * Composed as a printed book: each section is a chapter, the type pairs
 * Cormorant Garamond (English serif) with Tiro Devanagari Hindi (Sanskrit
 * display) and Noto Serif Devanagari (body Sanskrit). Every ornament is
 * inline SVG so the page has zero image dependencies before screenshots
 * and a real Krishna illustration are added.
 *
 * Section flow:
 *   Hero ▸ Sacred Verse ▸ App Showcase ▸ Features ▸ Languages
 *   ▸ How It Works ▸ Premium ▸ Pracharak ▸ Testimonials ▸ FAQ ▸ Footer
 */
export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <SacredVerse />
        <AppShowcase />
        <Features />
        <Languages />
        <HowItWorks />
        <Premium />
        <PracharakInvite />
        <Testimonials />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
