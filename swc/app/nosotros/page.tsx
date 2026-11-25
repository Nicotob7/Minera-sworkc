import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "../../components/site/PageHero";
import { RelatedLinks } from "../../components/site/RelatedLinks";
import { CTAFinal } from "../../components/site/CTAFinal";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Sworkc Technologies desarrolla software para la continuidad operacional minera en Chile: información de terreno clara, trazable y útil para decidir.",
  alternates: { canonical: "https://sworkc.cl/nosotros" },
};

/* Implementación real por etapas (mismo mensaje de la FAQ del producto). */
const ETAPAS = [
  { n: "01", title: "Levantamiento", desc: "Entendemos equipos, turnos, flujos de trabajo e indicadores relevantes para tu faena." },
  { n: "02", title: "Configuración", desc: "Ajustamos módulos, roles, alertas y reglas a la forma en que trabaja tu operación." },
  { n: "03", title: "Capacitación", desc: "Acompañamos a los usuarios para que la adopción en terreno sea rápida y sin fricción." },
  { n: "04", title: "Puesta en marcha", desc: "El sistema entra en operación con soporte continuo para sostener el uso en el tiempo." },
];

export default function NosotrosPage() {
  return (
    <main id="contenido" className="flex-1">
      <PageHero
        path="nosotros"
        title="Tecnología para la continuidad operacional minera"
        intro="Sworkc Technologies desarrolla software para que la información de terreno —turnos, mantenciones, fallas y equipos— sea clara, trazable y útil para decidir."
        readouts={[
          { label: "País", value: "Chile" },
          { label: "Foco", value: "minería y contratistas" },
          { label: "Implementación", value: "4 etapas" },
        ]}
        img={{
          src: "/img/faena/centinela-aereo.jpg",
          alt: "Distrito minero Centinela en el desierto de Atacama, fotografiado desde la Estación Espacial Internacional",
        }}
      />

      {/* ── Propósito: una declaración, no un bloque de tarjetas ── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-16">
            <div>
              <p className="max-w-[26ch] font-display text-[clamp(1.8rem,3.6vw,2.8rem)] font-light leading-[1.18] tracking-[-0.01em] text-ink [text-wrap:balance]">
                Que ninguna decisión operacional dependa de la{" "}
                <strong className="font-bold text-[#0a0c77]">memoria de un turno</strong>.
              </p>
            </div>
            <div className="self-end">
              <p className="max-w-[42ch] border-t border-border pt-5 text-sm leading-relaxed text-ink-soft lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0">
                En la operación minera, la continuidad se pierde cuando la información queda en
                planillas dispersas o conversaciones informales. sworkc centraliza órdenes de
                trabajo, estados de equipo, mantenciones e indicadores para que el relevo entre
                turnos sea claro y cada intervención quede documentada.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cómo trabajamos: secuencia real de implementación ── */}
      <section className="border-t border-border bg-[#f6f8fc] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0a0c77] pb-5">
            <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              Implementación por etapas
            </h2>
          </div>
          <p className="mt-5 max-w-[56ch] text-base leading-relaxed text-ink-soft">
            La puesta en marcha es gradual, para que la adopción sea real y sostenible en el tiempo.
          </p>

          <ol className="mt-12 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
            {ETAPAS.map((e, i) => (
              <li key={e.n} className="relative pr-8">
                {i < ETAPAS.length - 1 && (
                  <span aria-hidden className="absolute right-0 top-3 hidden h-px w-6 bg-[#0a0c77]/30 lg:block" />
                )}
                <p className="font-mono text-sm text-[#0a0c77]">{e.n}</p>
                <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-ink">{e.title}</h3>
                <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-ink-soft">{e.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Dónde estamos: dato real, foto real ── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-10">
          <div>
            <h2 className="max-w-[18ch] font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              Con foco en la minería en Chile
            </h2>
            <p className="mt-5 max-w-[46ch] text-base leading-relaxed text-ink-soft">
              Trabajamos con operaciones y contratistas mineros en Chile. La plataforma es web y
              funciona en terreno, así que puede usarse desde distintas faenas y ubicaciones.
            </p>
            <dl className="mt-7 max-w-sm border-t border-[#0a0c77]/20">
              {[
                ["Sede", "Chile"],
                ["Industria", "Minería y contratistas"],
                ["Plataforma", "Web · PWA · Android"],
              ].map(([k, v]) => (
                <div key={k} className="grid grid-cols-[110px_minmax(0,1fr)] gap-3 border-b border-border py-2.5">
                  <dt className="text-xs text-muted-foreground">{k}</dt>
                  <dd className="text-sm text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <div className="relative overflow-hidden rounded-xl shadow-[var(--shadow-lg)]">
              <Image
                src="/img/faena/chuquicamata-rajo.jpg"
                alt="Camino minero descendiendo por los bancos del rajo de Chuquicamata"
                width={933}
                height={1400}
                className="max-h-[520px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <RelatedLinks
        items={[
          { title: "Producto", desc: "Los módulos, el Expediente del Equipo y el uso en terreno.", href: "/producto" },
          { title: "Recursos", desc: "Video de la plataforma en uso y preguntas frecuentes.", href: "/recursos" },
          { title: "Contacto", desc: "Conversemos sobre tu operación.", href: "/#contacto" },
        ]}
      />

      <CTAFinal
        title="¿Trabajamos juntos?"
        text="Cuéntanos sobre tu operación y te mostramos cómo sworkc puede ordenar tu información de terreno."
      />
    </main>
  );
}
