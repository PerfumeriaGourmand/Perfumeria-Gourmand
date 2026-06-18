import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-display text-6xl font-bold text-gold mb-4">404</p>
        <h1 className="font-display text-xl font-bold text-cream mb-3">
          No encontramos esta sección
        </h1>
        <p className="font-sans text-sm text-cream-dim mb-8">
          La página del panel que buscás no existe.
        </p>
        <Link
          href="/admin"
          className="inline-block py-2.5 px-6 bg-gold text-obsidian rounded-full font-sans text-sm font-medium hover:bg-gold-light transition-colors"
        >
          Volver al panel
        </Link>
      </div>
    </div>
  );
}
