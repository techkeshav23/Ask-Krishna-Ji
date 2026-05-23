import { adminDb } from "@/lib/firebase-admin";
import PracharakActions from "./PracharakActions";

interface PracharakDoc {
  id: string;
  name: string;
  phone: string;
  whatsapp?: string;
  email: string;
  city?: string;
  state?: string;
  reference?: string;
  status: "pending" | "approved" | "rejected";
  totalCodesPurchased?: number;
  totalCodesRedeemed?: number;
  createdAt?: number;
}

export default async function AdminPracharaksPage({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  const filter = searchParams?.filter ?? "all";
  const rows = await loadPracharaks(filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Pracharaks</h1>
        <FilterTabs current={filter} />
      </div>
      <p className="text-text-secondary text-sm mb-4">
        {rows.length} {rows.length === 1 ? "record" : "records"}
      </p>

      {rows.length === 0 ? (
        <div className="card text-center text-text-secondary">
          No records for this filter.
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((p) => (
            <div key={p.id} className="card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={p.status} />
                    <span className="font-bold truncate">{p.name}</span>
                  </div>
                  <div className="text-xs text-text-secondary space-y-0.5">
                    <div>📞 {p.phone}{p.whatsapp ? ` · WA: ${p.whatsapp}` : ""}</div>
                    <div>✉️ {p.email}</div>
                    {p.city || p.state ? (
                      <div>
                        📍 {p.city}
                        {p.city && p.state ? ", " : ""}
                        {p.state}
                      </div>
                    ) : null}
                    {p.reference ? (
                      <div>👥 Ref: {p.reference}</div>
                    ) : null}
                    {p.status === "approved" ? (
                      <div className="mt-1">
                        🎟️ Purchased: {p.totalCodesPurchased || 0} · Redeemed:{" "}
                        {p.totalCodesRedeemed || 0}
                      </div>
                    ) : null}
                  </div>
                </div>
                <PracharakActions id={p.id} status={p.status} email={p.email} name={p.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function loadPracharaks(filter: string): Promise<PracharakDoc[]> {
  const db = adminDb();
  let query: FirebaseFirestore.Query = db.collection("pracharaks");
  if (filter === "pending" || filter === "approved" || filter === "rejected") {
    query = query.where("status", "==", filter);
  }
  const snap = await query.orderBy("createdAt", "desc").limit(100).get();
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PracharakDoc, "id">) }));
}

const StatusBadge: React.FC<{ status: PracharakDoc["status"] }> = ({ status }) => {
  const map: Record<PracharakDoc["status"], { bg: string; text: string; label: string }> = {
    pending: { bg: "bg-yellow-900/30", text: "text-yellow-200", label: "PENDING" },
    approved: { bg: "bg-green-900/30", text: "text-green-200", label: "APPROVED" },
    rejected: { bg: "bg-red-900/30", text: "text-red-200", label: "REJECTED" },
  };
  const s = map[status];
  return (
    <span
      className={`text-[10px] font-bold tracking-wide px-2 py-0.5 rounded ${s.bg} ${s.text}`}
    >
      {s.label}
    </span>
  );
};

const FilterTabs: React.FC<{ current: string }> = ({ current }) => {
  const tabs: { id: string; label: string }[] = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "approved", label: "Approved" },
    { id: "rejected", label: "Rejected" },
  ];
  return (
    <div className="flex gap-2 text-sm">
      {tabs.map((t) => (
        <a
          key={t.id}
          href={`/admin/pracharaks?filter=${t.id}`}
          className={`px-3 py-1 rounded-md border ${
            current === t.id
              ? "border-saffron bg-saffron/20 text-text-primary"
              : "border-saffron/20 text-text-secondary hover:text-text-primary"
          }`}
        >
          {t.label}
        </a>
      ))}
    </div>
  );
};
