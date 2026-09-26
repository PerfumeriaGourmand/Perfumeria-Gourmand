-- Compara product_variants.stock contra la suma de quantity_remaining
-- de sus lotes (stock_lots). Muestra solo las variantes donde NO coinciden.
-- Correr manualmente en el SQL Editor de Supabase cuando se sospeche
-- desincronización entre stock y lotes (ej. después de cargas manuales).
SELECT
  p.name,
  p.concentration,
  pv.id AS variant_id,
  pv.size_ml,
  pv.stock AS stock_actual,
  COALESCE(SUM(sl.quantity_remaining), 0) AS suma_lotes,
  pv.stock - COALESCE(SUM(sl.quantity_remaining), 0) AS diferencia
FROM product_variants pv
JOIN products p ON p.id = pv.product_id
LEFT JOIN stock_lots sl ON sl.variant_id = pv.id
GROUP BY p.name, p.concentration, pv.id, pv.size_ml, pv.stock
HAVING pv.stock <> COALESCE(SUM(sl.quantity_remaining), 0)
ORDER BY p.name, pv.size_ml;
