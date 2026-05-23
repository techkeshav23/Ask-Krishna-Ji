import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";
import { getServerSession } from "@/lib/session";

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
  // Layout already gated this — defensive null check for TS narrowing.
  if (!session || !session.docId) {
    return null;
  }
  const stats = await loadStats(session.docId);

  // Brand-new pracharak who hasn't paid for their first batch yet.
  // Show an activation gate instead of the usual dashboard so the next
  // action is unambiguous.
  if (stats.status === "pending_activation") {
    return <ActivationGate name={stats.name} />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">
        🙏 Welcome, {stats.name}
      </h1>
      <p className="text-text-secondary text-sm mb-6">
        Track your codes, view redemptions, and buy more bulk codes.
      </p>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Total Codes" value={stats.totalCodesPurchased} />
        <StatCard label="Redeemed" value={stats.totalCodesRedeemed} accent="gold" />
        <StatCard label="Available" value={stats.available} />
      </div>

      <Link
        href="/pracharak-portal/buy-codes"
        className="btn-primary block text-center mb-8"
      >
        🎟️ Buy More Codes
      </Link>

      <h2 className="font-bold text-saffron mb-3">Recent Codes</h2>
      {stats.recentCodes.length === 0 ? (
        <div className="card text-center text-text-secondary text-sm">
          No codes yet. Buy your first batch to get started.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase text-text-secondary border-b border-saffron/20">
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Issued</th>
                <th className="py-2 pr-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentCodes.map((c) => (
                <tr
                  key={c.code}
                  className="border-b border-saffron/10 hover:bg-bg-secondary/40"
                >
                  <td className="py-2 pr-3 font-mono">{c.code}</td>
                  <td className="py-2 pr-3 text-xs">
                    {new Date(c.generatedAt).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="py-2 pr-3 text-xs">
                    {c.redeemed ? (
                      <span className="text-green-300 font-bold">
                        ✓ Redeemed
                      </span>
                    ) : (
                      <span className="text-text-secondary">Available</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 card text-xs text-text-secondary">
        <p className="font-bold text-saffron mb-2">How it works</p>
        <ol className="list-decimal list-inside space-y-1">
          <li>Buy bulk codes at the Pracharak rate (₹500 each, min 5).</li>
          <li>
            Codes appear here in your portal — copy and share with users.
          </li>
          <li>
            Sell each code to a user at your chosen price (₹999 retail
            recommended).
          </li>
          <li>
            User redeems in the Ask Krishna Ji app — premium activates
            instantly for them.
          </li>
        </ol>
      </div>
    </div>
  );
}

const ActivationGate: React.FC<{ name: string }> = ({ name }) => (
  <div className="max-w-2xl mx-auto">
    <div className="card text-center py-10 px-6">
      <div className="text-5xl mb-3">🪷</div>
      <h1 className="text-3xl font-bold mb-2">
        Welcome, {name}!
      </h1>
      <p className="text-text-secondary mb-6">
        Your account is created. One last step — activate your Pracharak
        status by purchasing your first batch of subscription codes.
      </p>

      <div className="bg-bg-primary border border-saffron/30 rounded-lg p-5 mb-6 text-left">
        <p className="font-bold text-saffron mb-2">
          🎟️ First batch — ₹2,500 (5 codes × ₹500)
        </p>
        <ul className="text-sm text-text-secondary space-y-1 list-disc list-inside">
          <li>Each code activates Premium for one user (1 year).</li>
          <li>Sell at ₹999 (retail) → ₹499 margin per code.</li>
          <li>Codes appear in your portal immediately after payment.</li>
          <li>Buy more in any quantity (min 5) after activation.</li>
        </ul>
      </div>

      <Link
        href="/pracharak-portal/buy-codes"
        className="btn-primary inline-block w-full"
      >
        Activate now — Pay ₹2,500 →
      </Link>

      <p className="text-xs text-text-muted mt-4">
        Secure PayU checkout · Refundable within 24 hours if codes don't appear.
      </p>
    </div>
  </div>
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
  const p = (pSnap.data() as {
    name?: string;
    status?: string;
    totalCodesPurchased?: number;
    totalCodesRedeemed?: number;
  }) || {};
  const total = p.totalCodesPurchased || 0;
  const redeemed = p.totalCodesRedeemed || 0;
  const recentCodes = codesSnap.docs.map((d) => {
    const data = d.data() as { generatedAt: number; redeemedBy: string | null };
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
  accent?: "gold" | "saffron";
}> = ({ label, value, accent = "saffron" }) => (
  <div
    className={`card text-center ${
      accent === "gold" ? "border-gold/30" : "border-saffron/30"
    }`}
  >
    <div
      className={`text-2xl font-bold ${
        accent === "gold" ? "text-gold" : "text-saffron"
      }`}
    >
      {value}
    </div>
    <div className="text-xs text-text-secondary mt-1 uppercase tracking-wide">
      {label}
    </div>
  </div>
);
