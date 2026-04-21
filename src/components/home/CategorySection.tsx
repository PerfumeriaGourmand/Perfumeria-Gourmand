"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { id: "arabe", label: "Árabe", sub: "Perfumería oriental", dark: false, href: "/catalogo?category=arabe" },
  { id: "disenador", label: "Diseñador", sub: "Grandes firmas", dark: false, href: "/catalogo?category=disenador" },
  { id: "nicho", label: "Nicho", sub: "Perfumería de autor", dark: true, href: "/catalogo/nicho" },
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
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(45deg,transparent,transparent 24px,rgba(164,133,76,0.03) 24px,rgba(164,133,76,0.03) 25px)",
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: "var(--gold)",
        transform: `scaleX(${hov ? 1 : 0})`,
        transformOrigin: "left",
        transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
      }} />
      <p
        className="font-sans uppercase"
        style={{ fontSize: 9, letterSpacing: "0.4em", color: "var(--gold)", marginBottom: 8, position: "relative" }}
      >
        {cat.sub}
      </p>
      <p
        className="font-display"
        style={{ fontSize: 44, lineHeight: 1, color: cat.dark ? "#f5f0e8" : "#1c1917", position: "relative" }}
      >
        {cat.label}
      </p>
      <div style={{ marginTop: 16, position: "relative" }}>
        <span className={`elegant-btn ${cat.dark ? "text-cream" : "text-text-dark"} hover:text-gold`}>Ver todo</span>
      </div>
    </Link>
  );
}

export default function CategorySection() {
  return (
    <section style={{ background: "#fff", padding: "72px 80px" }}>
      <p className="font-sans uppercase text-gold text-center" style={{ fontSize: 9, letterSpacing: "0.5em", marginBottom: 10 }}>
        Explorar
      </p>
      <h2 className="font-display text-text-dark text-center" style={{ fontSize: 42, marginBottom: 52 }}>
        Nuestra colección
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "#e8e5e0" }}>
        {CATEGORIES.map((cat) => (
          <CategoryTile key={cat.id} cat={cat} />
        ))}
      </div>
    </section>
  );
}
