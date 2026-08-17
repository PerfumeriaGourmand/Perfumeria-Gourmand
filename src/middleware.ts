import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // API routes handle their own auth (requireAdmin()) independently of this
  // middleware's session refresh, and excluding them avoids an unnecessary
  // supabase.auth.getUser() round-trip on every API call — including
  // server-to-server webhooks like MercadoPago's, where the extra latency
  // was a plausible contributor to those requests timing out.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
