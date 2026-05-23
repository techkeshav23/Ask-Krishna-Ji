import { adminDb } from "@/lib/firebase-admin";

interface OrderDoc {
  id: string;
  txnid: string;
  status: string;
  amount: string;
  productinfo: string;
  firstname: string;
  email: string;
  uid?: string | null;
  tier?: string;
  mode?: string | null;
  paidAt?: number;
  premiumUntil?: number;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  const filter = searchParams?.filter ?? "all";
  const rows = await loadOrders(filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h1 className="text-2xl font-bold">Orders</h1>
        <div className="flex gap-2 text-sm">
          {[
            { id: "all", label: "All" },
            { id: "success", label: "Success" },
            { id: "failure", label: "Failure" },
          ].map((t) => (
            <a
              key={t.id}
              href={`/admin/orders?filter=${t.id}`}
              className={`px-3 py-1 rounded-md border ${
                filter === t.id
                  ? "border-saffron bg-saffron/20 text-text-primary"
                  : "border-saffron/20 text-text-secondary hover:text-text-primary"
              }`}
            >
              {t.label}
            </a>
          ))}
        </div>
      </div>
      <p className="text-text-secondary text-sm mb-4">
        {rows.length} {rows.length === 1 ? "order" : "orders"} (last 100)
      </p>

      {rows.length === 0 ? (
        <div className="card text-center text-text-secondary">No orders.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase text-text-secondary border-b border-saffron/20">
                <th className="py-2 pr-3">Txn ID</th>
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">Amount</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Tier</th>
                <th className="py-2 pr-3">Paid At</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-saffron/10 hover:bg-bg-secondary/40"
                >
                  <td className="py-2 pr-3 font-mono text-xs">{o.txnid}</td>
                  <td className="py-2 pr-3">
                    <div className="font-semibold">{o.firstname}</div>
                    <div className="text-xs text-text-muted">{o.email}</div>
                  </td>
                  <td className="py-2 pr-3 font-bold text-gold">₹{o.amount}</td>
                  <td className="py-2 pr-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="py-2 pr-3 text-xs">{o.tier || "—"}</td>
                  <td className="py-2 pr-3 text-xs">
                    {o.paidAt
                      ? new Date(o.paidAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

async function loadOrders(filter: string): Promise<OrderDoc[]> {
  const db = adminDb();
  let query: FirebaseFirestore.Query = db.collection("orders");
  if (filter === "success" || filter === "failure") {
    query = query.where("status", "==", filter);
  }
  const snap = await query.orderBy("paidAt", "desc").limit(100).get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<OrderDoc, "id">) }));
}

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const lower = status.toLowerCase();
  const cls =
    lower === "success"
      ? "bg-green-900/30 text-green-200"
      : lower === "failure"
        ? "bg-red-900/30 text-red-200"
        : "bg-yellow-900/30 text-yellow-200";
  return (
    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${cls}`}>
      {status}
    </span>
  );
};
