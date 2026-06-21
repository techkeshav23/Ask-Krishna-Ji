import type { SVGProps } from "react";

/**
 * Hand-drawn ornament set inspired by Indian manuscript chapter-heads.
 * Every shape is composed inline so the design has zero asset dependencies
 * and renders crisply at every resolution. Stroke widths are tuned for
 * burnished-gold ink on parchment, not for crisp UI.
 */

// ── A long diamond rule that splits sections. Wears a centre flourish. ──
export const DiamondRule = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 600 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    aria-hidden="true"
    {...props}
  >
    <line x1="0" y1="12" x2="265" y2="12" />
    <line x1="335" y1="12" x2="600" y2="12" />
    <g transform="translate(300 12)">
      <path d="M-22 0 L0 -8 L22 0 L0 8 Z" fill="currentColor" fillOpacity="0.18" />
      <path d="M-12 0 L0 -4 L12 0 L0 4 Z" fill="currentColor" />
      <circle cx="-32" cy="0" r="1.6" fill="currentColor" />
      <circle cx="32" cy="0" r="1.6" fill="currentColor" />
    </g>
  </svg>
);

// ── Small inline diamond used between words. ◆ ──
export const Diamond = ({
  size = 6,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <span
    className={`inline-block rotate-45 align-middle ${className}`}
    style={{
      width: size,
      height: size,
      background: "currentColor",
    }}
    aria-hidden="true"
  />
);

// ── Chapter ornament — concentric diamonds with a centre dot.
//    Sits above a section heading like a manuscript chapter mark. ──
export const ChapterMark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 60 28"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    aria-hidden="true"
    {...props}
  >
    <path d="M30 4 L52 14 L30 24 L8 14 Z" />
    <path d="M30 9 L44 14 L30 19 L16 14 Z" fill="currentColor" fillOpacity="0.25" />
    <circle cx="30" cy="14" r="1.6" fill="currentColor" />
    <line x1="2" y1="14" x2="6" y2="14" />
    <line x1="54" y1="14" x2="58" y2="14" />
  </svg>
);

// ── Dharma Chakra (8-spoke wheel). The hero centrepiece —
//    rotates slowly as a subtle living detail. ──
export const Chakra = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 400 400"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    aria-hidden="true"
    {...props}
  >
    {/* Outer rim */}
    <circle cx="200" cy="200" r="195" />
    <circle cx="200" cy="200" r="186" />
    {/* Decorative dots between rims */}
    {Array.from({ length: 64 }).map((_, i) => {
      const angle = (i / 64) * Math.PI * 2;
      const x = 200 + Math.cos(angle) * 190.5;
      const y = 200 + Math.sin(angle) * 190.5;
      return <circle key={i} cx={x} cy={y} r="0.6" fill="currentColor" stroke="none" />;
    })}
    {/* Inner rim */}
    <circle cx="200" cy="200" r="168" />
    {/* 8 spokes with tapered tips (Dharma Chakra) */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * 360;
      return (
        <g key={i} transform={`rotate(${angle} 200 200)`}>
          <line x1="200" y1="40" x2="200" y2="360" />
          <path d="M200 40 L196 56 L204 56 Z" fill="currentColor" />
          <path d="M200 360 L196 344 L204 344 Z" fill="currentColor" />
        </g>
      );
    })}
    {/* Diagonal half-spokes between primaries — 8 more for 16-spoke balance */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * 360 + 22.5;
      return (
        <g key={`d-${i}`} transform={`rotate(${angle} 200 200)`}>
          <line x1="200" y1="60" x2="200" y2="340" strokeOpacity="0.45" />
        </g>
      );
    })}
    {/* Inner medallion */}
    <circle cx="200" cy="200" r="60" />
    <circle cx="200" cy="200" r="52" strokeOpacity="0.5" />
    {/* Centre lotus — 8 petals */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * 360;
      return (
        <g key={`p-${i}`} transform={`rotate(${angle} 200 200)`}>
          <path
            d="M200 154 Q210 174 200 196 Q190 174 200 154 Z"
            fill="currentColor"
            fillOpacity="0.15"
          />
        </g>
      );
    })}
    <circle cx="200" cy="200" r="4" fill="currentColor" />
  </svg>
);

// ── Corner flourish — for foil cards and editorial frames ──
export const CornerFlourish = ({
  flip = false,
  ...props
}: SVGProps<SVGSVGElement> & { flip?: boolean }) => (
  <svg
    viewBox="0 0 60 60"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    aria-hidden="true"
    style={flip ? { transform: "scaleX(-1)" } : undefined}
    {...props}
  >
    <path d="M2 2 L2 22 M2 2 L22 2" />
    <path d="M2 28 Q14 28 14 16 Q14 6 24 6" strokeOpacity="0.65" />
    <circle cx="14" cy="14" r="2" fill="currentColor" />
  </svg>
);

// ── Lotus silhouette — used as section punctuation ──
export const Lotus = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 80 56"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    aria-hidden="true"
    {...props}
  >
    {/* Centre petal */}
    <path d="M40 8 Q44 28 40 50 Q36 28 40 8 Z" />
    {/* Mid petals */}
    <path d="M40 50 Q18 38 16 16 Q34 28 40 50 Z" />
    <path d="M40 50 Q62 38 64 16 Q46 28 40 50 Z" />
    {/* Outer petals */}
    <path d="M40 50 Q6 42 2 22 Q22 28 40 50 Z" strokeOpacity="0.55" />
    <path d="M40 50 Q74 42 78 22 Q58 28 40 50 Z" strokeOpacity="0.55" />
  </svg>
);

// ── Decorative shloka bracket (Devanagari double-danda style) ── ॥ ─
export const Danda = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-block font-sanskrit ${className}`}
    style={{ letterSpacing: "0.1em" }}
    aria-hidden="true"
  >
    ॥
  </span>
);

// ── Yantra — sacred geometry. Sits behind hero/quote sections at very low
//    opacity. Eight-petal lotus inscribed in nested squares, classic style. ──
export const Yantra = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 500 500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    stroke="currentColor"
    strokeWidth="0.8"
    aria-hidden="true"
    {...props}
  >
    <circle cx="250" cy="250" r="245" />
    <circle cx="250" cy="250" r="220" />
    {/* Outer square */}
    <rect x="50" y="50" width="400" height="400" />
    {/* Rotated inner square */}
    <rect
      x="100" y="100" width="300" height="300"
      transform="rotate(45 250 250)"
    />
    {/* Inner square */}
    <rect x="115" y="115" width="270" height="270" />
    {/* Lotus circle */}
    <circle cx="250" cy="250" r="120" />
    {/* 8 lotus petals around centre */}
    {Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * 360;
      return (
        <g key={i} transform={`rotate(${angle} 250 250)`}>
          <path d="M250 130 Q272 175 250 220 Q228 175 250 130 Z" />
        </g>
      );
    })}
    {/* Sri yantra-style triangles */}
    <path d="M250 170 L340 320 L160 320 Z" />
    <path d="M250 330 L160 180 L340 180 Z" />
    <circle cx="250" cy="250" r="6" fill="currentColor" />
  </svg>
);

// ── Bindu — small filled circle used as paragraph marker ──
export const Bindu = ({ className = "" }: { className?: string }) => (
  <span
    className={`inline-block rounded-full align-middle ${className}`}
    style={{ width: 5, height: 5, background: "currentColor" }}
    aria-hidden="true"
  />
);
