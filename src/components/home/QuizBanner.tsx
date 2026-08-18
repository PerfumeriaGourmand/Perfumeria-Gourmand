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
        className="relative overflow-hidden mx-auto flex flex-col items-center text-center max-w-4xl px-8 py-16 sm:px-20 sm:py-20"
        style={{
          background: "linear-gradient(160deg, #f4eee0 0%, #f1ece0 55%, #ede4d1 100%)",
          border: "1px solid rgba(164,133,76,0.22)",
          borderRadius: 28,
          boxShadow: "0 24px 60px -20px rgba(28,25,23,0.18)",
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
              "radial-gradient(ellipse at 50% 0%, rgba(164,133,76,0.16) 0%, transparent 65%)",
          }}
        />

        {/* Corner flourishes */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: 22, left: 22, width: 36, height: 36,
            borderTop: "1px solid rgba(164,133,76,0.4)",
            borderLeft: "1px solid rgba(164,133,76,0.4)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: 22, right: 22, width: 36, height: 36,
            borderBottom: "1px solid rgba(164,133,76,0.4)",
            borderRight: "1px solid rgba(164,133,76,0.4)",
          }}
        />

        <div
          className="relative flex items-center justify-center rounded-full mb-7"
          style={{ width: 60, height: 60, background: "rgba(164,133,76,0.12)" }}
        >
          <Sparkles size={26} strokeWidth={1.25} className="text-gold" />
        </div>

        <p
          className="relative font-sans uppercase text-gold"
          style={{ fontSize: 11, letterSpacing: "0.5em", marginBottom: 18 }}
        >
          Test olfativo
        </p>

        <h2
          className="relative font-display text-text-dark"
          style={{ fontSize: "clamp(30px, 5vw, 54px)", lineHeight: 1.15 }}
        >
          ¿No estás seguro de qué perfume comprar?
        </h2>

        <p
          className="relative font-body text-text-mid"
          style={{ fontSize: 17, maxWidth: 480, margin: "22px 0 36px", lineHeight: 1.8, fontStyle: "italic" }}
        >
          Respondé 5 preguntas rápidas y te recomendamos el perfume ideal para vos.
        </p>

        <Link href="/encontrar-mi-perfume" className="relative">
          <button
            className="font-sans uppercase tracking-widest text-xs px-11 py-4 rounded-full bg-gold text-obsidian hover:bg-gold-light active:bg-gold-dark transition-all duration-300 hover:shadow-lg"
          >
            Encontrá tu perfume
          </button>
        </Link>
      </div>
    </section>
  );
}
