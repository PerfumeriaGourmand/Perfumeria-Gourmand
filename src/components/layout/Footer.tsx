import Link from "next/link";

const COLUMNS = [
  {
    title: "Categorías",
    links: [
      { label: "Árabe", href: "/catalogo?category=arabe" },
      { label: "Diseñador", href: "/catalogo?category=disenador" },
      { label: "Nicho", href: "/catalogo/nicho" },
      { label: "Novedades", href: "/catalogo?sort=newest" },
    ],
  },
  {
    title: "Atención",
    links: [
      { label: "Mi cuenta", href: "/mi-cuenta" },
      { label: "Mis pedidos", href: "/mis-pedidos" },
      { label: "Envíos", href: "/envios" },
      { label: "Devoluciones", href: "/cambios-y-devoluciones" },
      { label: "Preguntas frecuentes", href: "/preguntas-frecuentes" },
      { label: "Contacto", href: "/contacto" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gold/10 px-6 pt-14 pb-9 sm:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-10 sm:gap-12 mb-11">
        <div>
          <p className="font-display text-[28px] text-cream mb-3 tracking-[0.02em]">
            Gourmand
          </p>
          <p className="font-body text-sm text-[#7a7268] leading-relaxed italic max-w-xs">
            Perfumería premium en Argentina. Árabe, Diseñador y Nicho — para cada identidad olfativa.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:contents">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-sans uppercase text-gold mb-4" style={{ fontSize: 9, letterSpacing: "0.45em" }}>
                {col.title}
              </p>
              {col.links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="block font-sans text-[#7a7268] hover:text-[#c8c0b0] transition-colors duration-200 mb-2.5 text-[13px] tracking-[0.02em]"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-gold/[0.07] pt-5 flex flex-col sm:flex-row items-center sm:justify-between gap-3">
        <p className="font-sans text-[10px] text-[#3a3530] tracking-[0.08em]">
          © {new Date().getFullYear()} Gourmand. Todos los derechos reservados.
        </p>
        <div className="flex gap-6">
          {[
            { label: "Términos", href: "/terminos-y-condiciones" },
            { label: "Privacidad", href: "/privacidad" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="font-sans text-[10px] text-[#3a3530] hover:text-[#7a7268] transition-colors duration-200 tracking-[0.08em]"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
