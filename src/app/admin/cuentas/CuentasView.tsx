"use client";

import { useState, useMemo } from "react";
import {
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  ArrowLeftRight,
  SlidersHorizontal,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { formatPrice } from "@/lib/utils";
import type { Destination, Movement } from "./page";

const inputClass =
  "w-full bg-obsidian border border-gold/20 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-dim focus:outline-none focus:border-gold/60 transition-colors";
const labelClass =
  "font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1.5 block";

const KIND_LABELS: Record<Movement["kind"], string> = {
  venta: "Venta",
  retiro: "Retiro",
  gasto: "Gasto",
  transferencia: "Transferencia",
  ajuste: "Ajuste",
};

type FormMode = null | "retiro" | "gasto" | "ajuste" | "transferencia";

export default function CuentasView({
  destinations,
  balances,
  movements,
}: {
  destinations: Destination[];
  balances: Record<string, number>;
  movements: Movement[];
}) {
  const [movementList, setMovementList] = useState(movements);
  const [balanceMap, setBalanceMap] = useState(balances);
  const [filterDestination, setFilterDestination] = useState<string | "all">("all");

  const [mode, setMode] = useState<FormMode>(null);
  const [destinationId, setDestinationId] = useState<string>(destinations[0]?.id ?? "");
  const [toDestinationId, setToDestinationId] = useState<string>(destinations[1]?.id ?? "");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const destinationById = useMemo(
    () => Object.fromEntries(destinations.map((d) => [d.id, d.name])),
    [destinations]
  );

  const filteredMovements = useMemo(
    () =>
      filterDestination === "all"
        ? movementList
        : movementList.filter((m) => m.destination_id === filterDestination),
    [movementList, filterDestination]
  );

  const closeForm = () => {
    setMode(null);
    setAmount("");
    setDescription("");
  };

  const submitSimple = async () => {
    if (!mode || mode === "transferencia") return;
    const value = parseFloat(amount);
    if (!destinationId || !value || value <= 0) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/account-movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination_id: destinationId,
          kind: mode,
          amount: value,
          description: description.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al registrar");

      setMovementList((prev) => [data.movement, ...prev]);
      setBalanceMap((prev) => ({
        ...prev,
        [data.movement.destination_id]:
          (prev[data.movement.destination_id] ?? 0) + Number(data.movement.amount),
      }));
      toast.success("Movimiento registrado");
      closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  };

  const submitTransfer = async () => {
    const value = parseFloat(amount);
    if (!destinationId || !toDestinationId || !value || value <= 0) return;
    if (destinationId === toDestinationId) {
      toast.error("El origen y destino deben ser distintos");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/account-transfers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from_destination_id: destinationId,
          to_destination_id: toDestinationId,
          amount: value,
          description: description.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al registrar");

      const newMovements: Movement[] = data.movements;
      setMovementList((prev) => [...newMovements, ...prev]);
      setBalanceMap((prev) => {
        const next = { ...prev };
        for (const m of newMovements) {
          next[m.destination_id] = (next[m.destination_id] ?? 0) + Number(m.amount);
        }
        return next;
      });
      toast.success("Transferencia registrada");
      closeForm();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Saldos por cuenta */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {destinations.map((d) => (
          <div
            key={d.id}
            className="bg-obsidian-surface border border-gold/10 p-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <Wallet size={13} strokeWidth={1.5} className="text-gold/60" />
              <p className="font-sans text-[10px] tracking-widest uppercase text-cream-dim">
                {d.name}
              </p>
            </div>
            <p className="font-display text-2xl text-gold">
              {formatPrice(balanceMap[d.id] ?? 0)}
            </p>
          </div>
        ))}
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setMode("retiro")}
          className="flex items-center gap-1.5 px-4 py-2.5 border border-gold/20 text-cream-muted font-sans text-xs hover:border-gold/40 hover:text-cream transition-colors"
        >
          <ArrowUpCircle size={13} strokeWidth={1.5} />
          Retiro
        </button>
        <button
          onClick={() => setMode("gasto")}
          className="flex items-center gap-1.5 px-4 py-2.5 border border-gold/20 text-cream-muted font-sans text-xs hover:border-gold/40 hover:text-cream transition-colors"
        >
          <ArrowDownCircle size={13} strokeWidth={1.5} />
          Gasto
        </button>
        <button
          onClick={() => setMode("transferencia")}
          className="flex items-center gap-1.5 px-4 py-2.5 border border-gold/20 text-cream-muted font-sans text-xs hover:border-gold/40 hover:text-cream transition-colors"
        >
          <ArrowLeftRight size={13} strokeWidth={1.5} />
          Transferencia
        </button>
        <button
          onClick={() => setMode("ajuste")}
          className="flex items-center gap-1.5 px-4 py-2.5 border border-gold/20 text-cream-muted font-sans text-xs hover:border-gold/40 hover:text-cream transition-colors"
        >
          <SlidersHorizontal size={13} strokeWidth={1.5} />
          Ajuste
        </button>
      </div>

      {/* Formulario */}
      {mode && (
        <div className="bg-obsidian-surface border border-gold/10 p-6 space-y-4 max-w-xl">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-[10px] tracking-widest uppercase text-gold/60">
              {mode === "retiro" && "Nuevo retiro"}
              {mode === "gasto" && "Nuevo gasto"}
              {mode === "ajuste" && "Nuevo ajuste"}
              {mode === "transferencia" && "Nueva transferencia"}
            </h2>
            <button
              onClick={closeForm}
              className="text-cream-dim hover:text-cream transition-colors"
            >
              <X size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {mode === "transferencia" ? "Desde" : "Cuenta"}
              </label>
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className={inputClass}
              >
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {mode === "transferencia" ? (
              <div>
                <label className={labelClass}>Hacia</label>
                <select
                  value={toDestinationId}
                  onChange={(e) => setToDestinationId(e.target.value)}
                  className={inputClass}
                >
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className={labelClass}>Monto (ARS)</label>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className={inputClass}
                />
              </div>
            )}
          </div>

          {mode === "transferencia" && (
            <div>
              <label className={labelClass}>Monto (ARS)</label>
              <input
                type="number"
                min={0}
                step={100}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className={labelClass}>Descripción (opcional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={mode === "ajuste" ? "Ej: corrección de saldo inicial" : "Ej: retiro para gastos personales"}
              className={inputClass}
            />
          </div>

          {mode === "ajuste" && (
            <p className="font-sans text-[10px] text-cream-dim">
              El ajuste puede ser positivo (suma) o negativo (resta), ej: -5000
            </p>
          )}

          <button
            onClick={mode === "transferencia" ? submitTransfer : submitSimple}
            disabled={saving || !amount || parseFloat(amount) === 0}
            className="w-full bg-gold text-obsidian font-sans text-xs tracking-widest uppercase px-6 py-3 hover:bg-gold-light transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {saving ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      )}

      {/* Movimientos */}
      <div className="bg-obsidian-surface border border-gold/10 p-6">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2 className="font-sans text-[10px] tracking-widest uppercase text-gold/60">
            Movimientos recientes
          </h2>
          <select
            value={filterDestination}
            onChange={(e) => setFilterDestination(e.target.value)}
            className="bg-obsidian border border-gold/20 px-3 py-2 font-sans text-xs text-cream focus:outline-none focus:border-gold/60"
          >
            <option value="all">Todas las cuentas</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {filteredMovements.length === 0 ? (
          <p className="font-sans text-xs text-cream-dim py-4">
            Sin movimientos todavía.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gold/10">
                  <th className="font-sans text-[10px] tracking-widest uppercase text-cream-dim pb-3 pr-4">
                    Fecha
                  </th>
                  <th className="font-sans text-[10px] tracking-widest uppercase text-cream-dim pb-3 pr-4">
                    Cuenta
                  </th>
                  <th className="font-sans text-[10px] tracking-widest uppercase text-cream-dim pb-3 pr-4">
                    Tipo
                  </th>
                  <th className="font-sans text-[10px] tracking-widest uppercase text-cream-dim pb-3 pr-4">
                    Descripción
                  </th>
                  <th className="font-sans text-[10px] tracking-widest uppercase text-cream-dim pb-3 text-right">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMovements.map((m) => (
                  <tr key={m.id} className="border-b border-gold/5 last:border-0">
                    <td className="font-sans text-xs text-cream-dim py-3 pr-4 whitespace-nowrap">
                      {new Date(m.created_at).toLocaleDateString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="font-sans text-xs text-cream py-3 pr-4 whitespace-nowrap">
                      {destinationById[m.destination_id] ?? "—"}
                    </td>
                    <td className="font-sans text-xs text-cream-muted py-3 pr-4 whitespace-nowrap">
                      {KIND_LABELS[m.kind]}
                    </td>
                    <td className="font-sans text-xs text-cream-dim py-3 pr-4">
                      {m.description ?? "—"}
                    </td>
                    <td
                      className={`font-sans text-xs py-3 text-right whitespace-nowrap ${
                        m.amount >= 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {m.amount >= 0 ? "+" : ""}
                      {formatPrice(m.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
