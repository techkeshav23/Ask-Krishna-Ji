import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import { adminDb } from "@/lib/firebase-admin";
import { Lotus } from "@/components/Ornaments";

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
      {/* Header bar — parchment with ink hairline, matches the editorial look */}
      <header className="border-b border-ink/15 bg-parchment-ivory/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-4">
            <Link
              href="/pracharak-portal"
              className="inline-flex items-center gap-2"
            >
              <Lotus className="h-5 w-auto text-saffron-deep" />
              <span className="font-display text-lg font-bold leading-none text-ink-deep">
                Pracharak
              </span>
              <span className="hidden text-xs font-semibold uppercase tracking-widest text-gold-deep sm:inline">
                · Ask Krishna Ji
              </span>
            </Link>
            <nav className="hidden items-center gap-5 text-sm font-semibold text-ink-soft md:flex">
              <Link
                href="/pracharak-portal"
                className="transition-colors hover:text-saffron-deep"
              >
                Dashboard
              </Link>
              <Link
                href="/pracharak-portal/buy-codes"
                className="transition-colors hover:text-saffron-deep"
              >
                Buy Codes
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-medium text-ink-fade md:inline">
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
                className="border border-ink/40 bg-transparent px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-deep transition-colors hover:border-saffron-deep hover:text-saffron-deep"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </div>
    </div>
  );
}
