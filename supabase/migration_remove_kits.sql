-- ============================================================
-- GOURMAND — Migración: Eliminar Kits como entidad separada
-- Los kits pasan a ser una categoría de producto más ('kit').
-- ============================================================

-- 1. Agregar 'kit' al enum de categorías de productos
ALTER TYPE product_category ADD VALUE IF NOT EXISTS 'kit';

-- 2. Eliminar FK de order_items.kit_id (conservar columna para datos históricos)
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_kit_id_fkey;

-- 3. Eliminar tablas de kits (en orden por dependencias)
DROP TABLE IF EXISTS kit_items;
DROP TABLE IF EXISTS kits;

-- 4. Eliminar políticas RLS de kits
-- (se eliminan automáticamente al dropear las tablas)
