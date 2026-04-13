"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const els = [titleRef.current, subtitleRef.current];
    const timers: ReturnType<typeof setTimeout>[] = [];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      const t = setTimeout(() => {
        if (!el) return;
        el.style.transition = "opacity 1s ease, transform 1s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 300 + i * 250);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0a0a0a] pt-[104px]">
      {/* Atmospheric layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-[rgba(201,169,110,0.05)] via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
        <GoldParticles />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,169,110,1) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <p
          className="font-sans text-xs tracking-[0.5em] uppercase text-gold mb-10 opacity-0 animate-fade-in"
          style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
        >
          Buenos Aires · Perfumería de Lujo
        </p>

        <h1
          ref={titleRef}
          className="font-display font-bold text-[clamp(3rem,10vw,8rem)] leading-[0.9] tracking-tight text-white mb-6"
        >
          El arte de oler
          <br />
          <em className="text-gold-shimmer not-italic">extraordinario</em>
        </h1>

        <p
          ref={subtitleRef}
          className="font-sans text-sm md:text-base text-white/40 max-w-lg mx-auto leading-relaxed mb-14 tracking-wide"
        >
          Nicho, árabe y diseñador. Seleccionados con precisión
          <br className="hidden md:block" /> para quienes entienden el perfume como declaración.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: "900ms", animationFillMode: "forwards" }}
        >
          <Link
            href="/catalogo"
            className="px-10 py-4 bg-white text-[#0a0a0a] font-sans text-sm font-semibold rounded-full hover:bg-cream transition-colors duration-300"
          >
            Explorar colección
          </Link>
          <Link
            href="/catalogo/nicho"
            className="px-10 py-4 border border-gold/40 text-gold font-sans text-sm font-medium rounded-full hover:border-gold/80 hover:bg-gold/5 transition-all duration-300"
          >
            Descubrir nichos
          </Link>
        </div>

        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-fade-in"
          style={{ animationDelay: "1400ms", animationFillMode: "forwards" }}
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent via-gold/40 to-transparent animate-pulse" />
          <span className="font-sans text-[10px] tracking-[0.4em] uppercase text-white/20">Scroll</span>
        </div>
      </div>
    </section>
  );
}

function GoldParticles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Fixed positions so SSR and client always match; animation randomised via CSS delay
  const particles = [
    { id: 0, size: 1.5, x: 12, y: 23, duration: 11, delay: 0 },
    { id: 1, size: 2.0, x: 28, y: 67, duration: 9, delay: 1.2 },
    { id: 2, size: 0.8, x: 45, y: 14, duration: 13, delay: 2.4 },
    { id: 3, size: 1.2, x: 61, y: 81, duration: 8, delay: 0.6 },
    { id: 4, size: 2.5, x: 74, y: 38, duration: 12, delay: 3.0 },
    { id: 5, size: 1.0, x: 88, y: 55, duration: 10, delay: 1.8 },
    { id: 6, size: 1.8, x: 5, y: 71, duration: 14, delay: 4.2 },
    { id: 7, size: 0.6, x: 35, y: 90, duration: 7, delay: 2.0 },
    { id: 8, size: 2.2, x: 52, y: 44, duration: 11, delay: 5.1 },
    { id: 9, size: 1.4, x: 68, y: 19, duration: 9, delay: 0.3 },
    { id: 10, size: 1.0, x: 82, y: 77, duration: 13, delay: 3.6 },
    { id: 11, size: 2.8, x: 19, y: 48, duration: 8, delay: 1.5 },
    { id: 12, size: 0.9, x: 40, y: 6, duration: 12, delay: 4.8 },
    { id: 13, size: 1.6, x: 93, y: 32, duration: 10, delay: 2.7 },
    { id: 14, size: 2.1, x: 56, y: 63, duration: 15, delay: 0.9 },
    { id: 15, size: 1.3, x: 77, y: 87, duration: 9, delay: 3.3 },
  ];

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-gold animate-particle"
          style={{
            width: p.size + "px",
            height: p.size + "px",
            left: p.x + "%",
            top: p.y + "%",
            opacity: 0,
            "--duration": p.duration + "s",
            "--delay": p.delay + "s",
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
