-- ============================================================
-- GOURMAND — Migration: Stock Lots (FIFO)
-- Ejecutar en Supabase SQL Editor
-- ============================================================

-- 1. Tabla stock_lots
CREATE TABLE IF NOT EXISTS stock_lots (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id         UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id         UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  purchase_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  quantity_purchased INT NOT NULL CHECK (quantity_purchased > 0),
  quantity_remaining INT NOT NULL CHECK (quantity_remaining >= 0),
  cost_price_usd     NUMERIC(10,2) NOT NULL CHECK (cost_price_usd >= 0),
  cost_price_ars     NUMERIC(10,2) NOT NULL CHECK (cost_price_ars >= 0),
  exchange_rate      NUMERIC(10,2) NOT NULL CHECK (exchange_rate > 0),
  notes              TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Agregar columnas de trazabilidad de lotes a order_items
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS lot_id UUID REFERENCES stock_lots(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10,2);

-- 3. Índices
CREATE INDEX IF NOT EXISTS idx_stock_lots_variant       ON stock_lots(variant_id);
CREATE INDEX IF NOT EXISTS idx_stock_lots_product       ON stock_lots(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_lots_purchase_date ON stock_lots(purchase_date ASC);
CREATE INDEX IF NOT EXISTS idx_stock_lots_remaining     ON stock_lots(quantity_remaining) WHERE quantity_remaining > 0;
CREATE INDEX IF NOT EXISTS idx_order_items_lot          ON order_items(lot_id) WHERE lot_id IS NOT NULL;

-- 4. RLS para stock_lots (solo service role accede — todas las ops son via API)
ALTER TABLE stock_lots ENABLE ROW LEVEL SECURITY;

-- 5. Función FIFO: asigna lotes a order_items y descuenta quantity_remaining
--    Se llama junto con decrement_stock_on_order al aprobar una orden.
CREATE OR REPLACE FUNCTION apply_fifo_lots_on_order(p_order_id UUID)
RETURNS void AS $$
DECLARE
  item         RECORD;
  lot          RECORD;
  qty_to_deduct INT;
  first_lot_id  UUID;
  first_lot_cost NUMERIC(10,2);
  deduct        INT;
BEGIN
  FOR item IN
    SELECT id, variant_id, quantity
    FROM order_items
    WHERE order_id = p_order_id AND variant_id IS NOT NULL
  LOOP
    qty_to_deduct := item.quantity;
    first_lot_id  := NULL;
    first_lot_cost := NULL;

    -- Iterar lotes del mismo variant ordenados por fecha (FIFO: más antiguo primero)
    FOR lot IN
      SELECT id, quantity_remaining, cost_price_ars
      FROM stock_lots
      WHERE variant_id = item.variant_id AND quantity_remaining > 0
      ORDER BY purchase_date ASC, created_at ASC
      FOR UPDATE
    LOOP
      EXIT WHEN qty_to_deduct <= 0;

      -- Guardar primer lote usado (para registrar en order_item)
      IF first_lot_id IS NULL THEN
        first_lot_id   := lot.id;
        first_lot_cost := lot.cost_price_ars;
      END IF;

      deduct := LEAST(qty_to_deduct, lot.quantity_remaining);

      UPDATE stock_lots
        SET quantity_remaining = quantity_remaining - deduct
        WHERE id = lot.id;

      qty_to_deduct := qty_to_deduct - deduct;
    END LOOP;

    -- Registrar en order_item el lote principal y su costo
    IF first_lot_id IS NOT NULL THEN
      UPDATE order_items
        SET lot_id = first_lot_id, cost_price = first_lot_cost
        WHERE id = item.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Función auxiliar: incrementar stock de un variant al ingresar un lote
CREATE OR REPLACE FUNCTION increment_variant_stock(p_variant_id UUID, p_quantity INT)
RETURNS void AS $$
BEGIN
  UPDATE product_variants
    SET stock = stock + p_quantity, updated_at = now()
    WHERE id = p_variant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- INSTRUCCIONES PARA EJECUTAR:
-- 1. Abrir Supabase Dashboard → SQL Editor
-- 2. Pegar y ejecutar este archivo completo
-- 3. Verificar que la tabla stock_lots se creó correctamente
-- 4. Verificar que order_items tiene las columnas lot_id y cost_price
-- ============================================================
