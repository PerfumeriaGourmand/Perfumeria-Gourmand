"use client";

import { useState } from "react";
import { Save, Store, CreditCard, Share2, Truck, Megaphone, Package } from "lucide-react";
import toast from "react-hot-toast";

interface SiteSettings {
  id?: number;
  store_name?: string;
  store_description?: string;
  logo_url?: string;
  announcement_text?: string;
  announcement_active?: boolean;
  mp_public_key?: string;
  mp_access_token?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  whatsapp_number?: string;
  free_shipping_min?: number;
  shipping_zones?: string;
  low_stock_threshold?: number;
}

const inputClass =
  "w-full bg-obsidian border border-gold/20 px-4 py-3 font-sans text-sm text-cream placeholder:text-cream-dim focus:outline-none focus:border-gold/60 transition-colors";
const labelClass = "font-sans text-[10px] tracking-widest uppercase text-cream-dim mb-1.5 block";

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-obsidian-surface border border-gold/10 p-6 space-y-5">
      <div className="flex items-center gap-2 mb-1">
        <Icon size={15} strokeWidth={1.5} className="text-gold/60" />
        <h2 className="font-sans text-xs tracking-widest uppercase text-gold/60">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function SettingsClient({
  initialSettings,
}: {
  initialSettings: SiteSettings | null;
}) {
  const s = initialSettings ?? {};
  const [saving, setSaving] = useState(false);

  // Store
  const [storeName, setStoreName] = useState(s.store_name ?? "Gourmand");
  const [storeDesc, setStoreDesc] = useState(s.store_description ?? "");
  const [logoUrl, setLogoUrl] = useState(s.logo_url ?? "");

  // Announcement
  const [announcementText, setAnnouncementText] = useState(s.announcement_text ?? "");
  const [announcementActive, setAnnouncementActive] = useState(s.announcement_active ?? false);

  // MercadoPago
  const [mpPublicKey, setMpPublicKey] = useState(s.mp_public_key ?? "");
  const [mpAccessToken, setMpAccessToken] = useState(s.mp_access_token ?? "");

  // Social
  const [instagram, setInstagram] = useState(s.instagram_url ?? "");
  const [facebook, setFacebook] = useState(s.facebook_url ?? "");
  const [tiktok, setTiktok] = useState(s.tiktok_url ?? "");
  const [whatsapp, setWhatsapp] = useState(s.whatsapp_number ?? "");

  // Shipping
  const [freeShippingMin, setFreeShippingMin] = useState(
    s.free_shipping_min?.toString() ?? ""
  );
  const [shippingZones, setShippingZones] = useState(s.shipping_zones ?? "");

  // Stock
  const [lowStockThreshold, setLowStockThreshold] = useState(
    s.low_stock_threshold?.toString() ?? "5"
  );

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        id: 1,
        store_name: storeName,
        store_description: storeDesc || null,
        logo_url: logoUrl || null,
        announcement_text: announcementText || null,
        announcement_active: announcementActive,
        mp_public_key: mpPublicKey || null,
        mp_access_token: mpAccessToken || null,
        instagram_url: instagram || null,
        facebook_url: facebook || null,
        tiktok_url: tiktok || null,
        whatsapp_number: whatsapp || null,
        free_shipping_min: freeShippingMin ? parseFloat(freeShippingMin) : null,
        shipping_zones: shippingZones || null,
        low_stock_threshold: lowStockThreshold ? parseInt(lowStockThreshold) : 5,
      };

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(await res.text());
      toast.success("Configuración guardada");
    } catch (err) {
      toast.error("Error al guardar: " + (err instanceof Error ? err.message : "desconocido"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-3xl text-cream mb-1">Configuración</h1>
          <p className="font-sans text-xs text-cream-dim">Ajustes generales de la tienda</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-gold text-obsidian font-sans text-xs tracking-widest uppercase px-5 py-3 hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          <Save size={14} strokeWidth={2} />
          {saving ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Store */}
        <SectionCard title="Datos de la tienda" icon={Store}>
          <div>
            <label className={labelClass}>Nombre de la tienda</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Descripción</label>
            <textarea
              value={storeDesc}
              onChange={(e) => setStoreDesc(e.target.value)}
              rows={3}
              className={inputClass + " resize-none"}
            />
          </div>
          <div>
            <label className={labelClass}>URL del logo</label>
            <input
              type="url"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
        </SectionCard>

        {/* Announcement */}
        <SectionCard title="Banner de anuncio" icon={Megaphone}>
          <div>
            <label className={labelClass}>Texto del banner</label>
            <input
              type="text"
              value={announcementText}
              onChange={(e) => setAnnouncementText(e.target.value)}
              placeholder="Ej: Envío gratis en compras mayores a $50.000"
              className={inputClass}
            />
            <p className="font-sans text-[10px] text-cream-dim mt-1.5">
              Aparece como barra en la parte superior del sitio
            </p>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => setAnnouncementActive((v) => !v)}
              className={`w-10 h-5 rounded-full transition-colors duration-200 flex items-center ${
                announcementActive ? "bg-gold" : "bg-obsidian border border-gold/20"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform duration-200 mx-0.5 ${
                  announcementActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <span className="font-sans text-xs text-cream-muted">Mostrar banner actualmente</span>
          </label>
        </SectionCard>

        {/* MercadoPago */}
        <SectionCard title="MercadoPago" icon={CreditCard}>
          <p className="font-sans text-xs text-cream-dim -mt-2">
            Las keys también se pueden configurar en las variables de entorno (.env.local)
          </p>
          <div>
            <label className={labelClass}>Public Key</label>
            <input
              type="text"
              value={mpPublicKey}
              onChange={(e) => setMpPublicKey(e.target.value)}
              placeholder="APP_USR-..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Access Token</label>
            <input
              type="password"
              value={mpAccessToken}
              onChange={(e) => setMpAccessToken(e.target.value)}
              placeholder="APP_USR-..."
              className={inputClass}
            />
          </div>
        </SectionCard>

        {/* Social */}
        <SectionCard title="Redes sociales" icon={Share2}>
          {[
            { label: "Instagram URL", value: instagram, set: setInstagram, ph: "https://instagram.com/gourmand" },
            { label: "Facebook URL", value: facebook, set: setFacebook, ph: "https://facebook.com/gourmand" },
            { label: "TikTok URL", value: tiktok, set: setTiktok, ph: "https://tiktok.com/@gourmand" },
            { label: "WhatsApp (número con código de país)", value: whatsapp, set: setWhatsapp, ph: "+541112345678" },
          ].map(({ label, value, set, ph }) => (
            <div key={label}>
              <label className={labelClass}>{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={ph}
                className={inputClass}
              />
            </div>
          ))}
        </SectionCard>

        {/* Stock */}
        <SectionCard title="Inventario" icon={Package}>
          <div>
            <label className={labelClass}>Umbral de stock bajo (unidades)</label>
            <input
              type="number"
              min={1}
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              placeholder="5"
              className={inputClass}
            />
            <p className="font-sans text-[10px] text-cream-dim mt-1.5">
              Variantes con stock por debajo de este valor se marcan como alerta
            </p>
          </div>
        </SectionCard>

        {/* Shipping */}
        <SectionCard title="Envíos" icon={Truck}>
          <div>
            <label className={labelClass}>Monto mínimo para envío gratis (ARS)</label>
            <input
              type="number"
              value={freeShippingMin}
              onChange={(e) => setFreeShippingMin(e.target.value)}
              placeholder="50000"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Zonas y costos de envío</label>
            <textarea
              value={shippingZones}
              onChange={(e) => setShippingZones(e.target.value)}
              rows={5}
              placeholder={`CABA: $2.500\nGBA Zona 1: $3.500\nGBA Zona 2: $4.500\nInterior: $6.000`}
              className={inputClass + " resize-none font-mono text-xs"}
            />
            <p className="font-sans text-[10px] text-cream-dim mt-1.5">
              Una zona por línea en formato: Zona: precio
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
