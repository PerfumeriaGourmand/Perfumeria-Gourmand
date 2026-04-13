import Link from "next/link";

const CATEGORIES = [
  {
    id: "arabe",
    label: "Árabe",
    description: "Oud, rosa, ámbar. La opulencia del Oriente Medio destilada en cada frasco.",
    bg: "bg-[#2a1500]",
  },
  {
    id: "disenador",
    label: "Diseñador",
    description: "Las grandes maisons del perfume. Elegancia accesible con firma.",
    bg: "bg-[#0d1b2e]",
  },
  {
    id: "nicho",
    label: "Nicho",
    description: "Perfumería de autor. Pequeñas tiradas, materias primas extraordinarias.",
    bg: "bg-[#150a28]",
  },
];

export default function CategorySection() {
  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-14">
        <p className="font-sans text-xs tracking-[0.35em] uppercase text-gold mb-3">
          Colecciones
        </p>
        <h2 className="font-display text-[clamp(1.8rem,3.5vw,3rem)] font-bold text-text-dark">
          Tres mundos del perfume
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CATEGORIES.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/catalogo?category=${cat.id}`}
            className={`group relative overflow-hidden rounded-2xl ${cat.bg} p-10 flex flex-col justify-between min-h-[280px] transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-hover`}
          >
            {/* Number */}
            <span className="font-display text-[80px] font-bold leading-none text-white/5 absolute top-3 right-5 select-none">
              0{i + 1}
            </span>

            <div>
              <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold/60 mb-4 group-hover:text-gold transition-colors duration-300">
                Categoría
              </p>
              <h3 className="font-display text-4xl font-bold text-white leading-none">
                {cat.label}
              </h3>
            </div>

            <div>
              <p className="font-sans text-sm text-white/40 leading-relaxed mb-6 max-w-xs">
                {cat.description}
              </p>
              <span className="inline-flex items-center gap-3 font-sans text-xs tracking-widest uppercase text-gold/60 group-hover:text-gold transition-colors duration-300">
                Ver destacados
                <span className="w-6 h-px bg-current transition-all duration-300 group-hover:w-10" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
