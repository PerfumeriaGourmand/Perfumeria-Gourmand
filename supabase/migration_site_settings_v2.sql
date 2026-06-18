-- Expand site_settings with all fields used by the admin panel
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS store_name          TEXT DEFAULT 'Gourmand',
  ADD COLUMN IF NOT EXISTS store_description   TEXT,
  ADD COLUMN IF NOT EXISTS logo_url            TEXT,
  ADD COLUMN IF NOT EXISTS announcement_text   TEXT,
  ADD COLUMN IF NOT EXISTS announcement_active BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS mp_public_key       TEXT,
  ADD COLUMN IF NOT EXISTS mp_access_token     TEXT,
  ADD COLUMN IF NOT EXISTS instagram_url       TEXT,
  ADD COLUMN IF NOT EXISTS facebook_url        TEXT,
  ADD COLUMN IF NOT EXISTS tiktok_url          TEXT,
  ADD COLUMN IF NOT EXISTS shipping_zones      TEXT,
  ADD COLUMN IF NOT EXISTS low_stock_threshold INT DEFAULT 5,
  ADD COLUMN IF NOT EXISTS current_exchange_rate NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS whatsapp_number     TEXT,
  ADD COLUMN IF NOT EXISTS free_shipping_min   NUMERIC(10,2);
