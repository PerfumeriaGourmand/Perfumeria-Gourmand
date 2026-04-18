"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export type Period = "daily" | "weekly" | "monthly" | "yearly" | "lifetime";

const PERIODS: Array<{ key: Period; label: string }> = [
  { key: "daily", label: "Diario" },
  { key: "weekly", label: "Semanal" },
  { key: "monthly", label: "Mensual" },
  { key: "yearly", label: "Anual" },
  { key: "lifetime", label: "Lifetime" },
];

export default function AnalyticsPeriodFilter({ active }: { active: Period }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function navigate(period: Period) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("period", period);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {PERIODS.map((p) => (
        <button
          key={p.key}
          onClick={() => navigate(p.key)}
          className={`font-sans text-[10px] tracking-widest uppercase px-3 py-1.5 transition-colors duration-150 ${
            active === p.key
              ? "bg-gold/20 text-gold border border-gold/40"
              : "text-cream-dim hover:text-cream border border-transparent hover:border-gold/20"
          }`}
        >
          {p.label}
        </button>
      ))}
    </div>
  );
}
