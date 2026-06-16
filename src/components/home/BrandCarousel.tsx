import Image from "next/image";

const LOGOS = [
  { src: "/logos/disenador/logoDior.png",           alt: "Dior" },
  { src: "/logos/nicho/Byredo.png",                 alt: "Byredo" },
  { src: "/logos/arabes/logoLattafa.png",            alt: "Lattafa" },
  { src: "/logos/disenador/logoArmani.png",          alt: "Armani" },
  { src: "/logos/nicho/Creed.png",                  alt: "Creed" },
  { src: "/logos/arabes/logoRasasi.png",             alt: "Rasasi" },
  { src: "/logos/disenador/logoCarolinaHerrera.png", alt: "Carolina Herrera" },
  { src: "/logos/nicho/Tom Ford.png",               alt: "Tom Ford" },
  { src: "/logos/arabes/logoAlHaramain.png",         alt: "Al Haramain" },
  { src: "/logos/disenador/logoYSL.png",             alt: "YSL" },
  { src: "/logos/nicho/Kilian.png",                 alt: "Kilian" },
  { src: "/logos/arabes/logoAfnan.jpg",              alt: "Afnan" },
  { src: "/logos/disenador/logoPacoRabanne.png",     alt: "Paco Rabanne" },
  { src: "/logos/nicho/MFK.png",                    alt: "Maison Francis Kurkdjian" },
  { src: "/logos/arabes/logoMaisonAlhambra.png",     alt: "Maison Alhambra" },
  { src: "/logos/disenador/logoGivenchy.png",        alt: "Givenchy" },
  { src: "/logos/nicho/Amouage.png",                alt: "Amouage" },
  { src: "/logos/arabes/logoArmaf.png",              alt: "Armaf" },
];

const TRACK = [...LOGOS, ...LOGOS];

export default function BrandCarousel() {
  return (
    <div
      className="overflow-hidden"
      style={{
        background: "#111",
        borderTop: "1px solid rgba(164,133,76,0.1)",
        borderBottom: "1px solid rgba(164,133,76,0.1)",
        padding: "22px 0",
      }}
    >
      <div className="marquee-track">
        {TRACK.map((logo, i) => (
          <div
            key={`${logo.alt}-${i}`}
            className="shrink-0 flex items-center justify-center bg-white rounded"
            style={{ width: 160, height: 64, margin: "0 12px", padding: "10px 16px" }}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={128}
              height={44}
              className="object-contain w-full h-full"
              sizes="160px"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
