-- Catálogo editable de destinos del dinero para ventas manuales
-- (ej: Ripio Bauti, Mercadopago Bauti, Mercadopago Fada, Ripio Fada)

CREATE TABLE IF NOT EXISTS payment_destinations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name       TEXT NOT NULL UNIQUE,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_destination_id UUID
    REFERENCES payment_destinations(id) ON DELETE SET NULL;

ALTER TABLE payment_destinations ENABLE ROW LEVEL SECURITY;
-- Sin políticas públicas: solo accesible vía service role (admin client) desde rutas /api/admin/*

INSERT INTO payment_destinations (name, sort_order) VALUES
  ('Ripio Bauti', 1),
  ('Mercadopago Bauti', 2),
  ('Mercadopago Fada', 3),
  ('Ripio Fada', 4)
ON CONFLICT (name) DO NOTHING;
