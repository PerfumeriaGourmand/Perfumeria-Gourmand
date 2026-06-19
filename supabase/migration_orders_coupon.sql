-- ============================================================
-- GOURMAND — Migration: cupones en orders + contador de usos
-- Ejecutar en Supabase SQL Editor
--
-- Bug encontrado: el checkout calculaba el descuento del cupón en el
-- cliente (subtotal - discount_amount) y lo mostraba en pantalla, pero
-- /api/orders nunca recibía ni aplicaba ese descuento — el total real
-- de la orden (y lo que se le cobraba en MercadoPago) era el precio
-- completo, sin descuento. Además coupons.current_uses nunca se
-- incrementaba en ningún lado, así que un cupón con max_uses nunca se
-- agotaba de verdad.
-- ============================================================

-- 1. Guardar qué cupón (si hubo) se aplicó a cada orden
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS coupon_code TEXT,
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0;

-- 2. Función para incrementar el contador de usos de un cupón.
--    Se llama una sola vez, al momento en que la orden pasa a "approved"
--    (no al crearla, para no contar pedidos que nunca se pagan).
CREATE OR REPLACE FUNCTION increment_coupon_usage(p_code TEXT)
RETURNS void AS $$
BEGIN
  IF p_code IS NULL THEN
    RETURN;
  END IF;

  UPDATE coupons
    SET current_uses = current_uses + 1
    WHERE code = p_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
