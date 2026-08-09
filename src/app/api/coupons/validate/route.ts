import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCoupon } from "@/lib/coupons";

export async function POST(req: NextRequest) {
  if (!(await rateLimit(`coupon:${getClientIp(req)}`, 15, 5 * 60 * 1000))) {
    return NextResponse.json({ error: "Demasiados intentos. Probá de nuevo en unos minutos." }, { status: 429 });
  }

  try {
    const { code, subtotal } = await req.json();

    if (!code || typeof subtotal !== "number") {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabase = await createAdminClient();
    const result = await validateCoupon(supabase, code, subtotal);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
