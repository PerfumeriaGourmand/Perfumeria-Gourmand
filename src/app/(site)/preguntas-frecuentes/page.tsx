"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FAQS: { category: string; items: { q: string; a: string }[] }[] = [
  {
    category: "Pedidos y pagos",
    items: [
      {
        q: "¿Qué medios de pago aceptan?",
        a: "Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express), transferencia bancaria y MercadoPago. Las tarjetas de crédito tienen hasta 12 cuotas sin interés con bancos adheridos.",
      },
      {
        q: "¿Puedo modificar o cancelar mi pedido?",
        a: "Podés modificar o cancelar tu pedido dentro de las 2 horas de realizado, siempre que aún no haya sido despachado. Contactanos por WhatsApp lo antes posible con tu número de orden.",
      },
      {
        q: "¿Los productos son 100% originales?",
        a: "Sí, absolutamente. Todos nuestros perfumes son originales y sellados, importados directamente de distribuidores oficiales. Cada fragancia incluye su packaging completo de fábrica.",
      },
      {
        q: "¿Cómo sé si mi pedido fue confirmado?",
        a: "Al confirmar el pago recibís un email con el resumen de tu pedido y número de orden. Si no lo recibís dentro de los 30 minutos, revisá la carpeta de spam o contáctanos.",
      },
    ],
  },
  {
    category: "Envíos",
    items: [
      {
        q: "¿Cuánto tarda en llegar mi pedido?",
        a: "CABA: 24 horas hábiles. GBA: 24–48 horas hábiles. Interior del país: 3–7 días hábiles. Los tiempos se cuentan desde el despacho, no desde el momento del pago.",
      },
      {
        q: "¿Tienen envío gratis?",
        a: "Sí. Envío gratis a CABA y GBA en compras desde $40.000. Para el interior del país, el envío es gratis desde $60.000. Debajo del mínimo, el costo depende de la zona.",
      },
      {
        q: "¿Cómo puedo rastrear mi pedido?",
        a: "Una vez despachado, te enviamos un email con el número de seguimiento y el link para rastrear tu paquete en tiempo real en el sitio del courier.",
      },
      {
        q: "¿Hacen envíos al interior del país?",
        a: "Sí, enviamos a todo el territorio argentino. Los tiempos y costos varían según la provincia de destino.",
      },
    ],
  },
  {
    category: "Productos",
    items: [
      {
        q: "¿Cómo elijo la fragancia correcta?",
        a: "En cada producto detallamos las notas olfativas (salida, corazón y fondo), la familia olfativa y la intensidad. Si tenés dudas, escribinos por WhatsApp y te asesoramos según tus preferencias personales.",
      },
      {
        q: "¿Qué diferencia hay entre EDP, EDT y Parfum?",
        a: "La concentración de aceites esenciales. Parfum (20–30%) es la más intensa y duradera. EDP (15–20%) es muy duradera, ideal para uso diario. EDT (5–15%) es más fresca y ligera. En cada producto especificamos el tipo.",
      },
      {
        q: "¿Tienen muestras o decants?",
        a: "Por el momento no comercializamos muestras ni decants. Todos nuestros productos se venden en sus presentaciones originales de fábrica.",
      },
      {
        q: "¿Los precios incluyen IVA?",
        a: "Sí, todos los precios publicados en el sitio incluyen IVA y son el precio final que pagás.",
      },
    ],
  },
  {
    category: "Cambios y devoluciones",
    items: [
      {
        q: "¿Puedo devolver un perfume si no me gusta el olor?",
        a: "Por razones higiénicas y de calidad, no aceptamos devoluciones por preferencia olfativa una vez que el producto fue abierto. Sí aceptamos cambios o devoluciones por productos defectuosos, dañados en el transporte o enviados por error.",
      },
      {
        q: "¿Qué hago si recibo un producto dañado?",
        a: "Contactanos dentro de las 48 horas de recibido el pedido por WhatsApp con fotos del producto y el embalaje. Gestionamos el reemplazo o reembolso sin costo para vos.",
      },
      {
        q: "¿Cuánto tarda el reembolso?",
        a: "Una vez aprobada la devolución, el reembolso se acredita en 5 a 10 días hábiles en el mismo medio de pago utilizado.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border-light last:border-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
      >
        <span className="font-sans text-sm font-medium text-text-dark">{q}</span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          className={cn("text-text-light flex-shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200",
          open ? "max-h-96 pb-5" : "max-h-0"
        )}
      >
        <p className="font-sans text-sm text-text-mid leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function FaqPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Header */}
      <div className="px-6 max-w-3xl mx-auto mb-14">
        <h1 className="font-display text-4xl font-bold text-text-dark mb-4">
          Preguntas frecuentes
        </h1>
        <p className="font-sans text-text-mid leading-relaxed max-w-lg">
          Encontrá respuesta a las dudas más comunes. Si no encontrás lo que buscás, escribinos.
        </p>
      </div>

      {/* FAQs */}
      <div className="px-6 max-w-3xl mx-auto space-y-10">
        {FAQS.map((section) => (
          <div key={section.category}>
            <h2 className="font-sans text-[10px] tracking-widest uppercase text-gold mb-4">
              {section.category}
            </h2>
            <div className="bg-white border border-border-light rounded-2xl px-6">
              {section.items.map((item) => (
                <FaqItem key={item.q} {...item} />
              ))}
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="bg-surface-2 rounded-2xl p-8 text-center">
          <p className="font-display text-xl text-text-dark mb-2">¿No encontraste tu respuesta?</p>
          <p className="font-sans text-sm text-text-mid mb-6">
            Nuestro equipo está disponible para ayudarte con cualquier consulta.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/contacto"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors"
            >
              Contactanos
            </Link>
            <a
              href="https://wa.me/5491100000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-gold/40 text-gold rounded-full font-sans text-sm font-medium hover:bg-gold/5 transition-colors"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
