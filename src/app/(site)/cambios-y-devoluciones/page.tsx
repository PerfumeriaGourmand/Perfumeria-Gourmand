import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cambios y devoluciones",
};

export default function CambiosPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-3xl mx-auto">
      <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">Legal</p>
      <h1 className="font-display text-4xl font-bold text-text-dark mb-8">
        Cambios y devoluciones
      </h1>
      <div className="divider-light mb-10" />

      <div className="font-sans text-text-mid leading-relaxed space-y-8">
        <section className="bg-white border border-border-light rounded-2xl p-6">
          <p className="font-sans text-sm font-semibold text-text-dark mb-1">
            Plazo para solicitar cambio o devolución
          </p>
          <p className="text-2xl font-display font-bold text-gold">30 días</p>
          <p className="text-xs text-text-light mt-1">desde la recepción del producto</p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">Política de cambios</h2>
          <p>
            Aceptamos cambios de productos dentro de los <strong>30 días corridos</strong> desde la fecha de recepción, siempre que el producto:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 text-sm">
            <li>Se encuentre en perfectas condiciones, sin uso</li>
            <li>Conserve el packaging y sellado original intactos</li>
            <li>Cuente con su factura o comprobante de compra</li>
          </ul>
          <p className="mt-3">
            El costo del envío de cambio está a cargo del comprador. Gourmand absorbe el costo del reenvío del nuevo producto en caso de error nuestro.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">Política de devoluciones</h2>
          <p>
            Procesamos devoluciones en los siguientes casos:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 text-sm">
            <li>Producto recibido con defecto de fabricación</li>
            <li>Producto incorrecto enviado por error nuestro</li>
            <li>Producto dañado durante el transporte</li>
          </ul>
          <p className="mt-3">
            En estos casos, el reembolso se realizará por el mismo medio de pago utilizado en la compra, dentro de los 5 a 10 días hábiles de aprobada la devolución.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">Productos sin cambio ni devolución</h2>
          <ul className="list-disc list-inside mt-2 space-y-1.5 text-sm">
            <li>Perfumes con precinto roto o packaging abierto</li>
            <li>Productos en oferta o liquidación (salvo defecto de fabricación)</li>
            <li>Productos comprados como kits (se tratan en su totalidad)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">¿Cómo iniciar un cambio o devolución?</h2>
          <p>
            Para iniciar el proceso, contáctenos a través de nuestro WhatsApp indicando:
          </p>
          <ul className="list-disc list-inside mt-3 space-y-1.5 text-sm">
            <li>Número de orden</li>
            <li>Producto a cambiar o devolver</li>
            <li>Motivo del cambio o devolución</li>
            <li>Fotos del producto (en caso de daño o defecto)</li>
          </ul>
          <p className="mt-4">
            Nuestro equipo se pondrá en contacto dentro de las 24 horas hábiles para coordinar el proceso.
          </p>
        </section>

        <section className="bg-surface-2 rounded-2xl p-5">
          <p className="font-sans text-sm font-semibold text-text-dark mb-2">
            ¿Necesitás ayuda?
          </p>
          <a
            href="https://wa.me/5491100000000"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-sm text-gold hover:text-gold-dark transition-colors"
          >
            Contactanos por WhatsApp →
          </a>
        </section>

        <p className="text-text-light text-xs pt-4 border-t border-border-light">
          Última actualización: enero 2025
        </p>
      </div>
    </div>
  );
}
