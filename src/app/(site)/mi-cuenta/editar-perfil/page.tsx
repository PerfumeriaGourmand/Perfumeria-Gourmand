"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Camera, Save, Eye, EyeOff } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import toast from "react-hot-toast";

export default function EditarPerfilPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  // Password fields
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    const client = createClient();
    client.auth.getUser().then(({ data }) => {
      const u = data.user;
      if (!u) {
        router.push("/mi-cuenta/login");
        return;
      }
      setUser(u);
      setFirstName(u.user_metadata?.first_name ?? u.user_metadata?.name ?? "");
      setLastName(u.user_metadata?.last_name ?? "");
      setEmail(u.email ?? "");
      setAvatarUrl(u.user_metadata?.avatar_url ?? "");
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("La imagen no puede superar 2MB");
      return;
    }
    setUploadingAvatar(true);
    try {
      const client = createClient();
      const ext = file.name.split(".").pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: uploadError } = await client.storage
        .from("products")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = client.storage.from("products").getPublicUrl(path);
      const url = urlData.publicUrl + `?t=${Date.now()}`;
      setAvatarUrl(url);
      await client.auth.updateUser({ data: { avatar_url: url } });
      toast.success("Foto actualizada");
    } catch {
      toast.error("Error al subir la imagen");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!firstName.trim()) {
      toast.error("El nombre es requerido");
      return;
    }
    setSaving(true);
    try {
      const client = createClient();
      const updates: { data: Record<string, string>; email?: string } = {
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        },
      };
      if (email.trim() && email !== user?.email) {
        updates.email = email.trim();
      }
      const { error } = await client.auth.updateUser(updates);
      if (error) throw error;
      toast.success(
        email !== user?.email
          ? "Perfil actualizado. Revisá tu nuevo email para confirmar el cambio."
          : "Perfil actualizado"
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword) { toast.error("Ingresá la nueva contraseña"); return; }
    if (newPassword.length < 6) { toast.error("La contraseña debe tener al menos 6 caracteres"); return; }
    if (newPassword !== confirmPassword) { toast.error("Las contraseñas no coinciden"); return; }
    setSavingPassword(true);
    try {
      const client = createClient();
      const { error } = await client.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Contraseña actualizada");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al cambiar contraseña");
    } finally {
      setSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClass =
    "w-full bg-white border border-border-light rounded-xl px-4 py-3 font-sans text-sm text-text-dark placeholder:text-text-light focus:outline-none focus:border-gold/50 transition-colors";
  const labelClass = "font-sans text-xs font-medium text-text-mid mb-1.5 block";

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-xl mx-auto">
      {/* Back */}
      <Link
        href="/mi-cuenta"
        className="flex items-center gap-1.5 font-sans text-xs text-text-light hover:text-text-mid transition-colors mb-8"
      >
        <ChevronLeft size={14} strokeWidth={2} />
        Volver a mi cuenta
      </Link>

      <h1 className="font-display text-3xl font-bold text-text-dark mb-8">Editar perfil</h1>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gold/15 border-2 border-gold/30 overflow-hidden flex items-center justify-center">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
            ) : (
              <span className="font-display text-3xl font-bold text-gold">
                {(firstName || user?.email || "U").charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute -bottom-1 -right-1 w-8 h-8 bg-text-dark text-white rounded-full flex items-center justify-center hover:bg-gold transition-colors disabled:opacity-60"
          >
            {uploadingAvatar ? (
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={13} strokeWidth={2} />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        <p className="font-sans text-xs text-text-light mt-3">JPG, PNG · máx. 2MB</p>
      </div>

      {/* Profile form */}
      <div className="bg-white border border-border-light rounded-2xl p-6 mb-5 space-y-4">
        <h2 className="font-sans text-xs font-semibold text-text-dark tracking-widest uppercase mb-2">
          Información personal
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nombre</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Juan"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Apellido</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="García"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className={inputClass}
          />
          {email !== user?.email && (
            <p className="font-sans text-[10px] text-gold mt-1.5">
              Se enviará un email de confirmación a esta dirección
            </p>
          )}
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors disabled:opacity-50"
        >
          <Save size={15} strokeWidth={2} />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      {/* Password form */}
      <div className="bg-white border border-border-light rounded-2xl p-6 space-y-4">
        <h2 className="font-sans text-xs font-semibold text-text-dark tracking-widest uppercase mb-2">
          Cambiar contraseña
        </h2>

        <div>
          <label className={labelClass}>Nueva contraseña</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className={inputClass + " pr-11"}
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
          <label className={labelClass}>Confirmar contraseña</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repetí la contraseña"
              className={inputClass + " pr-11"}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light hover:text-text-mid transition-colors"
            >
              {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p className="font-sans text-[10px] text-red-500 mt-1.5">Las contraseñas no coinciden</p>
          )}
        </div>

        <button
          onClick={handleChangePassword}
          disabled={savingPassword}
          className="w-full flex items-center justify-center gap-2 py-3.5 border border-text-dark text-text-dark rounded-full font-sans text-sm font-medium hover:bg-text-dark hover:text-white transition-colors disabled:opacity-50"
        >
          {savingPassword ? "Cambiando..." : "Cambiar contraseña"}
        </button>
      </div>
    </div>
  );
}
