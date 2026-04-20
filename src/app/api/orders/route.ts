import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import MercadoPagoConfig, { Preference } from "mercadopago";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      payment_method,
      installments,
      items,
      notes,
    } = body;

    if (!customer_name || !customer_email || !items?.length) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Calculate totals
    const subtotal: number = items.reduce(
      (sum: number, i: { unit_price: number; quantity: number }) =>
        sum + i.unit_price * i.quantity,
      0
    );
    const total = subtotal; // shipping TBD

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone: customer_phone || null,
        shipping_address: shipping_address || null,
        payment_method,
        installments: installments ?? 1,
        subtotal,
        shipping_cost: 0,
        total,
        notes: notes || null,
        payment_status: "pending",
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order creation error:", orderError);
      return NextResponse.json({ error: "Error al crear la orden" }, { status: 500 });
    }

    // Create order items
    const orderItems = items.map(
      (i: {
        id: string;
        name: string;
        size_ml?: number;
        quantity: number;
        unit_price: number;
      }) => ({
        order_id: order.id,
        variant_id: i.id,
        kit_id: null,
        product_name: i.name,
        size_ml: i.size_ml ?? null,
        quantity: i.quantity,
        unit_price: i.unit_price,
        total_price: i.unit_price * i.quantity,
      })
    );

    await supabase.from("order_items").insert(orderItems);

    // Create MercadoPago preference (for card payments)
    if (payment_method !== "bank_transfer") {
      try {
        const preference = new Preference(mpClient);
        const mpItems = items.map((i: { name: string; unit_price: number; quantity: number }) => ({
          title: i.name,
          unit_price: i.unit_price,
          quantity: i.quantity,
          currency_id: "ARS",
        }));

        const preferenceData = await preference.create({
          body: {
            items: mpItems,
            payer: {
              name: customer_name,
              email: customer_email,
              phone: customer_phone ? { number: customer_phone } : undefined,
            },
            payment_methods: {
              installments: installments ?? 1,
              excluded_payment_types:
                payment_method === "debit_card"
                  ? [{ id: "credit_card" }]
                  : payment_method === "credit_card"
                  ? [{ id: "debit_card" }]
                  : [],
            },
            back_urls: {
              success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${order.id}`,
              failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout?error=payment_failed`,
              pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?order_id=${order.id}&status=pending`,
            },
            auto_return: "approved",
            external_reference: order.id,
            notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
          },
        });

        // Save preference ID
        await supabase
          .from("orders")
          .update({ mp_preference_id: preferenceData.id })
          .eq("id", order.id);

        return NextResponse.json({
          order_id: order.id,
          init_point: preferenceData.init_point,
        });
      } catch (mpError) {
        console.error("MercadoPago error:", mpError);
        // Still return order ID even if MP fails
      }
    }

    return NextResponse.json({ order_id: order.id });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
