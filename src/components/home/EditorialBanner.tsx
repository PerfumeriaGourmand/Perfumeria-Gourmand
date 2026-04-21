import Link from "next/link";

const STATS = [
  ["500+", "Fragancias"],
  ["12", "Cuotas sin interés"],
  ["24hs", "Envío a CABA"],
  ["100%", "Originales"],
];

export default function EditorialBanner() {
  return (
    <div
      style={{
        background: "#111",
        borderTop: "1px solid rgba(164,133,76,0.1)",
        borderBottom: "1px solid rgba(164,133,76,0.1)",
        padding: "72px 80px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 64,
        alignItems: "center",
      }}
    >
      <div>
        <p className="font-sans uppercase text-gold" style={{ fontSize: 9, letterSpacing: "0.5em", marginBottom: 14 }}>
          Por qué Gourmand
        </p>
        <h2 className="font-display" style={{ fontSize: 46, color: "#f5f0e8", lineHeight: 1.1, marginBottom: 18 }}>
          La experiencia de una perfumería premium, en tu casa
        </h2>
        <p className="font-body" style={{ fontSize: 17, color: "#7a7268", lineHeight: 1.85, marginBottom: 28, fontStyle: "italic", maxWidth: 420 }}>
          Más de 500 fragancias curadas. Envíos en 24-48hs a todo el país. 12 cuotas sin interés con todos los bancos.
        </p>
        <Link href="/catalogo" className="elegant-btn text-gold">
          Conocer más
        </Link>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(164,133,76,0.08)" }}>
        {STATS.map(([n, l]) => (
          <div key={l} style={{ background: "#0a0a0a", padding: "30px 24px" }}>
            <p className="font-display text-gold" style={{ fontSize: 38, marginBottom: 4 }}>{n}</p>
            <p className="font-sans uppercase" style={{ fontSize: 9, letterSpacing: "0.3em", color: "#7a7268" }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
