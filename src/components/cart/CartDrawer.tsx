"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/cart";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
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
          "fixed inset-0 z-50 bg-black/30 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={cn(
          "fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white border-l border-border-light flex flex-col transition-transform duration-400 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        aria-label="Carrito de compras"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} strokeWidth={1.5} className="text-text-dark" />
            <span className="font-sans text-base font-semibold text-text-dark">Carrito</span>
            {count > 0 && (
              <span className="font-sans text-xs text-text-light">({count})</span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 flex items-center justify-center text-text-light hover:text-text-dark rounded-full hover:bg-surface-2 transition-colors"
            aria-label="Cerrar carrito"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <ShoppingBag size={36} strokeWidth={1} className="text-text-light/30" />
              <div>
                <p className="font-sans text-base font-semibold text-text-dark mb-1">
                  Tu carrito está vacío
                </p>
                <p className="font-sans text-sm text-text-light">
                  Explorá nuestra colección
                </p>
              </div>
              <Link
                href="/catalogo"
                onClick={closeCart}
                className="px-6 py-2.5 border border-text-dark text-text-dark rounded-full font-sans text-sm font-medium hover:bg-text-dark hover:text-white transition-colors"
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 bg-surface-2 rounded-xl">
                {/* Thumbnail */}
                <div className="w-16 h-20 bg-white rounded-lg flex-shrink-0 relative overflow-hidden border border-border-light">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill className="object-contain p-2" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBag size={14} className="text-text-light/30" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  {item.brand && (
                    <p className="font-sans text-[10px] font-semibold tracking-wide text-text-light mb-0.5">
                      {item.brand}
                    </p>
                  )}
                  <p className="font-sans text-sm font-medium text-text-dark leading-tight mb-1 truncate">
                    {item.name}
                  </p>
                  {item.size_ml && (
                    <p className="font-sans text-xs text-text-light mb-2">{item.size_ml}ml</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0 border border-border-light rounded-full overflow-hidden bg-white">
                      <button
                        className="px-2.5 py-1 text-text-mid hover:bg-surface-2 transition-colors text-sm"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus size={10} strokeWidth={2.5} />
                      </button>
                      <span className="font-sans text-xs w-6 text-center text-text-dark">
                        {item.quantity}
                      </span>
                      <button
                        className="px-2.5 py-1 text-text-mid hover:bg-surface-2 transition-colors"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus size={10} strokeWidth={2.5} />
                      </button>
                    </div>
                    <p className="font-sans text-sm font-semibold text-text-dark">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => removeItem(item.id)}
                  className="self-start text-text-light/50 hover:text-text-light transition-colors mt-0.5"
                  aria-label="Eliminar"
                >
                  <X size={14} strokeWidth={2} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border-light px-6 py-5 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-sans text-sm text-text-mid">Subtotal</span>
              <span className="font-sans text-lg font-semibold text-text-dark">
                {formatPrice(subtotal)}
              </span>
            </div>
            <p className="font-sans text-xs text-text-light">Envío calculado en el checkout</p>
            <Link href="/checkout" onClick={closeCart}>
              <button className="w-full py-3.5 bg-text-dark text-white rounded-full font-sans text-sm font-semibold hover:bg-text-mid transition-colors mt-2">
                Ir al checkout
              </button>
            </Link>
            <button
              onClick={closeCart}
              className="w-full font-sans text-sm text-text-light hover:text-text-mid transition-colors py-1"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
