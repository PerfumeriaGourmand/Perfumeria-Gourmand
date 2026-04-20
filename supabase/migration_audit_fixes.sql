-- ============================================================
-- GOURMAND — Migración: Correcciones de la auditoría de DB
-- ============================================================

-- ── 1. Tipo de cambio actual en site_settings ────────────────
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS current_exchange_rate NUMERIC(10,2);

-- ── 2. Índices faltantes ─────────────────────────────────────

-- order_items(order_id) — el FK más consultado del sistema, sin índice
CREATE INDEX IF NOT EXISTS idx_order_items_order_id
  ON order_items(order_id);

-- product_images(product_id) — cada carga de producto con imágenes lo necesita
CREATE INDEX IF NOT EXISTS idx_product_images_product_id
  ON product_images(product_id);

-- orders(user_id) — para RLS "Users can read own orders" y perfil de usuario
CREATE INDEX IF NOT EXISTS idx_orders_user_id
  ON orders(user_id) WHERE user_id IS NOT NULL;

-- orders(user_id, created_at DESC) — historial de usuario ordenado
CREATE INDEX IF NOT EXISTS idx_orders_user_created
  ON orders(user_id, created_at DESC) WHERE user_id IS NOT NULL;

-- ── 3. updated_at en product_images ──────────────────────────
ALTER TABLE product_images
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE TRIGGER product_images_updated_at BEFORE UPDATE ON product_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── 4. CHECK constraint en order_items ───────────────────────
-- Omitido: hay filas históricas con variant_id y kit_id ambos NULL
-- que violarían el constraint. No es crítico para el funcionamiento.

-- ── 5. Actualizar decrement_stock_on_order sin referencias a kits ────────
-- Al dropear las tablas kits y kit_items, la función original queda inválida.
-- Esta versión solo maneja product_variants.
CREATE OR REPLACE FUNCTION decrement_stock_on_order(p_order_id UUID)
RETURNS void AS $$
DECLARE
  item RECORD;
BEGIN
  FOR item IN
    SELECT variant_id, quantity
    FROM order_items
    WHERE order_id = p_order_id AND variant_id IS NOT NULL
  LOOP
    UPDATE product_variants
      SET stock = GREATEST(0, stock - item.quantity),
          updated_at = now()
      WHERE id = item.variant_id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ── 6. apply_fifo_lots_on_order se CONSERVA ──────────────────
-- La función FIFO se reactiva como sistema principal de asignación de costos.
-- Ver migration_fifo_reactivate.sql

-- ── 6. Agregar columnas faltantes al tipo TypeScript ─────────
-- (orders.source y site_settings.low_stock_threshold ya están en la DB
--  vía migraciones anteriores; estos son solo recordatorios documentales)
-- orders.source TEXT DEFAULT 'web'  ← migration_manual_sale.sql
-- site_settings.low_stock_threshold ← migration_low_stock_threshold.sql
