"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const CATEGORIES = [
  {
    id: "arabe",
    label: "Árabe",
    sub: "Perfumería oriental",
    dark: false,
    href: "/catalogo?category=arabe",
    image: "/banners/arabes.png",
  },
  {
    id: "disenador",
    label: "Diseñador",
    sub: "Grandes firmas",
    dark: false,
    href: "/catalogo?category=disenador",
    image: null,
  },
  {
    id: "nicho",
    label: "Nicho",
    sub: "Perfumería de autor",
    dark: true,
    href: "/catalogo/nicho",
    image: null,
  },
];

function CategoryTile({ cat }: { cat: typeof CATEGORIES[0] }) {
  const [hov, setHov] = useState(false);
  return (
    <Link
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
          {/* Gradient overlay so text is legible */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.25) 50%, rgba(10,10,10,0.08) 100%)",
            }}
          />
        </>
      )}

      {!cat.image && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 24px,rgba(164,133,76,0.03) 24px,rgba(164,133,76,0.03) 25px)",
        }} />
      )}

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
  return (
    <section className="px-5 sm:px-8 lg:px-20 py-16 lg:py-20" style={{ background: "#fff" }}>
      <p className="font-sans uppercase text-gold text-center" style={{ fontSize: 9, letterSpacing: "0.5em", marginBottom: 10 }}>
        Explorar
      </p>
      <h2 className="font-display text-text-dark text-center" style={{ fontSize: "clamp(28px, 4vw, 42px)", marginBottom: 52 }}>
        Nuestra colección
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: "#e8e5e0" }}>
        {CATEGORIES.map((cat) => (
          <CategoryTile key={cat.id} cat={cat} />
        ))}
      </div>
    </section>
  );
}
