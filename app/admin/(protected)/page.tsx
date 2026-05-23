import Link from "next/link";
import { adminDb } from "@/lib/firebase-admin";

/**
 * Admin overview dashboard. Fetches headline counts server-side so the
 * page renders fully populated with no client-side flicker.
 */
export default async function AdminOverviewPage() {
  const stats = await loadStats();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Overview</h1>
      <p className="text-text-secondary text-sm mb-6">
        Snapshot of the platform · refresh the page for latest data.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          label="Pending Pracharaks"
          value={stats.pracharakPending}
          accent="saffron"
          href="/admin/pracharaks?filter=pending"
        />
        <StatCard
          label="Approved Pracharaks"
          value={stats.pracharakApproved}
          accent="gold"
          href="/admin/pracharaks?filter=approved"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          accent="saffron"
          href="/admin/orders"
        />
        <StatCard
          label="Codes Issued"
          value={stats.codesIssued}
          accent="gold"
          href="/admin/codes"
        />
        <StatCard
          label="Codes Redeemed"
          value={stats.codesRedeemed}
          accent="saffron"
          href="/admin/codes?filter=redeemed"
        />
        <StatCard
          label="Premium Users"
          value={stats.premiumUsers}
          accent="gold"
        />
        <StatCard
          label="Premium Revenue ₹"
          value={stats.premiumRevenue.toLocaleString("en-IN")}
          accent="saffron"
        />
        <StatCard
          label="Pending Activations"
          value={stats.pendingActivations}
          accent="gold"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <QuickLink
          href="/admin/pracharaks"
          icon="🪷"
          title="Manage Pracharaks"
          subtitle="Approve, reject, set passwords"
        />
        <QuickLink
          href="/admin/orders"
          icon="💳"
          title="View Orders"
          subtitle="All Premium + bulk transactions"
        />
        <QuickLink
          href="/admin/codes"
          icon="🎟️"
          title="Manage Codes"
          subtitle="Generate + track redemption"
        />
      </div>
    </div>
  );
}

interface Stats {
  pracharakPending: number;
  pracharakApproved: number;
  totalOrders: number;
  codesIssued: number;
  codesRedeemed: number;
  premiumUsers: number;
  premiumRevenue: number;
  pendingActivations: number;
}

async function loadStats(): Promise<Stats> {
  const db = adminDb();
  const [pending, approved, orders, codes, redeemed, premium, pendingAct] =
    await Promise.all([
      db.collection("pracharaks").where("status", "==", "pending").count().get(),
      db
        .collection("pracharaks")
        .where("status", "==", "approved")
        .count()
        .get(),
      db.collection("orders").count().get(),
      db.collection("subscriptionCodes").count().get(),
      db
        .collection("subscriptionCodes")
        .where("redeemedBy", "!=", null)
        .count()
        .get(),
      db.collection("users").where("isPremium", "==", true).count().get(),
      db
        .collection("pendingPremiumActivations")
        .where("claimed", "==", false)
        .count()
        .get(),
    ]);

  // Sum revenue from the most recent 1000 successful orders. Capped
  // so this dashboard load is bounded regardless of order volume. When
  // we cross 1000 orders, replace with a pre-aggregated daily stats
  // doc that the webhook increments — safer than ever-growing reads.
  let revenue = 0;
  const successfulOrders = await db
    .collection("orders")
    .where("status", "==", "success")
    .orderBy("paidAt", "desc")
    .limit(1000)
    .get();
  successfulOrders.forEach((d) => {
    const amt = parseFloat((d.data() as { amount?: string }).amount || "0");
    if (!Number.isNaN(amt)) revenue += amt;
  });

  return {
    pracharakPending: pending.data().count,
    pracharakApproved: approved.data().count,
    totalOrders: orders.data().count,
    codesIssued: codes.data().count,
    codesRedeemed: redeemed.data().count,
    premiumUsers: premium.data().count,
    premiumRevenue: revenue,
    pendingActivations: pendingAct.data().count,
  };
}

const StatCard: React.FC<{
  label: string;
  value: number | string;
  accent: "saffron" | "gold";
  href?: string;
}> = ({ label, value, accent, href }) => {
  const body = (
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
  return href ? <Link href={href}>{body}</Link> : body;
};

const QuickLink: React.FC<{
  href: string;
  icon: string;
  title: string;
  subtitle: string;
}> = ({ href, icon, title, subtitle }) => (
  <Link href={href} className="card hover:border-saffron transition-colors">
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-bold">{title}</div>
    <div className="text-sm text-text-secondary">{subtitle}</div>
  </Link>
);
