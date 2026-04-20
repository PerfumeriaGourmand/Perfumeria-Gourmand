import Link from "next/link";

// SVG icons for socials
const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);
const TikTokIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.13 8.13 0 0 0 4.82 1.56V6.81a4.85 4.85 0 0 1-1.05-.12z"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/gourmand.perfumes", Icon: InstagramIcon },
  { label: "Facebook", href: "https://facebook.com/gourmand.perfumes", Icon: FacebookIcon },
  { label: "TikTok", href: "https://tiktok.com/@gourmand.perfumes", Icon: TikTokIcon },
  { label: "WhatsApp", href: "https://wa.me/5491100000000", Icon: WhatsAppIcon },
];

const EXPLORE = [
  { href: "/catalogo", label: "Catálogo completo" },
  { href: "/catalogo?category=nicho", label: "Perfumes nicho" },
  { href: "/catalogo?category=arabe", label: "Perfumes árabes" },
  { href: "/catalogo?category=disenador", label: "Diseñador" },
  { href: "/catalogo?category=kit", label: "Kits y conjuntos" },
];

const LEGAL = [
  { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
  { href: "/privacidad", label: "Política de privacidad" },
  { href: "/cambios-y-devoluciones", label: "Cambios y devoluciones" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1c1917] text-cream mt-20">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <p className="font-display text-2xl font-bold tracking-[0.2em] text-white mb-3">
              GOURMAND
            </p>
            <p className="font-sans text-sm text-cream-dim leading-relaxed mb-6">
              Perfumería de nicho, árabe y diseñador. Buenos Aires, Argentina.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-white/10 text-cream-dim hover:text-white hover:border-white/30 transition-all duration-200 rounded-full"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Explorar */}
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-5">
              Explorar
            </p>
            <ul className="space-y-3">
              {EXPLORE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream-dim hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-5">
              Información
            </p>
            <ul className="space-y-3">
              {LEGAL.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-cream-dim hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-gold mb-5">
              Contacto
            </p>
            <ul className="space-y-3 font-sans text-sm text-cream-dim">
              <li>Buenos Aires, Argentina</li>
              <li>
                <a
                  href="https://wa.me/5491100000000"
                  className="hover:text-white transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/gourmand.perfumes"
                  className="hover:text-white transition-colors duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @gourmand.perfumes
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-cream-dim/50">
            © {new Date().getFullYear()} GOURMAND — Todos los derechos reservados
          </p>
          <div className="flex items-center gap-1 text-cream-dim/30 font-sans text-xs">
            <span>Hecho con</span>
            <span className="text-gold/50">♡</span>
            <span>en Buenos Aires</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
