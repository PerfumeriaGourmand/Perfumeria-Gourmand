// ============================================================
// GOURMAND — Core Types
// ============================================================

export type ProductCategory = "arabe" | "disenador" | "nicho";
export type ProductGender = "hombre" | "mujer" | "unisex";
export type ProductSeason = "verano" | "invierno" | "primavera" | "otono" | "todo_clima";
export type ConcentrationType = "parfum" | "edp" | "edt" | "edc" | "oil" | "otro";
export type OrderStatus = "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "in_process";
export type PaymentMethod = "credit_card" | "debit_card" | "bank_transfer" | "mercadopago_wallet";

// ——————————————————————————————————————————
// Product
// ——————————————————————————————————————————

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  size_ml: number;
  price: number;
  stock: number;
  sku: string | null;
  is_active: boolean;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string | null;
  short_desc: string | null;
  category: ProductCategory;
  gender: ProductGender;
  concentration: ConcentrationType;
  seasons: ProductSeason[];
  is_featured: boolean;
  is_new: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Relations (joined)
  images?: ProductImage[];
  variants?: ProductVariant[];
}

// ——————————————————————————————————————————
// Kit
// ——————————————————————————————————————————

export interface KitItem {
  id: string;
  kit_id: string;
  variant_id: string;
  quantity: number;
  variant?: ProductVariant & { product?: Product };
}

export interface Kit {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  items?: KitItem[];
}

// ——————————————————————————————————————————
// Cart
// ——————————————————————————————————————————

export interface CartItem {
  id: string; // variant_id or kit_id
  type: "variant" | "kit";
  name: string;
  brand?: string;
  size_ml?: number;
  price: number;
  quantity: number;
  image_url?: string;
  stock: number;
}

// ——————————————————————————————————————————
// Order
// ——————————————————————————————————————————

export interface ShippingAddress {
  street: string;
  number: string;
  apt?: string;
  city: string;
  province: string;
  zip: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id: string | null;
  kit_id: string | null;
  lot_id: string | null;
  product_name: string;
  size_ml: number | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  cost_price: number | null;
}

// ——————————————————————————————————————————
// Stock Lots (FIFO)
// ——————————————————————————————————————————

export interface StockLot {
  id: string;
  product_id: string;
  variant_id: string;
  purchase_date: string;
  quantity_purchased: number;
  quantity_remaining: number;
  cost_price_usd: number;
  cost_price_ars: number;
  exchange_rate: number;
  notes: string | null;
  created_at: string;
}

export interface StockLotWithDetails extends StockLot {
  product?: { id: string; name: string; brand: string };
  variant?: { id: string; size_ml: number };
}

export interface StockLotWithMetrics extends StockLotWithDetails {
  units_sold: number;
  revenue_generated: number;
  profit_generated: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  shipping_address: ShippingAddress | null;
  payment_method: PaymentMethod | null;
  payment_status: OrderStatus;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  mp_merchant_order_id: string | null;
  installments: number;
  subtotal: number;
  shipping_cost: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

// ——————————————————————————————————————————
// Filters
// ——————————————————————————————————————————

export interface ProductFilters {
  category?: ProductCategory;
  gender?: ProductGender;
  season?: ProductSeason;
  concentration?: ConcentrationType;
  search?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "name_asc";
  page?: number;
  limit?: number;
}

// ——————————————————————————————————————————
// Admin metrics
// ——————————————————————————————————————————

export interface DashboardMetrics {
  total_sales: number;
  orders_today: number;
  orders_pending: number;
  low_stock_count: number;
  top_products: Array<{ product_id: string; name: string; views: number }>;
  recent_orders: Order[];
}

// ——————————————————————————————————————————
// Site settings
// ——————————————————————————————————————————

export interface SiteSettings {
  id: 1;
  hero_title: string;
  hero_subtitle: string;
  hero_video_url: string | null;
  hero_image_url: string | null;
  free_shipping_min: number;
  whatsapp_number: string | null;
  instagram_handle: string | null;
}
