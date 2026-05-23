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
      <div className="max-w-6xl mx-auto px-4 py-6">{children}</div>
    </div>
  );
}

const AdminTopBar: React.FC<{ email: string }> = ({ email }) => (
  <header className="bg-bg-secondary border-b border-saffron/20">
    <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link
          href="/admin"
          className="font-bold text-saffron hover:text-saffron-light"
        >
          🙏 Admin · Ask Krishna Ji
        </Link>
        <nav className="hidden md:flex items-center gap-3 text-sm text-text-secondary">
          <Link href="/admin" className="hover:text-text-primary">
            Overview
          </Link>
          <Link href="/admin/pracharaks" className="hover:text-text-primary">
            Pracharaks
          </Link>
          <Link href="/admin/orders" className="hover:text-text-primary">
            Orders
          </Link>
          <Link href="/admin/codes" className="hover:text-text-primary">
            Codes
          </Link>
        </nav>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-text-muted hidden sm:inline">{email}</span>
        <LogoutButton />
      </div>
    </div>
  </header>
);

// Server component — uses a plain HTML form that POSTs to /api/auth/logout
// with a `redirect` field. The logout API clears the cookie + 303-redirects
// to /admin/login so the user lands cleanly without seeing a JSON response.
const LogoutButton: React.FC = () => (
  <form action="/api/auth/logout" method="POST">
    <input type="hidden" name="redirect" value="/admin/login" />
    <button
      type="submit"
      className="text-xs px-3 py-1 rounded-md bg-saffron-dark text-white hover:bg-saffron"
    >
      Logout
    </button>
  </form>
);
