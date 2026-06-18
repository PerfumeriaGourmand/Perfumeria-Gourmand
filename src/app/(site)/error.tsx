"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[site error]", error);
  }, [error]);

  return (
    <div className="min-h-screen pt-[104px] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-display text-7xl font-bold text-gold mb-4">!</p>
        <h1 className="font-display text-2xl font-bold text-text-dark mb-3">
          Algo salió mal
        </h1>
        <p className="font-sans text-sm text-text-light mb-8">
          Tuvimos un problema para mostrar esta página. Probá de nuevo en un momento.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="py-3 px-6 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="py-3 px-6 border border-border-light text-text-dark rounded-full font-sans text-sm font-medium hover:border-gold/50 hover:text-gold transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
