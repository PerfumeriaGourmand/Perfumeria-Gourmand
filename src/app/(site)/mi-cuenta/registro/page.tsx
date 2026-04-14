"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegistroPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
        },
      },
    });

    if (error) {
      if (error.message.includes("already registered")) {
        toast.error("Ya existe una cuenta con ese email");
      } else {
        toast.error("Error al crear la cuenta. Intentá de nuevo.");
      }
      setLoading(false);
      return;
    }

    toast.success("¡Cuenta creada! Revisá tu email para confirmarla.");
    router.push("/mi-cuenta/login");
  };

  return (
    <div className="min-h-screen pt-28 pb-24 flex items-start justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-text-dark mb-2">Crear cuenta</h1>
          <p className="font-sans text-sm text-text-light">Registrate para comprar y seguir tus pedidos</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-sans text-xs font-medium text-text-mid mb-1.5">Nombre</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full border border-border-light rounded-xl px-4 py-3 font-sans text-sm text-text-dark focus:outline-none focus:border-gold/50 bg-white transition-colors"
                placeholder="Juan"
              />
            </div>
            <div>
              <label className="block font-sans text-xs font-medium text-text-mid mb-1.5">Apellido</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full border border-border-light rounded-xl px-4 py-3 font-sans text-sm text-text-dark focus:outline-none focus:border-gold/50 bg-white transition-colors"
                placeholder="García"
              />
            </div>
          </div>

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
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block font-sans text-xs font-medium text-text-mid mb-1.5">Confirmar contraseña</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="font-sans text-sm text-text-light">
            ¿Ya tenés cuenta?{" "}
            <Link href="/mi-cuenta/login" className="text-text-dark font-medium hover:text-gold transition-colors">
              Iniciá sesión
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
