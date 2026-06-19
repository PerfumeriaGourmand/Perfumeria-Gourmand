"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import type { Collection } from "@/types";

type CollectionRow = Collection & { collection_products?: { id: string }[] };

export default function CollectionsClient({ collections: initial }: { collections: CollectionRow[] }) {
  const [collections, setCollections] = useState(initial);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta colección?")) return;
    const res = await fetch("/api/admin/collections", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      toast.error("Error al eliminar");
      return;
    }
    setCollections((prev) => prev.filter((c) => c.id !== id));
    toast.success("Colección eliminada");
  };

  return (
    <div className="border border-gold/10 bg-obsidian-surface overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gold/10">
            {["Imagen", "Nombre", "Slug", "Productos", "Estado", ""].map((h) => (
              <th
                key={h}
                className="px-5 py-3 text-left font-sans text-[10px] tracking-widest uppercase text-cream-dim"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c.id} className="border-b border-gold/5 hover:bg-obsidian/40 transition-colors">
              <td className="px-5 py-4">
                {c.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={c.image_url} alt={c.name} className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 bg-obsidian rounded" />
                )}
              </td>
              <td className="px-5 py-4 font-sans text-sm text-cream">{c.name}</td>
              <td className="px-5 py-4 font-sans text-xs text-cream-muted">{c.slug}</td>
              <td className="px-5 py-4 font-sans text-xs text-cream-muted">
                {c.collection_products?.length ?? 0}
              </td>
              <td className="px-5 py-4">
                <span
                  className={`font-sans text-[10px] tracking-wide px-2 py-0.5 ${
                    c.is_active ? "bg-green-400/10 text-green-400" : "bg-cream-dim/10 text-cream-dim"
                  }`}
                >
                  {c.is_active ? "Activa" : "Inactiva"}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/collections/${c.id}`}
                    className="flex items-center gap-1.5 font-sans text-xs text-gold/60 hover:text-gold transition-colors"
                  >
                    <Edit size={12} strokeWidth={1.5} />
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="flex items-center gap-1.5 font-sans text-xs text-red-400/60 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={12} strokeWidth={1.5} />
                    Borrar
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {collections.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center font-sans text-sm text-cream-dim italic">
                No hay colecciones todavía
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
