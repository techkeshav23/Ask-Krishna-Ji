import { NextRequest, NextResponse } from "next/server";
import { getRequestSession } from "@/lib/session";

/**
 * GET /api/auth/me
 * Returns the current session payload (role, email, docId) or 401.
 * Used by client components to bootstrap their auth-aware UI.
 */
export async function GET(req: NextRequest) {
  const session = getRequestSession(req);
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    role: session.role,
    email: session.email,
    docId: session.docId,
  });
}
