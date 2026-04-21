"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { X, Minus, Plus } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCartStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const count = mounted ? itemCount() : 0;
  const subtotal = total();

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-sm z-50 flex flex-col transition-transform duration-[400ms] ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ background: "#0a0a0a", borderLeft: "1px solid rgba(164,133,76,0.15)" }}
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: "30px 28px 20px", borderBottom: "1px solid rgba(164,133,76,0.1)" }}
        >
          <div>
            <p className="font-display" style={{ fontSize: 26, color: "#f5f0e8", letterSpacing: "0.02em" }}>
              Tu carrito
            </p>
            <p className="font-sans uppercase" style={{ fontSize: 10, color: "#7a7268", letterSpacing: "0.25em", marginTop: 3 }}>
              {count} producto{count !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="transition-colors"
            style={{ background: "none", border: "none", cursor: "pointer", color: "#7a7268", fontSize: 18 }}
            aria-label="Cerrar carrito"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto" style={{ padding: "12px 28px" }}>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center" style={{ paddingTop: 80 }}>
              <p className="font-body" style={{ fontSize: 20, color: "#7a7268", fontStyle: "italic", marginBottom: 4 }}>
                El carrito está vacío
              </p>
              <p className="font-sans uppercase" style={{ fontSize: 11, color: "#3a3530", letterSpacing: "0.15em" }}>
                Explorá la colección
              </p>
              <Link href="/catalogo" onClick={closeCart} className="elegant-btn text-gold" style={{ marginTop: 12 }}>
                Ver catálogo
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{ display: "flex", gap: 14, padding: "16px 0", borderBottom: "1px solid rgba(164,133,76,0.07)" }}
              >
                <div
                  className="flex-shrink-0 relative overflow-hidden"
                  style={{ width: 60, height: 76, background: "#1a1a1a" }}
                >
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-contain p-1" />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  {item.brand && (
                    <p className="font-sans uppercase" style={{ fontSize: 9, letterSpacing: "0.3em", color: "rgba(164,133,76,0.55)", marginBottom: 4 }}>
                      {item.brand}
                    </p>
                  )}
                  <p className="font-body truncate" style={{ fontSize: 16, color: "#f5f0e8", lineHeight: 1.25, marginBottom: 3 }}>
                    {item.name}
                  </p>
                  {item.size_ml && (
                    <p className="font-sans" style={{ fontSize: 10, color: "#7a7268", marginBottom: 6 }}>
                      {item.size_ml}ml
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center"
                      style={{ border: "1px solid rgba(164,133,76,0.2)", background: "transparent" }}
                    >
                      <button
                        className="flex items-center justify-center transition-colors"
                        style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", color: "#7a7268" }}
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={9} strokeWidth={2} />
                      </button>
                      <span className="font-sans" style={{ fontSize: 11, width: 24, textAlign: "center", color: "#f5f0e8" }}>
                        {item.quantity}
                      </span>
                      <button
                        className="flex items-center justify-center transition-colors"
                        style={{ width: 28, height: 28, background: "none", border: "none", cursor: "pointer", color: "#7a7268" }}
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={9} strokeWidth={2} />
                      </button>
                    </div>
                    <p className="font-display text-gold" style={{ fontSize: 20 }}>
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="self-start transition-colors"
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#3a3530", padding: 4 }}
                  aria-label="Eliminar"
                >
                  <X size={13} strokeWidth={1.5} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "20px 28px 30px", borderTop: "1px solid rgba(164,133,76,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span className="font-sans uppercase" style={{ fontSize: 10, letterSpacing: "0.2em", color: "#7a7268" }}>
                Subtotal
              </span>
              <span className="font-display" style={{ fontSize: 24, color: "#f5f0e8" }}>
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="font-sans text-gold text-right" style={{ fontSize: 10, marginBottom: 20, letterSpacing: "0.05em" }}>
              6 cuotas sin interés de {formatPrice(Math.round(subtotal / 6))}
            </p>
            <Link href="/checkout" onClick={closeCart}>
              <button
                className="w-full font-sans uppercase transition-all duration-200"
                style={{
                  padding: "14px",
                  border: "1px solid rgba(164,133,76,0.45)",
                  background: "transparent",
                  color: "#c8c0b0",
                  fontSize: 11,
                  letterSpacing: "0.3em",
                  cursor: "pointer",
                  marginBottom: 8,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(164,133,76,0.1)";
                  e.currentTarget.style.color = "#a4854c";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#c8c0b0";
                }}
              >
                Finalizar compra
              </button>
            </Link>
            <button
              onClick={closeCart}
              className="w-full font-sans uppercase"
              style={{ padding: "11px", background: "transparent", border: "none", fontSize: 10, letterSpacing: "0.25em", color: "#7a7268", cursor: "pointer" }}
            >
              Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
