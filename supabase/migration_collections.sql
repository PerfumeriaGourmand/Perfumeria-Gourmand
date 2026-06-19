-- ============================================================
-- GOURMAND — Migration: Colecciones (ej. "Asad", "Asad Bourbon",
-- "Asad Zanzibar", "Asad Elixir" agrupados en la colección "Asad")
-- Ejecutar en Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS collections (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS collection_products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order    INT NOT NULL DEFAULT 0,
  UNIQUE (collection_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_collection_products_collection ON collection_products(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_products_product ON collection_products(product_id);

CREATE TRIGGER collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS: solo lectura pública. Todas las escrituras (crear/editar/borrar
-- colecciones y asignar productos) pasan por /api/admin/collections con
-- requireAdmin() + service_role — el mismo patrón que /api/admin/products,
-- no el de coupons (que usa el cliente del browser).
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active collections"
  ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read collection products"
  ON collection_products FOR SELECT USING (true);
