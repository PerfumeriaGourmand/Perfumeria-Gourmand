const BRANDS = [
  "Chanel", "Dior", "YSL", "Armani", "Rabanne", "Byredo", "Le Labo", "Lattafa",
  "Rasasi", "Maison Margiela", "Carolina Herrera", "Frederic Malle", "Initio",
  "Memo Paris", "Al Haramain", "Givenchy", "Hugo Boss", "Issey Miyake",
];

const TRACK = [...BRANDS, ...BRANDS];

export default function BrandCarousel() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: "#111",
        borderTop: "1px solid rgba(164,133,76,0.1)",
        borderBottom: "1px solid rgba(164,133,76,0.1)",
        padding: "15px 0",
      }}
    >
      <div className="marquee-track">
        {TRACK.map((brand, i) => (
          <div key={`${brand}-${i}`} className="flex items-center shrink-0">
            <span
              className="font-display hover:text-gold transition-colors duration-200 whitespace-nowrap select-none cursor-default uppercase"
              style={{ fontSize: 15, letterSpacing: "0.12em", color: "#7a7268", padding: "0 28px" }}
            >
              {brand}
            </span>
            <span style={{ color: "rgba(164,133,76,0.2)", fontSize: 6, alignSelf: "center" }}>◆</span>
          </div>
        ))}
      </div>
    </div>
  );
}
