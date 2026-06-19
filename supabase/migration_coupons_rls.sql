-- ============================================================
-- GOURMAND — Migration: coupons (CREATE TABLE + RLS)
-- Ejecutar en Supabase SQL Editor
--
-- La tabla `coupons` ya existe en producción (se usa desde
-- src/app/admin/coupons/page.tsx y src/app/api/coupons/validate/route.ts)
-- pero no tenía ninguna migración versionada en el repo, así que no
-- había forma de confirmar si RLS estaba habilitada.
--
-- Importante: src/app/admin/coupons/CouponsClient.tsx hace INSERT/UPDATE/
-- DELETE directo contra esta tabla usando el cliente del browser (anon key
-- + sesión del usuario admin), NO via service_role. Eso significa que sin
-- estas policies, cualquiera con la anon key (pública por diseño) podría
-- leer o escribir cupones directo contra la API REST de Supabase, sin
-- pasar por el sitio ni por el login de admin.
-- ============================================================

-- 1. Tabla (idempotente — no rompe nada si ya existe con estas columnas)
CREATE TABLE IF NOT EXISTS coupons (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code              TEXT NOT NULL UNIQUE,
  description       TEXT,
  discount_type     TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value    NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_amount  NUMERIC(10,2),
  max_uses          INT,
  current_uses      INT NOT NULL DEFAULT 0,
  expires_at        TIMESTAMPTZ,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- 2. RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read coupons" ON coupons;
CREATE POLICY "Admins can read coupons"
  ON coupons FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can insert coupons" ON coupons;
CREATE POLICY "Admins can insert coupons"
  ON coupons FOR INSERT WITH CHECK (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can update coupons" ON coupons;
CREATE POLICY "Admins can update coupons"
  ON coupons FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

DROP POLICY IF EXISTS "Admins can delete coupons" ON coupons;
CREATE POLICY "Admins can delete coupons"
  ON coupons FOR DELETE USING (auth.jwt() ->> 'role' = 'admin');

-- Nota: la validación pública de un código de cupón (/api/coupons/validate)
-- usa createAdminClient() (SUPABASE_SERVICE_ROLE_KEY), que bypassa RLS por
-- completo — no necesita policy propia. El público nunca debe poder leer
-- la tabla completa, solo validar un código puntual via ese endpoint.

-- ============================================================
-- INSTRUCCIONES PARA EJECUTAR:
-- 1. Abrir Supabase Dashboard → SQL Editor
-- 2. Pegar y ejecutar este archivo completo
-- 3. Si el panel admin de cupones (admin/coupons) deja de poder crear/editar
--    cupones después de correr esto, verificar que tu usuario admin tenga
--    app_metadata.role = "admin" seteado (Authentication → Users → editar
--    el usuario → User App Metadata).
-- ============================================================
