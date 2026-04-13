"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { OrderStatus } from "@/types";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "pending", label: "Pendiente" },
  { value: "in_process", label: "En proceso" },
  { value: "approved", label: "Aprobado" },
  { value: "rejected", label: "Rechazado" },
  { value: "cancelled", label: "Cancelado" },
  { value: "refunded", label: "Reembolsado" },
];

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (newStatus: string) => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: newStatus })
      .eq("id", orderId);

    if (error) {
      toast.error("Error al actualizar");
    } else {
      setStatus(newStatus);
      toast.success("Estado actualizado");
      // Decrement stock and apply FIFO lots if approved
      if (newStatus === "approved") {
        await supabase.rpc("decrement_stock_on_order", { p_order_id: orderId });
        await supabase.rpc("apply_fifo_lots_on_order", { p_order_id: orderId });
      }
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <select
      value={status}
      onChange={(e) => handleUpdate(e.target.value)}
      disabled={loading}
      className="bg-obsidian border border-gold/10 text-cream font-sans text-sm px-3 py-2 focus:outline-none focus:border-gold/30 transition-colors w-full"
    >
      {STATUS_OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
