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
      { label: "Devoluciones", href: "/devoluciones" },
    ],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0a0a0a",
        borderTop: "1px solid rgba(164,133,76,0.1)",
        padding: "56px 80px 36px",
      }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 44 }}>
        <div>
          <p className="font-display" style={{ fontSize: 30, color: "#f5f0e8", marginBottom: 12, letterSpacing: "0.02em" }}>
            Gourmand
          </p>
          <p className="font-body" style={{ fontSize: 15, color: "#7a7268", lineHeight: 1.8, maxWidth: 280, fontStyle: "italic" }}>
            Perfumería premium en Argentina. Árabe, Diseñador y Nicho — para cada identidad olfativa.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p
              className="font-sans uppercase text-gold"
              style={{ fontSize: 9, letterSpacing: "0.45em", marginBottom: 18 }}
            >
              {col.title}
            </p>
            {col.links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="block font-sans hover:text-[#c8c0b0] transition-colors duration-200"
                style={{ fontSize: 13, color: "#7a7268", marginBottom: 10, letterSpacing: "0.02em" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(164,133,76,0.07)", paddingTop: 22, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p className="font-sans" style={{ fontSize: 10, color: "#3a3530", letterSpacing: "0.08em" }}>
          © {new Date().getFullYear()} Gourmand. Todos los derechos reservados.
        </p>
        <div style={{ display: "flex", gap: 24 }}>
          {[{ label: "Términos", href: "/terminos-y-condiciones" }, { label: "Privacidad", href: "/privacidad" }].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="font-sans hover:text-[#7a7268] transition-colors duration-200"
              style={{ fontSize: 10, color: "#3a3530", letterSpacing: "0.08em" }}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
