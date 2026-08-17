import { NextRequest, NextResponse } from "next/server";
import { syncMpPayment } from "@/lib/mercadopago-sync";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Fallback for when the MercadoPago webhook doesn't arrive/fails: called
// from /checkout/success with the payment_id MercadoPago put in the
// redirect URL. Always re-fetches the payment from MercadoPago's API rather
// than trusting anything from the client.
export async function POST(req: NextRequest) {
  if (!(await rateLimit(`sync-payment:${getClientIp(req)}`, 20, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Demasiados intentos" }, { status: 429 });
  }

  try {
    const { payment_id } = await req.json();
    if (!payment_id) {
      return NextResponse.json({ error: "payment_id requerido" }, { status: 400 });
    }

    const result = await syncMpPayment(String(payment_id));
    if (!result) {
      return NextResponse.json({ error: "Pago no encontrado" }, { status: 404 });
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("[sync-payment] error:", err);
    return NextResponse.json({ error: "Error al sincronizar el pago" }, { status: 500 });
  }
}
