-- Completa notas, época, ocasión, edad y descripción para 4 perfumes Afnan ya cargados.
-- Matchea por name (no brand) por el mismo motivo que seed_full_catalog_quiz_data.sql:
-- reduce el riesgo de 0 filas afectadas por inconsistencias en el campo brand.
-- Correr primero: SELECT name, brand FROM products WHERE brand = 'Afnan';

UPDATE products SET
  notes_top    = ARRAY['Limón', 'Menta', 'Grosella Negra', 'Pimienta Rosa'],
  notes_heart  = ARRAY['Manzana', 'Incienso', 'Cedro'],
  notes_base   = ARRAY['Pachulí', 'Jengibre', 'Sándalo', 'Jazmín'],
  seasons      = ARRAY['primavera', 'verano']::product_season[],
  occasions    = ARRAY['diario', 'casual', 'cita', 'oficina']::product_occasion[],
  age_min      = 18,
  age_max      = 35,
  description  = 'Fragancia acuática y fresca que evoca un chapuzón matutino en aguas cristalinas. Abre con cítricos vibrantes y menta, evoluciona hacia un corazón limpio de manzana y cedro, y cierra con una base cálida y amaderada. Comparada frecuentemente con Bleu de Chanel e YSL Y EDP.'
WHERE name = '9am Dive';

UPDATE products SET
  notes_top    = ARRAY['Manzana', 'Canela', 'Lavanda', 'Bergamota'],
  notes_heart  = ARRAY['Muguet', 'Flor de Naranjo'],
  notes_base   = ARRAY['Pachulí', 'Ámbar', 'Vainilla', 'Haba Tonka'],
  seasons      = ARRAY['otono', 'invierno']::product_season[],
  occasions    = ARRAY['noche', 'cita', 'evento']::product_occasion[],
  age_min      = 18,
  age_max      = 30,
  description  = 'Dulce, seductora y adictiva. Considerada el mejor alternativo accesible al Jean Paul Gaultier Ultra Male. Proyección potente y larga duración de 8 a 10 horas. Perfecta para quien quiere dejar huella en una noche de salida.'
WHERE name = '9pm';

UPDATE products SET
  notes_top    = ARRAY['Pitahaya (Fruta del Dragón)', 'Bergamota', 'Coñac', 'Lavanda', 'Manzana'],
  notes_heart  = ARRAY['Caramelo', 'Cardamomo', 'Ante', 'Cedro', 'Mahonial'],
  notes_base   = ARRAY['Haba Tonka', 'Akigalawood', 'Ambrofix', 'Pachulí'],
  seasons      = ARRAY['otono', 'invierno']::product_season[],
  occasions    = ARRAY['noche', 'evento', 'cita']::product_occasion[],
  age_min      = 20,
  age_max      = 35,
  description  = 'Extrait de parfum audaz y moderno para noches que no se olvidan. Abre con una explosión frutal y alcohólica de fruta del dragón y coñac, evoluciona hacia un corazón especiado y aterciopelado, y cierra con una base amaderada premium de larga duración. Proyección nuclear.'
WHERE name = '9pm Night Out';

UPDATE products SET
  notes_top    = ARRAY['Piña', 'Mandarina', 'Manzana Granny Smith'],
  notes_heart  = ARRAY['Cedro', 'Vainilla', 'Musgo de Roble'],
  notes_base   = ARRAY['Caramelo', 'Maderas Secas', 'Ambergris', 'Almizcle'],
  seasons      = ARRAY['otono', 'invierno']::product_season[],
  occasions    = ARRAY['noche', 'casual', 'versatil']::product_occasion[],
  age_min      = 18,
  age_max      = 30,
  description  = 'Frutal, amaderada y adictiva con ADN cercano al Creed Aventus y Baccarat Rouge 540. La apertura de piña fotorrealista es su sello. Evoluciona hacia una base cremosa y cálida con caramelo y maderas secas. Una de las fragancias con mejor relación calidad-precio del mercado.'
WHERE name = '9pm Rebel';
