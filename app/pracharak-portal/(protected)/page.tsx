import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";
import { getServerSession } from "@/lib/session";
import { Danda, DiamondRule, Lotus } from "@/components/Ornaments";

interface PracharakStats {
  name: string;
  status: string;
  totalCodesPurchased: number;
  totalCodesRedeemed: number;
  available: number;
  recentCodes: { code: string; generatedAt: number; redeemed: boolean }[];
}

export default async function PracharakDashboardPage() {
  const session = getServerSession();
  if (!session || !session.docId) {
    return null;
  }
  const stats = await loadStats(session.docId);

  if (stats.status === "pending_activation") {
    return <ActivationGate name={stats.name} />;
  }

  return (
    <div>
      {/* Header strip */}
      <div className="mb-10">
        <span className="eyebrow text-gold-deep">The Dashboard</span>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink-deep sm:text-4xl">
          Welcome, <span className="italic text-saffron-deep">{stats.name}</span>
        </h1>
        <p className="mt-2 text-base text-ink-soft">
          Track your codes, view redemptions, and purchase more bulk codes.
        </p>
      </div>

      {/* Stats — three-up editorial ledger */}
      <div className="mb-10 grid grid-cols-1 gap-px overflow-hidden border border-ink/15 bg-ink/15 sm:grid-cols-3">
        <StatCard label="Total Codes" value={stats.totalCodesPurchased} />
        <StatCard label="Redeemed" value={stats.totalCodesRedeemed} />
        <StatCard label="Available" value={stats.available} highlight />
      </div>

      {/* Primary CTA */}
      <Link
        href="/pracharak-portal/buy-codes"
        className="btn-solid btn-solid--saffron mb-10"
      >
        <Danda className="text-gold-soft" />
        Buy More Codes
      </Link>

      {/* Recent codes ledger */}
      <section>
        <div className="mb-4 flex items-center gap-3">
          <span className="eyebrow text-gold-deep">Recent Codes</span>
          <span className="h-px flex-1 bg-ink/15" />
        </div>

        {stats.recentCodes.length === 0 ? (
          <div className="border border-ink/15 bg-parchment-ivory p-10 text-center">
            <p className="font-display text-lg italic text-ink-soft">
              No codes yet — purchase your first batch to begin.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-ink/15 bg-parchment-ivory">
            <table className="w-full border-collapse text-[0.95rem]">
              <thead>
                <tr className="border-b border-ink/15">
                  <th className="py-3 pl-4 pr-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gold-deep">
                    Code
                  </th>
                  <th className="py-3 pr-3 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gold-deep">
                    Issued
                  </th>
                  <th className="py-3 pr-4 text-left text-[0.65rem] font-bold uppercase tracking-widest text-gold-deep">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentCodes.map((c) => (
                  <tr
                    key={c.code}
                    className="border-b border-ink/10 transition-colors last:border-b-0 hover:bg-parchment-warm/40"
                  >
                    <td className="py-3 pl-4 pr-3 font-mono text-sm text-ink-deep">
                      {c.code}
                    </td>
                    <td className="py-3 pr-3 text-sm text-ink-soft">
                      {new Date(c.generatedAt).toLocaleDateString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                      })}
                    </td>
                    <td className="py-3 pr-4 text-sm">
                      {c.redeemed ? (
                        <span className="inline-flex items-center gap-1.5 font-semibold text-saffron-deep">
                          <span className="h-1.5 w-1.5 rotate-45 bg-saffron-deep" />
                          Redeemed
                        </span>
                      ) : (
                        <span className="text-ink-fade">Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* How it works — colophon */}
      <section className="mt-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="eyebrow text-gold-deep">How It Works</span>
          <span className="h-px flex-1 bg-ink/15" />
        </div>
        <ol className="space-y-3 border-l-2 border-gold-deep/30 pl-6">
          <Step n="i">
            Buy bulk codes at the Pracharak rate (₹500 each, minimum 5).
          </Step>
          <Step n="ii">
            Codes appear here in your portal — copy and share with your sangh.
          </Step>
          <Step n="iii">
            Sell each code at your chosen price (₹999 retail recommended).
          </Step>
          <Step n="iv">
            User redeems inside the Ask Krishna Ji app — premium activates
            instantly.
          </Step>
        </ol>

        <div className="mt-12 flex items-center justify-center text-gold-deep">
          <DiamondRule className="w-full max-w-md opacity-70" />
        </div>
      </section>
    </div>
  );
}

const Step = ({ n, children }: { n: string; children: React.ReactNode }) => (
  <li className="flex items-start gap-4">
    <span className="font-display text-xl italic text-saffron-deep">{n}.</span>
    <span className="text-[1.02rem] leading-relaxed text-ink-soft">
      {children}
    </span>
  </li>
);

const ActivationGate: React.FC<{ name: string }> = ({ name }) => (
  <div className="mx-auto max-w-2xl">
    <div className="form-card text-center">
      <Lotus className="mx-auto mb-4 h-10 w-auto text-saffron-deep" />
      <div className="mb-2 inline-flex items-center gap-3 text-gold-deep">
        <span className="eyebrow">Welcome, Pracharak</span>
      </div>
      <h1 className="mt-1 font-display text-3xl font-bold text-ink-deep sm:text-4xl">
        Welcome, <span className="italic text-saffron-deep">{name}</span>
      </h1>
      <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-ink-soft">
        Your account is created. One step remains — activate your Pracharak
        status by purchasing your first batch of subscription codes.
      </p>

      <div className="my-8 border border-gold-deep/40 bg-parchment/60 p-5 text-left">
        <p className="eyebrow mb-3 text-gold-deep">
          <Danda className="mr-1.5 text-gold-deep" />
          First Batch · ₹2,500 (5 codes × ₹500)
        </p>
        <ul className="space-y-2 text-[0.95rem] text-ink-soft">
          <Bullet>Each code activates Premium for one user (1 year).</Bullet>
          <Bullet>Sell at ₹999 (retail) → ₹499 margin per code.</Bullet>
          <Bullet>Codes appear in your portal immediately after payment.</Bullet>
          <Bullet>Buy more in any quantity (min 5) after activation.</Bullet>
        </ul>
      </div>

      <Link
        href="/pracharak-portal/buy-codes"
        className="btn-solid btn-solid--saffron"
      >
        <Danda className="text-gold-soft" />
        Activate Now · Pay ₹2,500
      </Link>

      <p className="form-help mt-4 text-center">
        Secure PayU checkout · Refundable within 24 hours if codes don&apos;t appear.
      </p>
    </div>
  </div>
);

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3">
    <span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-saffron-deep" />
    <span>{children}</span>
  </li>
);

async function loadStats(pracharakId: string): Promise<PracharakStats> {
  const db = adminDb();
  const [pSnap, codesSnap] = await Promise.all([
    db.collection("pracharaks").doc(pracharakId).get(),
    db
      .collection("subscriptionCodes")
      .where("pracharakId", "==", pracharakId)
      .orderBy("generatedAt", "desc")
      .limit(25)
      .get(),
  ]);
  const p =
    (pSnap.data() as {
      name?: string;
      status?: string;
      totalCodesPurchased?: number;
      totalCodesRedeemed?: number;
    }) || {};
  const total = p.totalCodesPurchased || 0;
  const redeemed = p.totalCodesRedeemed || 0;
  const recentCodes = codesSnap.docs.map((d) => {
    const data = d.data() as {
      generatedAt: number;
      redeemedBy: string | null;
    };
    return {
      code: d.id,
      generatedAt: data.generatedAt,
      redeemed: !!data.redeemedBy,
    };
  });
  return {
    name: p.name || "Pracharak",
    status: p.status || "pending_activation",
    totalCodesPurchased: total,
    totalCodesRedeemed: redeemed,
    available: Math.max(0, total - redeemed),
    recentCodes,
  };
}

const StatCard: React.FC<{
  label: string;
  value: number;
  highlight?: boolean;
}> = ({ label, value, highlight = false }) => (
  <div className="bg-parchment-ivory p-6 text-center">
    <div
      className={`font-display text-5xl font-bold ${
        highlight ? "text-saffron-deep" : "text-ink-deep"
      }`}
    >
      {value}
    </div>
    <div className="mt-2 text-[0.65rem] font-bold uppercase tracking-widest text-gold-deep">
      {label}
    </div>
  </div>
);
