const BRANDS = [
  "Kilian",
  "Le Labo",
  "Chanel",
  "Dior",
  "Creed",
  "Tom Ford",
  "Maison Francis Kurkdjian",
  "Rasasi",
  "Frederic Malle",
  "Lancôme",
  "YSL",
  "Rayhaan",
];

// Duplicate for seamless loop
const TRACK = [...BRANDS, ...BRANDS];

export default function BrandCarousel() {
  return (
    <section className="py-14 overflow-hidden border-y border-border-light bg-white">
      <div className="marquee-track">
        {TRACK.map((brand, i) => (
          <div
            key={`${brand}-${i}`}
            className="flex items-center shrink-0 px-10"
          >
            <span className="font-display text-lg font-light tracking-widest text-text-light hover:text-gold transition-colors duration-300 whitespace-nowrap select-none cursor-default">
              {brand}
            </span>
            {/* Separator dot */}
            <span className="ml-10 w-1 h-1 rounded-full bg-gold/30 shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
