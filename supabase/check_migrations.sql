-- ============================================================
-- GOURMAND — Verificación de migraciones aplicadas
-- Pegar y correr en Supabase SQL Editor. Cada fila te dice si
-- la migración correspondiente ya corrió (true) o no (false/null).
-- ============================================================

SELECT
  'migration_stock_lots.sql (tabla stock_lots)' AS migracion,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'stock_lots') AS aplicada
UNION ALL
SELECT
  'migration_site_settings_v2.sql (site_settings.store_name)',
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'store_name')
UNION ALL
SELECT
  'migration_cpp.sql (product_variants.average_cost_usd)',
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'product_variants' AND column_name = 'average_cost_usd')
UNION ALL
SELECT
  'migration_olfactory_notes.sql (products.notes_top)',
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'notes_top')
UNION ALL
SELECT
  'migration_remove_kits.sql (tabla kits eliminada)',
  NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'kits')
UNION ALL
SELECT
  'migration_manual_sale.sql (orders.source)',
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'source')
UNION ALL
SELECT
  'migration_fulfillment_status.sql (orders.fulfillment_status)',
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'fulfillment_status')
UNION ALL
SELECT
  'migration_fifo_reactivate.sql / apply_fifo_lots_on_order existe',
  EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'apply_fifo_lots_on_order')
UNION ALL
SELECT
  'migration_audit_fixes.sql / decrement_stock_on_order existe',
  EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'decrement_stock_on_order')
UNION ALL
SELECT
  'migration_coupons_rls.sql (tabla coupons + RLS habilitada)',
  EXISTS (
    SELECT 1 FROM pg_tables
    WHERE tablename = 'coupons' AND rowsecurity = true
  )
UNION ALL
SELECT
  'migration_orders_coupon.sql (orders.coupon_code + increment_coupon_usage)',
  EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'orders' AND column_name = 'coupon_code')
  AND EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'increment_coupon_usage');
