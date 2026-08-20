"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import type { User } from "@supabase/supabase-js";
import type { ProductReview } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          strokeWidth={1.5}
          className={n <= rating ? "fill-gold stroke-gold" : "stroke-current opacity-25"}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId, dark }: { productId: string; dark?: boolean }) {
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [blocked, setBlocked] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    supabase
      .from("product_reviews")
      .select("*")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReviews(data ?? []);
        setLoading(false);
      });

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setName(data.user?.user_metadata?.full_name ?? "");
    });
  }, [productId, supabase]);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalOpen]);

  const alreadyReviewed = user ? reviews.some((r) => r.user_id === user.id) : false;
  const average = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const handleSubmit = async () => {
    if (!user) {
      toast.error("Iniciá sesión para dejar una reseña");
      return;
    }
    if (rating === 0) {
      toast.error("Elegí una calificación");
      return;
    }
    if (!name.trim()) {
      toast.error("Ingresá tu nombre");
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .insert({
        product_id: productId,
        user_id: user.id,
        customer_name: name.trim(),
        rating,
        comment: comment.trim() || null,
      })
      .select()
      .single();
    setSubmitting(false);

    if (error) {
      // RLS bloquea el insert si el usuario no compró el producto
      setBlocked(true);
      toast.error("Solo pueden dejar reseña quienes compraron este producto");
      return;
    }

    setReviews((prev) => [data as ProductReview, ...prev]);
    setShowForm(false);
    setRating(0);
    setComment("");
    toast.success("¡Gracias por tu reseña!");
  };

  if (loading) return null;

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => setModalOpen(true)}
        aria-label={reviews.length > 0 ? `Ver reseñas — promedio ${average.toFixed(1)} de 5` : "Ver reseñas"}
        className={cn(
          "shrink-0 w-10 h-10 flex items-center justify-center rounded-full border transition-all duration-200 hover:scale-110",
          dark ? "border-gold/20 hover:border-gold" : "border-border-light hover:border-gold"
        )}
      >
        <Star
          size={17}
          strokeWidth={1.5}
          className={reviews.length > 0 ? "fill-gold stroke-gold" : dark ? "stroke-gold/50" : "stroke-text-light"}
        />
      </button>
      {reviews.length > 0 && (
        <span className={cn("font-sans text-[10px]", dark ? "text-cream-dim" : "text-text-light")}>
          {average.toFixed(1)} ({reviews.length})
        </span>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl p-6 sm:p-8",
                dark ? "bg-obsidian border border-gold/15" : "bg-white"
              )}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className={cn("font-display font-light text-2xl", dark ? "text-cream" : "text-text-dark")}>
                    Reseñas {reviews.length > 0 && `(${reviews.length})`}
                  </h2>
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <StarRow rating={Math.round(average)} />
                      <span className={cn("font-sans text-sm", dark ? "text-cream-dim" : "text-text-mid")}>
                        {average.toFixed(1)} de 5
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className={cn("shrink-0", dark ? "text-cream-dim hover:text-cream" : "text-text-light hover:text-text-dark")}
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              {user && !alreadyReviewed && !showForm && (
                <button
                  onClick={() => setShowForm(true)}
                  className={cn(
                    "font-sans text-xs uppercase tracking-widest px-6 py-3 rounded-full border transition-colors mb-6",
                    dark ? "border-gold/40 text-gold hover:bg-gold/10" : "border-text-dark text-text-dark hover:bg-text-dark hover:text-white"
                  )}
                >
                  Dejar una reseña
                </button>
              )}

              {showForm && (
                <div
                  className={cn(
                    "rounded-2xl border p-6 mb-6",
                    dark ? "border-gold/15 bg-black/20" : "border-border-light bg-surface-2"
                  )}
                >
                  <p className={cn("font-sans text-xs uppercase tracking-widest mb-3", dark ? "text-cream-dim" : "text-text-light")}>
                    Tu calificación
                  </p>
                  <div className="flex items-center gap-1 mb-5">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} onClick={() => setRating(n)} aria-label={`${n} estrellas`}>
                        <Star
                          size={26}
                          strokeWidth={1.5}
                          className={n <= rating ? "fill-gold stroke-gold" : cn("stroke-current opacity-30", dark && "text-cream")}
                        />
                      </button>
                    ))}
                  </div>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tu nombre"
                    className={cn(
                      "w-full font-sans text-sm mb-3 px-4 py-3 rounded-xl border outline-none",
                      dark ? "bg-black/30 border-gold/20 text-cream placeholder:text-cream-dim/50" : "bg-white border-border-light text-text-dark"
                    )}
                  />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Contanos qué te pareció (opcional)"
                    rows={3}
                    className={cn(
                      "w-full font-sans text-sm mb-4 px-4 py-3 rounded-xl border outline-none resize-none",
                      dark ? "bg-black/30 border-gold/20 text-cream placeholder:text-cream-dim/50" : "bg-white border-border-light text-text-dark"
                    )}
                  />
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className={cn(
                        "font-sans text-xs uppercase tracking-widest px-8 py-3 rounded-full transition-colors disabled:opacity-50",
                        dark ? "bg-gold text-obsidian hover:bg-gold-light" : "bg-text-dark text-white hover:bg-text-mid"
                      )}
                    >
                      {submitting ? "Enviando..." : "Publicar reseña"}
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className={cn("font-sans text-xs uppercase tracking-widest", dark ? "text-cream-dim" : "text-text-light")}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {blocked && (
                <p className={cn("font-sans text-xs italic mb-6", dark ? "text-cream-dim" : "text-text-light")}>
                  Solo los clientes que compraron este perfume pueden dejar una reseña.
                </p>
              )}

              {reviews.length === 0 ? (
                <p className={cn("font-sans text-sm italic", dark ? "text-cream-dim" : "text-text-light")}>
                  Todavía no hay reseñas para este perfume.
                </p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r) => (
                    <div key={r.id} className={cn("pb-4 border-b last:border-b-0", dark ? "border-gold/10" : "border-border-light")}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={cn("font-display text-lg", dark ? "text-cream" : "text-text-dark")}>
                          {r.customer_name}
                        </span>
                        <StarRow rating={r.rating} />
                      </div>
                      {r.comment && (
                        <p className={cn("font-sans text-sm leading-relaxed", dark ? "text-cream-dim" : "text-text-mid")}>
                          {r.comment}
                        </p>
                      )}
                      <p className={cn("font-sans text-[11px] mt-2", dark ? "text-cream-dim/50" : "text-text-light")}>
                        {new Date(r.created_at).toLocaleDateString("es-AR", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
