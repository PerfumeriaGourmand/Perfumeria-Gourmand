"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";

const CATEGORIES = [
  {
    id: "arabe",
    label: "Árabe",
    sub: "Perfumería oriental",
    dark: false,
    href: "/catalogo?category=arabe",
    image: "/banners/arabes.png",
    watermark: "أ",
  },
  {
    id: "disenador",
    label: "Diseñador",
    sub: "Grandes firmas",
    dark: false,
    href: "/catalogo?category=disenador",
    image: "/banners/disenador.png",
    watermark: "D",
  },
  {
    id: "nicho",
    label: "Nicho",
    sub: "Perfumería de autor",
    dark: true,
    href: "/catalogo/nicho",
    image: "/banners/nicho.png",
    watermark: "N",
  },
];

function CategoryTile({ cat, index }: { cat: typeof CATEGORIES[0]; index: number }) {
  const [hov, setHov] = useState(false);
  const { ref, inView } = useInView(0.1);

  return (
    <Link
      ref={ref as React.RefObject<HTMLAnchorElement>}
      href={cat.href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: cat.dark ? "#0a0a0a" : hov ? "#f2f0eb" : "#f8f7f4",
        aspectRatio: "3/4",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "32px",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.3s",
        textDecoration: "none",
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : "translateY(32px)",
        transitionProperty: "background, opacity, transform",
        transitionDuration: `0.3s, 0.65s, 0.65s`,
        transitionDelay: `0s, ${index * 0.1}s, ${index * 0.1}s`,
        transitionTimingFunction: "ease, ease, ease",
      }}
    >
      {/* Background image */}
      {cat.image && (
        <>
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            className="object-cover transition-transform duration-700"
            style={{ transform: hov ? "scale(1.04)" : "scale(1)" }}
            sizes="(max-width: 640px) 100vw, 33vw"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.25) 50%, rgba(10,10,10,0.08) 100%)",
            }}
          />
        </>
      )}

      {/* Decorative watermark letter for image-less tiles */}
      {!cat.image && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontSize: "clamp(120px, 18vw, 200px)",
            fontStyle: "italic",
            fontWeight: 300,
            color: cat.dark
              ? "rgba(164,133,76,0.06)"
              : "rgba(164,133,76,0.07)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            transform: hov ? "scale(1.04)" : "scale(1)",
            transition: "transform 0.7s ease",
          }}
        >
          {cat.watermark}
        </div>
      )}

      {/* Subtle top border accent */}
      {!cat.image && (
        <div
          className="absolute top-0 left-8 right-8"
          style={{
            height: "1px",
            background: cat.dark
              ? "linear-gradient(90deg, transparent, rgba(164,133,76,0.2), transparent)"
              : "linear-gradient(90deg, transparent, rgba(164,133,76,0.15), transparent)",
          }}
        />
      )}

      {/* Bottom gold hover line */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: "var(--gold)",
        transform: `scaleX(${hov ? 1 : 0})`,
        transformOrigin: "left",
        transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
      }} />

      <p
        className="font-sans uppercase"
        style={{
          fontSize: 9,
          letterSpacing: "0.4em",
          color: "var(--gold)",
          marginBottom: 8,
          position: "relative",
        }}
      >
        {cat.sub}
      </p>
      <p
        className="font-display"
        style={{
          fontSize: "clamp(32px, 3.5vw, 44px)",
          lineHeight: 1,
          color: cat.image || cat.dark ? "#f5f0e8" : "#1c1917",
          position: "relative",
        }}
      >
        {cat.label}
      </p>
      <div style={{ marginTop: 16, position: "relative" }}>
        <span className={`elegant-btn ${cat.image || cat.dark ? "text-cream" : "text-text-dark"} hover:text-gold`}>
          Ver todo
        </span>
      </div>
    </Link>
  );
}

export default function CategorySection() {
  const { ref: headingRef, inView: headingInView } = useInView();

  return (
    <section className="px-5 sm:px-8 lg:px-20 py-16 lg:py-20" style={{ background: "#fff" }}>
      <div
        ref={headingRef as React.RefObject<HTMLDivElement>}
        style={{
          opacity: headingInView ? 1 : 0,
          transform: headingInView ? "none" : "translateY(20px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
          marginBottom: 52,
        }}
      >
        <p className="font-sans uppercase text-gold text-center" style={{ fontSize: 9, letterSpacing: "0.5em", marginBottom: 10 }}>
          Explorar
        </p>
        <h2 className="font-display text-text-dark text-center" style={{ fontSize: "clamp(28px, 4vw, 42px)" }}>
          Nuestra colección
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: "#e8e5e0" }}>
        {CATEGORIES.map((cat, i) => (
          <CategoryTile key={cat.id} cat={cat} index={i} />
        ))}
      </div>
    </section>
  );
}
