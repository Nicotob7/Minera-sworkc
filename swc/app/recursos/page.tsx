import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../components/site/PageHero";
import { ComingSoonCard } from "../../components/site/ComingSoonCard";
import { RelatedLinks } from "../../components/site/RelatedLinks";
import { CTAFinal } from "../../components/site/CTAFinal";
import { Reveal } from "../../components/ui/Reveal";
import { ArrowUpRight } from "../../components/ui/icons";

export const metadata: Metadata = {
  title: "Recursos",
  description:
    "Guías, documentación y material de apoyo sobre sworkc. Contenido en preparación; mientras tanto, revisa las preguntas frecuentes o escríbenos.",
  alternates: { canonical: "https://sworkc.cl/recursos" },
};

/* Categorías de recursos previstas (aún sin contenido publicado). */
const RECURSOS = [
  {
    category: "Implementación",
    title: "Guía de puesta en marcha",
    note: "Cómo se implementa sworkc por etapas: levantamiento, configuración, capacitación y puesta en marcha.",
  },
  {
    category: "Uso del sistema",
    title: "Referencia de módulos",
    note: "Cómo operar órdenes de trabajo, estados de equipo, turnos, insumos y reportes en el día a día.",
  },
  {
    category: "Mantención",
    title: "Alertas y mantención preventiva",
    note: "Cómo configurar avisos por horas de uso, fechas y criticidad para anticipar detenciones.",
  },
  {
    category: "Confiabilidad",
    title: "Indicadores del equipo",
    note: "Cómo leer disponibilidad, MTTR, MTBF y MTBS en el Expediente Digital del Equipo.",
  },
  {
    category: "Terreno",
    title: "Uso con QR y modo offline",
    note: "Buenas prácticas para el registro en terreno con código QR y trabajo sin conexión.",
  },
  {
    category: "Administración",
    title: "Roles y configuración",
    note: "Cómo definir usuarios, permisos y flujos según la estructura de tu operación.",
  },
];

export default function RecursosPage() {
  return (
    <main id="contenido" className="flex-1">
      <PageHero
        eyebrow="Recursos"
        title="Guías y documentación"
        intro="Estamos preparando material de apoyo para sacar el máximo provecho de sworkc: guías de implementación, referencia de módulos y buenas prácticas de mantención."
      />

      <section className="bg-surface-2 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          {/* Recurso real ya disponible: FAQ del home */}
          <Reveal variant="up" as="div">
            <Link
              href="/#faq"
              className="group flex flex-col items-start justify-between gap-4 rounded-[var(--radius-lg)] border border-border bg-white p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77]/30 sm:flex-row sm:items-center"
            >
              <span>
                <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-brand-50 px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-900">
                  Disponible
                </span>
                <h2 className="mt-3 font-display text-lg font-bold tracking-tight text-ink">
                  Preguntas frecuentes
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  Respuestas breves sobre alcance, alertas, turnos y reportes de sworkc.
                </p>
              </span>
              <ArrowUpRight
                size={22}
                className="shrink-0 text-muted-foreground transition-colors group-hover:text-brand-900"
              />
            </Link>
          </Reveal>

          {/* En preparación */}
          <div className="mt-12">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">En preparación</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
              Estos recursos estarán disponibles próximamente. Si necesitas alguno con prioridad,
              escríbenos y lo coordinamos.
            </p>
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {RECURSOS.map((r, i) => (
                <Reveal key={r.title} variant="up" delay={(i % 3) * 70} as="div" className="h-full">
                  <ComingSoonCard category={r.category} title={r.title} note={r.note} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RelatedLinks
        items={[
          { title: "Producto", desc: "Los módulos y capacidades de sworkc en detalle.", href: "/producto" },
          { title: "Novedades", desc: "Anuncios y notas del producto (en preparación).", href: "/novedades" },
          { title: "Nosotros", desc: "Cómo trabajamos e implementamos la plataforma.", href: "/nosotros" },
        ]}
      />

      <CTAFinal
        title="¿Necesitas un recurso específico?"
        text="Cuéntanos qué material te ayudaría y lo preparamos según tu operación."
        cta="Escríbenos"
      />
    </main>
  );
}
