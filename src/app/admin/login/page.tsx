"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-obsidian flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-12">
          <p className="font-display text-3xl tracking-[0.3em] text-cream mb-2">GOURMAND</p>
          <p className="font-sans text-xs tracking-widest uppercase text-cream-dim">
            Panel de administración
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-obsidian-surface border border-gold/10 text-cream font-sans text-sm px-4 py-3 focus:border-gold/30 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-obsidian-surface border border-gold/10 text-cream font-sans text-sm px-4 py-3 pr-11 focus:border-gold/30 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cream-dim hover:text-cream transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full justify-center mt-2"
          >
            Ingresar
          </Button>
        </form>
      </div>
    </div>
  );
}
