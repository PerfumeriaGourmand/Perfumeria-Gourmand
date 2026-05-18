"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { ShoppingBag, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CartToastData {
  name: string;
  brand: string;
  imageUrl?: string;
  price: number;
  onViewCart: () => void;
}

function CartToastUI({
  t,
  name,
  brand,
  imageUrl,
  price,
  onViewCart,
}: CartToastData & { t: { id: string; visible: boolean } }) {
  return (
    <div
      className={`
        flex items-center gap-3 bg-white border border-border-light rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)]
        px-4 py-3 max-w-sm w-full pointer-events-auto
        transition-all duration-300
        ${t.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}
      `}
    >
      {/* Image */}
      <div className="w-12 h-14 bg-surface-2 rounded-xl overflow-hidden flex-shrink-0 border border-border-light relative">
        {imageUrl ? (
          <Image src={imageUrl} alt={name} fill className="object-contain p-1" sizes="48px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag size={16} strokeWidth={1.5} className="text-text-light" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-sans text-[10px] font-semibold tracking-wide text-gold uppercase mb-0.5">
          {brand}
        </p>
        <p className="font-sans text-sm font-medium text-text-dark truncate leading-tight">
          {name}
        </p>
        <p className="font-sans text-xs text-text-light mt-0.5">{formatPrice(price)}</p>
      </div>

      {/* CTA */}
      <button
        onClick={() => {
          toast.dismiss(t.id);
          onViewCart();
        }}
        className="flex-shrink-0 px-3 py-1.5 border border-text-dark text-text-dark rounded-full font-sans text-xs font-medium hover:bg-text-dark hover:text-white transition-colors"
      >
        Ver carrito
      </button>

      {/* Dismiss */}
      <button
        onClick={() => toast.dismiss(t.id)}
        className="flex-shrink-0 text-text-light hover:text-text-dark transition-colors"
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export function showCartToast(data: CartToastData) {
  toast.custom((t) => <CartToastUI t={t} {...data} />, {
    duration: 3500,
    position: "bottom-right",
  });
}
