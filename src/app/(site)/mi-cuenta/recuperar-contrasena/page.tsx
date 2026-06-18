"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RecuperarContrasenaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/mi-cuenta/restablecer-contrasena`,
    });
    setLoading(false);
    if (error) {
      toast.error("No pudimos enviar el email. Intentá de nuevo.");
      return;
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen pt-28 pb-24 flex items-start justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-text-dark mb-2">
            Recuperar contraseña
          </h1>
          <p className="font-sans text-sm text-text-light">
            {sent
              ? "Revisá tu email para continuar"
              : "Te enviamos un link para restablecerla"}
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-6">
            <p className="font-sans text-sm text-text-mid">
              Si existe una cuenta con <span className="font-medium text-text-dark">{email}</span>,
              vas a recibir un email con instrucciones para crear una nueva contraseña.
            </p>
            <Link
              href="/mi-cuenta/login"
              className="block font-sans text-sm text-text-dark font-medium hover:text-gold transition-colors"
            >
              ← Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-sans text-xs font-medium text-text-mid mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full border border-border-light rounded-xl px-4 py-3 font-sans text-sm text-text-dark focus:outline-none focus:border-gold/50 bg-white transition-colors"
                  placeholder="tu@email.com"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors disabled:opacity-50 mt-2"
              >
                {loading ? "Enviando..." : "Enviar link de recuperación"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/mi-cuenta/login"
                className="font-sans text-sm text-text-dark font-medium hover:text-gold transition-colors"
              >
                ← Volver a iniciar sesión
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
