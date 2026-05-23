import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";
import { getServerSession } from "@/lib/session";

interface PracharakStats {
  name: string;
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
            You receive the codes via email + see them here in your portal.
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
