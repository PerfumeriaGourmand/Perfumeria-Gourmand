"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  TrendingUp,
  ExternalLink,
  Layers,
  PenLine,
  Tag,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Productos & Kits", icon: Package },
  { href: "/admin/orders", label: "Órdenes", icon: ShoppingBag },
  { href: "/admin/stock", label: "Stock", icon: Layers },
  { href: "/admin/ventas-manuales", label: "Venta Manual", icon: PenLine },
  { href: "/admin/coupons", label: "Cupones", icon: Tag },
  { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
];

function SidebarContent({ onNavigate, onLogout, pathname }: { onNavigate: () => void; onLogout: () => void; pathname: string }) {
  return (
    <>
      <div className="px-6 mb-10">
        <p className="font-display text-xl tracking-[0.25em] text-cream">GOURMAND</p>
        <p className="font-sans text-[10px] tracking-widest uppercase text-gold/50 mt-1">Admin</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 font-sans text-xs tracking-wide transition-all duration-200 rounded-sm",
                active
                  ? "bg-gold/10 text-gold border-l-2 border-gold pl-[10px]"
                  : "text-cream-muted hover:text-cream hover:bg-obsidian-surface"
              )}
            >
              <link.icon size={15} strokeWidth={1.5} />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 mt-6 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 w-full font-sans text-xs tracking-wide text-cream-dim hover:text-cream hover:bg-obsidian-surface transition-all duration-200 rounded-sm"
        >
          <ExternalLink size={15} strokeWidth={1.5} />
          Ver tienda
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full font-sans text-xs tracking-wide text-cream-dim hover:text-cream-muted transition-colors duration-200"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-obsidian border-b border-gold/10 flex items-center px-4 gap-4">
        <button
          onClick={() => setOpen(true)}
          className="text-cream-muted hover:text-cream transition-colors"
          aria-label="Abrir menú"
        >
          <Menu size={20} strokeWidth={1.5} />
        </button>
        <p className="font-display text-base tracking-[0.25em] text-cream">GOURMAND</p>
        <span className="font-sans text-[10px] tracking-widest uppercase text-gold/50">Admin</span>
      </div>

      {/* Mobile drawer backdrop */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={cn(
          "md:hidden fixed top-0 left-0 z-50 h-full w-64 bg-obsidian border-r border-gold/10 flex flex-col py-8 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-cream-dim hover:text-cream transition-colors"
          aria-label="Cerrar menú"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
        <SidebarContent
          pathname={pathname}
          onNavigate={() => setOpen(false)}
          onLogout={handleLogout}
        />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 flex-shrink-0 border-r border-gold/10 flex-col py-8 sticky top-0 h-screen overflow-y-auto">
        <SidebarContent
          pathname={pathname}
          onNavigate={() => {}}
          onLogout={handleLogout}
        />
      </aside>
    </>
  );
}
