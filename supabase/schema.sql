-- ============================================================
-- GOURMAND — Supabase Schema
-- ============================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- fuzzy search

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE product_category AS ENUM ('arabe', 'disenador', 'nicho');
CREATE TYPE product_gender AS ENUM ('hombre', 'mujer', 'unisex');
CREATE TYPE product_season AS ENUM ('verano', 'invierno', 'primavera', 'otono', 'todo_clima');
CREATE TYPE concentration_type AS ENUM ('parfum', 'edp', 'edt', 'edc', 'oil', 'otro');
CREATE TYPE order_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled', 'refunded', 'in_process');
CREATE TYPE payment_method AS ENUM ('credit_card', 'debit_card', 'bank_transfer', 'mercadopago_wallet');

-- ============================================================
-- PRODUCTS
-- ============================================================

CREATE TABLE products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  brand         TEXT NOT NULL,
  description   TEXT,
  short_desc    TEXT,                          -- Para la sección nicho (texto poético corto)
  category      product_category NOT NULL,
  gender        product_gender NOT NULL DEFAULT 'unisex',
  concentration concentration_type NOT NULL,
  seasons       product_season[] NOT NULL DEFAULT '{}',
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  is_new        BOOLEAN NOT NULL DEFAULT false,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  sort_order    INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCT IMAGES
-- ============================================================

CREATE TABLE product_images (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  alt         TEXT,
  is_primary  BOOLEAN NOT NULL DEFAULT false,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCT VARIANTS (sizes + prices + stock)
-- ============================================================

CREATE TABLE product_variants (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  size_ml     INT NOT NULL,                -- e.g. 30, 50, 100
  price       NUMERIC(10,2) NOT NULL,
  stock       INT NOT NULL DEFAULT 0,
  sku         TEXT UNIQUE,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- KITS
-- ============================================================

CREATE TABLE kits (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10,2) NOT NULL,     -- precio del kit (puede ser diferente a la suma)
  stock       INT NOT NULL DEFAULT 0,
  image_url   TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE kit_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kit_id      UUID NOT NULL REFERENCES kits(id) ON DELETE CASCADE,
  variant_id  UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity    INT NOT NULL DEFAULT 1
);

-- ============================================================
-- ORDERS
-- ============================================================

CREATE TABLE orders (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  -- Customer info (guest checkout or user_id if logged in)
  user_id              UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  customer_name        TEXT NOT NULL,
  customer_email       TEXT NOT NULL,
  customer_phone       TEXT,
  -- Shipping
  shipping_address     JSONB,             -- { street, number, apt, city, province, zip }
  -- Payment
  payment_method       payment_method,
  payment_status       order_status NOT NULL DEFAULT 'pending',
  mp_preference_id     TEXT,             -- MercadoPago preference ID
  mp_payment_id        TEXT,             -- MercadoPago payment ID
  mp_merchant_order_id TEXT,
  installments         INT DEFAULT 1,
  -- Totals
  subtotal             NUMERIC(10,2) NOT NULL,
  shipping_cost        NUMERIC(10,2) NOT NULL DEFAULT 0,
  total                NUMERIC(10,2) NOT NULL,
  -- Meta
  notes                TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ORDER ITEMS
-- ============================================================

CREATE TABLE order_items (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  -- Can be a product variant or a kit
  variant_id   UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  kit_id       UUID REFERENCES kits(id) ON DELETE SET NULL,
  -- Snapshot at time of purchase
  product_name TEXT NOT NULL,
  size_ml      INT,
  quantity     INT NOT NULL DEFAULT 1,
  unit_price   NUMERIC(10,2) NOT NULL,
  total_price  NUMERIC(10,2) NOT NULL
);

-- ============================================================
-- PAGE VIEWS (for admin analytics)
-- ============================================================

CREATE TABLE page_views (
  id           BIGSERIAL PRIMARY KEY,
  path         TEXT NOT NULL,
  product_id   UUID REFERENCES products(id) ON DELETE SET NULL,
  referrer     TEXT,
  user_agent   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- ADMIN SETTINGS (singleton row for site config)
-- ============================================================

CREATE TABLE site_settings (
  id                  INT PRIMARY KEY DEFAULT 1,
  hero_title          TEXT DEFAULT 'El arte de oler extraordinario',
  hero_subtitle       TEXT DEFAULT 'Perfumería de nicho y diseñador. Buenos Aires.',
  hero_video_url      TEXT,
  hero_image_url      TEXT,
  free_shipping_min   NUMERIC(10,2) DEFAULT 50000,
  whatsapp_number     TEXT,
  instagram_handle    TEXT,
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO site_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_gender ON products(gender);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_new ON products(is_new) WHERE is_new = true;
CREATE INDEX idx_products_active ON products(is_active) WHERE is_active = true;
CREATE INDEX idx_products_search ON products USING gin(
  (to_tsvector('spanish', name || ' ' || brand || ' ' || coalesce(description, '')))
);
CREATE INDEX idx_product_variants_product ON product_variants(product_id);
CREATE INDEX idx_product_variants_stock ON product_variants(stock);
CREATE INDEX idx_orders_status ON orders(payment_status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_page_views_created ON page_views(created_at DESC);
CREATE INDEX idx_page_views_product ON page_views(product_id) WHERE product_id IS NOT NULL;

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER product_variants_updated_at BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER kits_updated_at BEFORE UPDATE ON kits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- STOCK DECREMENT FUNCTION (called on order approval)
-- ============================================================

CREATE OR REPLACE FUNCTION decrement_stock_on_order(p_order_id UUID)
RETURNS void AS $$
DECLARE
  item RECORD;
BEGIN
  FOR item IN
    SELECT variant_id, kit_id, quantity FROM order_items WHERE order_id = p_order_id
  LOOP
    IF item.variant_id IS NOT NULL THEN
      UPDATE product_variants
        SET stock = GREATEST(0, stock - item.quantity),
            updated_at = now()
        WHERE id = item.variant_id;
    END IF;

    IF item.kit_id IS NOT NULL THEN
      -- Decrement stock for each variant in the kit
      UPDATE product_variants pv
        SET stock = GREATEST(0, pv.stock - (ki.quantity * item.quantity)),
            updated_at = now()
        FROM kit_items ki
        WHERE ki.kit_id = item.kit_id
          AND ki.variant_id = pv.id;

      -- Decrement kit stock
      UPDATE kits
        SET stock = GREATEST(0, stock - item.quantity),
            updated_at = now()
        WHERE id = item.kit_id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE kit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read for catalog
CREATE POLICY "Public can read active products"
  ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT USING (true);
CREATE POLICY "Public can read active variants"
  ON product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read active kits"
  ON kits FOR SELECT USING (is_active = true);
CREATE POLICY "Public can read kit items"
  ON kit_items FOR SELECT USING (true);
CREATE POLICY "Public can read site settings"
  ON site_settings FOR SELECT USING (true);

-- Orders: guests insert, users read their own
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT USING (
    user_id = auth.uid() OR
    auth.jwt() ->> 'role' = 'admin'
  );

CREATE POLICY "Anyone can create order items"
  ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can read own order items"
  ON order_items FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders o
      WHERE o.id = order_items.order_id
        AND (o.user_id = auth.uid() OR auth.jwt() ->> 'role' = 'admin')
    )
  );

-- Page views: anyone can insert
CREATE POLICY "Anyone can insert page views"
  ON page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read page views"
  ON page_views FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Admin full access (using service role via backend API routes)
-- All admin mutations happen through API routes using SUPABASE_SERVICE_ROLE_KEY

-- ============================================================
-- STORAGE BUCKETS (run in Supabase dashboard or via CLI)
-- ============================================================

-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('kit-images', 'kit-images', true);

-- Storage policies (public read)
-- CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
-- CREATE POLICY "Admin upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.jwt() ->> 'role' = 'admin');
-- CREATE POLICY "Admin delete product images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.jwt() ->> 'role' = 'admin');
