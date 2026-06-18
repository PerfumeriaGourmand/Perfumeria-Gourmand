"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global error]", error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          background: "#fdfcfb",
          color: "#1c1917",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 400, padding: "0 24px" }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12 }}>
            Algo salió mal
          </h1>
          <p style={{ fontSize: 14, color: "#78716c", marginBottom: 24 }}>
            Tuvimos un problema inesperado. Probá recargar la página.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "12px 24px",
              background: "#1c1917",
              color: "#fff",
              borderRadius: 999,
              border: "none",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
