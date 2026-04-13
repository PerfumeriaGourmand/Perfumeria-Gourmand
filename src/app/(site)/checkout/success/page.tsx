"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cart";
import Button from "@/components/ui/Button";
import { Suspense } from "react";

function SuccessContent() {
  const params = useSearchParams();
  const orderId = params.get("order_id");
  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <CheckCircle size={48} strokeWidth={1} className="text-gold mx-auto mb-8" />
        <h1 className="font-display font-light text-4xl text-cream mb-4">
          ¡Pedido confirmado!
        </h1>
        <p className="font-sans text-sm text-cream-muted mb-8 leading-relaxed">
          Gracias por tu compra. Recibirás un email con los detalles de tu pedido.
          Nos pondremos en contacto para coordinar el envío.
        </p>
        {orderId && (
          <p className="font-sans text-xs text-cream-dim mb-10 font-mono tracking-wider">
            Orden #{orderId.slice(0, 8).toUpperCase()}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/catalogo">
            <Button variant="outline">Seguir comprando</Button>
          </Link>
          <Link href="/">
            <Button variant="ghost">Ir al inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
