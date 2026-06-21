/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Parchment surfaces — the manuscript background ──
        parchment: {
          DEFAULT: "#F3E8C8",
          warm: "#EDDDB6",
          aged: "#E4D0A4",
          deep: "#D6BE8A",
          ivory: "#FAF1D6",
        },
        // ── Ink — for type. Warm, never pure black. Pulled deeper than
        //    earlier draft so body text holds up on cream backgrounds. ──
        ink: {
          DEFAULT: "#1A1006",
          deep: "#0D0803",
          soft: "#382410",
          fade: "#6A4C2E",
          ghost: "#9A7B5A",
        },
        // ── Saffron — sacred orange, the colour of the renouncer ──
        saffron: {
          DEFAULT: "#B8451E",
          deep: "#8A3015",
          fire: "#D9572A",
          glow: "#E8825A",
        },
        // ── Sindoor red — the auspicious tilaka ──
        sindoor: {
          DEFAULT: "#A01818",
          deep: "#7B0F0F",
        },
        // ── Burnished gold — for foil-stamped accents ──
        gold: {
          DEFAULT: "#A88332",
          leaf: "#C9A227",
          deep: "#806020",
          soft: "#D9BD6E",
          whisper: "#EEDFA8",
        },
        // ── Indigo — peacock feather / Krishna's complexion ──
        peacock: {
          DEFAULT: "#1F3A5F",
          deep: "#0F2440",
        },
      },
      fontFamily: {
        // English serif display + body (single-family commit for editorial coherence)
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
        // Devanagari for headlines (Tiro Devanagari Hindi)
        sanskrit: ["var(--font-sanskrit)", "Sanskrit Text", "serif"],
        // Devanagari for body
        deva: ["var(--font-deva)", "Sanskrit Text", "serif"],
        // Monospace for caption numerals
        mono: ["ui-monospace", "Menlo", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 9vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.75rem, 6vw, 5.25rem)", { lineHeight: "1.02", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(2rem, 4vw, 3.5rem)", { lineHeight: "1.08", letterSpacing: "-0.01em" }],
        "eyebrow": ["0.6875rem", { lineHeight: "1.2", letterSpacing: "0.22em" }],
      },
      letterSpacing: {
        widest: "0.28em",
      },
      maxWidth: {
        canvas: "82rem",
        column: "44rem",
      },
      animation: {
        "rotate-slow": "rotate-slow 80s linear infinite",
        "fade-in-up": "fade-in-up 1.1s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 1s ease-out both",
        "ornament-draw": "ornament-draw 1.6s cubic-bezier(0.5, 0, 0.2, 1) forwards",
        marquee: "marquee 60s linear infinite",
      },
      keyframes: {
        "rotate-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "ornament-draw": {
          from: { strokeDashoffset: "1000", opacity: "0" },
          to: { strokeDashoffset: "0", opacity: "1" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
