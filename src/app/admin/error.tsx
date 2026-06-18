"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error]", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-display text-6xl font-bold text-gold mb-4">!</p>
        <h1 className="font-display text-xl font-bold text-cream mb-3">
          Algo salió mal
        </h1>
        <p className="font-sans text-sm text-cream-dim mb-8">
          Hubo un problema cargando esta sección del panel.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="py-2.5 px-6 bg-gold text-obsidian rounded-full font-sans text-sm font-medium hover:bg-gold-light transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/admin"
            className="py-2.5 px-6 border border-gold/30 text-cream rounded-full font-sans text-sm font-medium hover:border-gold/50 transition-colors"
          >
            Volver al panel
          </Link>
        </div>
      </div>
    </div>
  );
}
