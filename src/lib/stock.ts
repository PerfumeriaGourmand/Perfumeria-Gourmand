export type StockCheckItem = { id: string; name: string; quantity: number };
export type VariantStock = { id: string; stock: number; is_active: boolean };

// Returns the first item in the cart that can't be fulfilled with current
// stock, or null if everything's available. Extracted from /api/orders so it
// can be unit tested without mocking Supabase.
export function findOutOfStockItem(
  items: StockCheckItem[],
  variants: VariantStock[]
): StockCheckItem | null {
  for (const item of items) {
    const variant = variants.find((v) => v.id === item.id);
    if (!variant || !variant.is_active || variant.stock < item.quantity) {
      return item;
    }
  }
  return null;
}
