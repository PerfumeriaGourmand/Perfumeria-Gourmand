"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RotateCcw, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/catalog/ProductCard";
import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Option {
  value: string;
  label: string;
  desc?: string;
  symbol?: string;
}

interface Step {
  id: string;
  question: string;
  subtitle?: string;
  cols: 2 | 3;
  options: Option[];
}

type Answers = Record<string, string>;
type Phase = "quiz" | "loading" | "results";

// ─── Questions ────────────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    id: "for_whom",
    question: "¿Para quién buscás el perfume?",
    subtitle: "Empecemos por lo básico",
    cols: 2,
    options: [
      { value: "me",   label: "Para mí",       desc: "Quiero encontrar mi fragancia", symbol: "◈" },
      { value: "gift", label: "Es un regalo",   desc: "Busco el perfume ideal para alguien especial", symbol: "◇" },
    ],
  },
  {
    id: "gender",
    question: "¿Es para...?",
    cols: 3,
    options: [
      { value: "hombre", label: "Hombre",             desc: "Fragancias masculinas y unisex", symbol: "—" },
      { value: "mujer",  label: "Mujer",               desc: "Fragancias femeninas y unisex",  symbol: "—" },
      { value: "unisex", label: "Sin preferencia",     desc: "Quiero explorar todo",           symbol: "—" },
    ],
  },
  {
    id: "style",
    question: "¿Qué tipo de aroma te atrae más?",
    subtitle: "Elegí el que mejor te represente",
    cols: 2,
    options: [
      { value: "fresh",    label: "Fresco y limpio",      desc: "Cítricos, acuático — ligero para el día",       symbol: "○" },
      { value: "floral",   label: "Floral y romántico",   desc: "Rosas, jazmín — delicado y seductor",          symbol: "◌" },
      { value: "oriental", label: "Oriental e intenso",   desc: "Oud, ámbar, especias — potente y duradero",    symbol: "◆" },
      { value: "woody",    label: "Amaderado y único",    desc: "Sándalo, cuero — sofisticado y artesanal",     symbol: "◈" },
      { value: "unknown",  label: "No lo sé todavía",     desc: "Sorprendeme con algo especial",                symbol: "◇" },
    ],
  },
  {
    id: "occasion",
    question: "¿Para qué momento lo usarías?",
    cols: 3,
    options: [
      { value: "daily",      label: "Uso diario",      desc: "Trabajo, calle, todo el día",              symbol: "◎" },
      { value: "night",      label: "Noche y salidas", desc: "Eventos, cenas, ocasiones especiales",     symbol: "●" },
      { value: "versatile",  label: "Para todo",       desc: "Que funcione en cualquier situación",      symbol: "◑" },
    ],
  },
  {
    id: "age",
    question: "¿Qué edad tenés?",
    subtitle: "Para ajustar la recomendación a vos",
    cols: 2,
    options: [
      { value: "18-24", label: "18 a 24",   desc: "Fragancias frescas y accesibles para arrancar",       symbol: "○" },
      { value: "25-35", label: "25 a 35",   desc: "El rango más amplio del catálogo",                    symbol: "◐" },
      { value: "36-50", label: "36 a 50",   desc: "Perfumes con más carácter y sofisticación",            symbol: "◆" },
      { value: "51+",   label: "51 o más",  desc: "Clásicos elegantes y de autor",                        symbol: "◈" },
    ],
  },
  {
    id: "budget",
    question: "¿Cuál es tu presupuesto?",
    subtitle: "Precio por frasco",
    cols: 2,
    options: [
      { value: "low",       label: "Hasta $30.000",         desc: "Grandes opciones en este rango"    },
      { value: "mid",       label: "$30.000 — $70.000",     desc: "La mayoría de nuestras fragancias" },
      { value: "high",      label: "$70.000 — $120.000",    desc: "Selección premium"                 },
      { value: "unlimited", label: "Sin límite",            desc: "Lo que importa es el perfume"      },
    ],
  },
];

// ─── Query builder ─────────────────────────────────────────────────────────────

// Las notas son texto libre cargado a mano ("Rosa de Damasco", "Rosa Turca", "Rosa Búlgara"...)
// así que un match exacto por array no sirve — se busca por substring sobre texto normalizado.
const FAMILY_NOTES: Record<string, string[]> = {
  fresh: ["limon", "bergamota", "menta", "pomelo", "mandarina", "marina", "acuatica", "citricos", "naranja", "toronja", "lima"],
  floral: ["jazmin", "rosa", "muguet", "flor de naranjo", "peonia", "violeta", "iris", "gardenia", "tuberosa", "magnolia", "orquidea", "neroli", "freesia"],
  oriental: ["oud", "ambar", "incienso", "vainilla", "azafran", "almizcle", "mirra", "benjui", "labdanum", "cuero", "tabaco", "canela"],
  woody: ["cedro", "sandalo", "vetiver", "pachuli", "musgo", "guayaco", "cashmeran", "amberwood", "ambroxan"],
};

const OCCASION_TAG: Record<string, string> = {
  daily: "diario",
  night: "noche",
  versatile: "versatil",
};

const AGE_RANGE: Record<string, [number, number]> = {
  "18-24": [18, 24],
  "25-35": [25, 35],
  "36-50": [36, 50],
  "51+": [51, 200],
};

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function matchesFamily(product: Product, family: string) {
  const keywords = FAMILY_NOTES[family];
  if (!keywords) return true;
  const allNotes = [...(product.notes_top ?? []), ...(product.notes_heart ?? []), ...(product.notes_base ?? [])]
    .map(normalize)
    .join(" | ");
  return keywords.some((k) => allNotes.includes(k));
}

async function fetchRecommendations(answers: Answers): Promise<Product[]> {
  const supabase = createClient();

  let query = supabase
    .from("products")
    .select("*, images:product_images(*), variants:product_variants(*)")
    .eq("is_active", true);

  // Gender
  if (answers.gender === "hombre") {
    query = query.in("gender", ["hombre", "unisex"]);
  } else if (answers.gender === "mujer") {
    query = query.in("gender", ["mujer", "unisex"]);
  }

  // Occasion → columna real `occasions` (enum cargado a mano), reemplaza el proxy roto por concentration
  const occasionTag = OCCASION_TAG[answers.occasion ?? ""];
  if (occasionTag) {
    query = query.overlaps("occasions", [occasionTag]);
  }

  // Age → overlap real entre el rango elegido y age_min/age_max del perfume
  const ageRange = AGE_RANGE[answers.age ?? ""];
  if (ageRange) {
    const [userMin, userMax] = ageRange;
    query = query.lte("age_min", userMax).gte("age_max", userMin);
  }

  const { data } = await query.order("sort_order").limit(60);
  let products = (data ?? []) as Product[];

  // Style → familia olfativa real (notes_top/heart/base), reemplaza el proxy roto por category
  const style = answers.style;
  if (style && FAMILY_NOTES[style]) {
    const byFamily = products.filter((p) => matchesFamily(p, style));
    if (byFamily.length >= 3) products = byFamily;
  }

  // Budget filter (client-side on min variant price)
  const budgetMap: Record<string, { min?: number; max?: number }> = {
    low:       { max: 30000 },
    mid:       { min: 30000, max: 70000 },
    high:      { min: 70000, max: 120000 },
    unlimited: {},
  };
  const budget = budgetMap[answers.budget ?? "unlimited"] ?? {};
  if (budget.max !== undefined || budget.min !== undefined) {
    products = products.filter((p) => {
      const prices = (p.variants ?? [])
        .filter((v) => v.is_active && v.stock > 0)
        .map((v) => v.price);
      if (prices.length === 0) return false;
      const min = Math.min(...prices);
      if (budget.max !== undefined && min > budget.max) return false;
      if (budget.min !== undefined && min < budget.min) return false;
      return true;
    });
  }

  // Si los filtros dejaron muy pocos resultados, mostramos lo más relevante posible sin filtrar
  if (products.length < 3) {
    const { data: fallback } = await supabase
      .from("products")
      .select("*, images:product_images(*), variants:product_variants(*)")
      .eq("is_active", true)
      .order("sort_order")
      .limit(12);
    return (fallback ?? []) as Product[];
  }

  return products.slice(0, 8);
}

// ─── Animation variants ────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "60%" : "-60%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? "-60%" : "60%", opacity: 0 }),
};

const transition = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

// ─── Loading dots ──────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex items-center gap-2">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-gold"
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

// ─── Option card ──────────────────────────────────────────────────────────────

function OptionCard({
  option,
  selected,
  onClick,
  cols,
}: {
  option: Option;
  selected: boolean;
  onClick: () => void;
  cols: 2 | 3;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative text-left border transition-all duration-200 p-6 group",
        cols === 3 ? "rounded-2xl" : "rounded-2xl",
        selected
          ? "border-gold bg-gold/8 shadow-[0_0_0_1px_rgba(164,133,76,0.4),0_8px_32px_rgba(164,133,76,0.12)]"
          : "border-white/8 bg-white/4 hover:border-white/20 hover:bg-white/7"
      )}
    >
      {/* Selected indicator */}
      <div
        className={cn(
          "absolute top-4 right-4 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          selected ? "border-gold bg-gold" : "border-white/20"
        )}
      >
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-obsidian"
          />
        )}
      </div>

      {/* Symbol */}
      {option.symbol && option.symbol !== "—" && (
        <p className={cn(
          "font-display mb-4 transition-colors duration-200",
          cols === 3 ? "text-2xl" : "text-3xl",
          selected ? "text-gold" : "text-white/20 group-hover:text-white/40"
        )}>
          {option.symbol}
        </p>
      )}

      {/* Label */}
      <p className={cn(
        "font-display font-light leading-tight mb-2 transition-colors duration-200",
        cols === 3 ? "text-xl" : "text-2xl",
        selected ? "text-cream" : "text-cream/80"
      )}>
        {option.label}
      </p>

      {/* Desc */}
      {option.desc && (
        <p className={cn(
          "font-sans text-xs leading-relaxed transition-colors duration-200",
          selected ? "text-cream-dim" : "text-white/30 group-hover:text-white/50"
        )}>
          {option.desc}
        </p>
      )}
    </motion.button>
  );
}

// ─── Main Quiz ─────────────────────────────────────────────────────────────────

export default function Quiz() {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [direction, setDirection] = useState(1);
  const [phase, setPhase] = useState<Phase>("quiz");
  const [results, setResults] = useState<Product[]>([]);

  const currentStep = STEPS[stepIndex];
  const progress = (stepIndex / STEPS.length) * 100;

  const selectAnswer = useCallback(async (value: string) => {
    const newAnswers = { ...answers, [currentStep.id]: value };
    setAnswers(newAnswers);

    const isLast = stepIndex === STEPS.length - 1;

    // Short delay so the user sees the selection before advancing
    await new Promise((r) => setTimeout(r, 380));

    if (isLast) {
      setPhase("loading");
      const products = await fetchRecommendations(newAnswers);
      setResults(products);
      setPhase("results");
    } else {
      setDirection(1);
      setStepIndex((i) => i + 1);
    }
  }, [answers, currentStep, stepIndex]);

  const goBack = useCallback(() => {
    if (stepIndex === 0) return;
    setDirection(-1);
    setStepIndex((i) => i - 1);
  }, [stepIndex]);

  const restart = useCallback(() => {
    setAnswers({});
    setStepIndex(0);
    setDirection(1);
    setResults([]);
    setPhase("quiz");
  }, []);

  // ── Loading phase ──────────────────────────────────────────────────────────

  if (phase === "loading") {
    return (
      <div className="fixed inset-0 bg-obsidian flex flex-col items-center justify-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="w-16 h-16 rounded-full border border-gold/20 flex items-center justify-center">
            <Sparkles size={24} strokeWidth={1.5} className="text-gold" />
          </div>
          <div className="text-center">
            <p className="font-display text-2xl text-cream mb-2">Analizando tus preferencias</p>
            <p className="font-sans text-sm text-cream-dim">Buscando los perfumes ideales para vos...</p>
          </div>
          <LoadingDots />
        </motion.div>
      </div>
    );
  }

  // ── Results phase ─────────────────────────────────────────────────────────

  if (phase === "results") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-page-bg pt-24 pb-24"
      >
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="py-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold mb-3">
                Tu match perfecto
              </p>
              <h1 className="font-display font-light text-[clamp(2rem,4vw,3.5rem)] text-text-dark leading-none">
                {results.length > 0
                  ? `Encontramos ${results.length} fragancias para vos`
                  : "Explorá nuestra colección"}
              </h1>
            </div>
            <button
              onClick={restart}
              className="flex items-center gap-2 font-sans text-sm text-text-light hover:text-gold transition-colors shrink-0"
            >
              <RotateCcw size={14} strokeWidth={2} />
              Empezar de nuevo
            </button>
          </div>

          <div className="border-t border-border-light mb-10" />

          {results.length === 0 ? (
            <div className="flex flex-col items-center py-24 gap-6 text-center">
              <p className="font-display text-2xl text-text-dark">No encontramos resultados exactos</p>
              <p className="font-sans text-sm text-text-light max-w-sm">
                Probá ajustando tus preferencias o explorá el catálogo completo.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={restart}
                  className="px-6 py-3 border border-text-dark text-text-dark rounded-full font-sans text-sm hover:bg-text-dark hover:text-white transition-colors"
                >
                  Intentar de nuevo
                </button>
                <Link
                  href="/catalogo"
                  className="px-6 py-3 border border-gold/40 text-gold rounded-full font-sans text-sm hover:bg-gold/5 transition-colors"
                >
                  Ver catálogo
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {results.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <p className="font-sans text-sm text-text-light mb-4">
                  ¿Querés ver más opciones?
                </p>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center gap-2 px-8 py-3 border border-border-light text-text-mid rounded-full font-sans text-sm hover:border-gold hover:text-gold transition-colors"
                >
                  Ver catálogo completo
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    );
  }

  // ── Quiz phase ─────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/5 z-10">
        <motion.div
          className="h-full bg-gold"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 pt-8 pb-4 shrink-0 z-10">
        <button
          onClick={goBack}
          disabled={stepIndex === 0}
          className={cn(
            "flex items-center gap-2 font-sans text-sm transition-colors",
            stepIndex === 0
              ? "text-white/10 cursor-not-allowed"
              : "text-white/40 hover:text-white/70"
          )}
        >
          <ArrowLeft size={16} strokeWidth={1.5} />
          <span className="hidden sm:block">Anterior</span>
        </button>

        <Link href="/" className="font-display text-lg text-white/30 hover:text-white/60 transition-colors tracking-widest">
          GOURMAND
        </Link>

        <p className="font-sans text-xs text-white/30">
          {stepIndex + 1} <span className="text-white/15">/ {STEPS.length}</span>
        </p>
      </div>

      {/* Question area */}
      <div className="flex-1 flex flex-col items-center px-6 py-6 min-h-0 overflow-y-auto justify-start sm:justify-center">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={transition}
            className="w-full max-w-3xl flex flex-col items-center"
          >
            {/* Subtitle */}
            {currentStep.subtitle && (
              <p className="font-sans text-xs tracking-[0.4em] uppercase text-gold/60 mb-5 text-center">
                {currentStep.subtitle}
              </p>
            )}

            {/* Question */}
            <h2 className="font-display font-light text-[clamp(1.8rem,4vw,3rem)] text-cream text-center leading-tight mb-10 max-w-xl">
              {currentStep.question}
            </h2>

            {/* Options grid */}
            <div
              className={cn(
                "w-full grid gap-3",
                currentStep.cols === 3
                  ? "grid-cols-1 sm:grid-cols-3"
                  : currentStep.options.length === 5
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1 sm:grid-cols-2"
              )}
            >
              {currentStep.options.map((option) => (
                <OptionCard
                  key={option.value}
                  option={option}
                  selected={answers[currentStep.id] === option.value}
                  onClick={() => selectAnswer(option.value)}
                  cols={currentStep.cols}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom hint */}
      <div className="pb-8 text-center shrink-0">
        <p className="font-sans text-[10px] tracking-widest uppercase text-white/15">
          Seleccioná una opción para continuar
        </p>
      </div>
    </div>
  );
}
