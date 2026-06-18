"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RestablecerContrasenaPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [validSession, setValidSession] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      setValidSession(!!data.session);
      setChecking(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast.error("No pudimos actualizar la contraseña. Intentá de nuevo.");
      return;
    }
    toast.success("Contraseña actualizada");
    router.push("/mi-cuenta");
    router.refresh();
  };

  const inputClass =
    "w-full border border-border-light rounded-xl px-4 py-3 font-sans text-sm text-text-dark focus:outline-none focus:border-gold/50 bg-white transition-colors pr-11";

  if (checking) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!validSession) {
    return (
      <div className="min-h-screen pt-28 pb-24 flex items-start justify-center px-6">
        <div className="w-full max-w-sm text-center">
          <h1 className="font-display text-3xl font-bold text-text-dark mb-3">
            Link inválido o vencido
          </h1>
          <p className="font-sans text-sm text-text-light mb-8">
            Este link de recuperación ya no es válido. Pedí uno nuevo para restablecer tu contraseña.
          </p>
          <Link
            href="/mi-cuenta/recuperar-contrasena"
            className="inline-block py-3 px-6 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors"
          >
            Pedir nuevo link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-24 flex items-start justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold text-text-dark mb-2">
            Nueva contraseña
          </h1>
          <p className="font-sans text-sm text-text-light">Elegí una contraseña nueva para tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-sans text-xs font-medium text-text-mid mb-1.5">
              Nueva contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="Mínimo 6 caracteres"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text-mid transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-sans text-xs font-medium text-text-mid mb-1.5">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={inputClass}
                placeholder="Repetí la contraseña"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text-mid transition-colors"
              >
                {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="font-sans text-[10px] text-red-500 mt-1.5">Las contraseñas no coinciden</p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors disabled:opacity-50 mt-2"
          >
            {saving ? "Guardando..." : "Guardar nueva contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}
