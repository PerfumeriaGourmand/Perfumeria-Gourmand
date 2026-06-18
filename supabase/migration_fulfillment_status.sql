-- Track shipping/delivery state separately from payment_status (MercadoPago)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS fulfillment_status TEXT;
