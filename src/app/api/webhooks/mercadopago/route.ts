import { NextRequest, NextResponse, after } from "next/server";
import { verifyMpSignature } from "@/lib/mercadopago-signature";
import { syncMpPayment } from "@/lib/mercadopago-sync";

// MercadoPago (and the Vercel proxy in front of this function) expects a
// fast response — if we make it wait on the full chain (fetch the payment
// from MP's API, Supabase round-trips, stock/FIFO RPCs, email send) it can
// report a 502 even though the work would've finished fine, and a
// platform-level timeout kills the function before it logs anything.
// Acknowledge immediately, then do the real work via after() so it keeps
// running in the background after the response is already sent.
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    const isValidSignature = verifyMpSignature({
      signatureHeader: req.headers.get("x-signature"),
      requestId: req.headers.get("x-request-id"),
      dataId: new URL(req.url).searchParams.get("data.id"),
      secret: process.env.MERCADOPAGO_WEBHOOK_SECRET,
    });

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { type, data } = body;

    if (type === "payment" && data?.id) {
      const paymentId = String(data.id);
      after(() =>
        syncMpPayment(paymentId).catch((err) =>
          console.error("[webhook] syncMpPayment (background):", err)
        )
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
