"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export default function QuizBanner() {
  const { ref, inView } = useInView(0.2);

  return (
    <section
      className="relative overflow-hidden px-5 sm:px-8 lg:px-20 py-16 lg:py-20"
      style={{ background: "#0a0a0a" }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(164,133,76,0.09) 0%, transparent 65%)",
        }}
      />

      {/* Subtle grid, matches HeroSection */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(164,133,76,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(164,133,76,0.03) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative flex flex-col items-center text-center max-w-2xl mx-auto"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        <Sparkles size={28} strokeWidth={1} className="text-gold mb-6" />

        <p
          className="font-sans uppercase text-gold"
          style={{ fontSize: 10, letterSpacing: "0.5em", marginBottom: 16 }}
        >
          Test olfativo
        </p>

        <h2
          className="font-display text-cream"
          style={{ fontSize: "clamp(28px, 4.5vw, 48px)", lineHeight: 1.15 }}
        >
          ¿No estás seguro de qué perfume comprar?
        </h2>

        <p
          className="font-body text-cream-dim"
          style={{ fontSize: 16, maxWidth: 460, margin: "20px 0 32px", lineHeight: 1.75, fontStyle: "italic" }}
        >
          Respondé 5 preguntas rápidas y te recomendamos el perfume ideal para vos.
        </p>

        <Link href="/encontrar-mi-perfume">
          <button
            className="font-sans uppercase tracking-widest text-xs px-10 py-4 bg-gold text-obsidian hover:bg-gold-light active:bg-gold-dark transition-all duration-300"
          >
            Encontrá tu perfume
          </button>
        </Link>
      </div>
    </section>
  );
}
