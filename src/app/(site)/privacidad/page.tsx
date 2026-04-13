import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-3xl mx-auto">
      <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">Legal</p>
      <h1 className="font-display text-4xl font-bold text-text-dark mb-8">
        Política de privacidad
      </h1>
      <div className="divider-light mb-10" />

      <div className="font-sans text-text-mid leading-relaxed space-y-8">
        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">1. Información que recopilamos</h2>
          <p>
            Al utilizar nuestro sitio web y realizar compras, podemos recopilar la siguiente información personal: nombre completo, dirección de correo electrónico, número de teléfono, dirección de envío y datos de pago (procesados de forma segura por MercadoPago, no almacenamos datos de tarjetas).
          </p>
          <p className="mt-3">
            También recopilamos información de navegación (páginas visitadas, tiempo en el sitio, dispositivo utilizado) con fines estadísticos y para mejorar la experiencia de usuario.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">2. Uso de la información</h2>
          <p>Utilizamos su información para:</p>
          <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
            <li>Procesar y gestionar sus pedidos</li>
            <li>Enviar confirmaciones y actualizaciones de compra</li>
            <li>Coordinar el envío de productos</li>
            <li>Responder consultas y brindar soporte</li>
            <li>Mejorar nuestros servicios y experiencia de usuario</li>
            <li>Enviar comunicaciones de marketing (solo con su consentimiento)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">3. Protección de datos</h2>
          <p>
            Su información personal es tratada de acuerdo con la Ley 25.326 de Protección de Datos Personales de la República Argentina. Implementamos medidas técnicas y organizativas apropiadas para proteger sus datos contra acceso no autorizado, pérdida o divulgación.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">4. Compartir información con terceros</h2>
          <p>
            No vendemos, alquilamos ni cedemos su información personal a terceros sin su consentimiento, excepto cuando sea necesario para: procesar pagos (MercadoPago), coordinar envíos (servicios de correo), o cumplir obligaciones legales.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">5. Cookies</h2>
          <p>
            Utilizamos cookies propias para mantener su sesión activa y guardar preferencias de navegación. No utilizamos cookies de terceros con fines publicitarios sin su consentimiento explícito.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">6. Sus derechos</h2>
          <p>
            Usted tiene derecho a acceder, rectificar y suprimir sus datos personales en cualquier momento. Para ejercer estos derechos, contáctenos a través de nuestro WhatsApp o correo electrónico.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">7. Contacto</h2>
          <p>
            Si tiene preguntas sobre esta política de privacidad o sobre el tratamiento de sus datos, puede contactarnos a través de WhatsApp o Instagram @gourmand.perfumes.
          </p>
        </section>

        <p className="text-text-light text-xs pt-4 border-t border-border-light">
          Última actualización: enero 2025
        </p>
      </div>
    </div>
  );
}
