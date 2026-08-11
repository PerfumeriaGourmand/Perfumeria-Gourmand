-- Occasions: array porque un perfume puede servir para varias situaciones
DO $$
BEGIN
  CREATE TYPE product_occasion AS ENUM (
    'diario', 'oficina', 'noche', 'evento', 'cita', 'deportivo', 'casual', 'formal', 'versatil'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS occasions product_occasion[] NOT NULL DEFAULT '{}';

-- Age range: numérico (min/max) en vez de categorías fijas
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS age_min INT,
  ADD COLUMN IF NOT EXISTS age_max INT;

ALTER TABLE products
  ADD CONSTRAINT products_age_range_check
  CHECK (age_min IS NULL OR age_max IS NULL OR age_min <= age_max);
