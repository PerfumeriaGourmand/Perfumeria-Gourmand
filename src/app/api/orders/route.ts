import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import MercadoPagoConfig, { Preference } from "mercadopago";
import { sendOrderConfirmation } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { validateCoupon } from "@/lib/coupons";
import { findOutOfStockItem } from "@/lib/stock";

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN!,
});

export async function POST(req: NextRequest) {
  if (!(await rateLimit(`orders:${getClientIp(req)}`, 5, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Demasiados intentos. Probá de nuevo en unos minutos." }, { status: 429 });
  }

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
      coupon_code,
    } = body;

    if (!customer_name || !customer_email || !items?.length) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabase = await createAdminClient();

    // Validate stock at the moment of order creation — stock is only
    // decremented later on payment approval, so this can't fully close the
    // race window, but it stops accepting orders for items already sold out.
    const variantIds = items
      .map((i: { id: string }) => i.id)
      .filter(Boolean);
    const { data: variants, error: variantsError } = await supabase
      .from("product_variants")
      .select("id, stock, is_active")
      .in("id", variantIds);

    if (variantsError) {
      console.error("Stock check error:", variantsError);
      return NextResponse.json({ error: "Error al verificar stock" }, { status: 500 });
    }

    const outOfStockItem = findOutOfStockItem(items, variants ?? []);
    if (outOfStockItem) {
      return NextResponse.json(
        { error: `"${outOfStockItem.name}" ya no tiene stock disponible. Actualizá tu carrito.` },
        { status: 409 }
      );
    }

    // Calculate totals
    const subtotal: number = items.reduce(
      (sum: number, i: { unit_price: number; quantity: number }) =>
        sum + i.unit_price * i.quantity,
      0
    );

    // Re-validate the coupon and recompute the discount server-side — never
    // trust a discount_amount sent by the client, it could be tampered with.
    let appliedCouponCode: string | null = null;
    let discountAmount = 0;
    if (coupon_code) {
      const couponResult = await validateCoupon(supabase, coupon_code, subtotal);
      if (!couponResult.valid) {
        return NextResponse.json({ error: couponResult.error }, { status: 400 });
      }
      appliedCouponCode = couponResult.code;
      discountAmount = couponResult.discount_amount;
    }

    const total = Math.max(0, subtotal - discountAmount); // shipping TBD

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
        coupon_code: appliedCouponCode,
        discount_amount: discountAmount,
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

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      await supabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: "Error al crear los items del pedido" }, { status: 500 });
    }

    // Send confirmation email (fire-and-forget)
    sendOrderConfirmation({
      orderId: order.id,
      customerName: customer_name,
      customerEmail: customer_email,
      items,
      subtotal,
      total,
      paymentMethod: payment_method,
      installments: installments ?? 1,
      shippingAddress: shipping_address ?? null,
      notes: notes ?? null,
    }).catch((err) => console.error("[email] sendOrderConfirmation:", err));

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

        // Reflect the coupon discount as a negative line item so the amount
        // charged in MercadoPago matches the discounted total — without this
        // the customer would see a discount in the UI but pay full price.
        if (discountAmount > 0) {
          mpItems.push({
            title: `Descuento (${appliedCouponCode})`,
            unit_price: -discountAmount,
            quantity: 1,
            currency_id: "ARS",
          });
        }

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
