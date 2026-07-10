import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

const CHILE_MOBILE_PREFIX = "+569";
const CHILE_MOBILE_LOCAL_DIGITS = 8;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

const FIELD_LIMITS = {
  nombre: 80,
  empresa: 100,
  email: 254,
  mensaje: 1500,
};

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

/**
 * Recibe el formulario de contacto. Si hay SMTP configurado (variables de entorno),
 * envía el correo; si no, registra el mensaje y responde ok para no romper el flujo
 * mientras se ajustan los datos comerciales reales.
 *
 * Variables de entorno esperadas para envio real:
 *   SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO
 *
 * Si se usa un solo correo, SMTP_USER y CONTACT_TO pueden ser el mismo.
 */
function env(name: string) {
  const value = process.env[name]?.trim();
  return value || undefined;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, 90);
}

function getClientIp(req: Request) {
  const forwardedFor = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwardedFor || req.headers.get("x-real-ip") || req.headers.get("cf-connecting-ip") || "unknown";
}

function checkRateLimit(ip: string) {
  const now = Date.now();

  for (const [key, entry] of rateLimitStore) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  const entry = rateLimitStore.get(ip);

  if (!entry) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}

function validateMaxLength(label: string, value: string, max: number) {
  if (value.length <= max) return null;
  return `${label} no puede superar ${max} caracteres.`;
}

function normalizeChileMobilePhone(value: string) {
  if (!value) return "";

  const digits = value.replace(/\D/g, "");
  let localDigits = "";

  if (digits.startsWith("569")) {
    localDigits = digits.slice(3);
  } else if (digits.startsWith("56")) {
    const withoutCountry = digits.slice(2);
    if (!withoutCountry.startsWith("9")) return null;
    localDigits = withoutCountry.slice(1);
  } else if (digits.startsWith("9")) {
    localDigits = digits.slice(1);
  } else {
    localDigits = digits;
  }

  if (!new RegExp(`^\\d{${CHILE_MOBILE_LOCAL_DIGITS}}$`).test(localDigits)) {
    return null;
  }

  return `${CHILE_MOBILE_PREFIX}${localDigits}`;
}

function buildPlainText({
  nombre,
  empresa,
  email,
  telefono,
  mensaje,
}: {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  mensaje: string;
}) {
  return [
    "Nuevo mensaje recibido desde el formulario web de SWC",
    "",
    `Nombre: ${nombre}`,
    `Empresa: ${empresa || "No informada"}`,
    `Email: ${email}`,
    `Teléfono: ${telefono || "No informado"}`,
    "",
    "Mensaje:",
    mensaje,
  ].join("\n");
}

function buildHtml({
  nombre,
  empresa,
  email,
  telefono,
  mensaje,
}: {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  mensaje: string;
}) {
  const rows = [
    ["Nombre", nombre],
    ["Empresa", empresa || "No informada"],
    ["Email", email],
    ["Teléfono", telefono || "No informado"],
  ];

  return `
    <div style="margin:0;padding:24px;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;color:#172033;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #dfe7f2;border-radius:14px;overflow:hidden;">
        <div style="background:#0a0c77;color:#ffffff;padding:22px 26px;">
          <div style="font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#b9e7ff;">Formulario web SWC</div>
          <h1 style="margin:10px 0 0;font-size:24px;line-height:1.25;font-weight:700;">Nuevo mensaje de contacto</h1>
        </div>

        <div style="padding:26px;">
          <p style="margin:0 0 18px;font-size:15px;line-height:1.6;color:#4a5870;">
            Llegó una nueva consulta desde el sitio web. Puedes responder directamente a este correo para contactar al remitente.
          </p>

          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;margin:0 0 22px;">
            <tbody>
              ${rows
                .map(
                  ([label, value]) => `
                    <tr>
                      <td style="width:120px;padding:10px 12px;border:1px solid #e4ebf5;background:#f8fafd;font-size:12px;font-weight:700;text-transform:uppercase;color:#66728a;">${escapeHtml(label)}</td>
                      <td style="padding:10px 12px;border:1px solid #e4ebf5;font-size:15px;color:#172033;word-break:break-word;">${escapeHtml(value)}</td>
                    </tr>
                  `,
                )
                .join("")}
            </tbody>
          </table>

          <div style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#66728a;">Mensaje</div>
          <div style="white-space:pre-wrap;border-left:4px solid #0a0c77;background:#f8fafd;border-radius:10px;padding:16px 18px;font-size:16px;line-height:1.6;color:#172033;">${escapeHtml(mensaje)}</div>
        </div>
      </div>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const data = await req.json().catch(() => null);
    const honeypot = data?.website?.toString().trim() ?? "";

    if (honeypot) {
      console.warn("[contacto] Honeypot activado. Mensaje descartado.");
      return NextResponse.json({ ok: true, delivered: false });
    }

    const clientIp = getClientIp(req);
    const rateLimit = checkRateLimit(clientIp);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { ok: false, error: "Demasiados mensajes. Intenta nuevamente en unos minutos." },
        { status: 429, headers: { "Retry-After": rateLimit.retryAfterSeconds.toString() } },
      );
    }

    const nombre = data?.nombre?.toString().trim();
    const empresa = data?.empresa?.toString().trim() ?? "";
    const email = data?.email?.toString().trim();
    const telefono = data?.telefono?.toString().trim() ?? "";
    const mensaje = data?.mensaje?.toString().trim();

    if (!nombre || !email || !mensaje) {
      return NextResponse.json({ ok: false, error: "Faltan campos requeridos." }, { status: 400 });
    }

    const maxLengthError =
      validateMaxLength("Nombre", nombre, FIELD_LIMITS.nombre) ||
      validateMaxLength("Empresa", empresa, FIELD_LIMITS.empresa) ||
      validateMaxLength("Email", email, FIELD_LIMITS.email) ||
      validateMaxLength("Mensaje", mensaje, FIELD_LIMITS.mensaje);

    if (maxLengthError) {
      return NextResponse.json({ ok: false, error: maxLengthError }, { status: 400 });
    }

    const telefonoNormalizado = normalizeChileMobilePhone(telefono);
    if (telefono && !telefonoNormalizado) {
      return NextResponse.json(
        { ok: false, error: "Ingresa un teléfono chileno en formato +569XXXXXXXX." },
        { status: 400 },
      );
    }

    const telefonoContacto = telefonoNormalizado ?? "";

    const host = env("SMTP_HOST");
    if (!host) {
      // SMTP aún no configurado: registramos y respondemos ok (no romper la UI).
      console.warn("[contacto] Mensaje recibido (SMTP no configurado):", {
        nombre,
        empresa,
        email,
        telefono: telefonoContacto,
      });
      return NextResponse.json({ ok: true, delivered: false });
    }

    const user = env("SMTP_USER");
    const pass = env("SMTP_PASS")?.replace(/\s+/g, "");

    if (!user || !pass) {
      console.error("[contacto] SMTP incompleto: falta SMTP_USER o SMTP_PASS.");
      return NextResponse.json({ ok: false, error: "SMTP incompleto." }, { status: 500 });
    }

    const port = Number(env("SMTP_PORT") ?? 587);
    const secure = env("SMTP_SECURE") ? env("SMTP_SECURE") === "true" : port === 465;

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: env("SMTP_FROM") ?? `"Formulario web SWC" <${user}>`,
      to: env("CONTACT_TO") ?? user,
      replyTo: email,
      subject: `Nuevo mensaje de contacto - ${cleanHeader(empresa || nombre)}`,
      text: buildPlainText({ nombre, empresa, email, telefono: telefonoContacto, mensaje }),
      html: buildHtml({ nombre, empresa, email, telefono: telefonoContacto, mensaje }),
    });

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[contacto] error:", err);
    return NextResponse.json({ ok: false, error: "No se pudo enviar el mensaje." }, { status: 500 });
  }
}
