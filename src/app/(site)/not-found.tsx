import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen pt-[104px] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <p className="font-display text-7xl font-bold text-gold mb-4">404</p>
        <h1 className="font-display text-2xl font-bold text-text-dark mb-3">
          No encontramos esta página
        </h1>
        <p className="font-sans text-sm text-text-light mb-8">
          El producto o la página que buscás no existe o fue movida.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="py-3 px-6 bg-text-dark text-white rounded-full font-sans text-sm font-medium hover:bg-text-mid transition-colors"
          >
            Volver al inicio
          </Link>
          <Link
            href="/catalogo"
            className="py-3 px-6 border border-border-light text-text-dark rounded-full font-sans text-sm font-medium hover:border-gold/50 hover:text-gold transition-colors"
          >
            Ver catálogo
          </Link>
        </div>
      </div>
    </div>
  );
}
