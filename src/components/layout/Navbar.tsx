"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ShoppingBag, User, Menu, X, ChevronDown, LogIn, Settings, ArrowRight, Heart, Search } from "lucide-react";
import SearchBar from "@/components/layout/SearchBar";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { useThemeStore } from "@/store/theme";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// ——— Mega menu config ———
const MEGA_MENUS = {
  Árabe: {
    dark: false,
    eyebrow: "Fragancias de Oriente",
    description:
      "Oud, rosa, ámbar y especias. La opulencia del Oriente Medio destilada en cada frasco.",
    href: "/catalogo?category=arabe",
    genders: [
      {
        title: "Masculino",
        links: [
          { label: "Ver todos", href: "/catalogo?category=arabe&gender=hombre" },
          { label: "Novedades", href: "/catalogo?category=arabe&gender=hombre&sort=newest" },
          { label: "Más vendidos", href: "/catalogo?category=arabe&gender=hombre&sort=popular" },
        ],
      },
      {
        title: "Femenino",
        links: [
          { label: "Ver todos", href: "/catalogo?category=arabe&gender=mujer" },
          { label: "Novedades", href: "/catalogo?category=arabe&gender=mujer&sort=newest" },
          { label: "Más vendidos", href: "/catalogo?category=arabe&gender=mujer&sort=popular" },
        ],
      },
      {
        title: "Unisex",
        links: [
          { label: "Ver todos", href: "/catalogo?category=arabe&gender=unisex" },
          { label: "Novedades", href: "/catalogo?category=arabe&gender=unisex&sort=newest" },
        ],
      },
    ],
    quick: [
      { label: "Más vendidos", href: "/catalogo?category=arabe&sort=popular" },
      { label: "Novedades", href: "/catalogo?category=arabe&sort=newest" },
      { label: "Ver colección completa", href: "/catalogo?category=arabe" },
    ],
  },
  Diseñador: {
    dark: false,
    eyebrow: "Grandes maisons",
    description:
      "Las firmas más icónicas del perfume. Elegancia accesible con apellido de lujo.",
    href: "/catalogo?category=disenador",
    genders: [
      {
        title: "Masculino",
        links: [
          { label: "Ver todos", href: "/catalogo?category=disenador&gender=hombre" },
          { label: "Novedades", href: "/catalogo?category=disenador&gender=hombre&sort=newest" },
          { label: "Más vendidos", href: "/catalogo?category=disenador&gender=hombre&sort=popular" },
        ],
      },
      {
        title: "Femenino",
        links: [
          { label: "Ver todos", href: "/catalogo?category=disenador&gender=mujer" },
          { label: "Novedades", href: "/catalogo?category=disenador&gender=mujer&sort=newest" },
          { label: "Más vendidos", href: "/catalogo?category=disenador&gender=mujer&sort=popular" },
        ],
      },
      {
        title: "Unisex",
        links: [
          { label: "Ver todos", href: "/catalogo?category=disenador&gender=unisex" },
          { label: "Novedades", href: "/catalogo?category=disenador&gender=unisex&sort=newest" },
        ],
      },
    ],
    quick: [
      { label: "Más vendidos", href: "/catalogo?category=disenador&sort=popular" },
      { label: "Novedades", href: "/catalogo?category=disenador&sort=newest" },
      { label: "Ver colección completa", href: "/catalogo?category=disenador" },
    ],
  },
  Nicho: {
    dark: true,
    eyebrow: "Perfumería de autor",
    description:
      "Pequeñas tiradas, materias primas extraordinarias. Para olfatos que no aceptan lo ordinario.",
    href: "/catalogo/nicho",
    genders: [
      {
        title: "Masculino",
        links: [
          { label: "Ver todos", href: "/catalogo?category=nicho&gender=hombre" },
          { label: "Novedades", href: "/catalogo?category=nicho&gender=hombre&sort=newest" },
        ],
      },
      {
        title: "Femenino",
        links: [
          { label: "Ver todos", href: "/catalogo?category=nicho&gender=mujer" },
          { label: "Novedades", href: "/catalogo?category=nicho&gender=mujer&sort=newest" },
        ],
      },
      {
        title: "Unisex",
        links: [
          { label: "Ver todos", href: "/catalogo?category=nicho&gender=unisex" },
          { label: "Novedades", href: "/catalogo?category=nicho&gender=unisex&sort=newest" },
        ],
      },
    ],
    quick: [
      { label: "Más vendidos", href: "/catalogo?category=nicho&sort=popular" },
      { label: "Novedades", href: "/catalogo?category=nicho&sort=newest" },
      { label: "Experiencia Nicho →", href: "/catalogo/nicho" },
    ],
  },
} as const;

type MegaMenuKey = keyof typeof MEGA_MENUS;

const NAV_ITEMS = [
  { label: "Árabe" as MegaMenuKey, href: "/catalogo?category=arabe", hasMega: true },
  { label: "Diseñador" as MegaMenuKey, href: "/catalogo?category=disenador", hasMega: true },
  { label: "Nicho" as MegaMenuKey, href: "/catalogo/nicho", hasMega: true },
  { label: "Colecciones", href: "/colecciones", hasMega: false },
  { label: "Novedades", href: "/catalogo?sort=newest", hasMega: false },
  { label: "Marcas", href: "/marcas", hasMega: false },
] as const;

export default function Navbar({ hasAnnouncement = false }: { hasAnnouncement?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileSearchAnimDone, setMobileSearchAnimDone] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<MegaMenuKey | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const dropdownTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accountRef = useRef<HTMLDivElement>(null);
  const navRowRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { itemCount, openCart } = useCartStore();
  const { count: wishlistCount } = useWishlistStore();
  const { isNichoProduct } = useThemeStore();
  const [cartMounted, setCartMounted] = useState(false);
  useEffect(() => setCartMounted(true), []);
  const count = cartMounted ? itemCount() : 0;
  const wCount = cartMounted ? wishlistCount() : 0;

  // Detect if current page is nicho-themed
  const isNicho =
    pathname === "/catalogo/nicho" ||
    pathname.startsWith("/catalogo/nicho/") ||
    searchParams.get("category") === "nicho" ||
    isNichoProduct;

  // Non-nicho, non-scrolled → dark transparent (hero overlay)
  const isDark = isNicho || !scrolled;

  // Theme tokens
  const T = {
    header: isNicho
      ? "bg-[#0a0a0a] border-gold/10"
      : scrolled
      ? "bg-white border-border-light shadow-[0_1px_12px_rgba(0,0,0,0.07)]"
      : "bg-[rgba(10,10,10,0.82)] backdrop-blur-[18px] border-white/[0.08]",
    logo: isNicho
      ? "text-gold hover:text-gold-light"
      : scrolled
      ? "text-text-dark hover:text-gold"
      : "text-cream hover:text-gold",
    iconBtn: isDark
      ? "text-cream-dim hover:text-cream hover:bg-white/5"
      : "text-text-mid hover:text-text-dark hover:bg-surface-2",
    navBorder: isDark ? "border-gold/10" : "border-border-light",
    navLink: isDark ? "text-cream-dim hover:text-cream" : "text-text-mid hover:text-text-dark",
    navActive: isDark ? "text-cream border-gold" : "text-text-dark border-gold",
    navInactive: "border-transparent hover:border-gold/40",
  };

  // Auth state
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  // Close mobile search on navigation
  useEffect(() => {
    setMobileSearchOpen(false);
  }, [pathname, searchParams]);

  // Reset overflow-clip state whenever mobile search closes, so it re-clips on next open
  // animation. Adjusted during render (not in an effect, and not via a ref — refs can't be
  // read/written during render) per React's guidance for resetting state in response to a
  // prop/state change: https://react.dev/learn/you-might-not-need-an-effect
  const [prevMobileSearchOpen, setPrevMobileSearchOpen] = useState(mobileSearchOpen);
  if (prevMobileSearchOpen !== mobileSearchOpen) {
    setPrevMobileSearchOpen(mobileSearchOpen);
    if (!mobileSearchOpen) setMobileSearchAnimDone(false);
  }

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setAccountOpen(false);
    router.refresh();
  };

  const openDrop = (label: MegaMenuKey) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setOpenDropdown(label);
  };
  const closeDrop = () => {
    dropdownTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };
  const cancelClose = () => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
  };

  const isAdmin = user?.app_metadata?.role === "admin";

  return (
    <>
      <header
        className={cn(
          "fixed left-0 right-0 z-50 transition-all duration-300",
          hasAnnouncement ? "top-9" : "top-0",
          T.header
        )}
      >
        {/* ——— Top row: Logo | Search | Icons ——— */}
        <div className="max-w-7xl mx-auto px-5 flex items-center gap-4 h-16">
          {/* Logo */}
          <Link
            href="/"
            className={cn("font-display text-2xl font-bold tracking-[0.15em] transition-colors duration-300 shrink-0 sm:mr-4", T.logo)}
          >
            GOURMAND
          </Link>

          {/* Search — hidden on mobile */}
          <SearchBar dark={isDark} className="hidden sm:block flex-1" />

          {/* Icons */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-auto sm:ml-0">
            {/* Search icon — mobile only */}
            <button
              onClick={() => setMobileSearchOpen((v) => !v)}
              className={cn("sm:hidden w-9 h-9 flex items-center justify-center transition-colors rounded-full", T.iconBtn)}
              aria-label="Buscar"
            >
              {mobileSearchOpen ? <X size={18} strokeWidth={1.5} /> : <Search size={18} strokeWidth={1.5} />}
            </button>

            {/* Account */}
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((v) => !v)}
                className={cn("w-9 h-9 flex items-center justify-center transition-colors rounded-full", T.iconBtn)}
                aria-label="Mi cuenta"
              >
                {user ? (
                  <div className="w-7 h-7 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                    <span className="font-display text-xs font-bold text-gold">
                      {(user.user_metadata?.name ?? user.email ?? "U").charAt(0).toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <User size={18} strokeWidth={1.5} />
                )}
              </button>

              {/* Account dropdown */}
              <AnimatePresence>
                {accountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-3 w-72 bg-white border border-border-light rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden z-50"
                  >
                    {user ? (
                      <>
                        {/* User header */}
                        <div className="px-5 py-4 bg-surface-2 border-b border-border-light">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0">
                              <span className="font-display text-sm font-bold text-gold">
                                {(user.user_metadata?.name ?? user.email ?? "U")
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            </div>
                            <div className="min-w-0">
                              {user.user_metadata?.name && (
                                <p className="font-sans text-sm font-semibold text-text-dark truncate">
                                  {user.user_metadata.name}
                                </p>
                              )}
                              <p className="font-sans text-xs text-text-light truncate">
                                {user.email}
                              </p>
                              {isAdmin && (
                                <span className="inline-block mt-0.5 font-sans text-[9px] tracking-wider uppercase text-gold border border-gold/30 px-1.5 py-px rounded-full">
                                  Admin
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="py-1.5">
                          <Link
                            href="/mi-cuenta"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 font-sans text-sm text-text-mid hover:bg-surface-2 hover:text-text-dark transition-colors"
                          >
                            <User size={15} strokeWidth={1.5} className="text-text-light" />
                            Mi cuenta
                          </Link>
                          <Link
                            href="/mis-pedidos"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 font-sans text-sm text-text-mid hover:bg-surface-2 hover:text-text-dark transition-colors"
                          >
                            <ShoppingBag size={15} strokeWidth={1.5} className="text-text-light" />
                            Mis pedidos
                          </Link>
                          <Link
                            href="/mi-cuenta/editar-perfil"
                            onClick={() => setAccountOpen(false)}
                            className="flex items-center gap-3 px-5 py-3 font-sans text-sm text-text-mid hover:bg-surface-2 hover:text-text-dark transition-colors"
                          >
                            <Settings size={15} strokeWidth={1.5} className="text-text-light" />
                            Editar perfil
                          </Link>
                          {isAdmin && (
                            <>
                              <div className="mx-5 my-1.5 border-t border-border-light" />
                              <Link
                                href="/admin"
                                onClick={() => setAccountOpen(false)}
                                className="flex items-center gap-3 px-5 py-3 font-sans text-sm text-gold hover:bg-gold/5 transition-colors"
                              >
                                <Settings size={15} strokeWidth={1.5} />
                                Panel de administración
                              </Link>
                            </>
                          )}
                        </div>

                        <div className="px-5 py-3 border-t border-border-light">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 rounded-full font-sans text-xs text-red-500 hover:bg-red-50 hover:border-red-300 transition-colors"
                          >
                            <LogIn size={13} strokeWidth={2} className="rotate-180" />
                            Cerrar sesión
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="px-5 py-6">
                        <div className="w-12 h-12 rounded-full bg-surface-2 flex items-center justify-center mx-auto mb-4">
                          <User size={20} strokeWidth={1} className="text-text-light" />
                        </div>
                        <p className="font-sans text-sm font-semibold text-text-dark text-center mb-1">
                          Bienvenido
                        </p>
                        <p className="font-sans text-xs text-text-light text-center mb-5">
                          Iniciá sesión para ver tus pedidos y gestionar tu cuenta
                        </p>
                        <Link
                          href="/mi-cuenta/login"
                          onClick={() => setAccountOpen(false)}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-text-dark text-white rounded-full font-sans text-xs font-semibold hover:bg-text-mid transition-colors"
                        >
                          <LogIn size={14} strokeWidth={2} />
                          Iniciar sesión
                        </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist — hidden on mobile (accessible desde menú) */}
            <Link
              href="/favoritos"
              className={cn("hidden sm:flex relative w-9 h-9 items-center justify-center transition-colors rounded-full", T.iconBtn)}
              aria-label="Favoritos"
            >
              <Heart size={18} strokeWidth={1.5} className={wCount > 0 ? "fill-gold stroke-gold" : ""} />
              {wCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[9px] font-sans font-semibold rounded-full flex items-center justify-center">
                  {wCount > 9 ? "9+" : wCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className={cn("relative w-9 h-9 flex items-center justify-center transition-colors rounded-full", T.iconBtn)}
              aria-label="Carrito"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gold text-white text-[9px] font-sans font-semibold rounded-full flex items-center justify-center">
                  {count > 9 ? "9+" : count}
                </span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className={cn("lg:hidden w-9 h-9 flex items-center justify-center transition-colors rounded-full", T.iconBtn)}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Menu size={20} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>

        {/* ——— Mobile search bar ——— */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onAnimationComplete={() => setMobileSearchAnimDone(true)}
              className={cn(
                "sm:hidden border-t border-white/10",
                !mobileSearchAnimDone && "overflow-hidden"
              )}
            >
              <div className="px-4 py-3">
                <SearchBar
                  dark={isDark}
                  className="w-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ——— Bottom row: Nav + Mega menu container ——— */}
        <div
          ref={navRowRef}
          className={cn("hidden lg:block border-t relative", T.navBorder)}
          onMouseLeave={closeDrop}
        >
          <nav className="max-w-7xl mx-auto px-5 grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Empty left column — keeps the ul mathematically centered regardless of the right column's content/breakpoint */}
            <div aria-hidden="true" />
            <ul className="flex items-center justify-self-center">
              {NAV_ITEMS.map((item) => (
                <li
                  key={item.label}
                  onMouseEnter={() => item.hasMega && openDrop(item.label as MegaMenuKey)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-5 py-3 font-sans text-xs font-medium tracking-wide transition-colors duration-200 border-b-2",
                      openDropdown === item.label
                        ? T.navActive
                        : cn(T.navLink, T.navInactive)
                    )}
                  >
                    {item.label}
                    {item.hasMega && (
                      <ChevronDown
                        size={12}
                        strokeWidth={2}
                        className={cn(
                          "transition-transform duration-200",
                          openDropdown === item.label && "rotate-180"
                        )}
                      />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hidden xl:flex items-center gap-5 justify-self-end">
              <Link
                href="/encontrar-mi-perfume"
                className="font-sans font-semibold whitespace-nowrap text-gold transition-colors duration-200 hover:text-gold-light"
                style={{ fontSize: 9, letterSpacing: "0.1em" }}
              >
                ✦ ENCONTRÁ TU PERFUME
              </Link>
              {["Envío gratis desde $40.000"].map((t) => (
                <span key={t} className="font-sans text-gold whitespace-nowrap" style={{ fontSize: 9, letterSpacing: "0.1em" }}>
                  {t}
                </span>
              ))}
            </div>
          </nav>

          {/* ——— Mega Menu Panels ——— */}
          <AnimatePresence>
            {openDropdown && MEGA_MENUS[openDropdown] && (
              <motion.div
                key={openDropdown}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={cn(
                  "absolute left-0 right-0 top-full z-50 border-t",
                  MEGA_MENUS[openDropdown].dark
                    ? "bg-[#0a0a0a] border-gold/10"
                    : "bg-white border-border-light"
                )}
                style={{ boxShadow: "0 16px 40px rgba(0,0,0,0.12)" }}
                onMouseEnter={cancelClose}
                onMouseLeave={closeDrop}
              >
                <div className="max-w-7xl mx-auto px-8 py-10">
                  <div className="grid grid-cols-[1fr_1px_1fr_1px_1fr_1px_1.4fr] gap-0">
                    {/* Gender columns */}
                    {MEGA_MENUS[openDropdown].genders.map((gender, i) => {
                      const isDark = MEGA_MENUS[openDropdown].dark;
                      return (
                        <React.Fragment key={gender.title}>
                          <div className="px-6">
                            <p
                              className={cn(
                                "font-sans text-[10px] tracking-[0.35em] uppercase font-semibold mb-4",
                                isDark ? "text-gold/60" : "text-text-light"
                              )}
                            >
                              {gender.title}
                            </p>
                            <ul className="space-y-2.5">
                              {gender.links.map((link) => (
                                <li key={link.href}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setOpenDropdown(null)}
                                    className={cn(
                                      "font-sans text-sm transition-colors duration-150 group flex items-center gap-1.5",
                                      isDark
                                        ? "text-cream-muted hover:text-gold"
                                        : "text-text-mid hover:text-text-dark"
                                    )}
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {/* Separator */}
                          {i < MEGA_MENUS[openDropdown].genders.length && (
                            <div
                              className={cn(
                                "w-px self-stretch",
                                MEGA_MENUS[openDropdown].dark ? "bg-gold/10" : "bg-border-light"
                              )}
                            />
                          )}
                        </React.Fragment>
                      );
                    })}

                    {/* Right panel: editorial */}
                    <div
                      className={cn(
                        "px-8 py-2 border-l",
                        MEGA_MENUS[openDropdown].dark ? "border-gold/10" : "border-border-light"
                      )}
                    >
                      {/* Eyebrow */}
                      <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-gold mb-3">
                        {MEGA_MENUS[openDropdown].eyebrow}
                      </p>
                      {/* Title */}
                      <p
                        className={cn(
                          "font-display text-2xl font-bold mb-3 leading-tight",
                          MEGA_MENUS[openDropdown].dark ? "text-cream" : "text-text-dark"
                        )}
                      >
                        {openDropdown}
                      </p>
                      {/* Description */}
                      <p
                        className={cn(
                          "font-sans text-xs leading-relaxed mb-6 max-w-xs",
                          MEGA_MENUS[openDropdown].dark ? "text-cream-dim" : "text-text-light"
                        )}
                      >
                        {MEGA_MENUS[openDropdown].description}
                      </p>

                      {/* Quick links */}
                      <div className="space-y-2 mb-6">
                        {MEGA_MENUS[openDropdown].quick.map((q) => (
                          <Link
                            key={q.href}
                            href={q.href}
                            onClick={() => setOpenDropdown(null)}
                            className={cn(
                              "flex items-center gap-2 font-sans text-xs transition-colors group",
                              MEGA_MENUS[openDropdown].dark
                                ? "text-cream-dim hover:text-gold"
                                : "text-text-light hover:text-text-dark"
                            )}
                          >
                            <span
                              className={cn(
                                "w-3 h-px transition-all group-hover:w-5",
                                MEGA_MENUS[openDropdown].dark ? "bg-gold/40" : "bg-text-light"
                              )}
                            />
                            {q.label}
                          </Link>
                        ))}
                      </div>

                      {/* CTA */}
                      <Link
                        href={MEGA_MENUS[openDropdown].href}
                        onClick={() => setOpenDropdown(null)}
                        className={cn(
                          "inline-flex items-center gap-2.5 font-sans text-xs font-medium tracking-wide group",
                          MEGA_MENUS[openDropdown].dark
                            ? "text-gold hover:text-gold-light"
                            : "text-text-dark hover:text-gold"
                        )}
                      >
                        Ver colección completa
                        <ArrowRight
                          size={13}
                          strokeWidth={2}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ——— Mobile menu ——— */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-white flex flex-col transition-all duration-400 lg:hidden",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b border-border-light">
          <span className="font-display text-xl font-bold tracking-[0.15em] text-text-dark">
            GOURMAND
          </span>
          <button onClick={() => setMobileOpen(false)} className="text-text-mid">
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_ITEMS.map((item) => {
            const menu = item.hasMega ? MEGA_MENUS[item.label as MegaMenuKey] : null;
            return (
              <div key={item.label} className="border-b border-border-light">
                <button
                  className="w-full flex items-center justify-between px-6 py-4 font-sans text-sm font-medium text-text-dark"
                  onClick={() =>
                    item.hasMega
                      ? setMobileExpanded((v) => (v === item.label ? null : item.label))
                      : router.push(item.href)
                  }
                >
                  {item.label}
                  {item.hasMega && (
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform",
                        mobileExpanded === item.label && "rotate-180"
                      )}
                    />
                  )}
                </button>

                {menu && mobileExpanded === item.label && (
                  <div className="bg-surface-2 pb-3">
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block px-8 py-2.5 font-sans text-sm font-medium text-text-dark"
                    >
                      Ver todos
                    </Link>
                    {menu.genders.map((g) => (
                      <div key={g.title} className="mb-2">
                        <p className="px-8 pt-3 pb-1 font-sans text-[10px] tracking-widest uppercase text-text-light font-semibold">
                          {g.title}
                        </p>
                        {g.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileOpen(false)}
                            className="block px-10 py-2 font-sans text-sm text-text-mid hover:text-text-dark"
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Quiz CTA mobile */}
        <div className="px-6 pb-2">
          <Link
            href="/encontrar-mi-perfume"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 border border-gold/40 text-gold rounded-full font-sans text-sm font-medium hover:bg-gold/5 transition-colors"
          >
            ✦ Encontrá tu perfume
          </Link>
        </div>

        {/* Mobile account */}
        <div className="border-t border-border-light p-6 space-y-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center">
                  <span className="font-display text-sm font-bold text-gold">
                    {(user.user_metadata?.name ?? user.email ?? "U").charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-sans text-sm font-medium text-text-dark">
                    {user.user_metadata?.name ?? "Mi cuenta"}
                  </p>
                  <p className="font-sans text-xs text-text-light">{user.email}</p>
                </div>
              </div>
              <Link
                href="/mi-cuenta"
                onClick={() => setMobileOpen(false)}
                className="block font-sans text-sm text-text-dark font-medium"
              >
                Mi cuenta
              </Link>
              <Link
                href="/favoritos"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 font-sans text-sm text-text-dark font-medium"
              >
                <Heart size={14} strokeWidth={1.5} className={wCount > 0 ? "fill-gold stroke-gold" : "text-text-light"} />
                Favoritos{wCount > 0 && <span className="text-gold text-xs">({wCount})</span>}
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="block font-sans text-sm text-gold font-medium"
                >
                  Panel admin
                </Link>
              )}
              <button onClick={handleLogout} className="font-sans text-sm text-text-light">
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link
              href="/mi-cuenta/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 py-3 bg-text-dark text-white rounded-full font-sans text-sm font-medium w-full"
            >
              <LogIn size={16} strokeWidth={2} />
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
