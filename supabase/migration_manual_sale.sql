-- Add source column to orders to distinguish manual vs web sales
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'web';
