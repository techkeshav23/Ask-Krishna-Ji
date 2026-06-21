import { ChapterMark, DiamondRule } from "./Ornaments";

const STEPS = [
  {
    numeral: "I.",
    title: "Open the app",
    deva: "ऐप खोलिए",
    body: "Choose a language. The Gita arrives in the script you know — Hindi, Tamil, Bengali, English, twenty-one in total.",
  },
  {
    numeral: "II.",
    title: "Ask, or read",
    deva: "पूछिए, या पढ़िए",
    body: "Put a question to Krishna Ji and receive a Gita-rooted reply, or step into the reader and turn the pages of the seven hundred shlokas at your own pace.",
  },
  {
    numeral: "III.",
    title: "Return tomorrow",
    deva: "कल फिर आइए",
    body: "A single verse arrives each morning — a steady thread to wake the day around. The practice deepens by returning, not by rushing.",
  },
];

export const HowItWorks = () => {
  return (
    <section
      aria-label="How it works"
      className="relative py-14 lg:py-20"
    >
      <div className="mx-auto max-w-canvas px-6 lg:px-10">
        {/* Header */}
        <div className="mb-10 max-w-3xl">
          <div className="mb-5 flex items-center gap-3 text-gold-deep">
            <ChapterMark className="h-5 w-auto" />
            <span className="eyebrow">Chapter V · The Practice, Step by Step</span>
          </div>
          <h2 className="font-display text-display-md font-bold text-balance text-ink-deep">
            A practice in{" "}
            <span className="italic text-saffron">three movements.</span>
          </h2>
        </div>

        {/* Three columns — editorial, with hairline rules and Roman numerals */}
        <ol className="grid grid-cols-1 gap-px overflow-hidden border border-ink/15 bg-ink/15 md:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.numeral}
              className="relative flex flex-col bg-parchment-ivory p-8 lg:p-8"
            >
              <span className="mb-6 font-display text-7xl italic text-saffron/35 lg:text-8xl">
                {step.numeral}
              </span>
              <h3 className="mb-1 font-display text-3xl font-bold text-ink-deep">{step.title}</h3>
              <p className="mb-5 font-deva text-lg font-semibold text-ink-soft">{step.deva}</p>
              <p className="text-[1.05rem] leading-relaxed text-ink-soft">{step.body}</p>
            </li>
          ))}
        </ol>

        {/* Footer divider */}
        <div className="mt-10 flex items-center justify-center text-gold">
          <DiamondRule className="w-72 max-w-full" />
        </div>
      </div>
    </section>
  );
};
