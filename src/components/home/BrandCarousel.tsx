import Image from "next/image";
import Link from "next/link";

const LOGOS = [
  { src: "/logos/disenador/logoDior.png",           alt: "Dior",               href: "/catalogo?category=disenador&brand=Dior" },
  { src: "/logos/nicho/Byredo.png",                 alt: "Byredo",             href: "/catalogo?category=nicho&brand=Byredo" },
  { src: "/logos/arabes/logoLattafa.png",            alt: "Lattafa",            href: "/catalogo?category=arabe&brand=Lattafa" },
  { src: "/logos/disenador/logoArmani.png",          alt: "Armani",             href: "/catalogo?category=disenador&brand=Armani" },
  { src: "/logos/nicho/Creed.png",                  alt: "Creed",              href: "/catalogo?category=nicho&brand=Creed" },
  { src: "/logos/arabes/logoRasasi.png",             alt: "Rasasi",             href: "/catalogo?category=arabe&brand=Rasasi" },
  { src: "/logos/disenador/logoCarolinaHerrera.png", alt: "Carolina Herrera",  href: "/catalogo?category=disenador&brand=Carolina+Herrera" },
  { src: "/logos/nicho/Tom Ford.png",               alt: "Tom Ford",           href: "/catalogo?category=nicho&brand=Tom+Ford" },
  { src: "/logos/arabes/logoAlHaramain.png",         alt: "Al Haramain",        href: "/catalogo?category=arabe&brand=Al+Haramain" },
  { src: "/logos/disenador/logoYSL.png",             alt: "YSL",                href: "/catalogo?category=disenador&brand=Yves+Saint+Laurent" },
  { src: "/logos/nicho/Kilian.png",                 alt: "Kilian",             href: "/catalogo?category=nicho&brand=By+Kilian" },
  { src: "/logos/arabes/logoAfnan.jpg",              alt: "Afnan",              href: "/catalogo?category=arabe&brand=Afnan" },
  { src: "/logos/disenador/logoPacoRabanne.png",     alt: "Paco Rabanne",       href: "/catalogo?category=disenador&brand=Paco+Rabanne" },
  { src: "/logos/nicho/MFK.png",                    alt: "MFK",                href: "/catalogo?category=nicho&brand=MFK" },
  { src: "/logos/arabes/logoMaisonAlhambra.png",     alt: "Maison Alhambra",    href: "/catalogo?category=arabe&brand=Maison+Alhambra" },
  { src: "/logos/disenador/logoGivenchy.png",        alt: "Givenchy",           href: "/catalogo?category=disenador&brand=Givenchy" },
  { src: "/logos/nicho/Amouage.png",                alt: "Amouage",            href: "/catalogo?category=nicho&brand=Amouage" },
  { src: "/logos/arabes/logoArmaf.png",              alt: "Armaf",              href: "/catalogo?category=arabe&brand=Armaf" },
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
        padding: "20px 0",
      }}
    >
      <div className="marquee-track">
        {TRACK.map((logo, i) => (
          <Link
            key={`${logo.alt}-${i}`}
            href={logo.href}
            className="shrink-0 flex items-center justify-center bg-white rounded transition-opacity duration-200 hover:opacity-80"
            style={{ width: 190, height: 80, margin: "0 14px", padding: "12px 20px" }}
            tabIndex={-1}
          >
            <Image
              src={logo.src}
              alt={logo.alt}
              width={150}
              height={56}
              className="object-contain w-full h-full"
              sizes="190px"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
