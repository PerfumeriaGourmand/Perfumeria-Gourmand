import { describe, it, expect } from "vitest";
import { createHmac } from "crypto";
import { verifyMpSignature } from "./mercadopago-signature";

const secret = "test-secret";

function sign(manifest: string) {
  return createHmac("sha256", secret).update(manifest).digest("hex");
}

describe("verifyMpSignature", () => {
  it("acepta una firma valida", () => {
    const ts = "1700000000";
    const manifest = `id:123;request-id:req-1;ts:${ts};`;
    const v1 = sign(manifest);

    const result = verifyMpSignature({
      signatureHeader: `ts=${ts},v1=${v1}`,
      requestId: "req-1",
      dataId: "123",
      secret,
    });

    expect(result).toBe(true);
  });

  it("rechaza una firma con hash incorrecto", () => {
    const result = verifyMpSignature({
      signatureHeader: "ts=1700000000,v1=deadbeef",
      requestId: "req-1",
      dataId: "123",
      secret,
    });

    expect(result).toBe(false);
  });

  it("rechaza si falta el header x-signature", () => {
    const result = verifyMpSignature({
      signatureHeader: null,
      requestId: "req-1",
      dataId: "123",
      secret,
    });

    expect(result).toBe(false);
  });

  it("rechaza si falta el header x-request-id", () => {
    const result = verifyMpSignature({
      signatureHeader: "ts=1700000000,v1=deadbeef",
      requestId: null,
      dataId: "123",
      secret,
    });

    expect(result).toBe(false);
  });

  it("omite la validacion si no hay secret configurado (comportamiento actual, no ideal)", () => {
    const result = verifyMpSignature({
      signatureHeader: null,
      requestId: null,
      dataId: null,
      secret: undefined,
    });

    expect(result).toBe(true);
  });
});
