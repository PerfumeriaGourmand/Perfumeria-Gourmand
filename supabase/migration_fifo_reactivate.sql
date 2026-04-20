-- ============================================================
-- GOURMAND — Migración: Reactivar FIFO para asignación de costos
--
-- El sistema CPP calculaba cost_price = average_cost_usd × TC_actual,
-- lo que hacía que el costo variara con el dólar aunque el producto
-- ya estuviera comprado. Esto es incorrecto para el cálculo de margen.
--
-- El sistema FIFO asigna a cada venta el costo ARS real del lote
-- del que salió la mercadería (precio de compra histórico en ARS).
-- ============================================================

-- Función FIFO con costo promedio ponderado entre lotes consumidos.
-- Se llama al aprobar una orden (junto con decrement_stock_on_order).
--
-- Para cada order_item:
--   1. Consume quantity_remaining de los lotes más antiguos (FIFO)
--   2. Calcula cost_price = Σ(unidades_de_cada_lote × cost_price_ars) / cantidad_total
--   3. Guarda lot_id del primer lote consumido como referencia
CREATE OR REPLACE FUNCTION apply_fifo_lots_on_order(p_order_id UUID)
RETURNS void AS $$
DECLARE
  item          RECORD;
  lot           RECORD;
  qty_to_deduct INT;
  deduct        INT;
  total_cost    NUMERIC(12,4);
  has_lots      BOOLEAN;
BEGIN
  FOR item IN
    SELECT id, variant_id, quantity
    FROM order_items
    WHERE order_id = p_order_id AND variant_id IS NOT NULL
  LOOP
    qty_to_deduct := item.quantity;
    total_cost    := 0;
    has_lots      := FALSE;

    FOR lot IN
      SELECT id, quantity_remaining, cost_price_ars
      FROM stock_lots
      WHERE variant_id = item.variant_id AND quantity_remaining > 0
      ORDER BY purchase_date ASC, created_at ASC
      FOR UPDATE
    LOOP
      EXIT WHEN qty_to_deduct <= 0;

      has_lots := TRUE;
      deduct := LEAST(qty_to_deduct, lot.quantity_remaining);

      UPDATE stock_lots
        SET quantity_remaining = quantity_remaining - deduct
        WHERE id = lot.id;

      total_cost    := total_cost + (deduct * lot.cost_price_ars);
      qty_to_deduct := qty_to_deduct - deduct;
    END LOOP;

    -- Si se encontraron lotes: guardar costo promedio ponderado
    IF has_lots THEN
      UPDATE order_items
        SET cost_price = ROUND(total_cost / item.quantity, 2)
        WHERE id = item.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
