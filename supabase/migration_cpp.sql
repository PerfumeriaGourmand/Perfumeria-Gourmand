-- ================================================================
-- GOURMAND — Migración: CPP (Costo Promedio Ponderado)
-- Reemplaza sistema FIFO por costo promedio por variante.
-- Preserva todos los datos. No borra tablas ni filas.
-- ================================================================

-- ── 1. Nueva columna en product_variants ────────────────────────
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS average_cost_usd NUMERIC(10,4);

-- ── 2. Backfill: calcular CPP desde historial de lotes ──────────
-- Fórmula: Σ(cost_price_usd × quantity_purchased) / Σ(quantity_purchased)
-- Usa todos los lotes históricos.
UPDATE product_variants pv
SET average_cost_usd = sub.cpp
FROM (
  SELECT
    variant_id,
    ROUND(
      SUM(cost_price_usd * quantity_purchased)::NUMERIC
      / NULLIF(SUM(quantity_purchased), 0),
      4
    ) AS cpp
  FROM stock_lots
  GROUP BY variant_id
) sub
WHERE pv.id = sub.variant_id;

-- ── 3. Verificación ──────────────────────────��───────────────────
SELECT
  p.brand                        AS marca,
  p.name                         AS nombre,
  pv.size_ml,
  pv.stock                       AS stock_actual,
  pv.average_cost_usd            AS cpp_usd,
  COUNT(sl.id)                   AS num_lotes,
  SUM(sl.quantity_purchased)     AS uds_compradas_total,
  (
    SELECT sl2.exchange_rate
    FROM   stock_lots sl2
    WHERE  sl2.variant_id = pv.id
    ORDER  BY sl2.purchase_date DESC, sl2.created_at DESC
    LIMIT  1
  )                              AS tc_ultimo_lote,
  ROUND(
    pv.average_cost_usd * (
      SELECT sl2.exchange_rate
      FROM   stock_lots sl2
      WHERE  sl2.variant_id = pv.id
      ORDER  BY sl2.purchase_date DESC, sl2.created_at DESC
      LIMIT  1
    ), 2
  )                              AS cpp_ars_aprox
FROM product_variants pv
JOIN products p ON p.id = pv.product_id
LEFT JOIN stock_lots sl ON sl.variant_id = pv.id
WHERE pv.average_cost_usd IS NOT NULL
GROUP BY pv.id, p.brand, p.name
ORDER BY p.brand, p.name, pv.size_ml;

-- ── 4. Control de datos históricos en order_items ────────────────
SELECT
  COUNT(*)                              AS total_items,
  COUNT(lot_id)                         AS items_con_lot_id,
  COUNT(cost_price)                     AS items_con_cost_price,
  ROUND(SUM(cost_price * quantity), 2)  AS costo_ars_historico_total
FROM order_items;

-- ================================================================
-- NOTAS:
-- - order_items.lot_id y order_items.cost_price se CONSERVAN
--   como datos históricos del sistema FIFO anterior.
-- - Nuevas ventas tienen cost_price (ARS = average_cost_usd × TC)
--   pero lot_id = NULL (ya no se usan lotes individuales).
-- - stock_lots.quantity_remaining ya no se decrementa en ventas.
--   Sigue siendo válido como historial de compras.
-- - La función SQL apply_fifo_lots_on_order ya no se llama desde
--   el código pero se conserva en la DB sin borrar.
-- ================================================================
