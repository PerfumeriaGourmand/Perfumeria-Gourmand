"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import type { FulfillmentStatus } from "@/types";

const OPTIONS: { value: FulfillmentStatus; label: string }[] = [
  { value: "shipped", label: "Enviado" },
  { value: "delivered", label: "Entregado" },
];

export default function FulfillmentStatusUpdater({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: FulfillmentStatus | null;
}) {
  const [status, setStatus] = useState<FulfillmentStatus | null>(currentStatus);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpdate = async (newStatus: FulfillmentStatus) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fulfillment_status: newStatus }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al actualizar");
      }

      setStatus(newStatus);
      toast.success("Estado de envío actualizado");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={status ?? ""}
      onChange={(e) => handleUpdate(e.target.value as FulfillmentStatus)}
      disabled={loading}
      className="bg-obsidian border border-gold/10 text-cream font-sans text-sm px-3 py-2 focus:outline-none focus:border-gold/30 transition-colors w-full"
    >
      <option value="" disabled>
        Sin enviar
      </option>
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
