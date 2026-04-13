-- ============================================================
-- Fix: apply_fifo_lots_on_order
-- Antes: cost_price = primer lote consumido
-- Ahora: cost_price = costo promedio ponderado real
--        sum(unidades_de_cada_lote * cost_price_ars) / cantidad_total
-- ============================================================

CREATE OR REPLACE FUNCTION apply_fifo_lots_on_order(p_order_id UUID)
RETURNS void AS $$
DECLARE
  item          RECORD;
  lot           RECORD;
  qty_to_deduct INT;
  deduct        INT;
  total_cost    NUMERIC(12,4);
  first_lot_id  UUID;
BEGIN
  FOR item IN
    SELECT id, variant_id, quantity
    FROM order_items
    WHERE order_id = p_order_id AND variant_id IS NOT NULL
  LOOP
    qty_to_deduct := item.quantity;
    total_cost    := 0;
    first_lot_id  := NULL;

    FOR lot IN
      SELECT id, quantity_remaining, cost_price_ars
      FROM stock_lots
      WHERE variant_id = item.variant_id AND quantity_remaining > 0
      ORDER BY purchase_date ASC, created_at ASC
      FOR UPDATE
    LOOP
      EXIT WHEN qty_to_deduct <= 0;

      -- Guardar el primer lote como referencia en lot_id
      IF first_lot_id IS NULL THEN
        first_lot_id := lot.id;
      END IF;

      deduct := LEAST(qty_to_deduct, lot.quantity_remaining);

      UPDATE stock_lots
        SET quantity_remaining = quantity_remaining - deduct
        WHERE id = lot.id;

      -- Acumular costo proporcional (no el del primer lote)
      total_cost    := total_cost + (deduct * lot.cost_price_ars);
      qty_to_deduct := qty_to_deduct - deduct;
    END LOOP;

    -- Registrar costo promedio ponderado y lote de referencia
    IF first_lot_id IS NOT NULL THEN
      UPDATE order_items
        SET lot_id     = first_lot_id,
            cost_price = ROUND(total_cost / item.quantity, 2)
        WHERE id = item.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
