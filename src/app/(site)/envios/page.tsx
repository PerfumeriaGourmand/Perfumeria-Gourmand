import type { Metadata } from "next";
import { Truck, Clock, MapPin, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Envíos",
  description: "Información sobre envíos, tiempos y zonas de entrega de Gourmand.",
};

const ZONES = [
  { zone: "CABA", time: "24 hs", cost: "Gratis desde $40.000 — $2.500 debajo del mínimo" },
  { zone: "GBA", time: "24–48 hs", cost: "Gratis desde $40.000 — $3.500 debajo del mínimo" },
  { zone: "Interior del país", time: "3–7 días hábiles", cost: "Gratis desde $60.000 — desde $4.500" },
];

const STATS = [
  { icon: Truck, value: "24 hs", label: "Envío en CABA" },
  { icon: Clock, value: "48 hs", label: "Envío en GBA" },
  { icon: MapPin, value: "Todo el país", label: "Cobertura" },
  { icon: Package, value: "100%", label: "Originales y sellados" },
];

export default function EnviosPage() {
  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Hero */}
      <div className="px-6 max-w-3xl mx-auto mb-16">
        <h1 className="font-display text-4xl font-bold text-text-dark mb-4">
          Envíos
        </h1>
        <p className="font-sans text-text-mid leading-relaxed max-w-xl">
          Trabajamos con los mejores servicios de courier para que tus fragancias lleguen en perfectas condiciones y en el menor tiempo posible.
        </p>
      </div>

      {/* Stats */}
      <div className="px-6 max-w-3xl mx-auto mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border-light border border-border-light rounded-2xl overflow-hidden">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-white px-6 py-7 text-center">
              <Icon size={18} strokeWidth={1.5} className="text-gold mx-auto mb-3" />
              <p className="font-display text-2xl text-text-dark mb-1">{value}</p>
              <p className="font-sans text-[10px] tracking-wide uppercase text-text-light">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-6 max-w-3xl mx-auto space-y-10">
        {/* Zones */}
        <section>
          <h2 className="font-display text-2xl text-text-dark mb-6">Zonas y tiempos de entrega</h2>
          <div className="space-y-px bg-border-light rounded-2xl overflow-hidden border border-border-light">
            {ZONES.map((z) => (
              <div key={z.zone} className="bg-white px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-1">
                <p className="font-sans text-sm font-semibold text-text-dark">{z.zone}</p>
                <p className="font-display text-lg text-gold">{z.time}</p>
                <p className="font-sans text-sm text-text-mid">{z.cost}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="font-display text-2xl text-text-dark mb-5">¿Cómo funciona?</h2>
          <div className="font-sans text-text-mid leading-relaxed space-y-4 text-sm">
            <p>
              Una vez confirmado el pago, preparamos tu pedido en nuestro depósito y lo despachamos dentro de las <strong className="text-text-dark">24–48 horas hábiles</strong>. Recibirás un correo con el número de seguimiento para rastrear tu envío en tiempo real.
            </p>
            <p>
              Los pedidos realizados después de las <strong className="text-text-dark">16:00 hs</strong> o en fines de semana y feriados se procesan al siguiente día hábil.
            </p>
          </div>
        </section>

        {/* Packaging */}
        <section className="bg-surface-2 rounded-2xl p-6">
          <h2 className="font-display text-xl text-text-dark mb-3">Embalaje premium</h2>
          <p className="font-sans text-sm text-text-mid leading-relaxed">
            Todos nuestros perfumes son embalados con doble protección: cada frasco va envuelto individualmente con papel burbuja de alta densidad y colocado en una caja rígida con relleno amortiguador. Tu fragancia llega intacta, siempre.
          </p>
        </section>

        {/* FAQ quick */}
        <section>
          <h2 className="font-display text-2xl text-text-dark mb-5">Preguntas frecuentes</h2>
          <div className="space-y-4 text-sm">
            {[
              {
                q: "¿Puedo retirar en persona?",
                a: "Por el momento no contamos con local físico ni retiro en depósito. Todos los pedidos se envían a domicilio.",
              },
              {
                q: "¿Qué pasa si no estoy en casa cuando llega el pedido?",
                a: "El courier realiza hasta 2 intentos de entrega. Si no podemos entregarlo, quedará retenido en la sucursal más cercana por 5 días hábiles. Te notificamos por mail.",
              },
              {
                q: "¿Hacen envíos a PO Box o apartados postales?",
                a: "No, solo enviamos a domicilios particulares o comerciales con nombre y apellido del destinatario.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="border border-border-light rounded-xl p-5 bg-white">
                <p className="font-sans font-semibold text-text-dark mb-1.5">{q}</p>
                <p className="font-sans text-text-mid">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-text-light text-xs pt-4 border-t border-border-light">
          Última actualización: enero 2025
        </p>
      </div>
    </div>
  );
}
