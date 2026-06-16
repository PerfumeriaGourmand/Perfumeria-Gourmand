ALTER TABLE products
  ADD COLUMN IF NOT EXISTS notes_top    text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS notes_heart  text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS notes_base   text[] DEFAULT '{}';
