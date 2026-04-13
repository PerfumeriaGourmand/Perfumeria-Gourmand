-- Add configurable low stock threshold to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS low_stock_threshold INT NOT NULL DEFAULT 5;
