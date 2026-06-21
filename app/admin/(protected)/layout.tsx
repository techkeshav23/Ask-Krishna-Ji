import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "@/lib/session";

/**
 * Server-side gate for protected admin pages. The route group
 * (`(protected)`) keeps /admin/login outside this layout so it can
 * render without auth — preventing the redirect loop that hits when a
 * shared parent layout redirects unauth users to its own login child.
 */
export default function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getServerSession();
  if (!session || session.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen">
      <AdminTopBar email={session.email} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </div>
    </div>
  );
}

const AdminTopBar: React.FC<{ email: string }> = ({ email }) => (
  <header className="border-b border-ink/15 bg-parchment-ivory/80 backdrop-blur-sm">
    <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="inline-flex items-baseline gap-2">
          <span className="font-display text-lg font-bold leading-none text-ink-deep">
            Admin
          </span>
          <span className="hidden text-xs font-semibold uppercase tracking-widest text-gold-deep sm:inline">
            · Ask Krishna Ji
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-ink-soft md:flex">
          <Link href="/admin" className="transition-colors hover:text-saffron-deep">
            Overview
          </Link>
          <Link
            href="/admin/pracharaks"
            className="transition-colors hover:text-saffron-deep"
          >
            Pracharaks
          </Link>
          <Link
            href="/admin/orders"
            className="transition-colors hover:text-saffron-deep"
          >
            Orders
          </Link>
          <Link
            href="/admin/codes"
            className="transition-colors hover:text-saffron-deep"
          >
            Codes
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs font-medium text-ink-fade sm:inline">
          {email}
        </span>
        <LogoutButton />
      </div>
    </div>
  </header>
);

const LogoutButton: React.FC = () => (
  <form action="/api/auth/logout" method="POST">
    <input type="hidden" name="redirect" value="/admin/login" />
    <button
      type="submit"
      className="border border-ink/40 bg-transparent px-3 py-1.5 text-xs font-semibold tracking-wide text-ink-deep transition-colors hover:border-saffron-deep hover:text-saffron-deep"
    >
      Logout
    </button>
  </form>
);
