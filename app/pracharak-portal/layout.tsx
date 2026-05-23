import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

/**
 * Pracharak portal — gated for authenticated pracharak sessions only.
 * /pracharak-portal/login bypasses via its own nested layout.
 */
export default function PracharakPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getServerSession();
  if (!session || session.role !== "pracharak") {
    redirect("/pracharak-portal/login");
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
