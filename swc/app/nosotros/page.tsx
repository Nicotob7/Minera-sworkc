import type { Metadata } from "next";
import { PageHero } from "../../components/site/PageHero";
import { FeatureCard, type Feature } from "../../components/site/FeatureCard";
import { RelatedLinks } from "../../components/site/RelatedLinks";
import { CTAFinal } from "../../components/site/CTAFinal";
import { Reveal } from "../../components/ui/Reveal";
import { MapPin } from "../../components/ui/icons";
import { WrenchIcon } from "../../components/ui/wrench";
import { FileChartLineIcon } from "../../components/ui/file-chart-line";
import { RefreshCWIcon } from "../../components/ui/refresh-cw";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Sworkc Technologies crea software para la continuidad operacional minera. Cómo trabajamos: implementación por etapas (levantamiento, configuración, capacitación y puesta en marcha).",
  alternates: { canonical: "https://sworkc.cl/nosotros" },
};

/* Ideas fuerza sobre el enfoque de la empresa (basadas en el mensaje actual). */
const PILARES: Feature[] = [
  {
    icon: WrenchIcon,
    tag: "Enfoque",
    title: "Informática que sostiene la operación",
    desc: "Creamos herramientas digitales para que las operaciones mineras registren turnos, mantenciones, fallas y equipos.",
  },
  {
    icon: FileChartLineIcon,
    tag: "Criterio",
    title: "Información clara y trazable",
    desc: "Priorizamos que los datos de terreno sean confiables, trazables y estén listos para decidir, no dispersos en planillas.",
  },
  {
    icon: RefreshCWIcon,
    tag: "Método",
    title: "Se adapta a tu operación",
    desc: "El sistema se configura según los equipos, roles y flujos de cada empresa. Se ajusta a la operación, no al revés.",
  },
];

/* Implementación por etapas — real (mismo mensaje que la FAQ del home). */
const ETAPAS = [
  {
    n: 1,
    title: "Levantamiento de la operación",
    desc: "Entendemos equipos, turnos, flujos de trabajo e indicadores relevantes para tu faena.",
  },
  {
    n: 2,
    title: "Configuración",
    desc: "Ajustamos módulos, roles, alertas y reglas a la forma en que trabaja tu operación.",
  },
  {
    n: 3,
    title: "Capacitación del equipo",
    desc: "Acompañamos a los usuarios para que la adopción en terreno sea rápida y sin fricción.",
  },
  {
    n: 4,
    title: "Puesta en marcha",
    desc: "El sistema entra en operación con soporte continuo para sostener el uso en el tiempo.",
  },
];

export default function NosotrosPage() {
  return (
    <main id="contenido" className="flex-1">
      <PageHero
        eyebrow="Nosotros"
        title="Tecnología para la continuidad operacional minera"
        intro="Sworkc Technologies desarrolla software para que la información de terreno —turnos, mantenciones, fallas y equipos— sea clara, trazable y útil para decidir."
      >
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {PILARES.map((p, i) => (
            <Reveal key={p.title} variant="up" delay={i * 80} as="div" className="h-full">
              <FeatureCard {...p} />
            </Reveal>
          ))}
        </div>
      </PageHero>

      {/* Propósito */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <Reveal variant="up" as="div">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-900">
              Propósito
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Que ninguna decisión operacional dependa de la memoria de un turno
            </h2>
            <p className="mt-5 text-base leading-relaxed text-ink-soft">
              En la operación minera, la continuidad se pierde cuando la información queda en planillas
              dispersas, mensajes o conversaciones informales. sworkc centraliza órdenes de trabajo,
              estados de equipo, mantenciones e indicadores para que el relevo entre turnos sea claro y
              cada intervención quede documentada.
            </p>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Trabajamos junto a cada empresa para digitalizar sus procesos con criterio, cuidando que la
              herramienta se ajuste a la realidad de la faena y no al revés.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Cómo trabajamos — implementación por etapas */}
      <section id="como-trabajamos" className="scroll-mt-28 border-t border-border bg-surface-2 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-900">
              Cómo trabajamos
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Implementación por etapas
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              La puesta en marcha es gradual, para que la adopción sea real y sostenible en el tiempo.
            </p>
          </div>

          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {ETAPAS.map((etapa, i) => (
              <Reveal key={etapa.n} variant="up" delay={i * 70} as="li" className="h-full">
                <div className="flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-white p-6 shadow-[var(--shadow-md)]">
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full font-mono text-base font-semibold text-white shadow-[var(--shadow-sm)]"
                    style={{ background: "#0b1124" }}
                  >
                    {etapa.n}
                  </span>
                  <h3 className="mt-4 font-display text-base font-bold tracking-tight text-ink">
                    {etapa.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{etapa.desc}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Dónde estamos / alcance — real: Chile / minería, sin inventar sedes */}
      <section className="border-t border-border bg-white py-16 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2 lg:px-10">
          <Reveal variant="left" as="div">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-900">
              Dónde estamos
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Con foco en la minería en Chile
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Estamos en Chile y trabajamos con operaciones y contratistas mineros. La plataforma es web
              y funciona en terreno, así que puede usarse desde distintas faenas y ubicaciones.
            </p>
          </Reveal>
          <Reveal variant="right" as="div">
            <div className="flex items-center gap-4 rounded-[var(--radius-lg)] border border-border bg-surface-2 p-6 shadow-[var(--shadow-md)]">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-brand-100 bg-white text-brand-900 shadow-[var(--shadow-sm)]">
                <MapPin size={26} />
              </span>
              <div>
                <p className="font-display text-lg font-bold text-ink">Chile</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Operaciones y contratistas mineros.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <RelatedLinks
        items={[
          { title: "Producto", desc: "Los módulos, el Expediente del Equipo y el uso en terreno.", href: "/producto" },
          { title: "Novedades", desc: "Anuncios y notas del producto (en preparación).", href: "/novedades" },
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
