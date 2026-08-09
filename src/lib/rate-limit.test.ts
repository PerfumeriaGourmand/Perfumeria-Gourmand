import { describe, it, expect } from "vitest";
import { rateLimit } from "./rate-limit";

describe("rateLimit", () => {
  it("permite requests dentro del limite", () => {
    const key = `test-${Math.random()}`;
    expect(rateLimit(key, 3, 60_000)).toBe(true);
    expect(rateLimit(key, 3, 60_000)).toBe(true);
    expect(rateLimit(key, 3, 60_000)).toBe(true);
  });

  it("bloquea requests que superan el limite dentro de la ventana", () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 2, 60_000);
    rateLimit(key, 2, 60_000);
    expect(rateLimit(key, 2, 60_000)).toBe(false);
  });

  it("resetea el contador despues de que expira la ventana", () => {
    const key = `test-${Math.random()}`;
    rateLimit(key, 1, 10);
    expect(rateLimit(key, 1, 10)).toBe(false);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(rateLimit(key, 1, 10)).toBe(true);
        resolve();
      }, 20);
    });
  });

  it("mantiene contadores independientes por key", () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    rateLimit(keyA, 1, 60_000);
    expect(rateLimit(keyA, 1, 60_000)).toBe(false);
    expect(rateLimit(keyB, 1, 60_000)).toBe(true);
  });
});
