-- Canal/método por el que llegó la venta (Whatsapp, Marketplace, u otro texto libre)
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS payment_channel TEXT;
