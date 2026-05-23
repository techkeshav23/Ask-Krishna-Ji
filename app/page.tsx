import Link from "next/link";

const PREMIUM_PRICE = process.env.NEXT_PUBLIC_PREMIUM_PRICE_INR || "999";
const PLAY_STORE_URL =
  process.env.APP_PLAY_STORE_URL ||
  "https://play.google.com/store/apps/details?id=com.askkrishnaji.app";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 text-center max-w-3xl mx-auto">
        <div className="text-5xl mb-4">🙏</div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          Ask <span className="text-saffron">Krishna Ji</span>
        </h1>
        <p className="text-lg text-text-secondary mb-2">
          आपके जीवन का मार्गदर्शन, गीता से।
        </p>
        <p className="text-sm text-text-secondary opacity-80 mb-8">
          Spiritual guidance from Shrimad Bhagavad Gita — personalised
          conversations with Krishna Ji.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex items-center justify-center gap-2"
          >
            📱 Download on Play Store
          </a>
          <Link
            href="/premium"
            className="btn-gold inline-flex items-center justify-center gap-2"
          >
            ⭐ Go Premium · ₹{PREMIUM_PRICE}/year
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-12 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8">
          What's inside the app
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-3xl mb-3">📿</div>
            <h3 className="font-bold mb-2">Ask Krishna Ji</h3>
            <p className="text-sm text-text-secondary">
              Share your situation and receive Krishna-inspired guidance.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-3">📖</div>
            <h3 className="font-bold mb-2">Read 700 Shlokas</h3>
            <p className="text-sm text-text-secondary">
              Full Bhagavad Gita with translations across 20 languages.
            </p>
          </div>
          <div className="card text-center">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="font-bold mb-2">Modern Solutions</h3>
            <p className="text-sm text-text-secondary">
              Today's problems answered through Gita's eternal wisdom.
            </p>
          </div>
        </div>
      </section>

      {/* Premium pitch */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <div className="card border-gold/40 text-center">
          <div className="text-4xl mb-3">⭐</div>
          <h2 className="text-2xl font-bold mb-3">Premium Subscription</h2>
          <p className="text-text-secondary mb-1">
            Ad-free experience · Krishna Ji's mission ke saath jude
          </p>
          <p className="text-3xl font-bold text-gold my-4">
            ₹{PREMIUM_PRICE}
            <span className="text-base font-normal text-text-secondary">
              {" "}/ year
            </span>
          </p>
          <Link href="/premium" className="btn-gold inline-block">
            Subscribe Now
          </Link>
        </div>
      </section>

      {/* Pracharak pitch */}
      <section className="px-6 py-12 max-w-3xl mx-auto">
        <div className="card text-center">
          <div className="text-4xl mb-3">🪷</div>
          <h2 className="text-2xl font-bold mb-3">
            गीता के प्रचारक बनें
          </h2>
          <p className="text-text-secondary mb-4">
            Spread the message of Shrimad Bhagavad Gita. Sell premium
            subscriptions at a special bulk rate and earn while serving
            Krishna Ji's mission.
          </p>
          <Link href="/pracharak" className="btn-primary inline-block">
            Apply Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 mt-16 text-center text-sm text-text-muted border-t border-saffron/10">
        <p>© {new Date().getFullYear()} Ask Krishna Ji · Made with 🙏</p>
        <div className="mt-2 flex gap-4 justify-center">
          <a
            href="/privacy"
            className="hover:text-text-secondary transition-colors"
          >
            Privacy
          </a>
          <a
            href="/terms"
            className="hover:text-text-secondary transition-colors"
          >
            Terms
          </a>
        </div>
      </footer>
    </main>
  );
}
