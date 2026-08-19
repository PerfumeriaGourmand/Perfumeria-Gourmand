"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

interface Props {
  nightOutHref: string;
  althairHref: string;
}

function getSlides(nightOutHref: string, althairHref: string) {
  return [
    {
      eyebrow: "Afnan · Extrait de Parfum",
      title: "9pm\nNight Out",
      sub: "Proyección nuclear para noches que no se olvidan.",
      cta: { label: "Comprar ahora", href: nightOutHref },
      tag: "9pm Night Out",
      image: "/banners/night-out.webp",
      zoom: 1,
    },
    {
      eyebrow: "Lattafa · La colección",
      title: "Eclaire",
      sub: "Gourmand y dulce. La trilogía completa: Original, Banoffi y Pistache.",
      cta: { label: "Ver colección", href: "/catalogo?search=Eclaire" },
      tag: "Eclaire",
      image: "/banners/eclaire.png",
      zoom: 1,
    },
    {
      eyebrow: "Parfums de Marly · Eau de Parfum",
      title: "Althair",
      sub: "Oriental amaderado, cremoso y especiado. Vainilla, canela y ámbar en su máxima expresión.",
      cta: { label: "Comprar ahora", href: althairHref },
      tag: "Althair",
      image: "/banners/althair.png",
      zoom: 1,
    },
    {
      eyebrow: "Armaf · La colección",
      title: "Odyssey",
      sub: "Ediciones limitadas de alta proyección: Mandarin Sky, Mega y toda la línea Odyssey.",
      cta: { label: "Ver colección", href: "/catalogo?search=Odyssey" },
      tag: "Odyssey",
      image: "/banners/odyssey.webp",
      zoom: 1,
    },
  ];
}

const GLOWS = [
  "radial-gradient(ellipse at 50% 30%, rgba(164,133,76,0.04) 0%, transparent 55%)",
  "radial-gradient(ellipse at 65% 35%, rgba(164,133,76,0.05) 0%, transparent 55%)",
  "radial-gradient(ellipse at 55% 40%, rgba(164,133,76,0.06) 0%, transparent 55%)",
  "radial-gradient(ellipse at 40% 35%, rgba(164,133,76,0.05) 0%, transparent 55%)",
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

export default function HeroSection({ nightOutHref, althairHref }: Props) {
  const SLIDES = getSlides(nightOutHref, althairHref);
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
      style={{ height: "44vh", minHeight: 360 }}
    >
      {/* Background images — crossfade per slide */}
      {SLIDES.map((s, i) => (
        <div
          key={s.image}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: cur === i ? 1 : 0 }}
        >
          <Image
            src={s.image}
            alt={s.tag}
            fill
            priority={i === 0}
            className="object-cover"
            style={{ transform: `scale(${s.zoom})` }}
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.35) 55%, rgba(10,10,10,0.15) 100%)",
            }}
          />
        </div>
      ))}

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

      {/* Slide content */}
      <div
        key={cur}
        className="absolute inset-0 flex flex-col justify-end px-5 pb-12 sm:px-10 sm:pb-14 lg:px-20 lg:pb-14"
        style={{
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
            fontSize: "clamp(36px, 6.5vw, 88px)",
            letterSpacing: "0.01em",
            maxWidth: 680,
            animation: "fadeUp 0.6s 0.15s both",
          }}
        >
          {slide.title}
        </h1>

        <p
          className="font-body text-cream-dim hidden sm:block"
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
          <Link href={slide.cta.href}>
            <button className="font-sans uppercase tracking-widest text-xs px-11 py-4 rounded-full bg-gold text-obsidian hover:bg-gold-light active:bg-gold-dark transition-all duration-300 hover:shadow-lg">
              {slide.cta.label}
            </button>
          </Link>
        </div>
      </div>

      {/* Tag top-right */}
      <div
        className="absolute top-8 right-5 sm:right-20 font-sans uppercase flex items-center gap-2.5"
        style={{ fontSize: 9, letterSpacing: "0.5em", color: "rgba(164,133,76,0.4)" }}
      >
        <span className="inline-block h-px w-6 bg-gold/30" />
        {slide.tag}
      </div>

      {/* Controls */}
      <div className="absolute bottom-10 right-5 sm:bottom-14 sm:right-20 flex items-center gap-4">
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
