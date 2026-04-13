-- ============================================================
-- GOURMAND — Seed de datos de prueba
-- ============================================================

-- ——————————————————————————
-- PRODUCTOS
-- ——————————————————————————

INSERT INTO products (id, name, brand, description, short_desc, category, gender, concentration, seasons, is_featured, is_new, is_active, sort_order) VALUES

-- NICHO
('11111111-0000-0000-0000-000000000001',
 'Black Phantom', 'Kilian',
 'Un ron especiado envuelto en café, almendras tostadas y vainilla oscura. Profundo, adictivo, inevitablemente memorioso.',
 'Café, ron y sombras de vainilla. Una fragancia que cuenta historias sin decir una palabra.',
 'nicho', 'unisex', 'edp',
 ARRAY['invierno', 'otono']::product_season[], true, false, true, 1),

('11111111-0000-0000-0000-000000000002',
 'Santal 33', 'Le Labo',
 'La fragancia definitoria de una era. Cedro, sándalo australiano, violeta. Simple en nombre, infinita en complejidad.',
 'El sándalo que redefinió el lujo contemporáneo.',
 'nicho', 'unisex', 'edp',
 ARRAY['todo_clima']::product_season[], true, true, true, 2),

('11111111-0000-0000-0000-000000000003',
 'Oud Satin Mood', 'Maison Francis Kurkdjian',
 'Rosa, oud y vainilla se fusionan en una nube de seda pura. Opulencia sin peso, lujo sin esfuerzo.',
 'Rosa y oud envueltos en seda invisible.',
 'nicho', 'mujer', 'edp',
 ARRAY['invierno', 'otono', 'primavera']::product_season[], true, true, true, 3),

('11111111-0000-0000-0000-000000000004',
 'Portrait of a Lady', 'Frederic Malle',
 'Un ícono de la perfumería moderna. Rosa turca, patchouli y madera de cedro construyen una figura misteriosa e irresistible.',
 'La mujer que todos quieren conocer, nadie puede definir.',
 'nicho', 'mujer', 'edp',
 ARRAY['invierno', 'otono']::product_season[], false, false, true, 4),

('11111111-0000-0000-0000-000000000005',
 'Aventus', 'Creed',
 'Piña, bergamota, ahumado de abedul y musgo de roble. El perfume del hombre que construye imperios.',
 'Poder destilado. Sin más.',
 'nicho', 'hombre', 'edp',
 ARRAY['primavera', 'otono', 'todo_clima']::product_season[], true, false, true, 5),

-- ÁRABE
('22222222-0000-0000-0000-000000000001',
 'Oud Wood', 'Tom Ford',
 'Oud ahumado con notas de palisandro, notas especiadas y ámbar. La puerta de entrada perfecta al mundo del oud.',
 NULL,
 'arabe', 'unisex', 'edp',
 ARRAY['invierno', 'otono']::product_season[], true, false, true, 1),

('22222222-0000-0000-0000-000000000002',
 'Baccarat Rouge 540', 'Maison Francis Kurkdjian',
 'Jazmín, azafrán, cedro de cedro y resina ambargrís. El perfume más imitado de la última década.',
 NULL,
 'arabe', 'unisex', 'edp',
 ARRAY['todo_clima']::product_season[], true, true, true, 2),

('22222222-0000-0000-0000-000000000003',
 'Rose Oud', 'Rasasi',
 'Rosa de Damasco y oud envejecido. Tradición oriental en su máxima expresión, a un precio sorprendente.',
 NULL,
 'arabe', 'unisex', 'parfum',
 ARRAY['invierno', 'primavera']::product_season[], false, true, true, 3),

-- DISEÑADOR
('33333333-0000-0000-0000-000000000001',
 'Bleu de Chanel', 'Chanel',
 'La frescura de los cítricos mediterráneos con profundidad de cedro, incienso y sándalo. Atemporal.',
 NULL,
 'disenador', 'hombre', 'edp',
 ARRAY['todo_clima']::product_season[], true, false, true, 1),

('33333333-0000-0000-0000-000000000002',
 'N°5', 'Chanel',
 'El perfume más famoso del mundo. Aldehídos, rosa y jazmín sobre una base de sándalo y vainilla.',
 NULL,
 'disenador', 'mujer', 'edp',
 ARRAY['todo_clima']::product_season[], true, false, true, 2),

('33333333-0000-0000-0000-000000000003',
 'Sauvage', 'Dior',
 'Bergamota calabresa y pimienta de Sichuan sobre Ambroxan. El diseñador más vendido de los últimos años.',
 NULL,
 'disenador', 'hombre', 'edt',
 ARRAY['primavera', 'verano', 'todo_clima']::product_season[], true, false, true, 3),

('33333333-0000-0000-0000-000000000004',
 'La Vie Est Belle', 'Lancôme',
 'Iris, pralinée y pachulí. Dulce, femenino y reconocible al instante.',
 NULL,
 'disenador', 'mujer', 'edp',
 ARRAY['todo_clima']::product_season[], false, false, true, 4);

-- ——————————————————————————
-- VARIANTES (tamaños y precios)
-- ——————————————————————————

INSERT INTO product_variants (product_id, size_ml, price, stock, is_active) VALUES
-- Black Phantom
('11111111-0000-0000-0000-000000000001', 50, 85000, 12, true),
('11111111-0000-0000-0000-000000000001', 100, 145000, 8, true),

-- Santal 33
('11111111-0000-0000-0000-000000000002', 50, 110000, 6, true),
('11111111-0000-0000-0000-000000000002', 100, 190000, 3, true),

-- Oud Satin Mood
('11111111-0000-0000-0000-000000000003', 70, 165000, 5, true),

-- Portrait of a Lady
('11111111-0000-0000-0000-000000000004', 50, 120000, 7, true),
('11111111-0000-0000-0000-000000000004', 100, 210000, 4, true),

-- Aventus
('11111111-0000-0000-0000-000000000005', 50, 140000, 4, true),
('11111111-0000-0000-0000-000000000005', 100, 240000, 2, true),

-- Oud Wood
('22222222-0000-0000-0000-000000000001', 50, 95000, 10, true),
('22222222-0000-0000-0000-000000000001', 100, 160000, 6, true),

-- Baccarat Rouge 540
('22222222-0000-0000-0000-000000000002', 35, 120000, 8, true),
('22222222-0000-0000-0000-000000000002', 70, 210000, 4, true),

-- Rose Oud
('22222222-0000-0000-0000-000000000003', 100, 55000, 15, true),

-- Bleu de Chanel
('33333333-0000-0000-0000-000000000001', 50, 65000, 20, true),
('33333333-0000-0000-0000-000000000001', 100, 110000, 12, true),

-- N°5
('33333333-0000-0000-0000-000000000002', 35, 75000, 8, true),
('33333333-0000-0000-0000-000000000002', 100, 180000, 5, true),

-- Sauvage
('33333333-0000-0000-0000-000000000003', 60, 70000, 18, true),
('33333333-0000-0000-0000-000000000003', 100, 105000, 10, true),

-- La Vie Est Belle
('33333333-0000-0000-0000-000000000004', 50, 58000, 14, true),
('33333333-0000-0000-0000-000000000004', 100, 95000, 9, true);

-- ——————————————————————————
-- KITS
-- ——————————————————————————

INSERT INTO kits (id, name, description, price, stock, is_active, is_featured) VALUES
('aaaaaaaa-0000-0000-0000-000000000001',
 'Kit Nicho Iniciación',
 'El punto de entrada perfecto al mundo de la perfumería nicho. Black Phantom (50ml) + Santal 33 (50ml). Dos íconos que te van a cambiar la forma de entender el perfume.',
 185000, 5, true, true),

('aaaaaaaa-0000-0000-0000-000000000002',
 'Kit Diseñador Premium',
 'Lo mejor de la perfumería de autor accesible. Bleu de Chanel (50ml) + Sauvage (60ml). El dúo ganador para el hombre moderno.',
 120000, 8, true, true);

-- Kit items (referencing first variant of each product)
INSERT INTO kit_items (kit_id, variant_id, quantity)
SELECT 'aaaaaaaa-0000-0000-0000-000000000001', id, 1
FROM product_variants
WHERE product_id = '11111111-0000-0000-0000-000000000001' AND size_ml = 50;

INSERT INTO kit_items (kit_id, variant_id, quantity)
SELECT 'aaaaaaaa-0000-0000-0000-000000000001', id, 1
FROM product_variants
WHERE product_id = '11111111-0000-0000-0000-000000000002' AND size_ml = 50;

INSERT INTO kit_items (kit_id, variant_id, quantity)
SELECT 'aaaaaaaa-0000-0000-0000-000000000002', id, 1
FROM product_variants
WHERE product_id = '33333333-0000-0000-0000-000000000001' AND size_ml = 50;

INSERT INTO kit_items (kit_id, variant_id, quantity)
SELECT 'aaaaaaaa-0000-0000-0000-000000000002', id, 1
FROM product_variants
WHERE product_id = '33333333-0000-0000-0000-000000000003' AND size_ml = 60;
