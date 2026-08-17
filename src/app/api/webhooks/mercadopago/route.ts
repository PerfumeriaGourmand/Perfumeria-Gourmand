import { NextRequest, NextResponse } from "next/server";
import { verifyMpSignature } from "@/lib/mercadopago-signature";
import { syncMpPayment } from "@/lib/mercadopago-sync";

// Default serverless timeout (10s) can be too tight for this chain: fetch
// the payment from MercadoPago's API, two Supabase round-trips, the
// stock/FIFO RPCs, and the email send — especially on a cold start. A
// platform-level timeout kills the function before it can log anything,
// which is consistent with these requests not showing up in Vercel logs.
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

    if (type !== "payment" || !data?.id) {
      return NextResponse.json({ received: true });
    }

    await syncMpPayment(String(data.id));

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
