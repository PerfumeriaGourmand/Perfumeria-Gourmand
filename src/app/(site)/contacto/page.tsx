"use client";

import { useState } from "react";
import { MessageCircle, Mail, Instagram, Clock, Send } from "lucide-react";

const CHANNELS = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "La forma más rápida. Respondemos en minutos durante el horario de atención.",
    action: "Escribinos",
    href: "https://wa.me/5491100000000",
    accent: true,
  },
  {
    icon: Mail,
    title: "Email",
    description: "Para consultas que requieran más detalle o adjuntar comprobantes.",
    action: "hola@gourmand.com.ar",
    href: "mailto:hola@gourmand.com.ar",
    accent: false,
  },
  {
    icon: Instagram,
    title: "Instagram",
    description: "Seguinos para ver novedades, lanzamientos y contenido de fragancias.",
    action: "@gourmand.ar",
    href: "https://instagram.com/gourmand.ar",
    accent: false,
  },
];

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Simula envío — reemplazar con integración real
    await new Promise((r) => setTimeout(r, 1200));
    setSent(true);
    setSending(false);
  };

  const inputClass =
    "w-full border border-border-light rounded-xl px-4 py-3 font-sans text-sm text-text-dark placeholder:text-text-light focus:outline-none focus:border-gold/50 bg-white transition-colors";

  return (
    <div className="min-h-screen pt-28 pb-24">
      {/* Header */}
      <div className="px-6 max-w-4xl mx-auto mb-14">
        <h1 className="font-display text-4xl font-bold text-text-dark mb-4">Contacto</h1>
        <p className="font-sans text-text-mid leading-relaxed max-w-lg">
          Cualquier consulta sobre pedidos, fragancias o envíos — respondemos siempre.
        </p>
      </div>

      <div className="px-6 max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left — channels + hours */}
        <div className="space-y-8">
          <div className="space-y-4">
            {CHANNELS.map(({ icon: Icon, title, description, action, href, accent }) => (
              <a
                key={title}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`flex items-start gap-4 p-5 rounded-2xl border transition-colors group ${
                  accent
                    ? "border-gold/30 bg-gold/5 hover:bg-gold/10"
                    : "border-border-light bg-white hover:bg-surface-2"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${accent ? "bg-gold/15" : "bg-surface-2"}`}>
                  <Icon size={17} strokeWidth={1.5} className={accent ? "text-gold" : "text-text-mid"} />
                </div>
                <div className="min-w-0">
                  <p className="font-sans text-sm font-semibold text-text-dark mb-0.5">{title}</p>
                  <p className="font-sans text-xs text-text-light leading-relaxed mb-2">{description}</p>
                  <p className={`font-sans text-xs font-medium ${accent ? "text-gold" : "text-text-mid group-hover:text-gold transition-colors"}`}>
                    {action} →
                  </p>
                </div>
              </a>
            ))}
          </div>

          <div className="bg-surface-2 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} strokeWidth={1.5} className="text-gold" />
              <p className="font-sans text-xs tracking-widest uppercase text-gold">Horario de atención</p>
            </div>
            <div className="space-y-2 font-sans text-sm">
              <div className="flex justify-between">
                <span className="text-text-mid">Lunes a viernes</span>
                <span className="text-text-dark font-medium">10:00 – 19:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-mid">Sábados</span>
                <span className="text-text-dark font-medium">10:00 – 14:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-mid">Domingos y feriados</span>
                <span className="text-text-light">Cerrado</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div className="bg-white border border-border-light rounded-2xl p-8">
          {sent ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-8">
              <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center mb-5">
                <Send size={22} strokeWidth={1.5} className="text-gold" />
              </div>
              <h2 className="font-display text-2xl text-text-dark mb-2">¡Mensaje enviado!</h2>
              <p className="font-sans text-sm text-text-mid max-w-xs">
                Te respondemos dentro de las 24 horas hábiles. También podés escribirnos por WhatsApp para una respuesta más rápida.
              </p>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl text-text-dark mb-6">Envianos un mensaje</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-text-light mb-1.5 block">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre"
                      value={form.nombre}
                      onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-sans text-[10px] tracking-widest uppercase text-text-light mb-1.5 block">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu@email.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-text-light mb-1.5 block">
                    Asunto
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="¿En qué te podemos ayudar?"
                    value={form.asunto}
                    onChange={(e) => setForm((f) => ({ ...f, asunto: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="font-sans text-[10px] tracking-widest uppercase text-text-light mb-1.5 block">
                    Mensaje
                  </label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Contanos tu consulta con el mayor detalle posible..."
                    value={form.mensaje}
                    onChange={(e) => setForm((f) => ({ ...f, mensaje: e.target.value }))}
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors disabled:opacity-60"
                >
                  {sending ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={14} strokeWidth={2} />
                      Enviar mensaje
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
