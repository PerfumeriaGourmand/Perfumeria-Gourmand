-- ============================================================
-- PRODUCT REVIEWS
-- Reseñas de compradores verificados. Solo puede reseñar quien
-- tenga una orden con payment_status = 'approved' que incluya
-- ese producto — evita reviews falsas sin necesitar moderación.
-- ============================================================

CREATE TABLE IF NOT EXISTS product_reviews (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id    UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  rating        INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (product_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_product_reviews_product ON product_reviews(product_id);

ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read reviews"
  ON product_reviews FOR SELECT USING (true);

-- Solo compradores con una orden aprobada que incluya el producto
CREATE POLICY "Verified buyers can review"
  ON product_reviews FOR INSERT WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      JOIN product_variants pv ON pv.id = oi.variant_id
      WHERE o.user_id = auth.uid()
        AND o.payment_status = 'approved'
        AND pv.product_id = product_reviews.product_id
    )
  );

CREATE POLICY "Users can delete own review"
  ON product_reviews FOR DELETE USING (user_id = auth.uid());
