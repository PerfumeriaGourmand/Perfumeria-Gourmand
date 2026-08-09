import { describe, it, expect } from "vitest";
import { findOutOfStockItem, type VariantStock, type StockCheckItem } from "./stock";

const variants: VariantStock[] = [
  { id: "v1", stock: 10, is_active: true },
  { id: "v2", stock: 0, is_active: true },
  { id: "v3", stock: 5, is_active: false },
];

describe("findOutOfStockItem", () => {
  it("devuelve null si hay stock suficiente para todos los items", () => {
    const items: StockCheckItem[] = [{ id: "v1", name: "Black Phantom", quantity: 2 }];
    expect(findOutOfStockItem(items, variants)).toBeNull();
  });

  it("rechaza un item que pide mas cantidad que el stock disponible", () => {
    const items: StockCheckItem[] = [{ id: "v1", name: "Black Phantom", quantity: 20 }];
    expect(findOutOfStockItem(items, variants)?.id).toBe("v1");
  });

  it("rechaza un item sin stock (stock 0)", () => {
    const items: StockCheckItem[] = [{ id: "v2", name: "Santal 33", quantity: 1 }];
    expect(findOutOfStockItem(items, variants)?.id).toBe("v2");
  });

  it("rechaza una variante inactiva aunque tenga stock", () => {
    const items: StockCheckItem[] = [{ id: "v3", name: "Aventus", quantity: 1 }];
    expect(findOutOfStockItem(items, variants)?.id).toBe("v3");
  });

  it("rechaza un item cuya variante no existe", () => {
    const items: StockCheckItem[] = [{ id: "no-existe", name: "Fantasma", quantity: 1 }];
    expect(findOutOfStockItem(items, variants)?.id).toBe("no-existe");
  });
});
