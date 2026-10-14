// Kill switch del checkout. Mientras esté en `false` no se pueden confirmar
// compras desde la web: el front muestra el aviso y /api/orders rechaza el
// pedido (el bloqueo del servidor es el que realmente cuenta, el del front
// solo es UX). Para reactivar las ventas online, ponerlo en `true`.
export const CHECKOUT_ENABLED = false;

export const CHECKOUT_CONTACT_PHONE = "2983647516";
export const CHECKOUT_CONTACT_WHATSAPP_URL = "https://wa.me/542983647516";

export const CHECKOUT_DISABLED_MESSAGE =
  "Estamos finalizando la construcción del checkout. Si querés comprar, comunicate al 2983647516.";
