// ============================================================
// GOURMAND — Core Types
// ============================================================

export type ProductCategory = "arabe" | "disenador" | "nicho" | "kit";
export type ProductGender = "hombre" | "mujer" | "unisex";
export type ProductSeason = "verano" | "invierno" | "primavera" | "otono" | "todo_clima";
export type ConcentrationType = "parfum" | "edp" | "edt" | "edc" | "oil" | "otro";
export type OrderStatus = "pending" | "approved" | "rejected" | "cancelled" | "refunded" | "in_process";
export type FulfillmentStatus = "shipped" | "delivered";
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
  average_cost_usd: number | null;
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
  notes_top?: string[];
  notes_heart?: string[];
  notes_base?: string[];
  // Relations (joined)
  images?: ProductImage[];
  variants?: ProductVariant[];
}

// ——————————————————————————————————————————
// Cart
// ——————————————————————————————————————————

export interface CartItem {
  id: string; // variant_id
  type: "variant";
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
  kit_id: string | null; // histórico, sistema de kits anterior
  lot_id: string | null; // histórico, sistema FIFO anterior
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
  variant?: { id: string; size_ml: number; stock: number; average_cost_usd?: number | null };
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
  fulfillment_status: FulfillmentStatus | null;
  mp_preference_id: string | null;
  mp_payment_id: string | null;
  mp_merchant_order_id: string | null;
  installments: number;
  subtotal: number;
  shipping_cost: number;
  total: number;
  coupon_code: string | null;
  discount_amount: number;
  notes: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

// ——————————————————————————————————————————
// Coupons
// ——————————————————————————————————————————

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  min_order_amount: number | null;
  max_uses: number | null;
  current_uses: number;
  expires_at: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AppliedCoupon {
  code: string;
  description: string | null;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  discount_amount: number;
}

// ——————————————————————————————————————————
// Filters
// ——————————————————————————————————————————

export interface ProductFilters {
  category?: ProductCategory;
  gender?: ProductGender;
  season?: ProductSeason;
  concentration?: ConcentrationType;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
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
  low_stock_threshold: number;
  current_exchange_rate: number | null;
}
