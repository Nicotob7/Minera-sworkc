import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

/**
 * Recibe el formulario de contacto. Si hay SMTP configurado (variables de entorno),
 * envía el correo; si no, registra el mensaje y responde ok para no romper el flujo
 * mientras se ajustan los datos comerciales reales.
 *
 * Variables de entorno esperadas (opcionales hasta tener el correo real):
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO
 */
export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => null);
    const nombre = data?.nombre?.toString().trim();
    const empresa = data?.empresa?.toString().trim() ?? "";
    const email = data?.email?.toString().trim();
    const telefono = data?.telefono?.toString().trim() ?? "";
    const mensaje = data?.mensaje?.toString().trim();

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ ok: false, error: "Faltan campos requeridos." }, { status: 400 });
    }

    const host = process.env.SMTP_HOST;
    if (!host) {
      // SMTP aún no configurado: registramos y respondemos ok (no romper la UI).
      console.warn("[contacto] Mensaje recibido (SMTP no configurado):", { nombre, empresa, email, telefono });
      return NextResponse.json({ ok: true, delivered: false });
    }

    const transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? `"SWC Web" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO ?? process.env.SMTP_USER,
      replyTo: email,
      subject: `Nueva solicitud de demostración — ${empresa || nombre}`,
      text: `Nombre: ${nombre}\nEmpresa: ${empresa}\nEmail: ${email}\nTeléfono: ${telefono}\n\nMensaje:\n${mensaje}`,
    });

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contacto] error:", err);
    return NextResponse.json({ ok: false, error: "No se pudo enviar el mensaje." }, { status: 500 });
  }
}
