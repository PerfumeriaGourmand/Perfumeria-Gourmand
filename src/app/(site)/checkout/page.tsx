"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import Button from "@/components/ui/Button";
import GoldDivider from "@/components/ui/GoldDivider";
import toast from "react-hot-toast";
import type { ShippingAddress, PaymentMethod } from "@/types";

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string; desc: string }[] = [
  { id: "credit_card", label: "Tarjeta de crédito", desc: "Hasta 12 cuotas sin interés" },
  { id: "debit_card", label: "Tarjeta de débito", desc: "Pago inmediato" },
  { id: "bank_transfer", label: "Transferencia / CBU", desc: "5% de descuento" },
  { id: "mercadopago_wallet", label: "MercadoPago", desc: "Billetera digital" },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const router = useRouter();
  const subtotal = total();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"info" | "payment">("info");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [installments, setInstallments] = useState(1);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    apt: "",
    city: "",
    province: "",
    zip: "",
    notes: "",
  });

  const updateForm = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-6">
        <p className="font-display text-3xl text-text-mid">
          Tu carrito está vacío
        </p>
        <button
          onClick={() => router.push("/catalogo")}
          className="px-8 py-3 border border-text-dark text-text-dark rounded-full font-sans text-sm hover:bg-text-dark hover:text-white transition-colors"
        >
          Ver catálogo
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === "info") { setStep("payment"); return; }

    setLoading(true);
    try {
      const shippingAddress: ShippingAddress = {
        street: form.street,
        number: form.number,
        apt: form.apt || undefined,
        city: form.city,
        province: form.province,
        zip: form.zip,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          shipping_address: shippingAddress,
          payment_method: paymentMethod,
          installments,
          items: items.map((i) => ({
            id: i.id,
            type: i.type,
            name: i.name,
            size_ml: i.size_ml,
            quantity: i.quantity,
            unit_price: i.price,
          })),
          notes: form.notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Error al crear la orden");

      // Redirect to MercadoPago or success page
      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        clearCart();
        router.push(`/checkout/success?order_id=${data.order_id}`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al procesar el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="py-12">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-4">
            Finalizar compra
          </p>
          <h1 className="font-display font-light text-5xl text-text-dark">Checkout</h1>
        </div>

        <GoldDivider className="mb-12" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-8">
              {step === "info" ? (
                <>
                  <section>
                    <h2 className="font-display text-xl text-text-dark mb-6 tracking-wide">
                      Datos de contacto
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Nombre completo"
                        value={form.name}
                        onChange={(v) => updateForm("name", v)}
                        required
                        className="sm:col-span-2"
                      />
                      <Input
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(v) => updateForm("email", v)}
                        required
                      />
                      <Input
                        label="Teléfono"
                        type="tel"
                        value={form.phone}
                        onChange={(v) => updateForm("phone", v)}
                      />
                    </div>
                  </section>

                  <GoldDivider />

                  <section>
                    <h2 className="font-display text-xl text-text-dark mb-6 tracking-wide">
                      Dirección de envío
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Calle"
                        value={form.street}
                        onChange={(v) => updateForm("street", v)}
                        required
                        className="col-span-2 sm:col-span-1"
                      />
                      <Input
                        label="Número"
                        value={form.number}
                        onChange={(v) => updateForm("number", v)}
                        required
                      />
                      <Input
                        label="Piso / Depto"
                        value={form.apt}
                        onChange={(v) => updateForm("apt", v)}
                      />
                      <Input
                        label="Ciudad"
                        value={form.city}
                        onChange={(v) => updateForm("city", v)}
                        required
                      />
                      <Input
                        label="Provincia"
                        value={form.province}
                        onChange={(v) => updateForm("province", v)}
                        required
                      />
                      <Input
                        label="Código postal"
                        value={form.zip}
                        onChange={(v) => updateForm("zip", v)}
                        required
                      />
                    </div>
                  </section>

                  <section>
                    <label className="block font-sans text-[10px] tracking-widest uppercase text-text-mid mb-2">
                      Notas (opcional)
                    </label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                      rows={3}
                      className="w-full bg-white border border-border-light text-text-dark text-sm font-sans p-3 rounded-xl focus:border-gold/50 focus:outline-none resize-none placeholder:text-text-light transition-colors"
                      placeholder="Instrucciones para el envío, etc."
                    />
                  </section>
                </>
              ) : (
                <section>
                  <h2 className="font-display text-xl text-text-dark mb-6 tracking-wide">
                    Medio de pago
                  </h2>
                  <div className="space-y-3">
                    {PAYMENT_OPTIONS.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${
                          paymentMethod === opt.id
                            ? "border-gold/50 bg-gold/5"
                            : "border-border-light hover:border-gold/30"
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={opt.id}
                          checked={paymentMethod === opt.id}
                          onChange={() => setPaymentMethod(opt.id)}
                          className="accent-gold"
                        />
                        <div>
                          <p className="font-sans text-sm text-text-dark">{opt.label}</p>
                          <p className="font-sans text-xs text-text-light">{opt.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>

                  {paymentMethod === "credit_card" && (
                    <div className="mt-6">
                      <label className="block font-sans text-[10px] tracking-widest uppercase text-text-mid mb-3">
                        Cuotas
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="bg-white border border-border-light text-text-dark font-sans text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-gold/50 w-full transition-colors"
                      >
                        {[1, 3, 6, 12].map((n) => (
                          <option key={n} value={n}>
                            {n} {n === 1 ? "pago" : "cuotas"} de{" "}
                            {formatPrice(subtotal / n)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </section>
              )}

              <div className="flex gap-4">
                {step === "payment" && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep("info")}
                  >
                    Volver
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  className="flex-1 justify-center"
                >
                  {step === "info"
                    ? "Continuar al pago"
                    : loading
                    ? "Procesando..."
                    : "Confirmar pedido"}
                </Button>
              </div>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="border border-border-light bg-surface-2 rounded-2xl p-6 sticky top-28">
              <h2 className="font-display text-xl text-text-dark mb-6">Tu pedido</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-xs text-text-dark truncate">{item.name}</p>
                      {item.size_ml && (
                        <p className="font-sans text-[10px] text-text-light">
                          {item.size_ml}ml × {item.quantity}
                        </p>
                      )}
                    </div>
                    <p className="font-sans text-xs text-gold flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <GoldDivider className="mb-6" />
              <div className="flex justify-between items-center mb-2">
                <span className="font-sans text-xs text-text-mid uppercase tracking-widest">Subtotal</span>
                <span className="font-sans text-sm text-text-dark">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="font-sans text-xs text-text-mid uppercase tracking-widest">Envío</span>
                <span className="font-sans text-xs text-text-light italic">A calcular</span>
              </div>
              <GoldDivider className="mb-6" />
              <div className="flex justify-between items-center">
                <span className="font-display text-lg text-text-dark">Total</span>
                <span className="font-display text-2xl text-gold">{formatPrice(subtotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  className,
  onChange,
  ...props
}: {
  label: string;
  className?: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  return (
    <div className={className}>
      <label className="block font-sans text-[10px] tracking-widest uppercase text-text-mid mb-2">
        {label}
        {props.required && <span className="text-gold ml-1">*</span>}
      </label>
      <input
        {...props}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white border border-border-light text-text-dark text-sm font-sans px-4 py-3 rounded-xl focus:border-gold/50 focus:outline-none placeholder:text-text-light transition-colors duration-200"
      />
    </div>
  );
}
