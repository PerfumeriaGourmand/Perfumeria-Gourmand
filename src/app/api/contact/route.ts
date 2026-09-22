import { NextRequest, NextResponse } from "next/server";
import { sendContactMessage } from "@/lib/email";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  if (!(await rateLimit(`contact:${getClientIp(req)}`, 5, 10 * 60 * 1000))) {
    return NextResponse.json({ error: "Demasiados intentos. Probá de nuevo en unos minutos." }, { status: 429 });
  }

  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    await sendContactMessage({ name, email, subject, message });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error enviando mensaje de contacto:", err);
    return NextResponse.json({ error: "No se pudo enviar el mensaje" }, { status: 500 });
  }
}
