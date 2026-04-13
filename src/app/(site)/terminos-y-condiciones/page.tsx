import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y condiciones",
};

export default function TerminosPage() {
  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-3xl mx-auto">
      <p className="font-sans text-xs tracking-widest uppercase text-gold mb-3">Legal</p>
      <h1 className="font-display text-4xl font-bold text-text-dark mb-8">
        Términos y condiciones
      </h1>
      <div className="divider-light mb-10" />

      <div className="prose prose-sm max-w-none font-sans text-text-mid leading-relaxed space-y-8">
        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">1. Aceptación de los términos</h2>
          <p>
            Al acceder y utilizar el sitio web de Gourmand, usted acepta estar sujeto a estos términos y condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">2. Descripción del servicio</h2>
          <p>
            Gourmand es una tienda online especializada en perfumería de nicho, árabe y diseñador con base en Buenos Aires, Argentina. Ofrecemos productos originales 100% auténticos, con garantía de procedencia.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">3. Precios y pagos</h2>
          <p>
            Todos los precios publicados en el sitio están expresados en pesos argentinos (ARS) e incluyen IVA. Gourmand se reserva el derecho de modificar los precios sin previo aviso. El precio vigente al momento de realizar la compra será el que se aplicará a la transacción.
          </p>
          <p className="mt-3">
            Aceptamos los siguientes medios de pago: tarjeta de crédito (con opción de cuotas), tarjeta de débito, transferencia bancaria/CBU y MercadoPago. Los pagos son procesados de forma segura a través de MercadoPago.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">4. Envíos</h2>
          <p>
            Realizamos envíos a todo el territorio argentino. Los plazos de entrega estimados son de 3 a 7 días hábiles según la zona de destino. El costo de envío se calcula al momento del checkout según la dirección de entrega. Gourmand no se responsabiliza por demoras ocasionadas por el servicio de correo o fuerza mayor.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">5. Disponibilidad de stock</h2>
          <p>
            Los productos están sujetos a disponibilidad de stock. En caso de que un producto no esté disponible luego de realizada la compra, nos comunicaremos con usted para ofrecer una alternativa o proceder con el reembolso total.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">6. Propiedad intelectual</h2>
          <p>
            Todo el contenido del sitio (imágenes, textos, logotipos, diseño) es propiedad de Gourmand o de sus respectivos titulares y está protegido por las leyes de propiedad intelectual vigentes en Argentina. Queda prohibida su reproducción total o parcial sin autorización expresa.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">7. Limitación de responsabilidad</h2>
          <p>
            Gourmand no será responsable por daños indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso del servicio. En ningún caso la responsabilidad de Gourmand excederá el monto pagado por el usuario en la transacción que dio origen al reclamo.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">8. Modificaciones</h2>
          <p>
            Gourmand se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia desde su publicación en el sitio. El uso continuado del servicio luego de la publicación de cambios constituye la aceptación de los mismos.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-bold text-text-dark mb-3">9. Ley aplicable</h2>
          <p>
            Estos términos se rigen por las leyes de la República Argentina. Cualquier controversia se someterá a los tribunales ordinarios de la Ciudad Autónoma de Buenos Aires.
          </p>
        </section>

        <p className="text-text-light text-xs pt-4 border-t border-border-light">
          Última actualización: enero 2025
        </p>
      </div>
    </div>
  );
}
