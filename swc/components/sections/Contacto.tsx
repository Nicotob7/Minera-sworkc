"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
  type LucideIcon,
} from "../ui/icons";
import { SendAnimatedIcon, type SendAnimatedIconHandle } from "../ui/send-animated";

type EnvioEstado = "idle" | "loading" | "success" | "error";

type FormData = {
  nombre: string;
  empresa: string;
  email: string;
  telefono: string;
  asunto: string;
  mensaje: string;
};

// Mismos asuntos que valida el backend (lista cerrada; "Otro" habilita texto libre).
const ASUNTOS = [
  "Solicitar una demostración",
  "Cotización y planes",
  "Consulta técnica",
  "Alianzas o partnership",
  "Otro",
] as const;

// Anti-phishing (se valida igual en el backend): http(s)://, www., dominio/ruta.
const URL_RE = /(https?:\/\/|www\.|\S+\.[a-z]{2,63}\/\S)/i;

type CampoConfig = {
  id: keyof FormData;
  label: string;
  placeholder: string;
  icon: LucideIcon;
  type: string;
  autoComplete: string;
  required: boolean;
};

type ContactoItem = {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
};

const CAMPOS: CampoConfig[] = [
  {
    id: "nombre",
    label: "Nombre",
    placeholder: "Tu nombre completo",
    icon: User,
    type: "text",
    autoComplete: "name",
    required: true,
  },
  {
    id: "empresa",
    label: "Empresa",
    placeholder: "Nombre de tu operación",
    icon: Building2,
    type: "text",
    autoComplete: "organization",
    required: true,
  },
  {
    id: "email",
    label: "Email",
    placeholder: "nombre@empresa.cl",
    icon: Mail,
    type: "email",
    autoComplete: "email",
    required: true,
  },
  {
    id: "telefono",
    label: "Teléfono",
    placeholder: "+56 9 0000 0000",
    icon: Phone,
    type: "tel",
    autoComplete: "tel",
    required: false,
  },
];

const CONTACTO_INFO: ContactoItem[] = [
  { icon: Mail, label: "Correo", value: "contacto@sworkc.cl", href: "mailto:contacto@sworkc.cl" },
  { icon: Phone, label: "Teléfono", value: "+56 9 8516 5976", href: "tel:+56985165976" },
  { icon: MapPin, label: "Ubicación", value: "Chile" },
];

const EMPTY_FORM: FormData = {
  nombre: "",
  empresa: "",
  email: "",
  telefono: "",
  asunto: ASUNTOS[0],
  mensaje: "",
};

// Backend que recibe la solicitud y la envía por correo (SES).
// Configurable en build con NEXT_PUBLIC_API_URL; por defecto, la API de prod.
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://api.sworkc.cl";

export function Contacto() {
  const [form, setForm] = useState<FormData>(EMPTY_FORM);
  const [estado, setEstado] = useState<EnvioEstado>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const loading = estado === "loading";

  function update(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;

    if (URL_RE.test(form.mensaje)) {
      setEstado("error");
      setErrorMsg("Por seguridad, no puedes incluir enlaces (links). Escríbenos el detalle y te contactamos.");
      return;
    }

    setEstado("loading");
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/v1/contacto`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          empresa: form.empresa,
          email: form.email,
          telefono: form.telefono,
          asunto: form.asunto,
          mensaje: form.mensaje,
        }),
      });

      const json = await res.json().catch(() => null);

      if (!res.ok || !json?.ok) {
        setEstado("error");
        // 422 = validación (asunto/link/límites): reintentar no ayuda → guía clara.
        // 429 = rate limit. Otros = transitorio.
        setErrorMsg(
          res.status === 422
            ? "Revisa los datos: el asunto/mensaje no puede contener enlaces y el mensaje admite hasta 4000 caracteres."
            : res.status === 429
              ? "Demasiados envíos seguidos. Espera un minuto e inténtalo de nuevo."
              : "No pudimos enviar tu solicitud. Intenta nuevamente en unos minutos.",
        );
        return;
      }

      setEstado("success");
      setForm(EMPTY_FORM);
    } catch {
      setEstado("error");
      setErrorMsg("Hubo un problema de conexión. Revisa tu red e intenta otra vez.");
    }
  }

  return (
    <section id="contacto" aria-labelledby="contacto-title" className="relative overflow-hidden bg-[#070b1c] text-white">
      <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[360px] overflow-hidden bg-[#070b1c] p-6 pb-0 sm:p-8 sm:pb-0 lg:min-h-[600px] lg:p-12 lg:pb-0">
            {/* glow ambiental animado detrás de la imagen */}
            <div
              aria-hidden
              className="glow-pulse pointer-events-none absolute bottom-12 left-1/3 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(0,166,214,0.3), transparent 70%)" }}
            />
            <div className="relative z-10 mt-4 -ml-6 max-w-[460px] sm:-ml-8 lg:absolute lg:bottom-0 lg:left-2 lg:mt-0 lg:w-[500px] lg:max-w-none">
              <div className="absolute inset-x-8 bottom-0 h-16 rounded-full bg-black/30 blur-2xl" aria-hidden />
              <Image
                src="/img/contact.png"
                alt="Trabajador minero mostrando sworkc en una tablet"
                width={447}
                height={558}
                priority={false}
                className="relative z-10 h-auto w-full object-contain object-left-bottom drop-shadow-[0_18px_36px_rgba(0,0,0,0.32)]"
              />
            </div>
          </div>

          <div className="relative flex items-center justify-center bg-white p-6 text-[#0b1020] sm:p-8 lg:p-12 lg:py-16">
            <FormularioContacto
              form={form}
              estado={estado}
              errorMsg={errorMsg}
              loading={loading}
              onUpdate={update}
              onSubmit={handleSubmit}
              onReset={() => setEstado("idle")}
            />
          </div>
        </div>

        <BandaContacto />
    </section>
  );
}

type FormProps = {
  form: FormData;
  estado: EnvioEstado;
  errorMsg: string;
  loading: boolean;
  onUpdate: (field: keyof FormData, value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
};

function FormularioContacto({ form, estado, errorMsg, loading, onUpdate, onSubmit, onReset }: FormProps) {
  if (estado === "success") {
    return <ExitoEstado onReset={onReset} />;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="relative w-full max-w-2xl text-[#0b1020]"
    >
      <div className="mb-7 text-center lg:text-left">
        <h3 className="font-display text-3xl font-semibold tracking-tight sm:text-[2.35rem]">Contáctanos</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[#5b6680] lg:mx-0">
          Respondemos con una propuesta de reunión y contexto para tu operación.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CAMPOS.map((campo) => (
          <CampoInput key={campo.id} campo={campo} value={form[campo.id]} onChange={onUpdate} />
        ))}

        <CampoAsunto value={form.asunto} onChange={onUpdate} />

        <div className="sm:col-span-2">
          <CampoMensaje value={form.mensaje} onChange={onUpdate} />
        </div>
      </div>

      {estado === "error" && <ErrorBanner message={errorMsg} />}

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="max-w-[18rem] text-xs leading-relaxed text-[#6b7892]">
          Tus datos se usarán solo para responder esta solicitud.
        </p>
        <SubmitButton loading={loading} />
      </div>
    </form>
  );
}

function BandaContacto() {
  return (
    <div className="relative border-t border-white/10 bg-[#56616b] px-4 py-4 sm:px-6">
      <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CONTACTO_INFO.map((item) => (
          <ContactoCard key={item.label} item={item} />
        ))}
      </div>
    </div>
  );
}

function ContactoCard({ item }: { item: ContactoItem }) {
  const Icon = item.icon;
  const body = (
    <span className="group flex min-h-[72px] items-center gap-3 rounded-[var(--radius)] border border-white/12 bg-white/8 px-4 py-2.5 text-white backdrop-blur transition-all duration-300 hover:border-white/30 hover:bg-white/12">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--radius-sm)] bg-white/14">
        <Icon size={18} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-white/60">{item.label}</span>
        <span className="mt-1 block truncate font-mono text-sm font-semibold">{item.value}</span>
      </span>
      {item.href && <ArrowUpRight size={16} className="shrink-0 text-white/55 transition-colors group-hover:text-white" />}
    </span>
  );

  if (!item.href) return body;

  return (
    <a
      href={item.href}
      className="block rounded-[var(--radius)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
    >
      {body}
    </a>
  );
}

function CampoInput({
  campo,
  value,
  onChange,
}: {
  campo: CampoConfig;
  value: string;
  onChange: (field: keyof FormData, value: string) => void;
}) {
  const Icon = campo.icon;

  return (
    <div>
      <label htmlFor={campo.id} className="mb-1.5 block text-sm font-semibold text-[#0b1020]">
        {campo.label}
        {campo.required && <span className="ml-1 text-[#0a0c77]">*</span>}
      </label>
      <div className="group relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7b879d] transition-colors duration-200 group-focus-within:text-[#0a0c77]">
          <Icon size={18} />
        </span>
        <input
          id={campo.id}
          name={campo.id}
          type={campo.type}
          required={campo.required}
          autoComplete={campo.autoComplete}
          value={value}
          onChange={(e) => onChange(campo.id, e.target.value)}
          placeholder={campo.placeholder}
          className="min-h-[48px] w-full rounded-[var(--radius-pill)] border border-transparent bg-[#f3f5f8] px-4 py-3 pl-11 text-base text-[#0b1020] transition-all duration-200 placeholder:text-[#8793a8] hover:bg-[#eef2f7] focus-visible:border-[#0a0c77] focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77]/20"
        />
      </div>
    </div>
  );
}

function CampoAsunto({
  value,
  onChange,
}: {
  value: string;
  onChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor="asunto" className="mb-1.5 block text-sm font-semibold text-[#0b1020]">
        Asunto
        <span className="ml-1 text-[#0a0c77]">*</span>
      </label>
      <div className="relative">
        <select
          id="asunto"
          name="asunto"
          required
          value={value}
          onChange={(e) => onChange("asunto", e.target.value)}
          className="min-h-[48px] w-full cursor-pointer appearance-none rounded-[var(--radius-pill)] border border-transparent bg-[#f3f5f8] px-4 py-3 pr-11 text-base text-[#0b1020] transition-all duration-200 hover:bg-[#eef2f7] focus-visible:border-[#0a0c77] focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77]/20"
        >
          {ASUNTOS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#7b879d]">▾</span>
      </div>
    </div>
  );
}

function CampoMensaje({
  value,
  onChange,
}: {
  value: string;
  onChange: (field: keyof FormData, value: string) => void;
}) {
  return (
    <div>
      <label htmlFor="mensaje" className="mb-1.5 block text-sm font-semibold text-[#0b1020]">
        Mensaje
        <span className="ml-1 text-[#0a0c77]">*</span>
      </label>
      <div className="group relative">
        <span className="pointer-events-none absolute left-3.5 top-3.5 text-[#7b879d] transition-colors duration-200 group-focus-within:text-[#0a0c77]">
          <MessageSquare size={18} />
        </span>
        <textarea
          id="mensaje"
          name="mensaje"
          rows={3}
          required
          maxLength={4000}
          value={value}
          onChange={(e) => onChange("mensaje", e.target.value)}
          placeholder="Cuéntanos brevemente qué operación o flujo quieres digitalizar."
          className="w-full resize-none rounded-[1.35rem] border border-transparent bg-[#f3f5f8] px-4 py-3 pl-11 text-base text-[#0b1020] transition-all duration-200 placeholder:text-[#8793a8] hover:bg-[#eef2f7] focus-visible:border-[#0a0c77] focus-visible:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77]/20"
        />
      </div>
    </div>
  );
}

function SubmitButton({ loading }: { loading: boolean }) {
  const sendIconRef = useRef<SendAnimatedIconHandle>(null);

  return (
    <button
      type="submit"
      disabled={loading}
      aria-busy={loading}
      onMouseEnter={() => sendIconRef.current?.startAnimation()}
      onFocus={() => sendIconRef.current?.startAnimation()}
      className="group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-pill)] bg-[#0a0c77] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_16px_42px_rgba(10,12,119,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#14188a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:translate-y-0"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[120%]"
      />
      <span className="relative">{loading ? "Enviando…" : "Enviar solicitud"}</span>
      {loading ? (
        <Loader2 size={18} className="relative animate-spin" />
      ) : (
        <SendAnimatedIcon ref={sendIconRef} size={18} className="relative" />
      )}
    </button>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className="mt-5 flex items-start gap-3 rounded-[var(--radius)] border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger-fg"
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <span>{message || "Ocurrió un error al enviar. Intenta nuevamente."}</span>
    </div>
  );
}

function ExitoEstado({ onReset }: { onReset: () => void }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="float-slow relative overflow-hidden rounded-[var(--radius-xl)] border border-white/20 bg-white p-8 text-center text-[#0b1020] shadow-[0_32px_90px_rgba(0,0,0,0.34)] sm:p-10 lg:justify-self-end"
    >
      <span aria-hidden className="absolute inset-x-0 top-0 h-1 bg-[#0a0c77]" />
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#eef3f9] text-[#0a0c77]">
        <CheckCircle2 size={32} />
      </span>
      <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">Gracias, te contactaremos pronto</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[#5b6680]">
        Recibimos tu solicitud. Nuestro equipo se pondrá en contacto a la brevedad.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-7 inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius)] border border-[#dce4ef] bg-white px-5 py-3 text-sm font-semibold text-[#0a0c77] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#0a0c77] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77]/30"
      >
        Enviar otra solicitud
      </button>
    </div>
  );
}
