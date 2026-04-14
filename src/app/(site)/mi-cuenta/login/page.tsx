"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Credenciales incorrectas");
      setLoading(false);
      return;
    }
    toast.success("Sesión iniciada");
    router.push("/mi-cuenta");
    router.refresh();
  };

  return (
    <div className="min-h-screen pt-28 pb-24 flex items-start justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-text-dark mb-2">Mi cuenta</h1>
          <p className="font-sans text-sm text-text-light">Iniciá sesión para ver tus pedidos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-sans text-xs font-medium text-text-mid mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-border-light rounded-xl px-4 py-3 font-sans text-sm text-text-dark focus:outline-none focus:border-gold/50 bg-white transition-colors"
              placeholder="tu@email.com"
            />
          </div>
          <div>
            <label className="block font-sans text-xs font-medium text-text-mid mb-1.5">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-border-light rounded-xl px-4 py-3 font-sans text-sm text-text-dark focus:outline-none focus:border-gold/50 bg-white transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="font-sans text-sm text-text-light">
            ¿No tenés cuenta?{" "}
            <Link href="/mi-cuenta/registro" className="text-text-dark font-medium hover:text-gold transition-colors">
              Registrate
            </Link>
          </p>
          <Link href="/" className="block font-sans text-xs text-text-light hover:text-text-mid transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
