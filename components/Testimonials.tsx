import { ChapterMark } from "./Ornaments";

/**
 * Editorial pull-quote testimonials. Treated like book-review blurbs in a
 * paperback flyleaf — single line, oversize opening quote, attribution
 * underneath in eyebrow caps. Replace placeholder testimonials with real
 * user voices once gathered (TODO list returned to user).
 */

type Testimonial = {
  quote: string;
  name: string;
  context: string; // city, role, etc.
};

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "I'd carried the Gita on the shelf for years. Now I carry it in my pocket and it answers me back.",
    name: "Asha Iyer",
    context: "Schoolteacher · Bengaluru",
  },
  {
    quote:
      "My mother reads in Tamil, I read in English. We meet at the same shloka. Something has settled between us.",
    name: "Karthik R.",
    context: "Engineer · Coimbatore",
  },
  {
    quote:
      "रोज़ सुबह एक श्लोक आता है, और मैं उसी को लेकर पूरा दिन चलती हूँ।",
    name: "Sushma Tiwari",
    context: "Homemaker · Lucknow",
  },
  {
    quote:
      "The reading discipline — ticking each section as read — slowed me down in the best way. I no longer race through.",
    name: "Vivek Khanna",
    context: "Designer · Delhi",
  },
];

export const Testimonials = () => {
  return (
    <section
      aria-label="Reader voices"
      className="relative py-14 lg:py-20"
    >
      <div className="mx-auto max-w-canvas px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <div className="mb-5 flex items-center gap-3 text-gold-deep">
            <ChapterMark className="h-5 w-auto" />
            <span className="eyebrow">Chapter VII · Reader Voices</span>
          </div>
          <h2 className="font-display text-display-md font-bold text-balance text-ink-deep">
            What the readers are{" "}
            <span className="italic text-saffron">saying.</span>
          </h2>
        </div>

        {/* 2x2 grid of pull-quotes */}
        <div className="grid grid-cols-1 gap-px border-t border-l border-ink/15 md:grid-cols-2">
          {TESTIMONIALS.map((t, idx) => (
            <figure
              key={idx}
              className="relative border-b border-r border-ink/15 p-8 lg:p-8"
            >
              {/* Oversize opening quote — visual anchor */}
              <span
                aria-hidden="true"
                className="absolute left-4 top-4 font-display text-5xl leading-none text-saffron/30 md:text-7xl lg:left-6 lg:top-2 lg:text-8xl"
              >
                &ldquo;
              </span>
              <blockquote className="pullquote relative pl-2 text-2xl font-medium text-ink-deep md:text-[1.85rem]">
                {t.quote}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-3 text-ink-soft">
                <span className="h-px w-8 bg-gold-deep" />
                <span className="font-display text-lg font-bold text-ink-deep">{t.name}</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
                  {t.context}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
