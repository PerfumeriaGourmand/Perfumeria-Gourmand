"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { useInView } from "@/hooks/useInView";

export default function QuizBanner() {
  const { ref, inView } = useInView(0.2);

  return (
    <section
      className="px-5 sm:px-8 lg:px-20 pt-24 pb-16 lg:pt-28 lg:pb-20"
      style={{ background: "#f8f7f4" }}
    >
      <div
        ref={ref as React.RefObject<HTMLDivElement>}
        className="relative overflow-hidden mx-auto flex flex-col items-center text-center max-w-3xl px-8 py-14 sm:px-14 sm:py-16"
        style={{
          background: "#f1ece0",
          border: "1px solid rgba(164,133,76,0.18)",
          opacity: inView ? 1 : 0,
          transform: inView ? "none" : "translateY(24px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(164,133,76,0.12) 0%, transparent 65%)",
          }}
        />

        <Sparkles size={28} strokeWidth={1} className="relative text-gold mb-6" />

        <p
          className="relative font-sans uppercase text-gold"
          style={{ fontSize: 10, letterSpacing: "0.5em", marginBottom: 16 }}
        >
          Test olfativo
        </p>

        <h2
          className="relative font-display text-text-dark"
          style={{ fontSize: "clamp(28px, 4.5vw, 48px)", lineHeight: 1.15 }}
        >
          ¿No estás seguro de qué perfume comprar?
        </h2>

        <p
          className="relative font-body text-text-mid"
          style={{ fontSize: 16, maxWidth: 460, margin: "20px 0 32px", lineHeight: 1.75, fontStyle: "italic" }}
        >
          Respondé 5 preguntas rápidas y te recomendamos el perfume ideal para vos.
        </p>

        <Link href="/encontrar-mi-perfume" className="relative">
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
