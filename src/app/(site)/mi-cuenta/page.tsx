"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import { Settings, ShoppingBag, LogIn, User, Edit2, LogOut, Package } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import toast from "react-hot-toast";

interface Order {
  id: string;
  total: number;
  payment_status: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, string> = {
  approved: "Aprobado",
  pending: "Pendiente",
  rejected: "Rechazado",
  in_process: "En proceso",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
};

const STATUS_COLORS: Record<string, string> = {
  approved: "text-green-600 bg-green-50 border-green-200",
  pending: "text-yellow-600 bg-yellow-50 border-yellow-200",
  rejected: "text-red-500 bg-red-50 border-red-200",
  in_process: "text-blue-600 bg-blue-50 border-blue-200",
  cancelled: "text-text-light bg-surface-2 border-border-light",
  refunded: "text-text-light bg-surface-2 border-border-light",
};

function formatPrice(n: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
}

export default function MiCuentaPage() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user);
      if (data.user) {
        const { data: ordersData } = await supabase
          .from("orders")
          .select("id, total, payment_status, created_at")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .limit(5);
        setOrders(ordersData ?? []);
      }
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Sesión cerrada");
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-28 flex flex-col items-center justify-center gap-6 px-6">
        <User size={40} strokeWidth={1} className="text-text-light" />
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-text-dark mb-2">Mi cuenta</h1>
          <p className="font-sans text-sm text-text-light">Iniciá sesión para ver tus pedidos</p>
        </div>
        <Link
          href="/mi-cuenta/login"
          className="flex items-center gap-2 px-8 py-3 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors"
        >
          <LogIn size={16} strokeWidth={2} />
          Iniciar sesión
        </Link>
        <Link
          href="/mi-cuenta/registro"
          className="font-sans text-sm text-text-light hover:text-text-dark transition-colors"
        >
          ¿No tenés cuenta? Registrate
        </Link>
      </div>
    );
  }

  const isAdmin = user.app_metadata?.role === "admin";
  const firstName = user.user_metadata?.first_name ?? user.user_metadata?.name ?? "";
  const lastName = user.user_metadata?.last_name ?? "";
  const displayName = [firstName, lastName].filter(Boolean).join(" ") || null;
  const avatarUrl = user.user_metadata?.avatar_url ?? null;
  const initial = (displayName ?? user.email ?? "U").charAt(0).toUpperCase();

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-2xl mx-auto">

      {/* ——— User card ——— */}
      <div className="bg-white border border-border-light rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-5">
          {/* Avatar */}
          <div className="relative w-16 h-16 rounded-full bg-gold/15 border-2 border-gold/30 overflow-hidden flex items-center justify-center flex-shrink-0">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
            ) : (
              <span className="font-display text-2xl font-bold text-gold">{initial}</span>
            )}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            {displayName ? (
              <p className="font-display text-xl font-bold text-text-dark">{displayName}</p>
            ) : (
              <p className="font-display text-xl font-bold text-text-dark">Mi cuenta</p>
            )}
            <p className="font-sans text-sm text-text-light truncate">{user.email}</p>
            {isAdmin && (
              <span className="inline-block mt-1 font-sans text-[9px] tracking-wider uppercase text-gold border border-gold/30 px-2 py-0.5 rounded-full">
                Administrador
              </span>
            )}
          </div>
        </div>

        {/* Edit profile button */}
        <Link
          href="/mi-cuenta/editar-perfil"
          className="flex items-center justify-center gap-2 w-full py-2.5 border border-border-light rounded-full font-sans text-sm text-text-mid hover:border-text-dark hover:text-text-dark transition-colors"
        >
          <Edit2 size={14} strokeWidth={2} />
          Editar perfil
        </Link>
      </div>

      {/* ——— Quick actions ——— */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <Link
          href="/mis-pedidos"
          className="flex items-center gap-4 p-5 bg-white border border-border-light rounded-2xl hover:shadow-card transition-all duration-200 group"
        >
          <div className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center group-hover:bg-gold/10 transition-colors">
            <Package size={18} strokeWidth={1.5} className="text-text-mid" />
          </div>
          <div>
            <p className="font-sans text-sm font-medium text-text-dark">Mis pedidos</p>
            <p className="font-sans text-xs text-text-light">Historial de compras</p>
          </div>
        </Link>

        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center gap-4 p-5 bg-white border border-gold/30 rounded-2xl hover:shadow-card hover:border-gold/60 transition-all duration-200 group"
          >
            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center group-hover:bg-gold/20 transition-colors">
              <Settings size={18} strokeWidth={1.5} className="text-gold" />
            </div>
            <div>
              <p className="font-sans text-sm font-medium text-gold">Panel de administración</p>
              <p className="font-sans text-xs text-text-light">Gestionar productos y pedidos</p>
            </div>
          </Link>
        )}
      </div>

      {/* ——— Recent orders ——— */}
      {orders.length > 0 && (
        <div className="bg-white border border-border-light rounded-2xl overflow-hidden mb-6">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light">
            <div className="flex items-center gap-2">
              <ShoppingBag size={15} strokeWidth={1.5} className="text-text-light" />
              <span className="font-sans text-sm font-semibold text-text-dark">Pedidos recientes</span>
            </div>
            <Link href="/mis-pedidos" className="font-sans text-xs text-text-light hover:text-gold transition-colors">
              Ver todos →
            </Link>
          </div>
          <div className="divide-y divide-border-light">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="font-mono text-xs text-text-mid font-medium">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="font-sans text-[10px] text-text-light mt-0.5">
                    {new Date(order.created_at).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`font-sans text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                      STATUS_COLORS[order.payment_status] ?? "text-text-light bg-surface-2 border-border-light"
                    }`}
                  >
                    {STATUS_LABELS[order.payment_status] ?? order.payment_status}
                  </span>
                  <span className="font-sans text-sm font-semibold text-text-dark">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ——— Logout ——— */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 w-full justify-center py-3.5 border border-red-200 text-red-500 rounded-full font-sans text-sm font-medium hover:bg-red-50 hover:border-red-300 transition-colors"
      >
        <LogOut size={15} strokeWidth={2} />
        Cerrar sesión
      </button>
    </div>
  );
}
