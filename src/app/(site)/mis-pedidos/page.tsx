"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Package, ChevronDown, Search, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/order-utils";
import Breadcrumb from "@/components/ui/Breadcrumb";
import ShippingProgress from "@/components/ui/ShippingProgress";
import Link from "next/link";
import type { FulfillmentStatus } from "@/types";

interface OrderItem {
  product_name: string;
  size_ml: number | null;
  quantity: number;
  unit_price: number;
  total_price: number;
}

interface Order {
  id: string;
  customer_name: string;
  total: number;
  payment_status: string;
  fulfillment_status: FulfillmentStatus | null;
  created_at: string;
  payment_method: string | null;
  installments: number;
  items: OrderItem[];
}

const PAYMENT_LABELS: Record<string, string> = {
  credit_card: "Tarjeta de crédito",
  debit_card: "Tarjeta de débito",
  bank_transfer: "Transferencia / CBU",
  mercadopago_wallet: "MercadoPago",
};

export default function MisPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [isGuest, setIsGuest] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setEmail(data.user.email ?? "");
        await fetchByEmail(data.user.email ?? "");
      } else {
        setIsGuest(true);
        setLoading(false);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchByEmail(emailToFetch: string) {
    setLoading(true);
    const res = await fetch(`/api/orders/by-email?email=${encodeURIComponent(emailToFetch)}`);
    const json = await res.json();
    setOrders(json.orders ?? []);
    setLoading(false);
    setSearching(false);
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputEmail.trim()) return;
    setSearching(true);
    setEmail(inputEmail.trim());
    await fetchByEmail(inputEmail.trim());
  };

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 max-w-2xl mx-auto">
      <Breadcrumb items={[{ label: "Inicio", href: "/" }, { label: "Mi cuenta", href: "/mi-cuenta" }, { label: "Mis pedidos" }]} className="pt-4" />
      <div className="mb-8 flex items-center gap-3">
        <Package size={20} strokeWidth={1.5} className="text-text-light" />
        <h1 className="font-display text-2xl font-bold text-text-dark">Mis pedidos</h1>
      </div>

      {/* Email lookup (guests) */}
      {isGuest && (
        <form onSubmit={handleSearch} className="bg-white border border-border-light rounded-2xl p-6 mb-8">
          <p className="font-sans text-sm text-text-mid mb-4">
            Ingresá el email con el que realizaste tu compra para ver tus pedidos.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              value={inputEmail}
              onChange={(e) => setInputEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              className="flex-1 border border-border-light rounded-full px-4 py-2.5 font-sans text-sm text-text-dark placeholder:text-text-light focus:outline-none focus:border-text-dark transition-colors"
            />
            <button
              type="submit"
              disabled={searching}
              className="flex items-center gap-2 px-5 py-2.5 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors disabled:opacity-50"
            >
              {searching ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search size={15} strokeWidth={2} />
              )}
              Buscar
            </button>
          </div>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* No results */}
      {!loading && email && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
          <ShoppingBag size={36} strokeWidth={1} className="text-text-light" />
          <p className="font-display text-lg text-text-dark">Sin pedidos</p>
          <p className="font-sans text-sm text-text-light">
            No encontramos pedidos para <span className="text-text-mid font-medium">{email}</span>.
          </p>
          <Link
            href="/catalogo"
            className="mt-2 px-6 py-2.5 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors"
          >
            Ir al catálogo
          </Link>
        </div>
      )}

      {/* Initial guest state — no search yet */}
      {!loading && isGuest && !email && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <Package size={36} strokeWidth={1} className="text-text-light" />
          <p className="font-sans text-sm text-text-light">Ingresá tu email para ver tus pedidos.</p>
        </div>
      )}

      {/* Orders list */}
      {!loading && orders.length > 0 && (
        <div className="space-y-3">
          {isGuest && (
            <p className="font-sans text-xs text-text-light mb-4">
              Mostrando pedidos para <span className="text-text-mid font-medium">{email}</span>
            </p>
          )}
          {orders.map((order) => {
            const isOpen = expandedId === order.id;
            const orderNum = order.id.slice(0, 8).toUpperCase();
            const date = new Date(order.created_at).toLocaleDateString("es-AR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={order.id}
                className="bg-white border border-border-light rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <button
                  onClick={() => setExpandedId(isOpen ? null : order.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-2/40 transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="shrink-0">
                      <p className="font-mono text-sm font-medium text-text-dark">
                        #{orderNum}
                      </p>
                      <p className="font-sans text-[11px] text-text-light mt-0.5">{date}</p>
                    </div>
                    <span
                      className={`hidden sm:inline font-sans text-[10px] font-medium px-2.5 py-1 rounded-full border ${
                        STATUS_COLORS[order.payment_status] ??
                        "text-text-light bg-surface-2 border-border-light"
                      }`}
                    >
                      {STATUS_LABELS[order.payment_status] ?? order.payment_status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-4">
                    <span className="font-sans text-sm font-semibold text-text-dark">
                      {formatPrice(order.total)}
                    </span>
                    <ChevronDown
                      size={16}
                      strokeWidth={1.5}
                      className={`text-text-light transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                </button>

                {/* Mobile status badge */}
                <div className="px-5 pb-3 sm:hidden -mt-2">
                  <span
                    className={`inline font-sans text-[10px] font-medium px-2.5 py-1 rounded-full border ${
                      STATUS_COLORS[order.payment_status] ??
                      "text-text-light bg-surface-2 border-border-light"
                    }`}
                  >
                    {STATUS_LABELS[order.payment_status] ?? order.payment_status}
                  </span>
                </div>

                {/* Expandable detail */}
                <div
                  className="overflow-hidden transition-all duration-300"
                  style={{ maxHeight: isOpen ? "700px" : "0px" }}
                >
                  <div className="border-t border-border-light px-5 py-4 space-y-4">
                    {/* Shipping progress — solo tiene sentido si el pago esta aprobado */}
                    {order.payment_status === "approved" && (
                      <div className="pb-3 border-b border-border-light">
                        <ShippingProgress fulfillmentStatus={order.fulfillment_status} />
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <p className="font-sans text-sm text-text-dark truncate">
                              {item.product_name}
                              {item.size_ml && (
                                <span className="text-text-light ml-1 text-xs">{item.size_ml}ml</span>
                              )}
                            </p>
                            <p className="font-sans text-xs text-text-light">
                              x{item.quantity} · {formatPrice(item.unit_price)} c/u
                            </p>
                          </div>
                          <span className="font-sans text-sm font-medium text-text-dark shrink-0">
                            {formatPrice(item.total_price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Meta */}
                    <div className="pt-3 border-t border-border-light flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-sans text-xs text-text-light">
                          {PAYMENT_LABELS[order.payment_method ?? ""] ?? order.payment_method}
                          {order.installments > 1 && ` · ${order.installments} cuotas`}
                        </span>
                      </div>
                      <span className="font-sans text-sm font-bold text-text-dark">
                        Total: {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
