-- Segundo batch: 3 perfumes que habían quedado sin cargar del cruce contra la DB real.
-- (Atlantis Extrait ya estaba cubierto en seed_full_catalog_quiz_data.sql, no se repite acá.)
-- Correr primero: SELECT name, brand FROM products WHERE name IN ('Hawas Ice', 'Salvo Elixir', 'Club Black', 'Hawas For Her Gold');

UPDATE products SET
  notes_top    = ARRAY['Manzana', 'Limón Italiano', 'Bergamota Siciliana', 'Anís Estrellado'],
  notes_heart  = ARRAY['Ciruela', 'Flor de Naranjo', 'Cardamomo'],
  notes_base   = ARRAY['Almizcle', 'Ámbar', 'Driftwood', 'Musgo'],
  seasons      = ARRAY['primavera', 'verano']::product_season[],
  occasions    = ARRAY['diario', 'casual']::product_occasion[],
  age_min      = 18,
  age_max      = 40,
  description  = 'Versión más fría y cítrica del Hawas original, lanzada en 2023. Abre con manzana, limón italiano y bergamota siciliana sobre anís estrellado, el corazón de ciruela y flor de naranjo con cardamomo es frutal y aromático, y la base de driftwood y ámbar es suave y fresca. Muy similar al Hawas original pero con apertura más cítrica y menos canela. Para quien quiere el ADN Hawas en versión más veraniega.'
WHERE name = 'Hawas Ice';

UPDATE products SET
  notes_top    = ARRAY['Pimienta', 'Jazmín', 'Nuez de Cardamomo'],
  notes_heart  = ARRAY['Ambroxan', 'Notas Especiadas'],
  notes_base   = ARRAY['Madera de Guayaco', 'Ámbar', 'Almizcle', 'Vetiver', 'Sándalo'],
  seasons      = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions    = ARRAY['noche', 'cita', 'evento', 'formal']::product_occasion[],
  age_min      = 25,
  age_max      = 99,
  description  = 'Alternativa accesible al Dior Sauvage Elixir — 80-85% de similitud según usuarios. Abre con pimienta y cardamomo sobre jazmín, el corazón de ambroxan es el protagonista denso y especiado, y la base de maderas y vetiver es seca y elegante. Más llevadero que el Sauvage Elixir original — menos especiado agresivo. Requiere generosa cantidad de sprays (12-15) para mejor rendimiento.'
WHERE name = 'Salvo Elixir';

UPDATE products SET
  notes_top    = ARRAY['Bergamota'],
  notes_heart  = ARRAY['Jazmín', 'Incienso'],
  notes_base   = ARRAY['Vainilla', 'Benzoin', 'Ambroxan', 'Notas Amaderadas'],
  seasons      = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions    = ARRAY['diario', 'casual', 'oficina', 'cita', 'formal']::product_occasion[],
  age_min      = 20,
  age_max      = 55,
  description  = 'Oriental vainillado amaderado clásico lanzado en 2017. Abre con bergamota luminosa, el corazón de jazmín e incienso es elegante y cálido, y la base de vainilla, benzoin y ambroxan es cremosa, suave y muy larga. Una de las mejores propuestas de vainilla designer accesible. Recibe cumplidos consistentes y funciona bien como layering base. Para clima frío y noches de otoño/invierno.'
WHERE name = 'Club Black';

UPDATE products SET
  notes_top    = ARRAY['Granada', 'Manzana', 'Pomelo'],
  notes_heart  = ARRAY['Iris', 'Jazmín Sambac', 'Cítricos'],
  notes_base   = ARRAY['Praliné', 'Pachulí', 'Vetiver'],
  seasons      = ARRAY['todo_clima', 'primavera', 'verano', 'otono', 'invierno']::product_season[],
  occasions    = ARRAY['diario', 'versatil', 'oficina', 'cita', 'evento']::product_occasion[],
  age_min      = 18,
  age_max      = 40,
  description  = 'Floral frutal gourmand femenina creada por Claire Liégent y Dominique Ropion en 2015. Abre con granada pegajosa, manzana y pomelo fresco, el corazón de jazmín sambac e iris sobre cítricos es floral complejo y refinado, y la base de praliné y pachulí es cálida, dulce y elegante. La "joya escondida" del catálogo Rasasi — supera en calidad a muchas alternativas designer. Duración de 6 a 8 horas con buena proyección.'
WHERE name = 'Hawas For Her Gold';
