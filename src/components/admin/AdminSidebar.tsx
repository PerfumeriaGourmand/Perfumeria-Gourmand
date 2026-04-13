"use client";

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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const LINKS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Productos & Kits", icon: Package },
  { href: "/admin/orders", label: "Órdenes", icon: ShoppingBag },
  { href: "/admin/stock", label: "Stock (FIFO)", icon: Layers },
  { href: "/admin/ventas-manuales", label: "Venta Manual", icon: PenLine },
  { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/admin/settings", label: "Configuración", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className="w-56 flex-shrink-0 border-r border-gold/10 flex flex-col py-8">
      {/* Logo */}
      <div className="px-6 mb-10">
        <p className="font-display text-xl tracking-[0.25em] text-cream">GOURMAND</p>
        <p className="font-sans text-[10px] tracking-widest uppercase text-gold/50 mt-1">
          Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {LINKS.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
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

      {/* Ver sitio + Logout */}
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
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full font-sans text-xs tracking-wide text-cream-dim hover:text-cream-muted transition-colors duration-200"
        >
          <LogOut size={15} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
