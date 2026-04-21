"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

const SLIDES = [
  {
    eyebrow: "Nueva temporada · Otoño 2026",
    title: "El perfume\ncomo identidad",
    sub: "Más de 500 fragancias curadas. Desde clásicos de diseñador hasta joyas del nicho más exclusivo.",
    cta: { label: "Explorar colección", href: "/catalogo" },
    accent: { label: "Línea Nicho", href: "/catalogo/nicho" },
    tag: "Diseñador",
  },
  {
    eyebrow: "Perfumería árabe · Selección premium",
    title: "Intensidad\norientalque persiste",
    sub: "Oud, ámbar y especias. La tradición árabe en frascos de alta concentración.",
    cta: { label: "Ver colección árabe", href: "/catalogo?category=arabe" },
    accent: null,
    tag: "Árabe",
  },
  {
    eyebrow: "Perfumería de autor · Línea Nicho",
    title: "Para quienes\nvan más allá",
    sub: "Byredo, Le Labo, Frederic Malle. Fórmulas artesanales para una identidad olfativa única.",
    cta: { label: "Descubrir Nicho", href: "/catalogo/nicho" },
    accent: null,
    tag: "Nicho",
  },
];

const GLOWS = [
  "radial-gradient(ellipse at 60% 40%, rgba(164,133,76,0.06) 0%, transparent 60%)",
  "radial-gradient(ellipse at 30% 60%, rgba(164,133,76,0.05) 0%, transparent 55%)",
  "radial-gradient(ellipse at 70% 50%, rgba(164,133,76,0.08) 0%, transparent 60%)",
];

const PARTICLES = [
  { size: 3, x: 12, y: 25, dur: 3.5, delay: 0 },
  { size: 2, x: 23, y: 68, dur: 4.0, delay: 0.35 },
  { size: 2, x: 35, y: 14, dur: 4.5, delay: 0.7 },
  { size: 2, x: 48, y: 82, dur: 3.8, delay: 1.05 },
  { size: 3, x: 62, y: 38, dur: 4.2, delay: 1.4 },
  { size: 2, x: 74, y: 57, dur: 3.6, delay: 1.75 },
  { size: 2, x: 86, y: 22, dur: 4.8, delay: 2.1 },
  { size: 2, x: 5,  y: 74, dur: 4.0, delay: 2.45 },
];

export default function HeroSection() {
  const [cur, setCur] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [dir, setDir] = useState<1 | -1>(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const goTo = useCallback((idx: number, d: 1 | -1 = 1) => {
    if (animating || idx === cur) return;
    setDir(d);
    setAnimating(true);
    setCur(idx);
    setTimeout(() => setAnimating(false), 700);
  }, [animating, cur]);

  // Auto-advance
  useEffect(() => {
    const t = setTimeout(() => goTo((cur + 1) % SLIDES.length, 1), 5500);
    return () => clearTimeout(t);
  }, [cur, goTo]);

  const slide = SLIDES[cur];

  return (
    <section
      className="relative overflow-hidden bg-[#0a0a0a]"
      style={{ height: "68vh", minHeight: 520 }}
    >
      {/* Radial glow — shifts per slide */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000"
        style={{ background: GLOWS[cur] }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(164,133,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(164,133,76,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: p.size, height: p.size,
            left: `${p.x}%`, top: `${p.y}%`,
            background: `rgba(164,133,76,${0.2 + i * 0.04})`,
            animation: `float ${p.dur}s ease-in-out infinite alternate`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Ghost text */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display whitespace-nowrap select-none pointer-events-none leading-none"
        style={{ fontSize: "min(20vw, 240px)", color: "rgba(164,133,76,0.025)", letterSpacing: "-0.01em" }}
      >
        GOURMAND
      </div>

      {/* Slide content */}
      <div
        key={cur}
        className="absolute inset-0 flex flex-col justify-end"
        style={{
          padding: "0 80px 56px",
          animation: animating ? `${dir > 0 ? "slideInRight" : "slideInLeft"} 0.65s cubic-bezier(0.4,0,0.2,1) forwards` : "none",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.6s 0.1s",
        }}
      >
        <p
          className="font-sans uppercase text-gold mb-4"
          style={{ fontSize: 10, letterSpacing: "0.5em", animation: "fadeUp 0.5s 0.05s both" }}
        >
          {slide.eyebrow}
        </p>

        <h1
          className="font-display text-cream leading-[1.05] whitespace-pre-line"
          style={{
            fontSize: "clamp(44px, 6.5vw, 88px)",
            letterSpacing: "0.01em",
            maxWidth: 680,
            animation: "fadeUp 0.6s 0.15s both",
          }}
        >
          {slide.title}
        </h1>

        <p
          className="font-body text-cream-dim"
          style={{
            fontSize: 17,
            maxWidth: 420,
            marginTop: 16,
            lineHeight: 1.75,
            fontStyle: "italic",
            animation: "fadeUp 0.6s 0.25s both",
          }}
        >
          {slide.sub}
        </p>

        <div
          className="flex items-center gap-7 mt-8"
          style={{ animation: "fadeUp 0.6s 0.35s both" }}
        >
          <Link href={slide.cta.href} className="elegant-btn text-cream hover:text-gold">
            {slide.cta.label}
          </Link>
          {slide.accent && (
            <Link href={slide.accent.href} className="elegant-btn text-gold">
              {slide.accent.label}
            </Link>
          )}
        </div>
      </div>

      {/* Tag top-right */}
      <div
        className="absolute top-8 font-sans uppercase flex items-center gap-2.5"
        style={{ right: 80, fontSize: 9, letterSpacing: "0.5em", color: "rgba(164,133,76,0.4)" }}
      >
        <span className="inline-block h-px w-6 bg-gold/30" />
        {slide.tag}
      </div>

      {/* Controls */}
      <div className="absolute bottom-14 right-20 flex items-center gap-4">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > cur ? 1 : -1)}
            className="border-none cursor-pointer transition-all duration-400"
            style={{
              width: i === cur ? 28 : 6,
              height: 2,
              background: i === cur ? "var(--gold)" : "rgba(164,133,76,0.25)",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
        <button
          onClick={() => goTo((cur - 1 + SLIDES.length) % SLIDES.length, -1)}
          className="bg-transparent border-none cursor-pointer text-gold/50 hover:text-gold transition-colors ml-2 leading-none"
          style={{ fontSize: 18 }}
        >
          ←
        </button>
        <button
          onClick={() => goTo((cur + 1) % SLIDES.length, 1)}
          className="bg-transparent border-none cursor-pointer text-gold/50 hover:text-gold transition-colors leading-none"
          style={{ fontSize: 18 }}
        >
          →
        </button>
      </div>
    </section>
  );
}
