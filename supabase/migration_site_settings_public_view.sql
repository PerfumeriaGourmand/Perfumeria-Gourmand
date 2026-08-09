-- ============================================================
-- GOURMAND — Cierra RLS abierta en site_settings
-- ============================================================
-- La policy "Public can read site settings" (USING (true)) expone TODAS
-- las columnas de site_settings a cualquiera con la anon key, incluyendo
-- mp_access_token (secreto de MercadoPago). RLS es por fila, no por
-- columna, asi que la unica forma de exponer solo las columnas seguras
-- es a traves de una vista.

DROP POLICY IF EXISTS "Public can read site settings" ON site_settings;

CREATE OR REPLACE VIEW site_settings_public AS
SELECT
  id,
  store_name,
  store_description,
  logo_url,
  hero_title,
  hero_subtitle,
  hero_video_url,
  hero_image_url,
  announcement_text,
  announcement_active,
  free_shipping_min,
  shipping_zones,
  whatsapp_number,
  instagram_handle,
  instagram_url,
  facebook_url,
  tiktok_url,
  mp_public_key
FROM site_settings;

GRANT SELECT ON site_settings_public TO anon, authenticated;
