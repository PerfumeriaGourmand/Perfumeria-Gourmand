// Seed script — run with: node supabase/seed.mjs
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://qhlkxojumfrgymimvplo.supabase.co";
const SERVICE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFobGt4b2p1bWZyZ3ltaW12cGxvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NDkyNjY4NiwiZXhwIjoyMDkwNTAyNjg2fQ.DJWxKLpFU7rxlj-_uLOASA4psy2Pfx1gNkUQgn5Rbng";

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

// ============================================================
// PRODUCTS
// ============================================================
const products = [
  // ——— NICHO ———
  {
    id: "11111111-0000-0000-0000-000000000001",
    name: "Black Phantom",
    brand: "Kilian",
    description:
      "Un ron especiado envuelto en café, almendras tostadas y vainilla oscura. Profundo, adictivo, inevitablemente memorioso.",
    short_desc:
      "Café, ron y sombras de vainilla. Una fragancia que cuenta historias sin decir una palabra.",
    category: "nicho",
    gender: "unisex",
    concentration: "edp",
    seasons: ["invierno", "otono"],
    is_featured: true,
    is_new: false,
    is_active: true,
    sort_order: 1,
  },
  {
    id: "11111111-0000-0000-0000-000000000002",
    name: "Santal 33",
    brand: "Le Labo",
    description:
      "La fragancia definitoria de una era. Cedro, sándalo australiano, violeta. Simple en nombre, infinita en complejidad.",
    short_desc: "El sándalo que redefinió el lujo contemporáneo.",
    category: "nicho",
    gender: "unisex",
    concentration: "edp",
    seasons: ["todo_clima"],
    is_featured: true,
    is_new: true,
    is_active: true,
    sort_order: 2,
  },
  {
    id: "11111111-0000-0000-0000-000000000003",
    name: "Oud Satin Mood",
    brand: "Maison Francis Kurkdjian",
    description:
      "Rosa, oud y vainilla se fusionan en una nube de seda pura. Opulencia sin peso, lujo sin esfuerzo.",
    short_desc: "Rosa y oud envueltos en seda invisible.",
    category: "nicho",
    gender: "mujer",
    concentration: "edp",
    seasons: ["invierno", "otono", "primavera"],
    is_featured: true,
    is_new: true,
    is_active: true,
    sort_order: 3,
  },
  {
    id: "11111111-0000-0000-0000-000000000004",
    name: "Portrait of a Lady",
    brand: "Frederic Malle",
    description:
      "Un ícono de la perfumería moderna. Rosa turca, patchouli y madera de cedro construyen una figura misteriosa e irresistible.",
    short_desc:
      "La mujer que todos quieren conocer, nadie puede definir.",
    category: "nicho",
    gender: "mujer",
    concentration: "edp",
    seasons: ["invierno", "otono"],
    is_featured: false,
    is_new: false,
    is_active: true,
    sort_order: 4,
  },
  {
    id: "11111111-0000-0000-0000-000000000005",
    name: "Aventus",
    brand: "Creed",
    description:
      "Piña, bergamota, ahumado de abedul y musgo de roble. El perfume del hombre que construye imperios.",
    short_desc: "Poder destilado. Sin más.",
    category: "nicho",
    gender: "hombre",
    concentration: "edp",
    seasons: ["primavera", "otono", "todo_clima"],
    is_featured: true,
    is_new: false,
    is_active: true,
    sort_order: 5,
  },
  // ——— ÁRABE ———
  {
    id: "22222222-0000-0000-0000-000000000001",
    name: "Oud Wood",
    brand: "Tom Ford",
    description:
      "Oud ahumado con notas de palisandro, especias y ámbar. La puerta de entrada perfecta al mundo del oud.",
    short_desc: null,
    category: "arabe",
    gender: "unisex",
    concentration: "edp",
    seasons: ["invierno", "otono"],
    is_featured: true,
    is_new: false,
    is_active: true,
    sort_order: 1,
  },
  {
    id: "22222222-0000-0000-0000-000000000002",
    name: "Baccarat Rouge 540",
    brand: "Maison Francis Kurkdjian",
    description:
      "Jazmín, azafrán, cedro y resina ambargrís. El perfume más imitado de la última década.",
    short_desc: null,
    category: "arabe",
    gender: "unisex",
    concentration: "edp",
    seasons: ["todo_clima"],
    is_featured: true,
    is_new: true,
    is_active: true,
    sort_order: 2,
  },
  {
    id: "22222222-0000-0000-0000-000000000003",
    name: "Rose Oud",
    brand: "Rasasi",
    description:
      "Rosa de Damasco y oud envejecido. Tradición oriental en su máxima expresión, a un precio sorprendente.",
    short_desc: null,
    category: "arabe",
    gender: "unisex",
    concentration: "parfum",
    seasons: ["invierno", "primavera"],
    is_featured: false,
    is_new: true,
    is_active: true,
    sort_order: 3,
  },
  // ——— DISEÑADOR ———
  {
    id: "33333333-0000-0000-0000-000000000001",
    name: "Bleu de Chanel",
    brand: "Chanel",
    description:
      "La frescura de los cítricos mediterráneos con profundidad de cedro, incienso y sándalo. Atemporal.",
    short_desc: null,
    category: "disenador",
    gender: "hombre",
    concentration: "edp",
    seasons: ["todo_clima"],
    is_featured: true,
    is_new: false,
    is_active: true,
    sort_order: 1,
  },
  {
    id: "33333333-0000-0000-0000-000000000002",
    name: "Chanel N5",
    brand: "Chanel",
    description:
      "El perfume más famoso del mundo. Aldehídos, rosa y jazmín sobre una base de sándalo y vainilla.",
    short_desc: null,
    category: "disenador",
    gender: "mujer",
    concentration: "edp",
    seasons: ["todo_clima"],
    is_featured: true,
    is_new: false,
    is_active: true,
    sort_order: 2,
  },
  {
    id: "33333333-0000-0000-0000-000000000003",
    name: "Sauvage",
    brand: "Dior",
    description:
      "Bergamota calabresa y pimienta de Sichuan sobre Ambroxan. El diseñador más vendido de los últimos años.",
    short_desc: null,
    category: "disenador",
    gender: "hombre",
    concentration: "edt",
    seasons: ["primavera", "verano", "todo_clima"],
    is_featured: true,
    is_new: false,
    is_active: true,
    sort_order: 3,
  },
  {
    id: "33333333-0000-0000-0000-000000000004",
    name: "La Vie Est Belle",
    brand: "Lancome",
    description:
      "Iris, pralinée y pachulí. Dulce, femenino y reconocible al instante.",
    short_desc: null,
    category: "disenador",
    gender: "mujer",
    concentration: "edp",
    seasons: ["todo_clima"],
    is_featured: false,
    is_new: false,
    is_active: true,
    sort_order: 4,
  },
];

// ============================================================
// VARIANTS
// ============================================================
const variants = [
  // Black Phantom
  { product_id: "11111111-0000-0000-0000-000000000001", size_ml: 50, price: 85000, stock: 12, is_active: true },
  { product_id: "11111111-0000-0000-0000-000000000001", size_ml: 100, price: 145000, stock: 8, is_active: true },
  // Santal 33
  { product_id: "11111111-0000-0000-0000-000000000002", size_ml: 50, price: 110000, stock: 6, is_active: true },
  { product_id: "11111111-0000-0000-0000-000000000002", size_ml: 100, price: 190000, stock: 3, is_active: true },
  // Oud Satin Mood
  { product_id: "11111111-0000-0000-0000-000000000003", size_ml: 70, price: 165000, stock: 5, is_active: true },
  // Portrait of a Lady
  { product_id: "11111111-0000-0000-0000-000000000004", size_ml: 50, price: 120000, stock: 7, is_active: true },
  { product_id: "11111111-0000-0000-0000-000000000004", size_ml: 100, price: 210000, stock: 4, is_active: true },
  // Aventus
  { product_id: "11111111-0000-0000-0000-000000000005", size_ml: 50, price: 140000, stock: 4, is_active: true },
  { product_id: "11111111-0000-0000-0000-000000000005", size_ml: 100, price: 240000, stock: 2, is_active: true },
  // Oud Wood
  { product_id: "22222222-0000-0000-0000-000000000001", size_ml: 50, price: 95000, stock: 10, is_active: true },
  { product_id: "22222222-0000-0000-0000-000000000001", size_ml: 100, price: 160000, stock: 6, is_active: true },
  // Baccarat Rouge 540
  { product_id: "22222222-0000-0000-0000-000000000002", size_ml: 35, price: 120000, stock: 8, is_active: true },
  { product_id: "22222222-0000-0000-0000-000000000002", size_ml: 70, price: 210000, stock: 4, is_active: true },
  // Rose Oud
  { product_id: "22222222-0000-0000-0000-000000000003", size_ml: 100, price: 55000, stock: 15, is_active: true },
  // Bleu de Chanel
  { product_id: "33333333-0000-0000-0000-000000000001", size_ml: 50, price: 65000, stock: 20, is_active: true },
  { product_id: "33333333-0000-0000-0000-000000000001", size_ml: 100, price: 110000, stock: 12, is_active: true },
  // N5
  { product_id: "33333333-0000-0000-0000-000000000002", size_ml: 35, price: 75000, stock: 8, is_active: true },
  { product_id: "33333333-0000-0000-0000-000000000002", size_ml: 100, price: 180000, stock: 5, is_active: true },
  // Sauvage
  { product_id: "33333333-0000-0000-0000-000000000003", size_ml: 60, price: 70000, stock: 18, is_active: true },
  { product_id: "33333333-0000-0000-0000-000000000003", size_ml: 100, price: 105000, stock: 10, is_active: true },
  // La Vie Est Belle
  { product_id: "33333333-0000-0000-0000-000000000004", size_ml: 50, price: 58000, stock: 14, is_active: true },
  { product_id: "33333333-0000-0000-0000-000000000004", size_ml: 100, price: 95000, stock: 9, is_active: true },
];

// ============================================================
// KITS
// ============================================================
const kits = [
  {
    id: "aaaaaaaa-0000-0000-0000-000000000001",
    name: "Kit Nicho Iniciación",
    description:
      "El punto de entrada perfecto al mundo de la perfumería nicho. Black Phantom (50ml) + Santal 33 (50ml). Dos íconos que te van a cambiar la forma de entender el perfume.",
    price: 185000,
    stock: 5,
    is_active: true,
    is_featured: true,
  },
  {
    id: "aaaaaaaa-0000-0000-0000-000000000002",
    name: "Kit Diseñador Premium",
    description:
      "Lo mejor de la perfumería de autor accesible. Bleu de Chanel (50ml) + Sauvage (60ml). El dúo ganador para el hombre moderno.",
    price: 120000,
    stock: 8,
    is_active: true,
    is_featured: true,
  },
];

// ============================================================
// SEED
// ============================================================
async function seed() {
  console.log("🌱 Seeding Gourmand database...\n");

  // Products
  console.log("→ Inserting products...");
  const { error: prodErr } = await supabase.from("products").upsert(products);
  if (prodErr) console.error("  ✗ Products:", prodErr.message);
  else console.log(`  ✓ ${products.length} products inserted`);

  // Variants
  console.log("→ Inserting variants...");
  const { error: varErr } = await supabase.from("product_variants").upsert(variants);
  if (varErr) console.error("  ✗ Variants:", varErr.message);
  else console.log(`  ✓ ${variants.length} variants inserted`);

  // Kits
  console.log("→ Inserting kits...");
  const { error: kitErr } = await supabase.from("kits").upsert(kits);
  if (kitErr) console.error("  ✗ Kits:", kitErr.message);
  else console.log(`  ✓ ${kits.length} kits inserted`);

  // Kit items — fetch variant IDs first
  console.log("→ Inserting kit items...");
  const { data: allVariants } = await supabase
    .from("product_variants")
    .select("id, product_id, size_ml");

  const getVariant = (productId, sizeMl) =>
    allVariants?.find((v) => v.product_id === productId && v.size_ml === sizeMl)?.id;

  const kitItems = [
    { kit_id: "aaaaaaaa-0000-0000-0000-000000000001", variant_id: getVariant("11111111-0000-0000-0000-000000000001", 50), quantity: 1 },
    { kit_id: "aaaaaaaa-0000-0000-0000-000000000001", variant_id: getVariant("11111111-0000-0000-0000-000000000002", 50), quantity: 1 },
    { kit_id: "aaaaaaaa-0000-0000-0000-000000000002", variant_id: getVariant("33333333-0000-0000-0000-000000000001", 50), quantity: 1 },
    { kit_id: "aaaaaaaa-0000-0000-0000-000000000002", variant_id: getVariant("33333333-0000-0000-0000-000000000003", 60), quantity: 1 },
  ].filter((i) => i.variant_id);

  const { error: kitItemErr } = await supabase.from("kit_items").upsert(kitItems);
  if (kitItemErr) console.error("  ✗ Kit items:", kitItemErr.message);
  else console.log(`  ✓ ${kitItems.length} kit items inserted`);

  // Verify
  const { count } = await supabase.from("products").select("id", { count: "exact", head: true });
  console.log(`\n✅ Done! ${count} products in database.`);
  console.log("\n🔗 Open http://localhost:3000 to see the site");
}

seed().catch(console.error);
