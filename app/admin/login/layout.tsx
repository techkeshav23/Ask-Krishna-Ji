/**
 * Bypass the admin layout for the login page itself (which would
 * otherwise redirect-loop). This empty layout just renders children.
 */
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
