import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { adminDb } from "@/lib/firebase-admin";

/**
 * Server-side gate for the pracharak portal. The route group
 * (`(protected)`) keeps /pracharak-portal/login outside this layout so
 * it can render without auth — preventing the redirect loop that hits
 * when a shared parent layout redirects unauth users to its own login
 * child.
 *
 * Status policy:
 *   - approved / pending_activation → portal renders (pages decide
 *     what to show based on status)
 *   - revoked / rejected           → kicked to login (treated as not
 *     authenticated; their session can't unlock the portal)
 */
export default async function PracharakPortalProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getServerSession();
  if (!session || session.role !== "pracharak" || !session.docId) {
    redirect("/pracharak-portal/login");
  }

  // Re-check status server-side so a revoked pracharak can't keep using
  // a still-valid JWT cookie. Doing this in the layout means every
  // protected page benefits without per-page boilerplate.
  const db = adminDb();
  const pSnap = await db.collection("pracharaks").doc(session.docId).get();
  if (!pSnap.exists) {
    redirect("/pracharak-portal/login");
  }
  const pData = pSnap.data() as { status?: string };
  const status = pData.status || "";
  if (status !== "approved" && status !== "pending_activation") {
    redirect("/pracharak-portal/login?revoked=1");
  }

  return (
    <div className="min-h-screen">
      <header className="bg-bg-secondary border-b border-saffron/20">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/pracharak-portal"
              className="font-bold text-saffron hover:text-saffron-light"
            >
              🪷 Pracharak · Ask Krishna Ji
            </Link>
            <nav className="hidden md:flex items-center gap-3 text-sm text-text-secondary">
              <Link
                href="/pracharak-portal"
                className="hover:text-text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/pracharak-portal/buy-codes"
                className="hover:text-text-primary"
              >
                Buy Codes
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted hidden sm:inline">
              {session.email}
            </span>
            <form action="/api/auth/logout" method="POST">
              <input
                type="hidden"
                name="redirect"
                value="/pracharak-portal/login"
              />
              <button
                type="submit"
                className="text-xs px-3 py-1 rounded-md bg-saffron-dark text-white hover:bg-saffron"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="max-w-5xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}
