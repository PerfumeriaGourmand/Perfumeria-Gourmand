import { describe, it, expect } from "vitest";
import { rateLimit } from "./rate-limit";

// Estos tests corren sin UPSTASH_REDIS_REST_URL/TOKEN configuradas, asi que
// ejercitan el fallback en memoria (ver rate-limit.ts). El comportamiento con
// Upstash real requiere una cuenta y no se testea aca.
describe("rateLimit (fallback en memoria)", () => {
  it("permite requests dentro del limite", async () => {
    const key = `test-${Math.random()}`;
    expect(await rateLimit(key, 3, 60_000)).toBe(true);
    expect(await rateLimit(key, 3, 60_000)).toBe(true);
    expect(await rateLimit(key, 3, 60_000)).toBe(true);
  });

  it("bloquea requests que superan el limite dentro de la ventana", async () => {
    const key = `test-${Math.random()}`;
    await rateLimit(key, 2, 60_000);
    await rateLimit(key, 2, 60_000);
    expect(await rateLimit(key, 2, 60_000)).toBe(false);
  });

  it("resetea el contador despues de que expira la ventana", async () => {
    const key = `test-${Math.random()}`;
    await rateLimit(key, 1, 10);
    expect(await rateLimit(key, 1, 10)).toBe(false);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(await rateLimit(key, 1, 10)).toBe(true);
  });

  it("mantiene contadores independientes por key", async () => {
    const keyA = `test-a-${Math.random()}`;
    const keyB = `test-b-${Math.random()}`;
    await rateLimit(keyA, 1, 60_000);
    expect(await rateLimit(keyA, 1, 60_000)).toBe(false);
    expect(await rateLimit(keyB, 1, 60_000)).toBe(true);
  });
});
