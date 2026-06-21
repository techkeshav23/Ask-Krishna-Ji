import { ChapterMark, Lotus } from "./Ornaments";

/**
 * Editorial app showcase. Departs from the standard 3-phones-in-a-row
 * cliché: one large phone foregrounded, two smaller phones offset
 * behind it like overlapping plates in a hand-bound photo book.
 *
 * The phone bezels are rendered in SVG; replace the inner screen
 * contents with real screenshots when assets are available.
 */

type ScreenName = "chat" | "reader" | "samasya";

export const AppShowcase = () => {
  return (
    <section
      aria-label="A tour of the app"
      className="relative overflow-hidden py-24 lg:py-32"
    >
      <div className="mx-auto max-w-canvas px-6 lg:px-10">
        {/* Header — eyebrow + display + subhead — two-column layout */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div className="mb-5 flex items-center gap-3 text-gold-deep">
              <ChapterMark className="h-5 w-auto" />
              <span className="eyebrow">Chapter II · A Tour</span>
            </div>
            <h2 className="font-display text-display-md font-bold text-balance text-ink-deep">
              Bound like a book.{" "}
              <span className="italic text-saffron">Carried like a mantra.</span>
            </h2>
          </div>
          <p className="text-lg font-medium leading-relaxed text-ink-soft lg:col-span-5 lg:text-right lg:text-xl">
            Three rooms — a quiet chamber for asking, a reading room for the
            verses themselves, and a hall where today's questions are met with
            yesterday's answers.
          </p>
        </div>

        {/* Three phones — composed asymmetrically */}
        <div className="relative mx-auto grid h-[640px] max-w-5xl grid-cols-12 items-end lg:h-[720px]">
          {/* Left phone — Reader */}
          <div className="col-span-7 row-start-1 -mb-6 ml-2 mr-[-3rem] hidden translate-y-8 transform sm:block lg:col-span-4 lg:translate-y-12">
            <PhoneFrame screen="reader" rotate={-3.5} />
            <PlateCaption label="Plate ii. The Reading Room" />
          </div>

          {/* Centre phone — Chat (largest, foreground) */}
          <div className="col-span-12 row-start-1 z-20 sm:col-span-6 sm:col-start-4 lg:col-span-4 lg:col-start-5">
            <PhoneFrame screen="chat" featured />
            <PlateCaption label="Plate iii. The Quiet Chamber" centered />
          </div>

          {/* Right phone — Samasya */}
          <div className="col-span-7 col-start-6 row-start-1 -mb-6 ml-[-3rem] hidden translate-y-8 transform sm:block lg:col-span-4 lg:col-start-9 lg:translate-y-12">
            <PhoneFrame screen="samasya" rotate={3.5} />
            <PlateCaption label="Plate iv. Today's Questions" />
          </div>
        </div>

        {/* Lotus + divider footer */}
        <div className="mt-16 flex items-center justify-center gap-4 text-gold">
          <span className="h-px flex-1 bg-gold/40 max-w-[14rem]" />
          <Lotus className="h-7 w-auto opacity-80" />
          <span className="h-px flex-1 bg-gold/40 max-w-[14rem]" />
        </div>
      </div>
    </section>
  );
};

const PlateCaption = ({
  label,
  centered = false,
}: {
  label: string;
  centered?: boolean;
}) => (
  <p
    className={`mt-4 text-[0.65rem] uppercase tracking-widest text-ink-fade ${
      centered ? "text-center" : ""
    }`}
  >
    {label}
  </p>
);

const PhoneFrame = ({
  screen,
  rotate = 0,
  featured = false,
}: {
  screen: ScreenName;
  rotate?: number;
  featured?: boolean;
}) => {
  return (
    <div
      className="relative mx-auto w-full max-w-[300px] origin-bottom transition-transform duration-700 hover:rotate-0"
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      {/* Phone shell */}
      <div
        className={`relative aspect-[9/19] rounded-[2.6rem] border border-ink/30 bg-ink p-2 shadow-[0_30px_60px_-20px_rgba(42,28,15,0.45)] ${
          featured ? "scale-110" : ""
        }`}
        style={{
          background:
            "linear-gradient(150deg, #2A1C0F 0%, #1A1108 45%, #2A1C0F 100%)",
        }}
      >
        {/* Speaker notch */}
        <div className="absolute left-1/2 top-2 z-10 h-1 w-12 -translate-x-1/2 rounded-full bg-ink-soft/60" />
        {/* Inner screen */}
        <div className="relative h-full w-full overflow-hidden rounded-[2.1rem] bg-parchment">
          <PhoneScreen screen={screen} />
        </div>
      </div>
    </div>
  );
};

const PhoneScreen = ({ screen }: { screen: ScreenName }) => {
  if (screen === "chat") return <ChatScreenMock />;
  if (screen === "reader") return <ReaderScreenMock />;
  return <SamasyaScreenMock />;
};

// ── App screen mocks. Drawn as composed layouts rather than rectangles
//    so the showcase feels designed even before real screenshots land. ──
const ChatScreenMock = () => (
  <div className="flex h-full flex-col bg-parchment">
    <div className="flex items-center justify-between border-b border-ink/10 bg-parchment-warm px-3 pb-2 pt-4">
      <div className="text-[0.55rem] uppercase tracking-widest text-ink-fade">श्री कृष्ण से बात</div>
      <div className="text-[0.55rem] text-saffron">●</div>
    </div>
    <div className="flex-1 space-y-2 overflow-hidden p-3">
      {/* User bubble */}
      <div className="ml-auto max-w-[80%] rounded-2xl rounded-tr-sm bg-saffron px-3 py-2 text-[0.6rem] leading-tight text-parchment">
        मेरे मन में अशांति है, क्या करूँ?
      </div>
      {/* Krishna reply card */}
      <div className="max-w-[88%] rounded-2xl rounded-tl-sm border border-gold/40 bg-parchment-ivory p-3 shadow-sm">
        <div className="mb-1 text-[0.5rem] uppercase tracking-widest text-gold-deep">
          ◆ Gita · ii · 47
        </div>
        <div className="mb-1.5 font-sanskrit text-[0.7rem] leading-snug text-ink">
          कर्मण्येवाधिकारस्ते...
        </div>
        <div className="font-deva text-[0.55rem] leading-snug text-ink-soft">
          तुम कर्म पर ध्यान दो, फल पर नहीं। मन अपने आप शांत होगा।
        </div>
      </div>
    </div>
    <div className="border-t border-ink/10 bg-parchment-warm p-2">
      <div className="rounded-full border border-ink/20 bg-parchment-ivory px-3 py-1.5 text-[0.55rem] text-ink-fade">
        अपना प्रश्न लिखें...
      </div>
    </div>
  </div>
);

const ReaderScreenMock = () => (
  <div className="flex h-full flex-col bg-parchment-ivory">
    <div className="flex items-center justify-between border-b border-gold/30 bg-parchment-warm px-3 pb-2 pt-4">
      <div className="font-display text-[0.6rem] italic text-ink">Adhyāya ii</div>
      <div className="text-[0.55rem] uppercase tracking-widest text-gold-deep">47 / 700</div>
    </div>
    <div className="flex-1 overflow-hidden px-3 py-3">
      <div className="mb-1.5 text-[0.5rem] uppercase tracking-widest text-gold-deep">Verse 47</div>
      <div className="mb-3 font-sanskrit text-[0.7rem] leading-relaxed text-ink">
        कर्मण्येवाधिकारस्ते<br/>मा फलेषु कदाचन।<br/>
        मा कर्मफलहेतुर्भूर्मा<br/>ते सङ्गोऽस्त्वकर्मणि॥
      </div>
      <div className="mb-1 h-px w-12 bg-gold/40" />
      <div className="font-deva text-[0.55rem] leading-snug text-ink-soft">
        तुम्हारा अधिकार केवल कर्म पर है, फल पर नहीं...
      </div>
    </div>
    <div className="flex items-center justify-between border-t border-ink/10 px-3 py-2">
      <div className="h-1.5 w-1.5 rotate-45 bg-saffron" />
      <div className="flex gap-1">
        {[0,1,2,3].map(i=>(
          <div key={i} className={`h-1 w-3 rounded-full ${i<2?'bg-saffron':'bg-ink/15'}`} />
        ))}
      </div>
      <div className="h-1.5 w-1.5 rotate-45 bg-saffron" />
    </div>
  </div>
);

const SamasyaScreenMock = () => (
  <div className="flex h-full flex-col bg-parchment">
    <div className="flex items-center justify-between border-b border-ink/10 bg-parchment-warm px-3 pb-2 pt-4">
      <div className="text-[0.55rem] uppercase tracking-widest text-ink-fade">Today's Verse</div>
      <div className="text-[0.5rem] text-gold-deep">II · 47</div>
    </div>
    <div className="flex-1 overflow-hidden p-3">
      {/* Samasya card */}
      <div className="mb-2 rounded-lg border-l-2 border-saffron bg-parchment-ivory p-2.5">
        <div className="mb-1 text-[0.5rem] uppercase tracking-widest text-saffron-deep">समस्या</div>
        <div className="font-deva text-[0.6rem] leading-snug text-ink">
          काम का बोझ है, मन उलझा रहता है।
        </div>
      </div>
      {/* Samadhan card */}
      <div className="rounded-lg border-l-2 border-gold bg-parchment-ivory p-2.5">
        <div className="mb-1 text-[0.5rem] uppercase tracking-widest text-gold-deep">समाधान</div>
        <div className="mb-1 font-sanskrit text-[0.6rem] leading-snug text-ink">
          कर्मण्येवाधिकारस्ते...
        </div>
        <div className="font-deva text-[0.55rem] leading-snug text-ink-soft">
          फल की चिंता छोड़ें। बस कर्म करें।
        </div>
      </div>
    </div>
  </div>
);
