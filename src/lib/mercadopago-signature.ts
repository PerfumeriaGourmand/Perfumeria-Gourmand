import { createHmac } from "crypto";

// Extracted from the webhook route so it can be unit tested without
// constructing a real NextRequest. Verifies the x-signature header MP sends
// per https://www.mercadopago.com.ar/developers/en/docs/checkout-api/webhooks/notifications
export function verifyMpSignature(params: {
  signatureHeader: string | null;
  requestId: string | null;
  dataId: string | null;
  secret: string | undefined;
}): boolean {
  const { signatureHeader, requestId, dataId, secret } = params;

  if (!secret) return true; // Si no está configurado, se omite la validación
  if (!signatureHeader || !requestId) return false;

  const parts = Object.fromEntries(signatureHeader.split(",").map((p) => p.split("=")));
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const manifest = `id:${dataId ?? ""};request-id:${requestId};ts:${ts};`;
  const expected = createHmac("sha256", secret).update(manifest).digest("hex");
  return expected === v1;
}
