import { adminDb } from "@/lib/firebase-admin";
import GenerateCodesForm from "./GenerateCodesForm";

interface CodeDoc {
  code: string;
  pracharakId: string;
  pracharakName?: string;
  pracharakEmail?: string;
  generatedAt: number;
  redeemedBy: string | null;
  redeemedAt: number | null;
  expiresAt?: number;
}

interface PracharakOption {
  id: string;
  name: string;
  email: string;
}

export default async function AdminCodesPage({
  searchParams,
}: {
  searchParams?: { filter?: string };
}) {
  const filter = searchParams?.filter ?? "all";
  const [codes, approvedPracharaks] = await Promise.all([
    loadCodes(filter),
    loadApprovedPracharaks(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Codes</h1>

      <div className="card mb-6">
        <h2 className="font-bold mb-3 text-saffron">Generate Codes</h2>
        <p className="text-xs text-text-secondary mb-4">
          Issues N unique subscription codes for an approved Pracharak.
          Codes are emailed to the Pracharak automatically and saved in
          Firestore for tracking.
        </p>
        <GenerateCodesForm pracharaks={approvedPracharaks} />
      </div>

      <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
        <div className="text-text-secondary text-sm">
          {codes.length} {codes.length === 1 ? "code" : "codes"} (last 100)
        </div>
        <div className="flex gap-2 text-sm">
          {[
            { id: "all", label: "All" },
            { id: "available", label: "Available" },
            { id: "redeemed", label: "Redeemed" },
          ].map((t) => (
            <a
              key={t.id}
              href={`/admin/codes?filter=${t.id}`}
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

      {codes.length === 0 ? (
        <div className="card text-center text-text-secondary">
          No codes for this filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-left text-xs uppercase text-text-secondary border-b border-saffron/20">
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Pracharak</th>
                <th className="py-2 pr-3">Generated</th>
                <th className="py-2 pr-3">Redeemed</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr
                  key={c.code}
                  className="border-b border-saffron/10 hover:bg-bg-secondary/40"
                >
                  <td className="py-2 pr-3 font-mono">{c.code}</td>
                  <td className="py-2 pr-3 text-xs">
                    {c.pracharakName || c.pracharakId}
                  </td>
                  <td className="py-2 pr-3 text-xs">
                    {new Date(c.generatedAt).toLocaleDateString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="py-2 pr-3 text-xs">
                    {c.redeemedAt ? (
                      <span className="text-green-300">
                        ✓ {new Date(c.redeemedAt).toLocaleDateString("en-IN")}
                      </span>
                    ) : (
                      <span className="text-text-muted">—</span>
                    )}
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

async function loadCodes(filter: string): Promise<CodeDoc[]> {
  const db = adminDb();
  let query: FirebaseFirestore.Query = db.collection("subscriptionCodes");
  if (filter === "redeemed") {
    query = query.where("redeemedBy", "!=", null);
  } else if (filter === "available") {
    query = query.where("redeemedBy", "==", null);
  }
  const snap = await query.orderBy("generatedAt", "desc").limit(100).get();
  return snap.docs.map((d) => {
    const data = d.data() as Omit<CodeDoc, "code">;
    return { code: d.id, ...data };
  });
}

async function loadApprovedPracharaks(): Promise<PracharakOption[]> {
  const db = adminDb();
  const snap = await db
    .collection("pracharaks")
    .where("status", "==", "approved")
    .orderBy("name")
    .limit(200)
    .get();
  return snap.docs.map((d) => {
    const data = d.data() as { name: string; email: string };
    return { id: d.id, name: data.name, email: data.email };
  });
}
