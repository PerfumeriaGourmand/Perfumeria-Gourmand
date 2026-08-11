-- ============================================================
-- GOURMAND — Seed de datos de quiz (notas, temporadas, ocasiones, edad, descripción)
-- Completa columnas agregadas en migration_occasion_age.sql y migration_olfactory_notes.sql
-- ============================================================

-- Verificación previa: correr esto primero y confirmar que los 176 nombres existen antes de aplicar los UPDATE de abajo
-- SELECT name, brand FROM products ORDER BY name;

-- Brand: Paco Rabanne
UPDATE products SET
  notes_top = ARRAY['Manzana', 'Davana'],
  notes_heart = ARRAY['Rosa de Damasco', 'Cedro', 'Osmanthus'],
  notes_base = ARRAY['Vainilla Absoluta', 'Haba Tonka', 'Pachulí'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'evento', 'formal']::product_occasion[],
  age_min = 20, age_max = 35,
  description = 'La versión más oscura, rica y seductora de la línea 1 Million. Abre con manzana y davana —nota herbal y frutal única—, evoluciona hacia un corazón floral sofisticado y cierra con una base cremosa de vainilla absoluta y tonka. Parfum Intense de larga duración, ideal para dejar una impresión memorable.'
WHERE name = '1 Million Elixir';

-- Brand: Carolina Herrera
UPDATE products SET
  notes_top = ARRAY['Lavanda Negra', 'Pomelo', 'Enebro'],
  notes_heart = ARRAY['Regaliz Negro', 'Flor de Naranjo', 'Azafrán'],
  notes_base = ARRAY['Vainilla Negra', 'Roble', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'evento']::product_occasion[],
  age_min = 20, age_max = 35,
  description = 'Versión oscura e intensificada del icónico 212 VIP Black. Gourmand ambérica y aromática con un trío de lavanda negra, regaliz negro y vainilla negra. Comparada frecuentemente con 1 Million Elixir pero más fresca y menos pesada. Proyección y duración excepcionales.'
WHERE name = '212 VIP Elixir';

-- Brand: Giorgio Armani
UPDATE products SET
  notes_top = ARRAY['Notas Marinas', 'Aquozone', 'Bergamota', 'Mandarina Verde'],
  notes_heart = ARRAY['Romero', 'Lavanda', 'Ciprés', 'Resina de Lentisco'],
  notes_base = ARRAY['Ámbar Mineral', 'Pachulí', 'Almizcle'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'deportivo', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Interpretación moderna e intensa del icónico Acqua di Giò. Abre con notas marinas profundas y cítricas, evoluciona hacia un corazón aromático herbáceo y cierra con una base mineral oscura. Una de las fragancias masculinas más universales y sin fricciones del mercado.'
WHERE name = 'Acqua Di Gio Profondo';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Manzana Verde', 'Bergamota', 'Mandarina'],
  notes_heart = ARRAY['Cedro', 'Petitgrain', 'Cashmeran', 'Violeta'],
  notes_base = ARRAY['Almizcle', 'Musgo de Roble', 'Amberwood'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Extrait de parfum fresco y aromático inspirado en Greenley de Creed. Abre con una explosión de manzana verde y cítricos vibrantes, evoluciona hacia un corazón amaderado moderno y cierra con una base cálida de musgo y ámbar. Elegante, limpio y con buena duración.'
WHERE name = 'Aether Extrait';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Azafrán', 'Frambuesa'],
  notes_heart = ARRAY['Cuero', 'Pachulí'],
  notes_base = ARRAY['Oud', 'Madera de Guayaco', 'Ámbar', 'Benjuí', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'formal']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Fragancia oriental opulenta con apertura frutal especiada de azafrán y frambuesa que evoluciona hacia un corazón intenso de cuero y pachulí. La base de oud, guayaco y vetiver le da una profundidad oscura y seria. Comparada con Ombre Nomade de Louis Vuitton a una fracción del precio.'
WHERE name = 'Al Qiam Gold';

-- Brand: Parfums de Marly
UPDATE products SET
  notes_top = ARRAY['Flor de Naranjo', 'Bergamota', 'Canela', 'Cardamomo'],
  notes_heart = ARRAY['Vainilla Bourbon de Madagascar', 'Elemi'],
  notes_base = ARRAY['Madera de Guayaco', 'Ambrox', 'Praliné', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 20, age_max = 45,
  description = 'Oda moderna a la vainilla Bourbon de Madagascar. Abre con cítricos brillantes y especias cálidas, el corazón es pura vainilla cremosa y elegante, y la base amaderada le da proyección y duración. Una de las fragancias más aclamadas de Parfums de Marly por su equilibrio entre dulzura y sofisticación.'
WHERE name = 'Althair';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Notas Orientales', 'Licor', 'Vainilla', 'Madera Cachemira'],
  notes_heart = ARRAY['Ámbar', 'Caña de Azúcar', 'Cedro'],
  notes_base = ARRAY['Haba Tonka', 'Sándalo', 'Almizcle', 'Labdanum'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'evento', 'cita']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Oriental amaderado profundo y envolvente lanzado en 2025. Abre con una explosión alcohólica de licor y vainilla cremosa, el corazón es ámbar dorado y cálido, y la base de tonka, sándalo y labdanum es rica y perdurable. Longevidad excepcional de 10 a 12 horas. Para hombres que buscan dejar huella.'
WHERE name = 'Amber Empire';

-- Brand: Al Haramain
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Notas Verdes', 'Mandarina'],
  notes_heart = ARRAY['Melón', 'Piña', 'Ámbar', 'Grosella Negra'],
  notes_base = ARRAY['Almizcle', 'Vainilla', 'Galbanum', 'Petitgrain'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Fragancia fresca y tropical inspirada en la costa de Dubai. Abre con cítricos vibrantes, evoluciona hacia un corazón frutal exótico de melón y piña con ámbar, y cierra con una base cálida y amizclada. Comparada con Louis Vuitton Imagination a una fracción del precio.'
WHERE name = 'Amber Oud Aqua Dubai';

-- Brand: Al Haramain
UPDATE products SET
  notes_top = ARRAY['Azafrán', 'Bergamota', 'Elemi'],
  notes_heart = ARRAY['Oud', 'Rosa Búlgara', 'Muguet'],
  notes_base = ARRAY['Haba Tonka', 'Ámbar', 'Almizcle Blanco', 'Musgo de Roble'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'evento']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Oriental amaderado opulento inspirado en Arabians Tonka de Montale pero más fresco y accesible. Abre con azafrán especiado y bergamota, el corazón es oud suave y rosa búlgara, y la base de tonka y ámbar es envolvente y sedosa. Presencia potente y larga duración.'
WHERE name = 'Amber Oud Dubai Night';

-- Brand: Al Haramain
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Notas Verdes'],
  notes_heart = ARRAY['Melón', 'Piña', 'Notas Gourmand', 'Ámbar'],
  notes_base = ARRAY['Maderas', 'Vainilla', 'Almizcle'],
  seasons = ARRAY['todo_clima', 'primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'evento', 'formal', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Una de las fragancias más icónicas y vendidas de Al Haramain. Abre con cítricos frescos, el corazón es frutal y gourmand con melón y piña bañados en ámbar dorado, y la base cálida de vainilla y almizcle es perdurable. Proyección intensa y duración de 8 a 10 horas. Unisex con tendencia femenina.'
WHERE name = 'Amber Oud Gold';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Notas Amaderadas', 'Oud (Agarwood)'],
  notes_heart = ARRAY['Vainilla', 'Azúcar'],
  notes_base = ARRAY['Oud', 'Sándalo', 'Notas Herbales'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 25, age_max = 50,
  description = 'Gourmand oriental oscuro y ahumado comparado con By the Fireplace de Maison Margiela. Abre con oud denso y ahumado, el corazón dulce de vainilla y azúcar suaviza el humo, y la base regresa al oud con sándalo cremoso. Una de las mejores relaciones calidad-precio en fragancias invernales.'
WHERE name = 'Ameer Al Oudh Intense Oud';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Jengibre', 'Mandarina', 'Pimienta Rosa'],
  notes_heart = ARRAY['Lavanda', 'Praliné', 'Cacao', 'Jazmín'],
  notes_base = ARRAY['Vainilla', 'Ámbar', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'noche', 'cita', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Oriental vainillada inspirada en Burberry Goddess. Su nombre significa "melodías" en árabe. Abre con cítricos especiados, el corazón es una combinación gourmand de lavanda, praliné y cacao, y la base de vainilla y ámbar es suave y envolvente. Elegante, accesible y muy bien recibida.'
WHERE name = 'Angham';

-- Brand: Montale
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Azafrán'],
  notes_heart = ARRAY['Rosa Búlgara', 'Oud'],
  notes_base = ARRAY['Haba Tonka', 'Caña de Azúcar', 'Ámbar', 'Almizcle Blanco', 'Musgo de Roble'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'evento']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Una de las fragancias más icónicas de Montale, inspirada en los caballos árabes y la perfumería oriental. Audaz, especiada y sensual con azafrán y rosa búlgara sobre una base dulce y ahumada de tonka y ámbar. Proyección nuclear y longevidad superior a 9 horas. Tiene decenas de alternativas más económicas — entre ellas el Amber Oud Dubai Night del mismo catálogo.'
WHERE name = 'Arabians Tonka';

-- Brand: Lattafa Pride
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Menta'],
  notes_heart = ARRAY['Té Negro', 'Jengibre', 'Lavanda'],
  notes_base = ARRAY['Ambroxan', 'Incienso', 'Canela'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual', 'formal', 'versatil']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Alternativa accesible a Louis Vuitton Imagination. Abre con bergamota fresca y menta vibrante, el corazón de té negro y lavanda le da profundidad aromática, y la base de ambroxan e incienso es limpia y duradera. Fresca, moderna y apta para casi cualquier contexto.'
WHERE name = 'Art Of Arabia I';

-- Brand: Lattafa Pride
UPDATE products SET
  notes_top = ARRAY['Cardamomo', 'Heliotropo', 'Bergamota', 'Pimienta Rosa'],
  notes_heart = ARRAY['Almendra', 'Lavanda', 'Jazmín'],
  notes_base = ARRAY['Vainilla', 'Madera de Guayaco', 'Oud', 'Sándalo'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'formal']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'La más compleja y polarizante de la trilogía. Abre con especias y heliotropo, el corazón es floral-amaderado con almendra cremosa, y la base de oud y sándalo le da carácter oriental. Requiere paciencia — mejora notablemente con el tiempo en la piel.'
WHERE name = 'Art of Arabia II';

-- Brand: Lattafa Pride
UPDATE products SET
  notes_top = ARRAY['Olíbano', 'Davana', 'Bergamota'],
  notes_heart = ARRAY['Dátiles', 'Tabaco', 'Sándalo', 'Tuberosa'],
  notes_base = ARRAY['Mirra', 'Vainilla', 'Haba Tonka', 'Labdanum', 'Pachulí'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual', 'formal']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'La joya de la colección. Abre con incienso resinoso y davana frutal-herbal, el corazón de dátiles y tabaco es opulento y gourmand, y la base de tonka, mirra y labdanum es profunda y persistente. Para quienes aman los orientales oscuros y dulces.'
WHERE name = 'Art of Arabia III';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Pimienta Negra', 'Tabaco', 'Piña'],
  notes_heart = ARRAY['Pachulí', 'Café', 'Iris'],
  notes_base = ARRAY['Vainilla', 'Ámbar', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Alternativa accesible a Dior Sauvage Elixir. Abre con pimienta negra y piña, el corazón de café e iris agrega profundidad, y la base de vainilla y ámbar es cálida y envolvente. Excelente relación calidad-precio para quien busca ese ADN especiado-dulce.'
WHERE name = 'Asad';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Pimienta Rosa', 'Lavanda', 'Ciruela Mirabelle'],
  notes_heart = ARRAY['Cacao', 'Davana', 'Nuez Moscada'],
  notes_base = ARRAY['Vetiver', 'Vainilla Bourbon', 'Ámbar'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'La versión más cálida y gourmand de la familia Asad. Abre con lavanda aromática y ciruela frutal, el corazón de cacao amargo y nuez moscada es sofisticado, y la base de vainilla bourbon y vetiver es suave, terrosa y cremosa. Perfecta para días fríos en la oficina o salidas casuales.'
WHERE name = 'Asad Bourbon';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Pimienta Rosa', 'Azafrán', 'Pomelo'],
  notes_heart = ARRAY['Tabaco', 'Cedro', 'Vainilla'],
  notes_base = ARRAY['Ámbar Ligero', 'Incienso', 'Pachulí', 'Cashmeran'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'formal']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'La versión más oscura y concentrada de la familia Asad. Abre con azafrán especiado y pomelo fresco, el corazón de tabaco y cedro es fumado y masculino, y la base resinosa de incienso y cashmeran es profunda y larga. Para quienes prefieren fragancias complejas con carácter.'
WHERE name = 'Asad Elixir';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Lavanda', 'Pimienta Negra'],
  notes_heart = ARRAY['Agua de Coco', 'Iris', 'Sal'],
  notes_base = ARRAY['Vainilla', 'Incienso'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'El miembro más fresco e inesperado de la familia Asad. Abre con pimienta negra y lavanda aromática, el corazón tropical-mineral de agua de coco salada e iris es único, y la base de vainilla seca con incienso cierra con elegancia. Perfecta para verano.'
WHERE name = 'Asad Zanzibar';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Notas Marinas', 'Sal', 'Limón'],
  notes_heart = ARRAY['Davana', 'Iris'],
  notes_base = ARRAY['Ambergris', 'Musgo de Roble', 'Sándalo'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Fragancia acuática y salina inspirada en el océano. Comparada con Megamare de Orto Parisi. Abre con una explosión marina de sal y limón, el corazón de davana e iris le da un toque floral aromático, y la base de ambergris y sándalo es cálida y perdurable. Única en su estilo — no es para todos, pero quienes la aman la adoran.'
WHERE name = 'Atlas';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Cítricos', 'Naranja'],
  notes_heart = ARRAY['Jazmín', 'Rosa', 'Muguet'],
  notes_base = ARRAY['Almizcle Blanco'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Floral cítrica luminosa y positiva. Abre con naranjas dulces y cítricos vibrantes, el corazón es un bouquet de jazmín, rosa y muguet delicado y bien equilibrado, y la base de almizcle blanco es limpia y suave. Femenina, fresca y muy fácil de llevar.'
WHERE name = 'Azeezah';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Naranja', 'Mandarina', 'Limón'],
  notes_heart = ARRAY['Sandía', 'Coco'],
  notes_base = ARRAY['Cacao', 'Ambergris', 'Amberwood'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Cítrica tropical gourmand densa y única, lanzada en 2025. Abre con naranja, mandarina y limón brillantes, el corazón de sandía y coco es el protagonista absoluto — jugoso, cremoso y tropical, y la base de cacao y ambergris le da profundidad y calidez inesperada. No es una fragancia fresca ligera — es densa y siruposa. Para quien ama los frutales tropicales con carácter. Unisex.'
WHERE name = 'Atlantis Extrait';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Fruta de la Pasión', 'Notas Frutales', 'Rosa', 'Azafrán'],
  notes_heart = ARRAY['Oud', 'Pachulí', 'Benjuí'],
  notes_base = ARRAY['Cuero', 'Ámbar', 'Vainilla', 'Labdanum', 'Madera de Guayaco'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'formal']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Oriental frutado-cuero lanzado en 2024. Abre con fruta de la pasión exótica y azafrán especiado, el corazón de oud y benjuí es resinoso y profundo, y la base de cuero, labdanum y vainilla es oscura y envolvente. Larga duración de hasta 12 horas. Para quienes aprecian el oud con carácter sin perder sofisticación.'
WHERE name = 'Azzure Oud';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Pimienta Rosa'],
  notes_heart = ARRAY['Rosa Turca', 'Rosa Búlgara', 'Jazmín'],
  notes_base = ARRAY['Oud', 'Vainilla', 'Ámbar'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'noche', 'cita', 'versatil']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Floral oriental equilibrado y accesible. Abre con bergamota fresca y pimienta rosa, el corazón es un bouquet de rosas turcas y búlgaras con jazmín, y la base de oud, vainilla y ámbar lo ancla con calidez. Unisex con tendencia femenina. Una de las fragancias más versátiles y bien recibidas de la línea Badee al Oud.'
WHERE name = 'Badee al Oud Amethyst';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Piña', 'Crème Brûlée'],
  notes_heart = ARRAY['Canela', 'Cúrcuma', 'Pimienta Negra', 'Benjuí'],
  notes_base = ARRAY['Vainilla', 'Sándalo', 'Cashmeran', 'Musgo'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Gourmand especiado adictivo. Abre con piña jugosa y crème brûlée caramelizado, el corazón especiado de canela y cúrcuma le da carácter, y la base de vainilla y cashmeran es cremosa y duradera. Comparada con JPG Scandal DNA. Una de las fragancias con más cumplidos de todo el catálogo Lattafa.'
WHERE name = 'Badee al Oud Honor and Glory';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Leche de Rosa'],
  notes_heart = ARRAY['Merengue', 'Almendra'],
  notes_base = ARRAY['Sándalo', 'Vainilla', 'Almizcle'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual']::product_occasion[],
  age_min = 18, age_max = 30,
  description = 'Gourmand floral cremoso y dulce, diseñado para mujer. Abre con leche de rosa delicada y romántica, el corazón de merengue y almendra es suave y gourmand, y la base de sándalo, vainilla y almizcle es aterciopelada y duradera. Elegante sin ser pesada, perfecta para el día a día.'
WHERE name = 'Badee Al Oud Noble Blush';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Azafrán', 'Nuez Moscada', 'Lavanda'],
  notes_heart = ARRAY['Oud', 'Pachulí'],
  notes_base = ARRAY['Oud', 'Pachulí', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 25, age_max = 50,
  description = 'Oriental amaderado ahumado con oud como protagonista absoluto. Abre con azafrán especiado y lavanda aromática, el corazón es oud puro con pachulí terroso, y la base repite esas notas con almizcle suave. Comparada con fragancias de Initio. No es para todos — apunta a quienes ya aman el oud auténtico.'
WHERE name = 'Badee al Oud Oud for Glory';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Manzana', 'Lichi', 'Rosa'],
  notes_heart = ARRAY['Ciruela', 'Jazmín'],
  notes_base = ARRAY['Vainilla', 'Musgo', 'Pachulí'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'noche', 'cita', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Frutal floral moderno y equilibrado. Abre con manzana crujiente y lichi jugoso sobre rosa, el corazón de ciruela y jazmín es suave y romántico, y la base de musgo y pachulí le da profundidad terrosa. Comparada con Kayali Eden Juicy Apple pero más duradera. Una de las fragancias más versátiles y fáciles de llevar del catálogo.'
WHERE name = 'Badee al Oud Sublime';

-- Brand: Bharara
UPDATE products SET
  notes_top = ARRAY['Naranja', 'Bergamota', 'Limón'],
  notes_heart = ARRAY['Notas Frutales (Tuttifrutti)'],
  notes_base = ARRAY['Almizcle Blanco', 'Ámbar', 'Vainilla'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Fragancia cítrica frutal moderna y accesible. Abre con una explosión de naranja, bergamota y limón, el corazón es frutal cremoso y tropical, y la base de almizcle blanco, ámbar y vainilla es suave y envolvente. Alta concentración de aceite (30%), larga duración y gran proyección. Ideal para quien busca frescura con carácter.'
WHERE name = 'Bharara King';

-- Brand: Valentino
UPDATE products SET
  notes_top = ARRAY['Vainilla Bourbon', 'Jengibre', 'Bergamota'],
  notes_heart = ARRAY['Lavandín', 'Nuez Moscada', 'Acorde Salado'],
  notes_base = ARRAY['Vetiver Ahumado', 'Cedro', 'Pachulí'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'casual', 'cita', 'evento']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'La versión más oscura y seductora del Born in Roma original. La vainilla bourbon es la protagonista —intensa, cremosa y sin ser dulzona— elevada por jengibre especiado y lavandín aromático. La base de vetiver ahumado le da una profundidad masculina y elegante. Proyección notable y duración de 7 a 8 horas. Recibe muchos cumplidos.'
WHERE name = 'Born In Roma Intense';

-- Brand: Hugo Boss
UPDATE products SET
  notes_top = ARRAY['Incienso', 'Cardamomo'],
  notes_heart = ARRAY['Vetiver', 'Pachulí'],
  notes_base = ARRAY['Cedro', 'Labdanum'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'evento', 'formal']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Reinterpretación oscura y concentrada del icónico Boss Bottled, lanzada en 2023. Abre con incienso vibrante y cardamomo especiado, el corazón de vetiver y pachulí es terroso y profundo, y la base de cedro y labdanum es amaderada y elegante. Comparada frecuentemente con Dior Sauvage Elixir. Duración de 7 a 8 horas con buena proyección. Para hombres que buscan un perfume oscuro y sofisticado con carácter.'
WHERE name = 'Boss Bottled Elixir Parfum Intense';

-- Brand: Mancera
UPDATE products SET
  notes_top = ARRAY['Limón Siciliano', 'Bergamota', 'Grosella Negra', 'Especias'],
  notes_heart = ARRAY['Notas Frutales', 'Hojas de Pachulí', 'Jazmín Acuático'],
  notes_base = ARRAY['Cedro', 'Cuero', 'Sándalo', 'Vainilla', 'Almizcle Blanco', 'Musgo'],
  seasons = ARRAY['todo_clima', 'primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual', 'formal', 'versatil']::product_occasion[],
  age_min = 20, age_max = 45,
  description = 'Una de las fragancias nicho más icónicas y vendidas del mundo. Abre con una explosión cítrica de limón siciliano y grosella negra, el corazón es frutal-herbáceo con pachulí y jazmín, y la base de cedro, cuero y vainilla es suave y persistente. Duración excepcional de 8 a 10 horas. Frecuentemente comparada con Creed Aventus pero con mayor versatilidad estacional.'
WHERE name = 'Cedrat Boise';

-- Brand: Carolina Herrera
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Pomelo', 'Hierba'],
  notes_heart = ARRAY['Azafrán', 'Nuez Moscada', 'Violeta', 'Jazmín', 'Notas Amaderadas'],
  notes_base = ARRAY['Ámbar', 'Vainilla', 'Cuero', 'Gamuza', 'Sándalo', 'Musgo de Roble', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['oficina', 'noche', 'cita', 'formal', 'versatil']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Cuero especiado moderno y sofisticado. Abre con cítricos luminosos y hierba fresca, el corazón de azafrán y nuez moscada le da carácter oriental, y la base de cuero, ámbar y gamuza es cálida y masculina. Versátil y elegante, deja cumplidos en múltiples contextos.'
WHERE name = 'CH Men';

-- Brand: Calvin Klein
UPDATE products SET
  notes_top = ARRAY['Lavanda', 'Notas Verdes', 'Bergamota', 'Menta', 'Enebro', 'Mandarina'],
  notes_heart = ARRAY['Hierba Verde', 'Jazmín', 'Durazno', 'Freesia', 'Magnolia', 'Orquídea'],
  notes_base = ARRAY['Almizcle', 'Sándalo', 'Cedro', 'Vainilla', 'Ámbar', 'Opopónax'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Clásico unisex de 1996, limpio, fresco y sin pretensiones. Abre con lavanda, menta y notas verdes, el corazón floral-frutal es suave y fácil de llevar, y la base amizclada es cálida y discreta. Su longevidad es limitada — hay que reaplicar. Perfecto para quienes buscan algo fresco, inofensivo y accesible.'
WHERE name = 'CK Be';

-- Brand: Calvin Klein
UPDATE products SET
  notes_top = ARRAY['Limón', 'Notas Verdes', 'Bergamota', 'Mandarina', 'Papaya', 'Piña', 'Cardamomo'],
  notes_heart = ARRAY['Freesia', 'Jazmín', 'Muguet', 'Nuez Moscada', 'Raíz de Orris', 'Rosa', 'Violeta'],
  notes_base = ARRAY['Ámbar', 'Cedro', 'Notas Verdes', 'Almizcle', 'Musgo de Roble', 'Sándalo', 'Té'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'El perfume unisex más icónico de los años 90, pionero del género. Abre con cítricos tropicales y cardamomo, el corazón floral es delicado y limpio, y la base de té y musgo es discreta. Fresco, moderno incluso hoy, y universalmente agradable. Longevidad moderada de 4 a 6 horas.'
WHERE name = 'CK One';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Pomelo', 'Limón', 'Menta', 'Pimienta Rosa', 'Cilantro'],
  notes_heart = ARRAY['Jengibre', 'Melón', 'Jazmín', 'Nuez Moscada'],
  notes_base = ARRAY['Incienso', 'Ámbar', 'Cedro', 'Sándalo', 'Pachulí', 'Labdanum', 'Notas Amaderadas'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'casual', 'formal']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Fresco cítrico-especiado con profundidad amaderada. Abre con pomelo y limón brillantes sobre menta y pimienta, el corazón de jengibre y melón es cálido y frutal, y la base resinosa de incienso y cedro le da carácter. Comparada con Versace Dylan Blue.'
WHERE name = 'Club de Nuit Iconic';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Limón', 'Piña', 'Bergamota', 'Grosella Negra', 'Manzana'],
  notes_heart = ARRAY['Abedul', 'Jazmín', 'Rosa'],
  notes_base = ARRAY['Almizcle', 'Ambergris', 'Pachulí', 'Vainilla'],
  seasons = ARRAY['todo_clima', 'otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'noche', 'evento', 'formal']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'La alternativa más famosa y vendida de Creed Aventus. Abre con piña y grosella negra frutal y ahumada, el corazón de abedul le da un toque fumado característico, y la base de ambergris y pachulí es cálida y duradera. Proyección y duración extraordinarias. Una de las mejores relaciones calidad-precio del mercado.'
WHERE name = 'Club de Nuit Intense';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Frutas Rojas', 'Acordes Marinos'],
  notes_heart = ARRAY['Violeta', 'Sándalo', 'Madera Blanca'],
  notes_base = ARRAY['Vetiver', 'Almizcle', 'Ambroxan'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Alternativa marina-frutal al Creed Millésime Impérial. Abre con bergamota, frutas rojas y acordes oceánicos salinos, el corazón amaderado-floral es limpio y elegante, y la base de ambroxan y almizcle es suave y persistente. Fresca, moderna y con mejor rendimiento que el original que inspira.'
WHERE name = 'Club de Nuit Milestone';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Piña', 'Limón', 'Bergamota', 'Caramelo', 'Pimienta Rosa', 'Pera', 'Pimienta Negra'],
  notes_heart = ARRAY['Musgo de Roble', 'Madera Blanca', 'Jazmín', 'Muguet', 'Anís'],
  notes_base = ARRAY['Ambroxan', 'Almizcle Blanco', 'Cedro', 'Pachulí', 'Ámbar', 'Cuero', 'Vainilla'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'casual', 'formal']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'La versión más refinada y premium del ADN Aventus en la línea Armaf. Abre con piña y limón sobre caramelo, el corazón es complejo con musgo de roble y anís, y la base de ambroxan, cuero y vainilla es elegante y duradera. Más suave y sofisticada que el CDNI original.'
WHERE name = 'Club de Nuit Precieux I';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Limón', 'Lima', 'Grosella Negra', 'Hoja de Violeta', 'Jengibre'],
  notes_heart = ARRAY['Rosa', 'Iris', 'Jazmín'],
  notes_base = ARRAY['Ambroxan', 'Almizcle', 'Sándalo', 'Cedro'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'noche', 'cita', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Cítrico floral elegante y moderno con ADN Creed. Abre con una explosión cítrica-metálica de bergamota y grosella negra, el corazón floral de rosa e iris es refinado, y la base de ambroxan y sándalo es limpia y persistente. Duración de 8 a 10 horas. Una de las fragancias más versátiles y bien valoradas de la colección.'
WHERE name = 'Club de Nuit Sillage';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Azafrán', 'Jazmín'],
  notes_heart = ARRAY['Amberwood', 'Ambergris'],
  notes_base = ARRAY['Resina de Abeto', 'Cedro'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'formal']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Oriental amaderado oscuro y minimalista. Abre con azafrán especiado y jazmín, el corazón es ámbar profundo y ambergris, y la base de resina de abeto y cedro es resinosa y fumada. La más oscura y seria de la colección. Para quienes buscan algo diferente al ADN frutal del resto de la línea.'
WHERE name = 'Club de Nuit Untold';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Pimienta Rosa', 'Flor de Naranjo', 'Jazmín'],
  notes_heart = ARRAY['Lavanda', 'Tagetes', 'Geranio', 'Vetiver', 'Elemi', 'Azafrán'],
  notes_base = ARRAY['Ambroxan', 'Ámbar', 'Pachulí', 'Cedro', 'Labdanum'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'casual', 'formal']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Aromático amaderado moderno comparado con Prada Luna Rossa Carbon y Dior Sauvage. Abre con bergamota y pimienta rosa vibrantes, el corazón de lavanda y azafrán es aromático y masculino, y la base de ambroxan y cedro es cálida y duradera. Proyección notable, duración todo el día. Un all-rounder perfecto para cualquier contexto.'
WHERE name = 'Club de Nuit Urban Man Elixir';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Canela', 'Azafrán', 'Nuez Moscada', 'Cardamomo', 'Pimienta Rosa', 'Jengibre'],
  notes_heart = ARRAY['Oud', 'Dátiles', 'Mirra', 'Incienso', 'Caramelo', 'Amberwood', 'Davana'],
  notes_base = ARRAY['Cuero', 'Vainilla de Madagascar', 'Manteca de Cacao', 'Benjuí', 'Haba Tonka', 'Labdanum', 'Pachulí', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'evento']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Oriental amaderado gourmand oscuro y opulento lanzado en 2024. Abre con una explosión de especias orientales — azafrán, canela y cardamomo — el corazón de dátiles, oud y caramelo es profundo y adictivo, y la base de manteca de cacao, vainilla y cuero es sensual y larga. Duración excepcional de hasta 12 horas.'
WHERE name = 'Cocoa Morado';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Durazno', 'Fruta de la Pasión', 'Pera', 'Frambuesa', 'Cassis'],
  notes_heart = ARRAY['Muguet'],
  notes_base = ARRAY['Almizcle', 'Vainilla', 'Sándalo', 'Pachulí', 'Heliotropo'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Frutal tropical chypre unisex inspirado en Kirke de Tiziana Terenzi. Abre con una explosión de durazno, pera y fruta de la pasión, el corazón de muguet es delicado y floral, y la base de vainilla y sándalo es cálida y cremosa. Duración de 10 a 12 horas. Una de las mejores alternativas accesibles de fragancias frutales premium.'
WHERE name = 'Confidential Gold';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Cítricos', 'Bergamota', 'Ciprés', 'Pimienta Negra'],
  notes_heart = ARRAY['Notas Marinas', 'Notas Amaderadas', 'Olíbano'],
  notes_base = ARRAY['Almizcle', 'Ambergris', 'Labdanum', 'Musgo'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Fresca cítrica-amaderada comparada con Chanel Allure Homme Sport. Abre con bergamota y pimienta negra, el corazón marino y amaderado es limpio y elegante, y la base de ambergris y labdanum es suave y duradera. Perfecta para verano, gimnasio y oficina en clima cálido.'
WHERE name = 'Confidential Platinum';

-- Brand: Al Haramain
UPDATE products SET
  notes_top = ARRAY['Manzana', 'Lavanda', 'Jazmín', 'Violeta'],
  notes_heart = ARRAY['Vainilla', 'Pachulí', 'Bergamota', 'Mandarina'],
  notes_base = ARRAY['Sándalo', 'Cardamomo', 'Pimienta', 'Madera de Guayaco', 'Geranio'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'noche', 'cita', 'versatil']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Oriental especiado moderno y accesible. Abre con manzana frutal y lavanda aromática, el corazón de vainilla y pachulí es cálido y sensual, y la base de sándalo y cardamomo es elegante y duradera. Fácil de llevar y bien recibida.'
WHERE name = 'Detour Noir';

-- Brand: Al Haramain
UPDATE products SET
  notes_top = ARRAY['Almendra', 'Mandarina', 'Notas Acuáticas', 'Bergamota'],
  notes_heart = ARRAY['Civeta', 'Geranio', 'Rosa', 'Lirio de Agua', 'Gardenia'],
  notes_base = ARRAY['Oud Laosiano', 'Madera de Guayaco', 'Vainilla', 'Sándalo', 'Pachulí Indonesio', 'Café', 'Ámbar', 'Musgo de Roble', 'Pimienta Rosa'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'evento', 'formal']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Oriental amaderado intenso y animalic, comparado con Layton Exclusif de Parfums de Marly. Abre con almendra y bergamota elegante, el corazón floral con civeta le da un carácter oscuro y seductor, y la base de oud laosiano, café y musgo de roble es profunda y larga. Ultramasculina y de nicho accesible.'
WHERE name = 'Detour Noir Exclusif';

-- Brand: Dolce & Gabbana
UPDATE products SET
  notes_top = ARRAY['Limón Confitado'],
  notes_heart = ARRAY['Flor de Naranjo', 'Pannacotta', 'Ron'],
  notes_base = ARRAY['Vainilla'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Gourmand floral inspirado en el panettone italiano. Abre con limón confitado brillante y festivo, el corazón de flor de naranjo y pannacotta cremosa es suave y adictivo, y la base de vainilla es cálida y envolvente. Versátil en todas las estaciones, muy fácil de llevar y con excelente duración.'
WHERE name = 'Devotion';

-- Brand: Dolce & Gabbana
UPDATE products SET
  notes_top = ARRAY['Avellana'],
  notes_heart = ARRAY['Flor de Naranjo'],
  notes_base = ARRAY['Vainilla'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Versión más concentrada y rica de Devotion. La avellana tostada reemplaza el limón confitado en la apertura, dándole un carácter más gourmand y profundo. El corazón de flor de naranjo es más cremoso y la base de vainilla más intensa. Ideal para quien quiere la firma Devotion con más proyección y duración.'
WHERE name = 'Devotion EDP Intense';

-- Brand: Jean Paul Gaultier
UPDATE products SET
  notes_top = ARRAY['Notas Solares', 'Lirio', 'Bergamota'],
  notes_heart = ARRAY['Frangipani', 'Sal Marina'],
  notes_base = ARRAY['Ámbar', 'Benjuí'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'noche', 'evento', 'versatil']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Versión más intensa e irresistible de la colección Divine. Abre con notas solares luminosas y lirio, el corazón de frangipani tropical y sal marina es sensual y único, y la base de ámbar y benjuí es cálida y duradera. Comparada con la EDP original pero con más profundidad y proyección. Icónica botella de corsé dorado recargable.'
WHERE name = 'Divine Le parfum';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Limón', 'Bergamota', 'Pomelo', 'Resina de Elemi'],
  notes_heart = ARRAY['Jengibre', 'Cedro', 'Vetiver'],
  notes_base = ARRAY['Lavanda', 'Romero', 'Sándalo'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'deportivo', 'casual', 'versatil']::product_occasion[],
  age_min = 25, age_max = 50,
  description = 'Fresca cítrica-amaderada comparada con Dior Homme Sport. Abre con bergamota, limón y pomelo vibrantes con un toque resinoso de elemi, el corazón de jengibre y cedro es estructurado y masculino, y la base herbácea de lavanda y sándalo es limpia y elegante. Duración de 4 a 6 horas. Perfecta para el uso diario en clima cálido sin abrumar.'
WHERE name = 'Dark Door Sport';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Caramelo', 'Leche', 'Azúcar'],
  notes_heart = ARRAY['Miel', 'Flores Blancas'],
  notes_base = ARRAY['Vainilla', 'Praliné', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual']::product_occasion[],
  age_min = 18, age_max = 30,
  description = 'Gourmand cremoso y adictivo inspirado en el éclair francés. Abre con caramelo y leche dulce, el corazón de miel y flores blancas le da calidez floral suave, y la base de vainilla y praliné es aterciopelada y duradera. Comparada con Bianco Latte de Giardino Benessere. Femenina sin ser abrumadora.'
WHERE name = 'Eclaire';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Crema de Banana', 'Dulce de Leche'],
  notes_heart = ARRAY['Crema Chantilly', 'Vainilla'],
  notes_base = ARRAY['Praliné', 'Galleta', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 30,
  description = 'Gourmand inspirado en el banoffee pie —postre inglés de banana y toffee. Abre con banana cremosa y dulce de leche intenso, el corazón de crema chantilly y vainilla es suave y envolvente, y la base de praliné y galleta es confortante y dulce. La versión más duradera de la trilogía Eclaire.'
WHERE name = 'Eclaire Banoffi';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Crema de Pistacho', 'Pistacho Tostado'],
  notes_heart = ARRAY['Coco', 'Cacao', 'Crema Chantilly'],
  notes_base = ARRAY['Vainilla', 'Leche', 'Almizcle'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Gourmand cremoso centrado en el pistacho. Abre con pistacho tostado fotorrealista, el corazón de coco y cacao con crema chantilly es suave y exótico, y la base de vainilla y leche es delicada y envolvente. La más moderada y versátil de la trilogía, perfecta como fragancia cotidiana.'
WHERE name = 'Eclaire Pistache';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Limón', 'Bergamota', 'Salvia Clara', 'Bayas de Enebro'],
  notes_heart = ARRAY['Té Blanco', 'Sándalo', 'Cardamomo', 'Olíbano'],
  notes_base = ARRAY['Ambergris', 'Cedro', 'Cashmeran', 'Pachulí'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'versatil']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Aromático amaderado fresco y elegante. Abre con cítricos brillantes y bayas de enebro, el corazón de té blanco y cardamomo es limpio y refinado, y la base de ambergris y cashmeran es suave y persistente. Masculino sin ser abrumador, ideal para ambientes profesionales.'
WHERE name = 'Emeer';

-- Brand: Xerjoff
UPDATE products SET
  notes_top = ARRAY['Limón de Amalfi', 'Bergamota Calabresa', 'Naranja Brasileña', 'Jengibre'],
  notes_heart = ARRAY['Manzana Verde', 'Melón', 'Pera', 'Clavos', 'Cardamomo de Guatemala', 'Canela de Madagascar'],
  notes_base = ARRAY['Almizcle', 'Ámbar', 'Vainilla de Madagascar', 'Notas Amaderadas'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Primo más sofisticado de Erba Pura. Abre con cítricos mediterráneos brillantes y jengibre, el corazón de melón, pera y manzana verde es jugoso y tropical con un toque especiado, y la base de almizcle y vainilla de Madagascar es cremosa y duradera. Más complejo y dorado que Erba Pura, con mejor equilibrio cítrico-frutal.'
WHERE name = 'Erba Gold';

-- Brand: Xerjoff
UPDATE products SET
  notes_top = ARRAY['Naranja Siciliana', 'Bergamota Calabresa', 'Limón Siciliano'],
  notes_heart = ARRAY['Frutas Mediterráneas'],
  notes_base = ARRAY['Almizcle Blanco', 'Vainilla de Madagascar', 'Ámbar'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'noche', 'formal', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Una de las fragancias nicho más aclamadas del mundo. Abre con una explosión de cítricos mediterráneos brillantes y jugosos, el corazón frutal es candied y adictivo gracias a una molécula exclusiva "PURA", y la base de almizcle blanco y vainilla de Madagascar es sedosa y duradera. Proyección extraordinaria de 8 a 12 horas. Un "compliment monster" universal que alegra a quien lo huele.'
WHERE name = 'Erba Pura';

-- Brand: Versace
UPDATE products SET
  notes_top = ARRAY['Menta', 'Manzana Candy', 'Limón', 'Mandarina'],
  notes_heart = ARRAY['Ambroxan', 'Salvia Clara', 'Geranio'],
  notes_base = ARRAY['Vainilla', 'Cedro', 'Sándalo', 'Pachulí', 'Naranja Amarga', 'Cuero'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'noche', 'cita', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Versión más madura y amaderada del Eros EDT. Abre con menta fresca y manzana candy, el corazón de ambroxan y salvia le da un carácter más acuático y moderno, y la base de vainilla y maderas es cálida y envolvente. Más versátil estacionalmente que el EDT, con menos dulzura y más profundidad.'
WHERE name = 'Eros EDP';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Manzana', 'Bergamota', 'Jengibre'],
  notes_heart = ARRAY['Lavanda', 'Salvia', 'Bayas de Enebro', 'Geranio'],
  notes_base = ARRAY['Haba Tonka', 'Amberwood', 'Cedro', 'Vetiver'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual', 'formal']::product_occasion[],
  age_min = 20, age_max = 50,
  description = 'Alternativa accesible al YSL Y EDP. Abre con manzana fresca y bergamota, el corazón aromático de lavanda y salvia es limpio y masculino, y la base de tonka y amberwood es cálida y seca. Lineal y versátil. Longevidad moderada de 4 horas — hay que reaplicar.'
WHERE name = 'Fakhar Black';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Tuberosa', 'Sal'],
  notes_heart = ARRAY['Ámbar', 'Haba Tonka', 'Cashmeran'],
  notes_base = ARRAY['Cedro', 'Vetiver', 'Labdanum'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'evento']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Oriental amaderado salino y moderno. La tuberosa salada en la apertura es única e inesperada, el corazón de ámbar y cashmeran es cálido y sedoso, y la base de cedro y vetiver es terrosa y elegante. Para paladares que aprecian fragancias menos convencionales.'
WHERE name = 'Fakhar Gold';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Pimienta Rosa', 'Cardamomo'],
  notes_heart = ARRAY['Guayaba', 'Lavanda', 'Jengibre'],
  notes_base = ARRAY['Incienso', 'Palo Santo', 'Sándalo'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 20, age_max = 50,
  description = 'Aromático fougère frutal comparado con YSL Y Elixir. Abre con bergamota y cardamomo especiado, el corazón de guayaba exótica y lavanda es fresco e inesperado, y la base de palo santo e incienso le da profundidad ahumada. Moderno, masculino y bien diferenciado del resto de la línea Fakhar.'
WHERE name = 'Fakhar Platin';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Almendra Amarga', 'Cereza Negra', 'Licor de Cereza'],
  notes_heart = ARRAY['Cereza Ácida', 'Ciruela', 'Rosa Turca', 'Jazmín Sambac'],
  notes_base = ARRAY['Vainilla', 'Haba Tonka', 'Canela', 'Bálsamo del Perú', 'Benjuí', 'Sándalo', 'Clavo', 'Cedro', 'Pachulí', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Cherry gourmand oscuro y seductor, alternativa accesible a Tom Ford Lost Cherry. Abre con cereza negra y almendra amarga intoxicantes, el corazón de ciruela y rosa turca es lujoso y romántico, y la base de vainilla, tonka y especias es cálida y duradera. Adictiva e irresistible para quienes aman los orientales frutales oscuros.'
WHERE name = 'Forbidden Love';

-- Brand: Givenchy
UPDATE products SET
  notes_top = ARRAY['Cardamomo', 'Salvia'],
  notes_heart = ARRAY['Narciso Francés', 'Vetiver de Haití', 'Vetiver de Madagascar'],
  notes_base = ARRAY['Cedro', 'Sándalo', 'Vainilla', 'Palo Santo'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'noche', 'cita', 'formal']::product_occasion[],
  age_min = 25, age_max = 60,
  description = 'Amaderado aromático elegante y contemporáneo lanzado en 2023. Abre con salvia fresca y cardamomo especiado, el corazón de narciso francés y cuatro vetiveres distintos es profundo y terroso, y la base de cedro, sándalo y palo santo con vainilla es cálida y adictiva. Sofisticado sin ser pretencioso, recibe muchos cumplidos.'
WHERE name = 'Gentleman Society';

-- Brand: Carolina Herrera
UPDATE products SET
  notes_top = ARRAY['Almendra', 'Café', 'Bergamota', 'Limón'],
  notes_heart = ARRAY['Tuberosa', 'Jazmín Sambac', 'Rosa', 'Flor de Naranjo', 'Raíz de Orris'],
  notes_base = ARRAY['Haba Tonka', 'Cacao', 'Vainilla', 'Praliné', 'Sándalo', 'Ámbar', 'Pachulí'],
  seasons = ARRAY['todo_clima', 'otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento', 'formal']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Una de las fragancias femeninas más icónicas e imitadas del mundo desde 2016. Abre con almendra y café oscuro que generan una apertura adictiva y misteriosa, el corazón de tuberosa y jazmín sambac es blanco floral cremoso e intenso, y la base de tonka, cacao y vainilla es seductora y larga. Proyección potente las primeras horas. El famoso frasco de tacón de aguja negro y dorado.'
WHERE name = 'Good Girl';

-- Brand: Halloween (Jesus Del Pozo)
UPDATE products SET
  notes_top = ARRAY['Violeta', 'Notas Marinas', 'Hoja de Banana', 'Petitgrain'],
  notes_heart = ARRAY['Magnolia', 'Violeta', 'Tuberosa', 'Muguet', 'Pimienta'],
  notes_base = ARRAY['Incienso', 'Sándalo', 'Mirra', 'Vainilla de Madagascar'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'formal', 'versatil']::product_occasion[],
  age_min = 30, age_max = 99,
  description = 'Floral oriental misterioso y sensual lanzado en 1997. Abre con violeta polvoriada y notas verdes de banana y petitgrain, el corazón floral de tuberosa y magnolia con pimienta es romántico e intrigante, y la base de incienso, mirra y vainilla de Madagascar es cálida y duradera. Un clásico atemporal de la perfumería española.'
WHERE name = 'Halloween';

-- Brand: Halloween (Jesus Del Pozo)
UPDATE products SET
  notes_top = ARRAY['Martini de Manzana', 'Hoja de Violeta', 'Albahaca Verde', 'Mandarina'],
  notes_heart = ARRAY['Jengibre', 'Canela', 'Lavanda', 'Flor de Naranjo de Túnez'],
  notes_base = ARRAY['Cuero', 'Almizcle', 'Ámbar Gris', 'Vainilla'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Oriental especiado con ADN frutal-boozy. Abre con martini de manzana y albahaca fresca, el corazón especiado de canela y jengibre es cálido y sensual, y la base de cuero y ámbar es oscura y masculina. Longevidad moderada de 3 a 4 horas. Precio accesible para un oriental bien construido.'
WHERE name = 'Halloween Man';

-- Brand: Rasasi
UPDATE products SET
  notes_top = ARRAY['Manzana', 'Bergamota', 'Limón', 'Canela'],
  notes_heart = ARRAY['Notas Acuáticas', 'Ciruela', 'Flor de Naranjo', 'Cardamomo'],
  notes_base = ARRAY['Ambergris', 'Almizcle', 'Pachulí', 'Madera a la Deriva'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 50,
  description = 'Una de las fragancias más aclamadas y mejor valuadas del mercado. Abre con manzana y canela vibrantes, el corazón acuático de ciruela y cardamomo es dulce y masculino, y la base de ambergris y madera a la deriva es excepcional en longevidad. Comparada con Invictus Aqua de Paco Rabanne pero de mayor calidad. Duración de 8 a 12 horas. Fragrancia de culto mundial.'
WHERE name = 'Hawas';

-- Brand: Rasasi
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Piña', 'Pomelo'],
  notes_heart = ARRAY['Pachulí', 'Cedro', 'Jazmín'],
  notes_base = ARRAY['Ambergris', 'Almizcle', 'Madera Ahumada'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'formal']::product_occasion[],
  age_min = 20, age_max = 50,
  description = 'La versión más oscura y ahumada del universo Hawas. Abre con piña y bergamota cítrica, el corazón de pachulí y cedro le da un carácter amaderado especiado, y la base ahumada de ambergris y madera quemada es oscura y profunda. Comparada con Nishane Hacivat. Para quienes quieren el ADN Aventus con más oscuridad y carácter.'
WHERE name = 'Hawas Black';

-- Brand: Rasasi
UPDATE products SET
  notes_top = ARRAY['Menta', 'Bergamota', 'Artemisia'],
  notes_heart = ARRAY['Chocolate Negro', 'Lavanda', 'Benzoin'],
  notes_base = ARRAY['Miel', 'Haba Tonka', 'Tabaco', 'Almizcle Blanco'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 18, age_max = 50,
  description = 'Gourmand aromático oscuro y adictivo. Abre con menta fresca y artemisia herbácea, el corazón de chocolate negro y lavanda es la combinación más inesperada y fascinante de la línea, y la base de miel, tabaco y tonka es cálida y larga. El miembro más gourmand y nocturno de la familia Hawas.'
WHERE name = 'Hawas Elixir';

-- Brand: Rasasi
UPDATE products SET
  notes_top = ARRAY['Salvia Clara'],
  notes_heart = ARRAY['Jazmín Egipcio', 'Notas Marinas'],
  notes_base = ARRAY['Ambergris', 'Ámbar', 'Notas Minerales'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Contrariamente a su nombre, Hawas Fire es fresco y acuático. Abre con salvia aromática, el corazón marino de jazmín y notas del océano es limpio y sorprendente, y la base mineral de ambergris es suave y persistente. Compara con Acqua di Giò Profondo de Armani. Para quienes esperan algo oscuro y picante, puede sorprender — pero es refrescante y fácil de llevar.'
WHERE name = 'Hawas Fire';

-- Brand: Rasasi
UPDATE products SET
  notes_top = ARRAY['Piña', 'Naranja', 'Pomelo'],
  notes_heart = ARRAY['Iris', 'Ámbar', 'Lavanda'],
  notes_base = ARRAY['Haba Tonka', 'Almizcle', 'Pachulí', 'Cashmeran'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'La versión más tropical y festiva de la familia Hawas. Abre con piña, naranja y pomelo jugosos y soleados, el corazón de iris y lavanda sobre ámbar le da elegancia inesperada, y la base de tonka y cashmeran es cremosa y duradera. Para verano y vacaciones, trae buenas vibras en cada spray.'
WHERE name = 'Hawas Malibu';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Manzana', 'Bergamota'],
  notes_heart = ARRAY['Canela', 'Notas Amaderadas'],
  notes_base = ARRAY['Almizcle', 'Vainilla'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Aromático amaderado cálido y accesible. Abre con manzana fresca y bergamota cítrica, el corazón de canela y notas amaderadas es especiado y reconfortante, y la base de almizcle y vainilla es suave y duradera. Fácil de llevar, recibe cumplidos sin esfuerzo.'
WHERE name = 'Hayaati';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Pimienta Rosa', 'Bergamota', 'Jengibre', 'Nuez Moscada'],
  notes_heart = ARRAY['Cedro', 'Notas Amaderadas', 'Incienso', 'Labdanum'],
  notes_base = ARRAY['Almizcle', 'Ambergris', 'Ámbar'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'formal']::product_occasion[],
  age_min = 18, age_max = 50,
  description = 'Oriental especiado amaderado oscuro y elegante. Abre con especias vibrantes de pimienta rosa, jengibre y nuez moscada, el corazón resinoso de cedro e incienso es misterioso y profundo, y la base de ambergris y ámbar es suave y larga. Masculino sin ser abrumador.'
WHERE name = 'Hayaati Al Maleky';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Pomelo', 'Cassis'],
  notes_heart = ARRAY['Cuero', 'Durazno', 'Azafrán'],
  notes_base = ARRAY['Vainilla', 'Ámbar', 'Almizcle', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 25, age_max = 50,
  description = 'Citrus gourmand cuero inspirado en 1 Million de Paco Rabanne. Abre con bergamota y pomelo brillantes con cassis, el corazón de cuero, durazno y azafrán es lujoso y exótico, y la base de vainilla y vetiver es cálida y duradera. Unisex con tendencia masculina. Muy buena relación calidad-precio.'
WHERE name = 'Hayaati Gold';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Canela', 'Acordes Místicos'],
  notes_heart = ARRAY['Jazmín', 'Tuberosa', 'Incienso', 'Mahonial'],
  notes_base = ARRAY['Haba Tonka', 'Almizcle', 'Vainilla'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento']::product_occasion[],
  age_min = 18, age_max = 55,
  description = 'Floral oriental cálido y seductor para mujer. Abre con canela especiada y acordes misteriosos, el corazón de tuberosa y jazmín con velo de incienso es cremoso y cautivador, y la base de tonka y vainilla es adictiva y larga. Duración de 7 a 9 horas. Para quien quiere florales con profundidad y misterio.'
WHERE name = 'Her Confession';

-- Brand: Initio Parfums Privés
UPDATE products SET
  notes_top = ARRAY['Hedione (Molécula del Placer)', 'Almendra', 'Magnolia'],
  notes_heart = ARRAY['Jazmín', 'Heliotropo', 'Vainilla'],
  notes_base = ARRAY['Sándalo'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'noche', 'cita', 'versatil']::product_occasion[],
  age_min = 20, age_max = 99,
  description = 'Floral amaderado sedoso construido alrededor de la molécula Hedione —conocida por su efecto hedónico en el sistema olfativo. Abre con almendra cremosa y magnolia luminosa, el corazón de jazmín y heliotropo es suave y polvoriado, y la base de sándalo es plush y envolvente. Comparada con JPG Scandal Le Parfum. Sensual, magnética y con proyección excepcional en ropa.'
WHERE name = 'High Frequency';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Mandarina', 'Canela', 'Lavanda'],
  notes_heart = ARRAY['Iris', 'Ciprés', 'Benzoin', 'Mahonial'],
  notes_base = ARRAY['Vainilla', 'Haba Tonka', 'Pachulí', 'Cedro', 'Incienso', 'Ámbar'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 25, age_max = 50,
  description = 'Oriental especiado aromático para hombre, pareja de Her Confession. Abre con mandarina fresca y canela, el corazón de iris y ciprés le da elegancia verde y sofisticada, y la base de tonka, cedro e incienso es cálida, profunda y duradera. Más versátil que Her Confession, apto para múltiples contextos.'
WHERE name = 'His Confession';

-- Brand: Mancera
UPDATE products SET
  notes_top = ARRAY['Azafrán', 'Jengibre', 'Mandarina Siciliana', 'Bergamota Siciliana'],
  notes_heart = ARRAY['Amberwood', 'Rosa Marroquí', 'Jazmín Egipcio', 'Pachulí Indonesio'],
  notes_base = ARRAY['Vainilla de Madagascar', 'Almizcle Blanco', 'Sándalo', 'Musgo de Roble'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Oriental floral seductor y adictivo comparado con Baccarat Rouge 540 pero más floral. Abre con azafrán y mandarina especiada, el corazón de rosa marroquí, jazmín y amberwood es cálido y romántico, y la base de vainilla y sándalo es sedosa y muy larga. Proyección y duración excepcionales. Uno de los fragancias con más cumplidos de la casa Mancera.'
WHERE name = 'Instant Crush';

-- Brand: Paco Rabanne
UPDATE products SET
  notes_top = ARRAY['Notas Marinas', 'Pomelo', 'Mandarina'],
  notes_heart = ARRAY['Hoja de Laurel', 'Jazmín'],
  notes_base = ARRAY['Ambergris', 'Madera de Guayaco', 'Musgo de Roble', 'Pachulí'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'deportivo', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'El clásico acuático-frutal de Paco Rabanne desde 2013. Abre con pomelo y notas marinas vibrantes, el corazón de laurel y jazmín es limpio y fresco, y la base de ambergris y guayaco es cálida y moderada. Duración de 3 a 4 horas. Un "entry level" icónico ideal para jóvenes y clima caluroso.'
WHERE name = 'Invictus';

-- Brand: Rabanne
UPDATE products SET
  notes_top = ARRAY['Notas Marinas', 'Lavanda', 'Pimienta Rosa'],
  notes_heart = ARRAY['Jabón', 'Hoja de Violeta', 'Mirto'],
  notes_base = ARRAY['Almizcle', 'Cashmeran', 'Sándalo'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'casual', 'formal', 'versatil']::product_occasion[],
  age_min = 18, age_max = 50,
  description = 'La versión más concentrada y limpia de la línea Invictus lanzada en 2024. Abre con notas marinas y lavanda, el corazón jabonoso de violeta y mirto es diferente al resto de la línea, y la base de cashmeran y sándalo es suave y moderna. Más dulce y limpia que el EDT original, con mejor concentración. Para quien quiere el ADN Invictus con más sofisticación.'
WHERE name = 'Invictus Parfum';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Limón', 'Bergamota'],
  notes_heart = ARRAY['Piña', 'Pimienta Negra'],
  notes_base = ARRAY['Vainilla', 'Amberwood', 'Cedro', 'Pachulí'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'versatil', 'casual', 'formal']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Frutal amaderado fresco y accesible, alternativa al discontinuado 1 Million Lucky de Paco Rabanne. Abre con limón y bergamota brillantes, el corazón de piña y pimienta negra es jugoso y especiado, y la base de amberwood y vainilla es cálida y bien equilibrada. Duración de 6 a 8 horas. Muy buen all-rounder para el precio.'
WHERE name = 'Ishq Al Shuyukh Silver';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Mandarina'],
  notes_heart = ARRAY['Naranja'],
  notes_base = ARRAY['Jengibre', 'Ambergris'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Cítrica frutal fresca y luminosa, alternativa accesible a Louis Vuitton Afternoon Swim. Abre con bergamota y mandarina vibrantes, el corazón de naranja es jugoso y soleado, y la base de jengibre y ambergris le da calidez y elegancia. Duración moderada. Perfecta para verano y días activos.'
WHERE name = 'Jean Lowe Azure';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Pomelo', 'Jengibre', 'Bergamota'],
  notes_heart = ARRAY['Notas Acuáticas', 'Romero', 'Salvia', 'Geranio'],
  notes_base = ARRAY['Ambroxan', 'Ámbar', 'Labdanum'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 25, age_max = 99,
  description = 'Cítrica aromática moderna comparada con Louis Vuitton L''Immensité. Abre con pomelo y jengibre vibrantes, el corazón herbal-acuático de romero y salvia es fresco y sofisticado, y la base de ambroxan y labdanum es cálida y larga. Duración de 8 horas, proyección notable. La mejor de la línea Jean Lowe según la mayoría de usuarios.'
WHERE name = 'Jean Lowe Immortal';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Canela', 'Nuez Moscada', 'Bergamota'],
  notes_heart = ARRAY['Dátiles', 'Praliné', 'Tuberosa', 'Mahonial'],
  notes_base = ARRAY['Vainilla', 'Haba Tonka', 'Amberwood', 'Mirra', 'Benzoin', 'Akigalawood'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Oriental gourmand especiado dulce inspirado en Kilian Angels'' Share. Abre con canela y nuez moscada, el corazón de dátiles y praliné es rico y adictivo, y la base de vainilla y akigalawood es envolvente y larga. Muy popular en redes sociales. Cuidado con la cantidad de sprays — 2 o 3 son suficientes.'
WHERE name = 'Khamrah';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Especias', 'Pimiento de Jamaica', 'Mandarina'],
  notes_heart = ARRAY['Incienso', 'Labdanum', 'Flor de Naranjo', 'Pachulí'],
  notes_base = ARRAY['Praliné', 'Tabaco', 'Ámbar', 'Haba Tonka', 'Benzoin'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'formal']::product_occasion[],
  age_min = 18, age_max = 40,
  description = '"Dukhan" significa humo en árabe. Oriental especiado ahumado y tabacalero que amplifica el ADN de Khamrah con tabaco e incienso. Abre con especias vibrantes y mandarina, el corazón de incienso y labdanum es fumado y misterioso, y la base de tabaco y praliné es densa y poderosa. Necesita maceración para mostrar su mejor cara. Proyección notable.'
WHERE name = 'Khamrah Dukhan';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Canela', 'Cardamomo', 'Jengibre'],
  notes_heart = ARRAY['Praliné', 'Frutas Confitadas', 'Flores Blancas'],
  notes_base = ARRAY['Vainilla', 'Café', 'Haba Tonka', 'Benzoin', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'noche', 'cita', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'La versión más equilibrada y compleja de la familia Khamrah. La adición de café arábica con cardamomo convierte el gourmand dulce original en algo más aromático y con más carácter. Abre con especias cálidas, el corazón de praliné y frutas confitadas es delicioso, y la base de café y vainilla es rica y persistente. Para muchos supera al Khamrah original.'
WHERE name = 'Khamrah Qahwa';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Coñac'],
  notes_heart = ARRAY['Canela', 'Haba Tonka', 'Roble'],
  notes_base = ARRAY['Vainilla', 'Praliné', 'Sándalo'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 20, age_max = 50,
  description = 'Gourmand boozy y especiado, alternativa accesible a Kilian Angels'' Share pero con más coñac y roble. Abre con coñac alcohólico e intrigante, el corazón de canela y tonka es cálido y especiado, y la base de vainilla, praliné y sándalo es suave y duradera. Transición del dulce inicial a un base más amaderada y refinada.'
WHERE name = 'Kismet Magic';

-- Brand: Versace
UPDATE products SET
  notes_top = ARRAY['Mandarina', 'Pimienta de Madagascar', 'Limón', 'Chinotto', 'Romero'],
  notes_heart = ARRAY['Geranio', 'Rosa', 'Pepperwood'],
  notes_base = ARRAY['Vainilla', 'Haba Tonka', 'Sándalo', 'Cedro de Texas', 'Pachulí', 'Musgo de Roble'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'casual', 'cita', 'evento']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'La versión más ardiente y especiada de la familia Eros lanzada en 2018. Abre con cítricos mediterráneos vibrantes y pimienta de Madagascar, el corazón especiado de geranio y rosa con pepperwood es único y masculino, y la base de vainilla, tonka y maderas es cálida, sensual y larga. Para noches de invierno y citas románticas.'
WHERE name = 'Kit Eros Flame';

-- Brand: Issey Miyake
UPDATE products SET
  notes_top = ARRAY['Yuzu', 'Limón', 'Bergamota', 'Verbena', 'Mandarina', 'Ciprés', 'Coriandro', 'Salvia', 'Estragón'],
  notes_heart = ARRAY['Lirio de Agua', 'Nuez Moscada', 'Geranio', 'Azafrán', 'Canela de Ceilán'],
  notes_base = ARRAY['Vetiver de Tahití', 'Almizcle', 'Cedro', 'Sándalo', 'Ámbar', 'Tabaco'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual', 'formal', 'versatil']::product_occasion[],
  age_min = 25, age_max = 99,
  description = 'Uno de los clásicos masculinos más icónicos desde 1994. Acuático-amaderado puro e intemporal. Abre con yuzu astringente y cítricos mediterráneos, el corazón de lirio de agua y nuez moscada es único y japonés en su espíritu, y la base de vetiver y sándalo es limpia y elegante. Duración de 8 a 10 horas. Universal, sofisticado y que nunca pasa de moda.'
WHERE name = 'L''Eau d''Issey Miyake';

-- Brand: Paris Corner
UPDATE products SET
  notes_top = ARRAY['Bergamota Italiana', 'Helado de Pistacho', 'Avellana', 'Ron Dulce', 'Cardamomo'],
  notes_heart = ARRAY['Geranio', 'Peonía Blanca', 'Muguet', 'Jazmín', 'Frambuesa', 'Durazno Blanco', 'Pera'],
  notes_base = ARRAY['Crema Chantilly', 'Malvavisco', 'Algodón de Azúcar', 'Turkish Delight', 'Cacao', 'Cedro', 'Sándalo', 'Haba Tonka'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Gourmand floral cremoso inspirado en el gelato de pistacho italiano. Abre con pistacho cremoso, avellana y ron, el corazón floral-frutal de jazmín, peonía y frambuesa es suave y femenino, y la base de crema chantilly, malvavisco y tonka es dulce, envolvente y larga. Unisex con tendencia femenina. Para quien ama los gourmand cremosos sin que sean abrumadores.'
WHERE name = 'Kahir Pistachio';

-- Brand: Givenchy
UPDATE products SET
  notes_top = ARRAY['Naranja Roja', 'Jengibre'],
  notes_heart = ARRAY['Tuberosa', 'Jazmín', 'Hoja de Pimiento'],
  notes_base = ARRAY['Sándalo', 'Pachulí', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Versión oscura y especiada de L''Interdit, lanzada en 2021. Abre con naranja roja vibrante y jengibre picante, el corazón de tuberosa y jazmín con hoja de pimiento es sensual e intenso, y la base de sándalo y pachulí es cálida y elegante. Duración de 6 a 8 horas. Para la mujer que quiere dejar huella en una noche de salida.'
WHERE name = 'L''Interdit Rouge';

-- Brand: Givenchy
UPDATE products SET
  notes_top = ARRAY['Neroli Tunecino', 'Flor de Naranjo', 'Jazmín Sambac'],
  notes_heart = ARRAY['Tuberosa India', 'Cáscara de Cacao'],
  notes_base = ARRAY['Pachulí Indonesio', 'Vetiver Haitiano', 'Ambroxan', 'Tabaco'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'evento', 'formal']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'La versión más intensa y oscura de la colección Rouge, lanzada en 2023. Abre con un bouquet de flores blancas indólicas de neroli y jazmín sambac, el corazón de tuberosa y cáscara de cacao reciclada es único y profundo, y la base de vetiver, tabaco y ambroxan es fumada y larga. Para quien ama los florales oscuros y sensuales con carácter.'
WHERE name = 'L''Interdit Rouge Ultime';

-- Brand: Jean Paul Gaultier
UPDATE products SET
  notes_top = ARRAY['Bergamota'],
  notes_heart = ARRAY['Coco'],
  notes_base = ARRAY['Haba Tonka', 'Sándalo', 'Ámbar', 'Ambergris'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Fresco tropical cítrico-coco lanzado en 2019. Abre con bergamota brillante, el corazón de coco es cremoso y adictivo, y la base de tonka y sándalo le da calidez y dulzura. El más fresco y ligero de la familia Le Beau, perfecto para verano y días calurosos. Nota dominante de coco muy pronunciada.'
WHERE name = 'Le Beau EDT';

-- Brand: Jean Paul Gaultier
UPDATE products SET
  notes_top = ARRAY['Piña', 'Iris', 'Jengibre', 'Ciprés'],
  notes_heart = ARRAY['Coco', 'Notas Amaderadas'],
  notes_base = ARRAY['Haba Tonka', 'Sándalo', 'Ámbar', 'Ambergris'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Versión más rica y seductora del Le Beau. La piña reemplaza a la bergamota en la apertura, dándole más carácter frutal y gourmand. El coco es igualmente prominente pero más cremoso y dulce. La base amaderada es más densa. Más proyección que el EDT, ideal para quien quiere el ADN Le Beau con más presencia.'
WHERE name = 'Le Beau Le Parfum';

-- Brand: Jean Paul Gaultier
UPDATE products SET
  notes_top = ARRAY['Notas Verdes', 'Notas Acuáticas', 'Menta', 'Jengibre'],
  notes_heart = ARRAY['Coco', 'Higo', 'Sal'],
  notes_base = ARRAY['Sándalo', 'Haba Tonka'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'La versión más fresca y verde de la familia Le Beau, lanzada en 2024. Abre con menta y jengibre acuático-verdoso, el corazón de coco salado e higo es tropical y único — un "postre salado de playa", y la base de sándalo y tonka es suave. La más experimental y diferente de la trilogía. Proyección y duración de 7+ horas.'
WHERE name = 'Le Beau Paradise Garden';

-- Brand: Jean Paul Gaultier
UPDATE products SET
  notes_top = ARRAY['Lavanda', 'Menta', 'Miel'],
  notes_heart = ARRAY['Haba Tonka', 'Benzoin', 'Vainilla'],
  notes_base = ARRAY['Tabaco', 'Ámbar', 'Madera'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento']::product_occasion[],
  age_min = 20, age_max = 35,
  description = 'La versión más dulce y adictiva del Le Male, lanzada en 2023. Abre con lavanda fresca sobre miel punzante, el corazón de tonka y benzoin es gourmand y sensual, y la base de tabaco y ámbar es profunda y duradera. Proyección nuclear — con 2 a 3 sprays es suficiente. Comparada con Xerjoff Naxos. Recibe muchísimos cumplidos.'
WHERE name = 'Le Male Elixir';

-- Brand: YSL
UPDATE products SET
  notes_top = ARRAY['Lavanda', 'Bergamota', 'Mandarina Verde'],
  notes_heart = ARRAY['Flor de Naranjo Marroquí', 'Jazmín', 'Orquídea'],
  notes_base = ARRAY['Vainilla Bourbon de Madagascar', 'Ámbar', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'noche', 'cita', 'versatil']::product_occasion[],
  age_min = 18, age_max = 50,
  description = 'Versión más cálida, sensual y duradera del Libre original. La orquídea y la vainilla intensificada reemplazan parte de la frescura del EDP original por profundidad y calidez. Lavanda como nota dominante. Duración excepcional de 8 a 12 horas. Para la mujer que quiere el ADN Libre con más presencia y madurez.'
WHERE name = 'Libre EDP Intense';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Canela', 'Bergamota', 'Cardamomo', 'Flor de Naranjo'],
  notes_heart = ARRAY['Vainilla Bourbon', 'Elemi'],
  notes_base = ARRAY['Almizcle', 'Praliné', 'Ambroxan', 'Madera de Guayaco'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual', 'formal']::product_occasion[],
  age_min = 18, age_max = 50,
  description = 'Oriental amaderado cremoso y especiado de alta calidad. Abre con canela y flor de naranjo cálidas, el corazón de vainilla bourbon y elemi es cremoso y elegante, y la base de praliné y ambroxan es suave y duradera. Frecuentemente comparada con Althair de Parfums de Marly. Una de las mejores relaciones calidad-precio de la casa French Avenue.'
WHERE name = 'Liquid Brun';

-- Brand: Lira — Casamorati 1888 (Xerjoff)
UPDATE products SET
  notes_top = ARRAY['Naranja Roja', 'Bergamota', 'Lavanda'],
  notes_heart = ARRAY['Canela', 'Regaliz', 'Jazmín'],
  notes_base = ARRAY['Caramelo', 'Vainilla', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Oriental floral gourmand vintage e intemporal de la colección Casamorati 1888. Abre con naranja roja brillante y lavanda fresca, el corazón de canela y regaliz sobre jazmín es especiado y femenino, y la base de caramelo y vainilla es dulce, seductora y muy larga. Concentración alta — 1 o 2 sprays son suficientes. Celebra el antiguo arte de la perfumería italiana.'
WHERE name = 'Lira';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Cítricos', 'Cardamomo', 'Lavanda'],
  notes_heart = ARRAY['Flor de Naranjo', 'Madera de Guayaco', 'Rosa'],
  notes_base = ARRAY['Ámbar Seco', 'Vainilla', 'Haba Tonka', 'Musgo de Roble'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'formal']::product_occasion[],
  age_min = 25, age_max = 45,
  description = 'Versión Extrait de Parfum del Liquid Brun original, lanzada en 2025 en formato 150ml. La diferencia clave: es más ligera en especias (sin canela prominente), tiene más floral con lavanda y rosa, y la base de ámbar, tonka y musgo de roble es más rica y compleja. Duración superior a 10 horas. Ligeramente más madura y unisex que el original. Para quien ama Liquid Brun y quiere más profundidad y proyección.'
WHERE name = 'Liquid Brun Limited Edition';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Cereza', 'Jengibre'],
  notes_heart = ARRAY['Jazmín Sambac'],
  notes_base = ARRAY['Almizcle', 'Pimienta Rosa', 'Ambretolida'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'noche', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Frutal floral fresco y playful, alternativa accesible a Tom Ford Electric Cherry. Abre con cereza y jengibre vibrantes, el corazón de jazmín sambac es suave y exótico, y la base de almizcle y pimienta rosa deja un rastro seductor y aireado. Duración de 8 horas. Unisex con tendencia femenina.'
WHERE name = 'Love Spark';

-- Brand: Bvlgari
UPDATE products SET
  notes_top = ARRAY['Especias', 'Ron', 'Tabaco'],
  notes_heart = ARRAY['Cuero', 'Iris', 'Tuberosa'],
  notes_base = ARRAY['Haba Tonka', 'Madera de Guayaco', 'Benzoin'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'cita']::product_occasion[],
  age_min = 25, age_max = 60,
  description = 'Oriental amaderado oscuro y seductor lanzado en 2014. Abre con ron y especias boozy, el corazón de tuberosa y cuero es inesperadamente floral y masculino, y la base de benzoin y tonka es cálida y elegante. Duración de 8 a 10 horas. Uno de los mejores perfumes masculinos de precio designer.'
WHERE name = 'Man in Black';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Lichis', 'Frambuesa', 'Hoja de Violeta'],
  notes_heart = ARRAY['Rosa Blanca', 'Peonía', 'Jazmín'],
  notes_base = ARRAY['Almizcle', 'Vainilla'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Floral frutal femenino comparado con Angel Nova de Mugler. Abre con lichis y frambuesa jugosos y frescos, el corazón floral de rosa y peonía es suave y romántico, y la base de almizcle y vainilla es ligera y fácil. Muy fácil de llevar para el día a día.'
WHERE name = 'Mayar';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Fresa', 'Bergamota'],
  notes_heart = ARRAY['Mermelada de Cereza', 'Cacao'],
  notes_base = ARRAY['Vainilla', 'Ámbar', 'Pachulí'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 20, age_max = 55,
  description = 'Gourmand frutal oscuro y adictivo. Abre con fresa jugosa y bergamota, el corazón de mermelada de cereza y cacao es rico y chocolatoso, y la base de vainilla y pachulí es cálida y duradera. Duración de 8 a 10 horas. Unisex — el primero de la línea Mayar diseñado para todos.'
WHERE name = 'Mayar Cherry';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Mandarina Verde', 'Higo', 'Agua de Coco', 'Melón'],
  notes_heart = ARRAY['Loto', 'Lirio de Agua', 'Jazmín'],
  notes_base = ARRAY['Almizcle', 'Ambroxan', 'Vainilla', 'Sándalo'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Frutal acuática tropical para mujer. Abre con higo verde, agua de coco y melón fresco, el corazón floral-acuático de loto y lirio de agua es limpio y natural, y la base de ambroxan y vainilla es suave y moderna. Necesita maceración para mostrar su mejor cara.'
WHERE name = 'Mayar Natural Intense';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Coco', 'Durazno'],
  notes_heart = ARRAY['Flor de Tiaré', 'Ylang Ylang', 'Jazmín'],
  notes_base = ARRAY['Vainilla', 'Almizcle Blanco'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Tropical coco-floral cremosa e intensa. Abre con coco dulce y durazno, el corazón de tiaré y ylang ylang es exótico y solar, y la base de vainilla y almizcle es cremosa. Tiene aroma a bloqueador solar — a quienes les gusta, la aman; a quienes no, no la toleran. Mejor en clima cálido.'
WHERE name = 'Montaigne Coco';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Especias', 'Bergamota', 'Naranja'],
  notes_heart = ARRAY['Coco', 'Ylang Ylang', 'Ambroxan', 'Mahonial'],
  notes_base = ARRAY['Sándalo', 'Almizcle', 'Benjuí'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'versatil']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Oriental floral cremoso con coco exótico y ambroxan moderno. Abre con especias cálidas y naranja, el corazón cremoso de coco y ylang ylang es tropical y sensual, y la base de sándalo y benjuí es elegante y duradera. Duración superior a 10 horas. La botella de serpiente dorada es icónica. Unisex bien equilibrado.'
WHERE name = 'Musamam White Intense';

-- Brand: YSL
UPDATE products SET
  notes_top = ARRAY['Bergamota de Calabria', 'Vert de Bergamota'],
  notes_heart = ARRAY['Flor de Naranjo Absoluta de Túnez'],
  notes_base = ARRAY['Pachulí Indonesio', 'Ambrofix'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual', 'versatil']::product_occasion[],
  age_min = 20, age_max = 50,
  description = 'Woody floral fresco y moderno para hombre lanzado en 2023. Abre con bergamota brillante y verde, el corazón de flor de naranjo absoluta tunecina es el protagonista —fresco, sensual y único—, y la base de pachulí y ambrofix es limpia y larga. Fragrancia de firma perfecta, inofensiva y con muchos cumplidos. Duración de 7 a 8 horas.'
WHERE name = 'Myslf';

-- Brand: Xerjoff
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Limón', 'Lavanda'],
  notes_heart = ARRAY['Jazmín Sambac', 'Canela', 'Miel', 'Cashmeran'],
  notes_base = ARRAY['Tabaco', 'Haba Tonka', 'Vainilla'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento']::product_occasion[],
  age_min = 25, age_max = 99,
  description = 'Gourmand oriental de lujo, uno de los más aclamados de Xerjoff. Abre con lavanda fresca y bergamota, el corazón de miel y canela sobre jazmín sambac es adictivo y seductor, y la base de tabaco y tonka es profunda y larga. Comparada con Le Male Elixir de JPG. Proyección potente — 2 o 3 sprays son suficientes. Alta concentración de aceites.'
WHERE name = 'Naxos';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Frutos Rojos', 'Mandarina'],
  notes_heart = ARRAY['Vainilla', 'Cacao', 'Rosa'],
  notes_base = ARRAY['Azúcar', 'Haba Tonka', 'Ámbar', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 45,
  description = 'Oriental vainillada gourmand dulce y acogedora. Abre con frutos rojos y mandarina, el corazón de vainilla y cacao sobre rosa es rico y chocolatoso, y la base de azúcar y tonka es suave y larga. Perfecta para clima frío y uso cotidiano invernal.'
WHERE name = 'Nebras';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Naranja', 'Pomelo', 'Artemisia'],
  notes_heart = ARRAY['Menta', 'Lavanda'],
  notes_base = ARRAY['Ambroxan', 'Ciprés', 'Pachulí'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'oficina']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Fresca aromática amaderada comparada con YSL Y EDP pero más aireada. Abre con naranja y pomelo sobre artemisia herbácea, el corazón de menta y lavanda es refrescante y masculino, y la base de ambroxan y ciprés es moderna y duradera. Duración de 8 horas. Excelente para verano y trabajo.'
WHERE name = 'Odyssey Aqua';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Fresa', 'Frambuesa', 'Geranio', 'Durazno', 'Bergamota'],
  notes_heart = ARRAY['Caramelo', 'Jazmín', 'Maracuyá'],
  notes_base = ARRAY['Pachulí', 'Almizcle', 'Ámbar'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 30,
  description = 'Frutal floral gourmand femenino, comparado con Burberry Her Elixir de Parfum. Abre con fresa y frambuesa vibrantes, el corazón de caramelo y maracuyá sobre jazmín es dulce y juguetón, y la base de pachulí y ámbar le da calidez y duración. Perfecta para quienes aman los frutales dulces y accesibles.'
WHERE name = 'Odyssey Candee';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Café', 'Pistacho', 'Hazelnut', 'Praliné', 'Kunafa'],
  notes_heart = ARRAY['Chocolate', 'Vainilla', 'Cardamomo'],
  notes_base = ARRAY['Caramelo', 'Amberwood', 'Haba Tonka'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Gourmand postre ultra-rico lanzado en 2025, inspirado en los chocolates de pistacho de Dubai. Abre con café y pistacho crocante sobre kunafa, el corazón de chocolate y vainilla con cardamomo es decadente y envolvente, y la base de caramelo y tonka es larga y suntuosa. Para los amantes extremos del gourmand.'
WHERE name = 'Odyssey Chocolate Dubai';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Almendra', 'Lactonas', 'Especias'],
  notes_heart = ARRAY['Flores Blancas'],
  notes_base = ARRAY['Vainilla', 'Sándalo', 'Almizcle', 'Cacao'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Gourmand lácteo floral cremoso, comparado con Blanche Bête de Les Liquides Imaginaires. Abre con almendra cremosa y lactonas cálidas, el corazón de flores blancas es suave y elegante, y la base de vainilla y cacao es envolvente y larga. Más femenino de lo que el nombre sugiere. Muy bien equilibrado.'
WHERE name = 'Odyssey Eau de Montagne';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Cardamomo', 'Mandarina', 'Neroli'],
  notes_heart = ARRAY['Flor de Naranjo', 'Rosa'],
  notes_base = ARRAY['Vainilla', 'Notas Amaderadas', 'Sándalo', 'Ámbar'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual']::product_occasion[],
  age_min = 25, age_max = 55,
  description = 'Oriental amaderado elegante y clásico. Abre con cardamomo y neroli frescos, el corazón floral de flor de naranjo y rosa es refinado y masculino, y la base de vainilla y sándalo es cálida y duradera. Sofisticado sin ser abrumador.'
WHERE name = 'Odyssey Homme';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Limón', 'Naranja Dulce', 'Mandarina', 'Bergamota'],
  notes_heart = ARRAY['Flor de Naranjo', 'Notas Marinas', 'Jengibre'],
  notes_base = ARRAY['Té Azul', 'Almizcle', 'Ámbar'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Cítrica marina fresca y ligera, comparada con LV Afternoon Swim e Imagination. Abre con una explosión de cítricos mediterráneos brillantes, el corazón de jengibre y flor de naranjo con notas marinas es refrescante, y la base de té azul y almizcle es sutil. Longevidad moderada — sus fans la aman por su frescura, aunque otros la encuentran simple.'
WHERE name = 'Odyssey Limoni Fresh';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Mandarina', 'Naranja', 'Azafrán', 'Salvia'],
  notes_heart = ARRAY['Caramelo', 'Haba Tonka', 'Caléndula'],
  notes_base = ARRAY['Ambroxan', 'Cedro', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Oriental frutal especiado con caramelo. Comparado con JPG Scandal DNA. Abre con mandarina y azafrán vibrantes, el corazón de caramelo y tonka es dulce y cálido, y la base de ambroxan y vetiver es moderna y duradera. Para quienes quieren algo entre frutal y oriental con carácter.'
WHERE name = 'Odyssey Mandarin Sky';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Naranja', 'Bergamota', 'Limón', 'Jengibre', 'Menta'],
  notes_heart = ARRAY['Piña', 'Salvia', 'Enebro', 'Geranio'],
  notes_base = ARRAY['Almizcle', 'Cedro', 'Haba Tonka', 'Vetiver'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual']::product_occasion[],
  age_min = 20, age_max = 60,
  description = 'Fresca aromática amaderada comparada con YSL Y EDP. Abre con cítricos y menta vibrantes, el corazón aromático de piña y salvia es moderno y fresco, y la base de cedro y tonka es cálida y equilibrada. Mejor performance que Lattafa Fakhar Black en la misma franja. Excelente relación calidad-precio para uso diario.'
WHERE name = 'Odyssey Mega';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Piña', 'Grosella Negra', 'Naranja Roja', 'Salvia'],
  notes_heart = ARRAY['Praliné', 'Vainilla', 'Ciruela', 'Cardamomo'],
  notes_base = ARRAY['Pachulí', 'Haba Tonka'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Frutal oriental especiado y adictivo lanzado en 2025. Abre con piña, grosella y naranja roja con un toque de salvia, el corazón de praliné y ciruela sobre cardamomo es dulce y especiado, y la base de pachulí y tonka es oscura y duradera. Energética y moderna — el nombre la describe perfectamente.'
WHERE name = 'Odyssey Revolution';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Canela', 'Manzana', 'Bergamota'],
  notes_heart = ARRAY['Lavanda', 'Canela', 'Flor de Naranjo', 'Muguet'],
  notes_base = ARRAY['Vainilla', 'Tabaco', 'Ámbar', 'Haba Tonka', 'Pachulí'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Oriental especiado floral cálido con ADN Stronger With You. Abre con canela y manzana, el corazón especiado de lavanda y flor de naranjo es aromático y cálido, y la base de tabaco, vainilla y tonka es profunda y larga. Para clima frío y quien busca un oriental accesible con personalidad.'
WHERE name = 'Odyssey Spectra';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Pomelo', 'Cítricos'],
  notes_heart = ARRAY['Pimienta', 'Lavanda', 'Geranio', 'Elemi'],
  notes_base = ARRAY['Ambroxan', 'Cedro', 'Notas Amaderadas', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'formal', 'oficina']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Aromático amaderado fresco y potente, con ADN cercano a Dior Sauvage EDP y Versace Dylan Blue. Abre con pomelo y cítricos vibrantes, el corazón de pimienta, lavanda y elemi es especiado y aromático, y la base de ambroxan y vetiver es oscura y persistente. El más fuerte y con mayor proyección del lote de los tres clásicos Odyssey.'
WHERE name = 'Odyssey Tyrant';

-- Brand: Armaf
UPDATE products SET
  notes_top = ARRAY['Pimienta', 'Bergamota', 'Menta', 'Limón'],
  notes_heart = ARRAY['Pimienta Rosa', 'Lavanda', 'Jengibre', 'Vetiver'],
  notes_base = ARRAY['Cedro', 'Pachulí', 'Elemi', 'Sándalo', 'Almizcle', 'Vetiver'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Aromático amaderado fresco, comparado con Dior Sauvage EDP y Versace Dylan Blue como una mezcla de ambos. Abre con pimienta y bergamota sobre menta fresca, el corazón aromático de lavanda y jengibre es masculino y elegante, y la base de sándalo y vetiver es profunda y larga. Proyección y duración notables. Muy seguro de comprar a ciegas.'
WHERE name = 'Odyssey Wild One';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Almizcle Blanco', 'Azafrán', 'Limón'],
  notes_heart = ARRAY['Flores Blancas', 'Jazmín', 'Almizcle Blanco'],
  notes_base = ARRAY['Almizcle Blanco', 'Cedro', 'Ámbar', 'Resina', 'Resina de Abeto'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Almizcle blanco floral limpio y fresco. Abre con almizcle blanco, azafrán suave y limón cítrico, el corazón de flores blancas y jazmín es delicado y luminoso, y la base resinosa de cedro y abeto le da profundidad inesperada. Se diferencia de la mayoría de los almizcles blancos por su base levemente resinosa. Para quienes buscan algo limpio, fresco y universalmente agradable.'
WHERE name = 'Opulent Musk';

-- Brand: Rayhaan
UPDATE products SET
  notes_top = ARRAY['Mandarina', 'Menta', 'Citron', 'Bergamota', 'Grosella Negra', 'Cilantro'],
  notes_heart = ARRAY['Albahaca', 'Zanahoria', 'Rosa'],
  notes_base = ARRAY['Ambroxan', 'Higo', 'Ámbar'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Fresca cítrica acuática costera lanzada en 2025 por Rayhaan (sub-marca de Rasasi). Abre con un blast de cítricos mediterráneos y menta, el corazón de albahaca y rosa sobre zanahoria es herbáceo y fresco, y la base de ambroxan e higo es moderna y suave. Versión más jugosa y dulce del ADN Pacific Cobra. Longevidad de 3 a 4 horas — apta para calor sin abrumar.'
WHERE name = 'Pacific Aura';

-- Brand: Paco Rabanne
UPDATE products SET
  notes_top = ARRAY['Lavanda', 'Limón', 'Limón de Amalfi'],
  notes_heart = ARRAY['Lavanda', 'Manzana', 'Humo', 'Notas Terrosas', 'Pachulí'],
  notes_base = ARRAY['Vainilla', 'Lavanda', 'Vetiver'],
  seasons = ARRAY['todo_clima', 'otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 25, age_max = 99,
  description = 'Aromático amaderado moderno y adictivo lanzado en 2021. Lavanda Creamy 3.0 como protagonista absoluta. Abre con limón y lavanda cremosa, el corazón de manzana, humo y pachulí es inesperadamente profundo, y la base de vainilla y vetiver es cálida y larga. La icónica botella con forma de robot. Proyección y duración de 8 horas. Recibe muchos cumplidos.'
WHERE name = 'Phantom My Hero';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Jacinto', 'Piña'],
  notes_heart = ARRAY['Iris', 'Pimienta Rosa', 'Jazmín'],
  notes_base = ARRAY['Almizcle', 'Ámbar', 'Pachulí', 'Vetiver', 'Vainilla'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 45,
  description = 'Floral chypre polvoriada con toque frutal. Abre con piña y jacinto vibrantes, el corazón de iris y jazmín sobre pimienta rosa es elegante y moderno, y la base terrosa de vetiver y pachulí con vainilla es suave y bien equilibrada. Unisex con tendencia femenina. Para uso cotidiano refinado.'
WHERE name = 'Philos Centro';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Frutas', 'Rosa Turca'],
  notes_heart = ARRAY['Ylang Ylang', 'Cuero', 'Nuez Moscada', 'Ámbar'],
  notes_base = ARRAY['Vetiver', 'Pachulí', 'Vainilla', 'Cedro', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 20, age_max = 60,
  description = 'Oriental floral oscuro y seductor. Abre con frutos sobre rosa turca, el corazón de ylang ylang y cuero con nuez moscada es rico y exótico, y la base de vetiver y pachulí es profunda y duradera. Más oscuro y gótico que el resto de la línea Philos. Para quienes disfrutan florales con carácter cuero-amaderado.'
WHERE name = 'Philos Opus Noir';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Naranja', 'Bergamota', 'Limón'],
  notes_heart = ARRAY['Frutas'],
  notes_base = ARRAY['Vainilla de Madagascar', 'Almizcle Blanco', 'Ámbar'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Cítrica frutal ligera y limpia, comparada con Erba Pura de Xerjoff. Abre con naranja y limón brillantes, el corazón frutal es jugoso y mediterráneo, y la base de vainilla de Madagascar y almizcle blanco es sedosa y suave. La más simple y accesible de la colección Philos. Para quienes buscan algo fresco y sin complicaciones.'
WHERE name = 'Philos Pura';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Frambuesa', 'Limón Siciliano'],
  notes_heart = ARRAY['Jazmín', 'Rosa'],
  notes_base = ARRAY['Ámbar', 'Vainilla', 'Almizcle'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Frutal floral luminosa y romántica. Abre con frambuesa y limón siciliano jugosos y alegres, el corazón de jazmín y rosa es delicado y clásico, y la base de ámbar y vainilla es cálida y duradera. La más romántica y femenina de la colección. Para el día a día con un toque de elegancia.'
WHERE name = 'Philos Rosso';

-- Brand: Paco Rabanne
UPDATE products SET
  notes_top = ARRAY['Romero', 'Salvia Clara', 'Madera de Rosewood'],
  notes_heart = ARRAY['Lavanda', 'Geranio', 'Haba Tonka'],
  notes_base = ARRAY['Musgo de Roble', 'Miel', 'Almizcle', 'Ámbar', 'Tabaco'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'noche', 'evento', 'versatil']::product_occasion[],
  age_min = 25, age_max = 99,
  description = 'Uno de los fougères más icónicos e influyentes de la perfumería masculina desde 1973. Abre con romero y salvia aromáticos y verdes, el corazón de lavanda y geranio es herbáceo y limpio, y la base de musgo de roble, miel y tabaco es cálida, profunda y atemporal. Premio Fragrance Foundation 1975. Un clásico absoluto con más de medio siglo de vigencia.'
WHERE name = 'Pour Homme';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Piña', 'Azafrán'],
  notes_heart = ARRAY['Jazmín', 'Bálsamo de Abeto'],
  notes_base = ARRAY['Ámbar', 'Cedro', 'Oud'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'casual', 'formal']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Oriental amaderado frutal clásico de Lattafa. Abre con piña y azafrán, el corazón resinoso de bálsamo de abeto y jazmín es aromático y profundo, y la base de oud y cedro es cálida. Uno de los perfumes más conocidos y accesibles de la casa. Buena relación calidad-precio para el uso diario.'
WHERE name = 'Qaed al Fursan';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Coco', 'Piña', 'Cítricos'],
  notes_heart = ARRAY['Ylang Ylang', 'Frangipani', 'Jazmín'],
  notes_base = ARRAY['Vainilla', 'Almizcle', 'Sándalo', 'Notas Dulces'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Tropical gourmand cremoso y dulce — "piña colada en una botella". Abre con coco y piña vibrantes, el corazón floral de ylang ylang y frangipani es exótico, y la base de vainilla y sándalo es cremosa y suave. Unisex con tendencia femenina. Muy fácil de llevar y agradable en clima cálido.'
WHERE name = 'Qaed al Fursan Unlimited';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Canela', 'Cardamomo', 'Mandarina', 'Nuez Moscada'],
  notes_heart = ARRAY['Caramelo', 'Lavanda', 'Salvia Clara', 'Geranio', 'Ciprés'],
  notes_base = ARRAY['Ámbar', 'Cedro', 'Olíbano', 'Labdanum', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Oriental especiado aromático con caramelo, inspirado en Versace Eros Najim. Abre con canela y cardamomo sobre mandarina, el corazón de caramelo y lavanda con ciprés es cálido y aromático, y la base resinosa de olíbano y labdanum es elegante y duradera. Para quien busca un oriental accesible con personalidad y complejidad.'
WHERE name = 'Qaed al Fursan Untamed';

-- Brand: Rayhaan
UPDATE products SET
  notes_top = ARRAY['Menta', 'Bergamota'],
  notes_heart = ARRAY['Lavanda', 'Benjuí'],
  notes_base = ARRAY['Vainilla', 'Haba Tonka'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'noche', 'cita', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Gourmand aromático dulce comparado con Le Male Elixir de JPG y Scandal Le Parfum. Abre con menta fresca y bergamota, el corazón de lavanda y benjuí es aromático y cálido, y la base de vainilla y tonka es cremosa y adictiva. Longevidad variable — funciona mejor en clima fresco.'
WHERE name = 'Rayhaan Elixir';

-- Brand: Mancera
UPDATE products SET
  notes_top = ARRAY['Canela', 'Oud Nepalés', 'Incienso', 'Azafrán', 'Nuez Moscada', 'Manzana Verde', 'Pera Blanca'],
  notes_heart = ARRAY['Pachulí', 'Jazmín'],
  notes_base = ARRAY['Tabaco', 'Vainilla de Madagascar', 'Ámbar', 'Sándalo', 'Madera de Guayaco', 'Almizcle Blanco', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'formal']::product_occasion[],
  age_min = 25, age_max = 55,
  description = 'Oriental especiado tabacalero oscuro y adictivo lanzado en 2017. Abre con durazno suave, incienso y canela sobre oud, el corazón de tabaco cubano sobre pachulí es sensual y fumado, y la base de vainilla de Madagascar y sándalo es envolvente y muy larga. Duración de 8 a 10 horas. Proyección potente — menos es más.'
WHERE name = 'Red Tobacco';

-- Brand: Mancera
UPDATE products SET
  notes_top = ARRAY['Oud', 'Canela', 'Incienso', 'Azafrán', 'Pera', 'Nuez Moscada'],
  notes_heart = ARRAY['Tabaco', 'Cuero', 'Pachulí', 'Vetiver', 'Jazmín'],
  notes_base = ARRAY['Vainilla', 'Almizcle', 'Sándalo', 'Madera de Guayaco', 'Ambergris'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'evento']::product_occasion[],
  age_min = 25, age_max = 60,
  description = 'Extrait de Parfum lanzado en 2023 — la versión "beast mode" de Red Tobacco. El cuero es más prominente, el incienso más intenso y el pachulí más oscuro. Sigue la misma dirección pero amplificada. Para quienes ya aman Red Tobacco y quieren más profundidad y duración aún.'
WHERE name = 'Red Tobacco Intense';

-- Brand: Paris Corner
UPDATE products SET
  notes_top = ARRAY['Pimienta Negra', 'Elemi', 'Pimienta Rosa'],
  notes_heart = ARRAY['Olíbano', 'Azafrán'],
  notes_base = ARRAY['Vainilla Bourbon', 'Gamuza', 'Cedro'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'cita']::product_occasion[],
  age_min = 20, age_max = 60,
  description = 'Oriental especiado oscuro y seductor, comparado con YSL Babycat. Abre con pimienta negra y elemi resinoso, el corazón de azafrán y olíbano es místico y cálido, y la base de vainilla bourbon y gamuza es sedosa y larga. La vainilla es profunda y boozy, no dulce. Para clima frío y veladas íntimas.'
WHERE name = 'Rifaaqat';

-- Brand: Dior
UPDATE products SET
  notes_top = ARRAY['Bergamota Calabresa', 'Pimienta de Sichuan'],
  notes_heart = ARRAY['Lavanda', 'Pimienta Rosa', 'Geranio', 'Pachulí', 'Vetiver', 'Elemi'],
  notes_base = ARRAY['Ambroxan', 'Cedro', 'Labdanum'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'versatil']::product_occasion[],
  age_min = 18, age_max = 60,
  description = 'El perfume masculino más vendido del mundo. Abre con bergamota calabresa brillante y pimienta de Sichuan, el corazón de lavanda y ambroxan es fresco y magnético, y la base de cedro y labdanum es moderna y seca. Proyección fuerte las primeras horas. La fragancia que "todos usan" pero con razón — es simplemente excelente.'
WHERE name = 'Sauvage EDT';

-- Brand: Dior
UPDATE products SET
  notes_top = ARRAY['Bergamota'],
  notes_heart = ARRAY['Pimienta de Sichuan', 'Lavanda', 'Anís Estrellado', 'Nuez Moscada'],
  notes_base = ARRAY['Ambroxan', 'Vainilla'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'casual', 'formal']::product_occasion[],
  age_min = 18, age_max = 60,
  description = 'Versión más concentrada y cálida del Sauvage. La vainilla en base le da más suavidad y sensualidad. Proyecta menos que el EDT pero dura más (8 a 10 horas). Más ambroxan-forward y cercana a la piel. Para quienes quieren el ADN Sauvage con mayor intimidad y calidez.'
WHERE name = 'Sauvage EDP';

-- Brand: Jean Paul Gaultier
UPDATE products SET
  notes_top = ARRAY['Salvia Clara', 'Mandarina'],
  notes_heart = ARRAY['Caramelo', 'Haba Tonka'],
  notes_base = ARRAY['Vetiver'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual', 'cita', 'evento']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Oriental dulce gourmand moderno lanzado en 2021. Abre con salvia aromática y mandarina, el corazón de caramelo y tonka es dulce y adictivo, y la base de vetiver es la nota que lo ancla en tierra. Extremadamente popular en las redes sociales por sus cumplidos. Proyección fuerte — con 2 sprays es suficiente.'
WHERE name = 'Scandal Pour Homme';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Mandarina Verde', 'Bergamota', 'Grosella Negra'],
  notes_heart = ARRAY['Notas Aromáticas', 'Especias', 'Jazmín', 'Pimienta Rosa', 'Lavanda'],
  notes_base = ARRAY['Ámbar', 'Almizcle', 'Notas Amaderadas', 'Vetiver'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'versatil', 'casual', 'formal']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Frutal especiado amaderado fresco y complejo, comparado con Creed God of Fire. Abre con mandarina verde y grosella negra, el corazón aromático especiado de jazmín y lavanda sobre pimienta rosa es refinado, y la base de ámbar y vetiver es duradera. Necesita maceración. Unisex con tendencia masculina.'
WHERE name = 'Sceptre Malachite';

-- Brand: Viktor & Rolf
UPDATE products SET
  notes_top = ARRAY['Pimienta Rosa', 'Elemi', 'Bergamota', 'Pomelo'],
  notes_heart = ARRAY['Canela', 'Paprika', 'Azafrán'],
  notes_base = ARRAY['Tabaco', 'Cuero', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Especiado oriental explosivo desde 2012. Abre con pimienta rosa y pomelo, el corazón de canela y paprika es ardiente y único, y la base de tabaco y cuero es oscura y seca. Más fresco y cítrico que el Extreme. Para salidas nocturnas y clima frío.'
WHERE name = 'Spicebomb';

-- Brand: Viktor & Rolf
UPDATE products SET
  notes_top = ARRAY['Pomelo', 'Pimiento de Jamaica', 'Pimienta Negra'],
  notes_heart = ARRAY['Canela', 'Azafrán', 'Comino'],
  notes_base = ARRAY['Tabaco', 'Vainilla', 'Bourbon', 'Ámbar', 'Cistus'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'cita', 'formal']::product_occasion[],
  age_min = 20, age_max = 45,
  description = 'Versión más cálida, dulce y sofisticada del Spicebomb original, lanzada en 2015. Abre con pimienta y pomelo más moderados, el corazón de canela y azafrán sobre comino es especiado y rico, y la base de tabaco, vainilla y bourbon es suntuosa y larga. Duración de 8 a 10 horas. Para cenas, salidas románticas y eventos donde querés hacer una impresión duradera.'
WHERE name = 'Spicebomb Extreme';

-- Brand: Emper
UPDATE products SET
  notes_top = ARRAY['Cardamomo', 'Violeta'],
  notes_heart = ARRAY['Iris', 'Ámbar'],
  notes_base = ARRAY['Sándalo', 'Cuero', 'Papiro', 'Cedro Virginiano'],
  seasons = ARRAY['todo_clima', 'otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual', 'formal']::product_occasion[],
  age_min = 20, age_max = 99,
  description = 'Amaderado aromático polvoriado, alternativa accesible a Le Labo Santal 33. Abre con cardamomo especiado y violeta floral, el corazón de iris polvoriado sobre ámbar es elegante y sofisticado, y la base de sándalo, cuero y papiro es cálida, seca y distintiva. Unisex bien equilibrado. Para quien ama los amaderados refinados sin ser dulces.'
WHERE name = 'Stallion 53';

-- Brand: Emporio Armani (EDT)
UPDATE products SET
  notes_top = ARRAY['Cardamomo', 'Pimienta Rosa', 'Hoja de Violeta'],
  notes_heart = ARRAY['Salvia'],
  notes_base = ARRAY['Castaño Cristalizado', 'Vainilla Jungle Essence', 'Amberwood'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Fougère oriental moderno lanzado en 2017 — el pilar de la colección SWY. Abre con cardamomo y pimienta rosa sobre violeta, el corazón de salvia es aromático y limpio, y la base de castaño cristalizado y vainilla es cálida y única. Más fresco y menos dulce que los flankers. El más versátil de la familia.'
WHERE name = 'Stronger With You';

-- Brand: Emporio Armani
UPDATE products SET
  notes_top = ARRAY['Ron', 'Elemi', 'Bergamota'],
  notes_heart = ARRAY['Lavanda', 'Davana'],
  notes_base = ARRAY['Vainilla de Madagascar', 'Castaño', 'Cedro', 'Pachulí'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual', 'cita']::product_occasion[],
  age_min = 25, age_max = 50,
  description = 'La versión más boozy y oscura de la familia SWY, lanzada en 2021. Abre con ron y bergamota cálidos, el corazón de lavanda y davana es herbal y complejo, y la base de vainilla de Madagascar con castaño y pachulí es profunda y elegante. Menos dulce que Intensely, más sofisticada. Para quien quiere el ADN SWY con más madurez y carácter.'
WHERE name = 'Stronger WIth You Absolutely';

-- Brand: Emporio Armani
UPDATE products SET
  notes_top = ARRAY['Pimienta Rosa', 'Enebro', 'Violeta'],
  notes_heart = ARRAY['Toffee', 'Canela', 'Lavanda', 'Salvia'],
  notes_base = ARRAY['Vainilla', 'Haba Tonka', 'Ámbar', 'Gamuza'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Gourmand oriental dulce y adictivo lanzado en 2019 — el más popular de la familia SWY. Abre con pimienta rosa y enebro, el corazón de toffee y canela sobre lavanda es caramelado y festivo, y la base de tonka y gamuza es suave y duradera. La más dulce y juvenil de la línea. Duración de 8 a 12 horas.'
WHERE name = 'Stronger With You Intensely';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Ambrette', 'Mandarina', 'Almizcle'],
  notes_heart = ARRAY['Naranja', 'Peonía', 'Iris'],
  notes_base = ARRAY['Haba Tonka', 'Heliotropo', 'Cebada'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Floral frutal cremosa y suave, alternativa a Jo Malone Scarlet Poppy Cologne Intense. La nota de cebada le da un carácter único de "leche de cereales" que la diferencia de los gourmands convencionales. Abre con mandarina y almizcle, el corazón de peonía e iris es delicado y femenino, y la base de tonka y heliotropo es cremosa. Necesita maceración. Para las que buscan algo suave, sofisticado y diferente.'
WHERE name = 'Sweet Paradise';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Azafrán', 'Bergamota'],
  notes_heart = ARRAY['Licor de Ciruela', 'Canela'],
  notes_base = ARRAY['Ámbar', 'Haba Tonka', 'Benzoin'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual', 'cita']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'Oriental especiado boozy y elegante, creado por Quentin Bisch. Abre con azafrán dorado y bergamota, el corazón de licor de ciruela y canela es oscuro, frutal y adictivo, y la base de ámbar, tonka y benzoin es balsámica y larga. Comparada con Khamrah Qahwa pero más refinada y menos dulce. Una de las mejores propuestas de Lattafa en 2024.'
WHERE name = 'Teriaq Intense';

-- Brand: Lattafa (edad_min/edad_max provistos por el usuario, no estaban en el texto original)
UPDATE products SET
  notes_top = ARRAY['Menta', 'Lavanda', 'Salvia'],
  notes_heart = ARRAY['Vainilla', 'Tabaco', 'Flor de Naranjo'],
  notes_base = ARRAY['Benzoin', 'Haba Tonka', 'Labdanum'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Fougère aromático especiado con tabaco, comparado con Le Male Elixir y Stronger With You. Abre con menta y salvia frescas, el corazón de tabaco sobre vainilla y flor de naranjo es cálido y seductor, y la base balsámica de benzoin y labdanum es elegante y larga.'
WHERE name = 'The Kingdom';

-- Brand: Azzaro
UPDATE products SET
  notes_top = ARRAY['Cardamomo'],
  notes_heart = ARRAY['Toffee'],
  notes_base = ARRAY['Amberwood'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Oriental especiado dulce minimalista y adictivo. Solo tres notas pero tremendamente efectivo. Cardamomo picante en apertura, toffee caramelado en el corazón, y amberwood cálido y seco en base. Duración de 8 a 10 horas. El perfume que más se compara con Stronger With You Intensely. Una de las mejores relaciones calidad-precio del mercado designer.'
WHERE name = 'The Most Wanted EDP';

-- Brand: Azzaro (en Fragrantica figura como "The Most Wanted Intense")
UPDATE products SET
  notes_top = ARRAY['Canela', 'Mandarina', 'Lavanda', 'Limón'],
  notes_heart = ARRAY['Notas Frutales', 'Incienso', 'Cedro Rojo', 'Comino'],
  notes_base = ARRAY['Tabaco', 'Vainilla', 'Cedro', 'Cuero', 'Benzoin', 'Ciprés', 'Pachulí'],
  seasons = ARRAY['primavera', 'otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Fresco floral especiado con base amaderada seca, lanzado en 2024. Más fresco y ligero que el EDP — cercano al ADN de YSL MYSLF. Abre con canela y mandarina sobre lavanda y limón, el corazón de incienso y cedro rojo es aromático y único, y la base de tabaco y vainilla le da calidez. Muy versátil y recibe cumplidos.'
WHERE name = 'The Most Wanted EDT Intense';

-- Brand: Azzaro
UPDATE products SET
  notes_top = ARRAY['Jengibre'],
  notes_heart = ARRAY['Notas Amaderadas'],
  notes_base = ARRAY['Vainilla Bourbon'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 20, age_max = 45,
  description = 'La versión más seca, madura y menos dulce de la familia, lanzada en 2022. Solo tres notas esenciales. Jengibre especiado y seco, maderas cálidas en el corazón, y vainilla bourbon suave y cremosa en base. Para quien ama el ADN Most Wanted pero quiere algo más refinado, menos caramelado y más adulto.'
WHERE name = 'The Most Wanted Parfum';

-- Brand: Dolce & Gabbana (Masculino)
UPDATE products SET
  notes_top = ARRAY['Pomelo', 'Coriandro', 'Albahaca'],
  notes_heart = ARRAY['Jengibre', 'Cardamomo', 'Flor de Naranjo'],
  notes_base = ARRAY['Tabaco', 'Ámbar', 'Cedro'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento', 'formal']::product_occasion[],
  age_min = 25, age_max = 50,
  description = 'Versión más intensa y tabacalera del clásico The One EDT de 2008, lanzada en 2015. Abre con pomelo y coriandro elegantes, el corazón de jengibre y cardamomo sobre flor de naranjo es cálido y masculino, y la base de tabaco, ámbar y cedro es oscura y sofisticada. Longevidad de 4 a 6 horas — la única debilidad. Para noches de invierno y citas románticas.'
WHERE name = 'The One EDP';

-- Brand: Rayhaan
UPDATE products SET
  notes_top = ARRAY['Nuez Moscada', 'Clavo', 'Limón'],
  notes_heart = ARRAY['Leche', 'Rosa', 'Davana'],
  notes_base = ARRAY['Ámbar', 'Pachulí', 'Olíbano', 'Labdanum'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 20, age_max = 50,
  description = 'Oriental especiado lácteo con profundidad resinosa, comparado con Rasasi Mohra. Abre con nuez moscada y clavo sobre limón fresco, el corazón de leche y davana sobre rosa es exótico y cremoso, y la base de ámbar, pachulí y olíbano es oscura y duradera. Proyección moderada con evolución notable en la piel.'
WHERE name = 'Tiger';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Tabaco', 'Especias'],
  notes_heart = ARRAY['Tabaco', 'Vainilla', 'Haba Tonka', 'Cacao'],
  notes_base = ARRAY['Frutas Secas', 'Notas Amaderadas'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual']::product_occasion[],
  age_min = 25, age_max = 99,
  description = 'Tabacalero vainillado cremoso, alternativa accesible a Tom Ford Tobacco Vanille. Abre con tabaco y especias, el corazón de tabaco cubano sobre vainilla y cacao es suave, redondo y adictivo, y la base de frutas secas y maderas es cálida. Se vuelve más suave con el tiempo — la vainilla domina en el drydown. Unisex con leve tendencia masculina.'
WHERE name = 'Tobacco Touch';

-- Brand: Moschino
UPDATE products SET
  notes_top = ARRAY['Pimienta Rosa', 'Pera', 'Nuez Moscada Indonesia', 'Elemi', 'Bergamota'],
  notes_heart = ARRAY['Rosa Absoluta', 'Magnolia', 'Clavo', 'Lino'],
  notes_base = ARRAY['Vetiver Haitiano', 'Cashmeran', 'Sándalo', 'Ambermax', 'Almizcle'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'cita', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Floral especiado amaderado inesperado e icónico, creado por Yann Vasnier en 2019. Abre con pimienta rosa y pera jugosa, el corazón de rosa absoluta y clavo es la estrella — floral masculino audaz y polarizante, y la base de vetiver y cashmeran es terrosa y elegante. No es para todos — la rosa es muy prominente. Para hombres seguros de sí mismos que buscan algo diferente.'
WHERE name = 'Toy Boy';

-- Brand: Rayhaan
UPDATE products SET
  notes_top = ARRAY['Mango', 'Piña', 'Bergamota'],
  notes_heart = ARRAY['Flores Blancas', 'Brisa Marina', 'Coco'],
  notes_base = ARRAY['Almizcle', 'Notas Amaderadas'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Tropical frutal marina fresca y unisex. Abre con mango y piña vibrantes sobre bergamota, el corazón de flores blancas y coco con brisa marina es playero y ligero, y la base de almizcle es suave y aireada. Más suave y delicada que Lattafa Petra — para quienes quieren la vibe playa sin que sea agresiva. Longevidad moderada.'
WHERE name = 'Tropical Vibes';

-- Brand: Afnan
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Mandarina'],
  notes_heart = ARRAY['Ámbar', 'Notas Amaderadas'],
  notes_base = ARRAY['Almizcle', 'Pachulí', 'Especias Frescas'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'oficina', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Cítrico amaderado fresco y elegante, alternativa accesible a Bvlgari Tygar. Abre con bergamota y mandarina brillantes, el corazón de ámbar y maderas es suave y moderno, y la base de almizcle y pachulí es cálida y duradera. Simple y efectivo — lo que ves es lo que obtenés. Proyección fuerte en calor. Necesita maceración para mejor rendimiento.'
WHERE name = 'Turathi Blue';

-- Brand: Afnan
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Pomelo Rosa', 'Pera', 'Mandarina'],
  notes_heart = ARRAY['Manzana', 'Cedro', 'Flor de Naranjo'],
  notes_base = ARRAY['Vainilla', 'Ámbar Seco', 'Almizcle', 'Ambroxan'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Frutal cítrica fresca y solar con base ambarada moderna. Más dulce y frutal que Turathi Blue — la manzana y el ambroxan le dan más carácter luminoso. Abre con pomelo rosa y pera, el corazón de flor de naranjo y cedro es limpio y moderno, y la base de vainilla y ambroxan es suave y contemporánea. Para días de verano y look casual relajado.'
WHERE name = 'Turathi Electric';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Manzana', 'Humo', 'Canela'],
  notes_heart = ARRAY['Tabaco', 'Musgo'],
  notes_base = ARRAY['Vainilla Bourbon', 'Orcanox™'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 20, age_max = 45,
  description = 'Oriental ahumado tabacalero con acorde de narguile — manzana y humo de carbón desde el primer spray. Abre con manzana dulce y humo denso, el corazón de tabaco y musgo es terroso y misterioso, y la base de vainilla bourbon con Orcanox™ (acorde ambarado exclusivo) es cálida y persistent. Para los amantes de los orientales oscuros y fumados. No es una fragancia segura de comprar a ciegas.'
WHERE name = 'Veneno';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Bergamota', 'Neroli', 'Leche'],
  notes_heart = ARRAY['Tiaré', 'Ylang Ylang', 'Flores Blancas'],
  notes_base = ARRAY['Coco', 'Vainilla', 'Madera de Guayaco', 'Labdanum'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Floral tropical cremosa con aroma a bloqueador solar de lujo. Abre con neroli y bergamota sobre leche cremosa, el corazón de tiaré y ylang ylang es exótico y solar, y la base de coco y labdanum es resinosa y elegante. Para quien ama el estilo "Olympéa Solar" o "Qaed Al Fursan Unlimited" con más floral y menos dulzura. Unisex con tendencia femenina.'
WHERE name = 'Veneno Bianco';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Tarta de Limón al Merengue'],
  notes_heart = ARRAY['Neroli'],
  notes_base = ARRAY['Vainilla'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'cita', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Gourmand cítrico minimalista y sorprendente, lanzada en 2025. La nota de tarta de limón al merengue es el protagonista absoluto — cítrica, cremosa y azucarada a la vez. El neroli en corazón aporta frescura floral y el drydown de vainilla es suave y limpio. Simple pero bien ejecutada. Para quienes aman los gourmands ligeros sin que sean pesados. Unisex con tendencia femenina.'
WHERE name = 'Victoria';

-- Brand: Lattafa Pride
UPDATE products SET
  notes_top = ARRAY['Lavanda', 'Salvia', 'Bergamota'],
  notes_heart = ARRAY['Ciruela', 'Palo Santo', 'Pimienta Negra'],
  notes_base = ARRAY['Sándalo', 'Amberwood'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Oriental amaderado aromático único, alternativa a Initio Paragon. Abre con lavanda y salvia aromáticas sobre bergamota, el corazón de ciruela oscura y palo santo es la combinación más distintiva — ahumada, resinosa y frutal a la vez, y la base de sándalo y amberwood es cálida y envolvente. Una de las propuestas más originales de Lattafa Pride.'
WHERE name = 'Vintage Radio';

-- Brand: Paris Corner
UPDATE products SET
  notes_top = ARRAY['Albahaca', 'Limón', 'Citron', 'Bergamota'],
  notes_heart = ARRAY['Verbena', 'Jazmín', 'Ambrettolide'],
  notes_base = ARRAY['Almizcle'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Cítrica aromática ultra-fresca y limpia, alternativa a Hermès Twilly d''Hermès EDT. Abre con albahaca y citron sobre limón vibrante, el corazón de verbena y jazmín sobre ambrettolide es fresco y sofisticado, y la base de almizcle es sutil y aireada. Muy ligera — ideal para calor extremo donde perfumes más pesados no funcionan. Unisex puro.'
WHERE name = 'Voux Zingy';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Grosella Negra', 'Mora', 'Bergamota', 'Romero'],
  notes_heart = ARRAY['Frambuesa', 'Vodka', 'Muguet', 'Albahaca'],
  notes_base = ARRAY['Fresa', 'Almizcle', 'Durazno', 'Ámbar', 'Sándalo', 'Pachulí', 'Incienso'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'noche', 'casual', 'versatil']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Frutal floral chispeante y vibrante — "limonada rosada efervescente". Abre con grosella y mora sobre bergamota aromática, el corazón de frambuesa y vodka con muguet es refrescante y femenino, y la base de sándalo e incienso le da profundidad inesperada. La más femenina y fresca de la trilogía Vulcan. Unisex con clara tendencia femenina.'
WHERE name = 'Vulcan Baie';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Mango', 'Limón', 'Jengibre', 'Ruibarbo'],
  notes_heart = ARRAY['Pimienta Rosa', 'Jazmín', 'Violeta', 'Praliné'],
  notes_base = ARRAY['Haba Tonka', 'Cedro', 'Ambergris', 'Musgo'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento']::product_occasion[],
  age_min = 18, age_max = 40,
  description = 'Frutal especiado ambarado con praliné — la más potente y seductora de la trilogía Vulcan. Abre con mango y jengibre sobre ruibarbo, el corazón de pimienta rosa y praliné sobre violeta es cálido y gourmand, y la base de tonka y ambergris es lujosa y muy duradera. La favorita de la línea según la mayoría de usuarios.'
WHERE name = 'Vulcan Feu';

-- Brand: French Avenue
UPDATE products SET
  notes_top = ARRAY['Whiskey', 'Naranja', 'Mandarina', 'Coriandro'],
  notes_heart = ARRAY['Haba Tonka', 'Cashmeran', 'Styrax', 'Anís'],
  notes_base = ARRAY['Vainilla', 'Benzoin', 'Pachulí'],
  seasons = ARRAY['otono', 'invierno']::product_season[],
  occasions = ARRAY['noche', 'casual']::product_occasion[],
  age_min = 20, age_max = 55,
  description = 'Oriental boozy especiado y complejo — la más madura y oscura de la familia Vulcan. Abre con whiskey y naranja especiada sobre coriandro, el corazón de tonka y styrax resinoso es cremoso y oscuro, y la base de vainilla y benzoin es balsámica y muy larga (12+ horas). La más subestimada de la línea según quienes la prueban. Para amantes de los orientales adultos.'
WHERE name = 'Vulcan Sable';

-- Brand: Azzaro
UPDATE products SET
  notes_top = ARRAY['Frambuesa', 'Mandarina Verde', 'Bergamota'],
  notes_heart = ARRAY['Cardamomo', 'Lavanda', 'Salvia Clara'],
  notes_base = ARRAY['Cuero', 'Wolfwood', 'Vetiver'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['noche', 'cita', 'evento']::product_occasion[],
  age_min = 25, age_max = 55,
  description = 'Cuero frutal moderno y seductor lanzado en 2025 — alternativa accesible a Tom Ford Ombré Leather. Abre con frambuesa jugosa y mandarina verde, el corazón de cardamomo y lavanda es aromático y especiado, y la base de cuero y wolfwood es suave, cálida y duradera. Proyección moderada pero tenaz. Para quien quiere introducirse en el cuero sin que sea agresivo.'
WHERE name = 'Wanted Forever Elixir';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Mandarina', 'Heliotropo', 'Orquídea'],
  notes_heart = ARRAY['Acorde Gourmand', 'Frutas Tropicales'],
  notes_base = ARRAY['Vainilla', 'Sándalo', 'Almizcle'],
  seasons = ARRAY['primavera', 'verano', 'otono']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Oriental vainillada frutal tropical femenina — una de las más vendidas de Lattafa. Abre con mandarina y orquídea sobre heliotropo, el corazón gourmand de frutas tropicales es suave y adictivo, y la base de vainilla y sándalo es cálida y sedosa. Sillage generoso las primeras horas. La de mayor venta dentro de la familia Yara.'
WHERE name = 'Yara';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Mandarina Verde', 'Grosella Negra'],
  notes_heart = ARRAY['Gardenia', 'Caramelo de Fresa Efervescente'],
  notes_base = ARRAY['Sándalo', 'Vainilla Syrup', 'Almizcle', 'Ámbar'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 15, age_max = 30,
  description = 'La más dulce y candy de la familia Yara. Abre con grosella negra y mandarina con un toque tartoso, el corazón de caramelo de fresa efervescente y gardenia es puro deleite, y la base de vainilla syrup y ámbar es suave y duradera. Comparada con Dior Poison Girl pero más accesible y jovial. La más gourmand de la colección.'
WHERE name = 'Yara Candy';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Pera', 'Pimienta Rosa', 'Grosella Negra'],
  notes_heart = ARRAY['Tuberosa', 'Jazmín', 'Almendra'],
  notes_base = ARRAY['Vainilla', 'Cashmeran', 'Pachulí'],
  seasons = ARRAY['otono', 'invierno', 'primavera']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 20, age_max = 40,
  description = 'La más tranquila, íntima y madura de la colección Yara. Abre con pera y grosella sobre pimienta rosa, el corazón de tuberosa, jazmín y almendra es floral cremoso y sensual, y la base de cashmeran y pachulí es cálida y sutil. Menor proyección que las otras — es un perfume de piel. Para quienes quieren algo elegante y discreto.'
WHERE name = 'Yara Moi';

-- Brand: Lattafa
UPDATE products SET
  notes_top = ARRAY['Coco', 'Mango', 'Maracuyá'],
  notes_heart = ARRAY['Jazmín', 'Heliotropo', 'Flor de Naranjo'],
  notes_base = ARRAY['Cashmeran', 'Vainilla', 'Almizcle'],
  seasons = ARRAY['primavera', 'verano']::product_season[],
  occasions = ARRAY['diario', 'casual']::product_occasion[],
  age_min = 18, age_max = 35,
  description = 'Tropical frutal floral cremosa y solar. Abre con coco, mango y maracuyá jugosos y vibrantes, el corazón de jazmín y flor de naranjo sobre heliotropo es exótico y luminoso, y la base de cashmeran y vainilla es suave y sedosa. La más fresca y tropical de la familia. Para días de verano y quien quiere vibe vacacional sin agobiar.'
WHERE name = 'Yara Tous';

-- Brand: Maison Alhambra
UPDATE products SET
  notes_top = ARRAY['Manzana', 'Aldeídos', 'Jengibre', 'Pomelo'],
  notes_heart = ARRAY['Lavanda', 'Salvia', 'Geranio'],
  notes_base = ARRAY['Haba Tonka', 'Olíbano', 'Cedro', 'Pachulí'],
  seasons = ARRAY['todo_clima']::product_season[],
  occasions = ARRAY['diario', 'casual', 'formal']::product_occasion[],
  age_min = 25, age_max = 55,
  description = 'Fougère aromático oscuro y elegante, versión más profunda del Yeah! EDP — inspirado en YSL Y Parfum. Abre con manzana limpia y aldeídos frescos sobre jengibre, el corazón de lavanda y salvia con geranio es aromático y sofisticado, y la base de olíbano y pachulí le da oscuridad y profundidad. Más serio y masculino que el EDP regular.'
WHERE name = 'Yeah! Man Parfum';

-- ============================================================
-- RESUMEN
-- ============================================================
-- Total de UPDATE generados: 175
--
-- Casos dudosos / a revisar manualmente:
--   1. Nombres con formato de marca inconsistente en el texto fuente — verificar
--      que "brand" en la DB coincide (no se usó en el WHERE, solo se dejó como comentario):
--        - "Rabanne" (Invictus Parfum) vs "Paco Rabanne" en el resto de items Paco Rabanne.
--        - "Rayhaan " con espacio final en el texto original (Rayhaan Elixir) — se
--          normalizó el comentario de marca a "Rayhaan" sin espacio, pero si el
--          campo brand en la DB tiene el espacio final, no afecta el WHERE (usa name).
--        - "Lira — Casamorati 1888 (Xerjoff)" — nombre de producto probablemente
--          guardado en DB solo como "Lira"; se usó WHERE name = 'Lira'. Verificar
--          que no exista colisión con otro perfume llamado igual de otra marca.
--   2. "The Kingdom" (Lattafa): edad_min/edad_max (18-40) fueron provistos directamente
--      por el usuario porque el texto original no traía edad recomendada para este ítem.
--      Se ignoró completamente la versión femenina (Pera/Peonía/Grosella Negra) según instrucción.
--   3. "The Most Wanted EDT Intense" (Azzaro): el texto aclara que en Fragrantica figura
--      como "The Most Wanted Intense" (sin "EDT") — verificar cuál es el nombre exacto
--      guardado en la tabla products antes de correr el UPDATE.
--   4. Seasons con formato "Todo el año — especialmente X y Y": se interpretó como
--      ARRAY['todo_clima', 'X', 'Y']. Aplicado en: Amber Oud Gold Edition (primavera,
--      verano), Cedrat Boisé (primavera, verano), Club de Nuit Intense Man (otono,
--      invierno), Phantom My Hero (otono, invierno), Stallion 53 (otono, invierno,
--      primavera), The Most Wanted EDT Intense (uso "Primavera / Otoño / Invierno" tal
--      cual, no lleva todo_clima).
--   5. Occasions: mapeo por palabras clave con juicio editorial en casos ambiguos como
--      "Deporte, playa y salidas informales" → se incluyó 'deportivo' solo cuando el
--      texto lo menciona explícitamente (ej. Dark Door Sport, Odyssey Aqua no menciona
--      deporte explícito, se dejó sin 'deportivo' aunque compare con fragancias sport).
--   6. Perfumes con notas muy largas (10+) como Forbidden Love, Red Tobacco, L'Eau
--      d'Issey Miyake Pour Homme: se transcribieron todas las notas tal cual el texto,
--      sin recortar, lo que genera arrays largos — verificar que no haya límite de
--      longitud de columna o de UI en el frontend del quiz.
--   7. Verificar manualmente que todos los 170 nombres listados coincidan carácter por
--      carácter (tildes, mayúsculas, símbolos como "!" en "Yeah! Man Parfum" o comillas
--      en "L'Eau d'Issey Miyake Pour Homme") con los valores reales en la columna name
--      de la tabla products, ya que un mismatch silencioso en UPDATE ... WHERE name = ...
--      simplemente afecta 0 filas sin error visible.
-- ============================================================
