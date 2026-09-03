import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../components/site/PageHero";
import { RelatedLinks } from "../../components/site/RelatedLinks";
import { CTAFinal } from "../../components/site/CTAFinal";
import { FAQ } from "../../components/sections/FAQ";
import { Reveal } from "../../components/ui/Reveal";
import { ArrowRight } from "../../components/ui/icons";

export const metadata: Metadata = {
  title: "Guías y recursos",
  description:
    "Material de apoyo para operar sworkc: guías de implementación, referencia de módulos y buenas prácticas de mantención. En preparación.",
  alternates: { canonical: "https://sworkc.cl/recursos" },
};

/* Recursos previstos. SIN contenido inventado: estado real "en preparación". */
const EN_PREPARACION = [
  { code: "IMP", title: "Guía de puesta en marcha", desc: "Cómo se implementa sworkc por etapas: levantamiento, configuración, capacitación y puesta en marcha." },
  { code: "MOD", title: "Referencia de módulos", desc: "Cómo operar órdenes de trabajo, estados de equipo, turnos, insumos y reportes en el día a día." },
  { code: "MNT", title: "Alertas y mantención preventiva", desc: "Cómo configurar avisos por horas de uso, fechas y criticidad para anticipar detenciones." },
  { code: "KPI", title: "Indicadores del equipo", desc: "Cómo leer disponibilidad, MTTR, MTBF y MTBS en el Expediente Digital del Equipo." },
  { code: "TER", title: "Uso con QR y modo offline", desc: "Buenas prácticas para el registro en terreno con código QR y trabajo sin conexión." },
  { code: "ADM", title: "Roles y configuración", desc: "Cómo definir usuarios, permisos y flujos según la estructura de tu operación." },
];

export default function RecursosPage() {
  return (
    <main id="contenido" className="flex-1">
      <PageHero
        path="recursos"
        title="Guías y documentación"
        intro="Estamos preparando material de apoyo para sacar el máximo provecho de sworkc. Si necesitas un recurso con prioridad, escríbenos y lo coordinamos."
        readouts={[
          { label: "Disponibles", value: "1" },
          { label: "En preparación", value: "6" },
        ]}
        img={{
          src: "/img/faena/pala-electrica.jpg",
          alt: "Pala eléctrica de cable P&H 4100 cargando material en una faena minera",
          credit: "Pala P&H 4100 · foto Sansumaria · CC BY-SA 3.0",
        }}
      />

      {/* ── Índice de recursos: bitácora con estado real ── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal variant="up" as="div" className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0a0c77] pb-5">
            <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              Índice de recursos
            </h2>
            <p className="font-mono text-xs text-muted-foreground">DISPONIBLES · 1 / EN PREPARACIÓN · 6</p>
          </Reveal>

          {/* Disponible hoy (real): la FAQ, más abajo en esta misma página */}
          <Reveal variant="up" as="div" className="mt-10">
            <Link
              href="#faq"
              className="group grid gap-x-8 gap-y-1 rounded-lg border border-[#0a0c77]/25 bg-[#f6f8fc] px-5 py-5 transition-colors hover:border-[#0a0c77] sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center"
            >
              <span className="font-mono text-sm font-medium text-[#0a0c77]">FAQ</span>
              <span>
                <span className="font-display text-lg font-semibold tracking-tight text-ink">
                  Preguntas frecuentes
                </span>
                <span className="mt-0.5 block text-sm leading-relaxed text-ink-soft">
                  Respuestas breves sobre alcance, alertas, turnos y reportes de sworkc.
                </span>
              </span>
              <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#0a0c77]">
                Disponible aquí abajo
                <ArrowRight size={15} className="rotate-90 transition-transform group-hover:translate-y-0.5" />
              </span>
            </Link>
          </Reveal>

          {/* En preparación (honesto, sin placeholders decorativos) */}
          <div className="mt-8">
            {EN_PREPARACION.map((r, i) => (
              <Reveal
                key={r.code}
                variant="up"
                delay={Math.min(i, 4) * 40}
                as="div"
                className="grid gap-x-8 gap-y-1 border-b border-border py-5 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="font-mono text-sm text-muted-foreground">{r.code}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{r.title}</h3>
                  <p className="mt-0.5 max-w-[62ch] text-sm leading-relaxed text-ink-soft">{r.desc}</p>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  En preparación
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal variant="up" as="p" className="mt-8 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
            ¿Necesitas alguno de estos materiales con urgencia?{" "}
            <Link href="/#contacto" className="font-semibold text-[#0a0c77] underline-offset-4 hover:underline">
              Escríbenos
            </Link>{" "}
            y lo preparamos según tu operación.
          </Reveal>
        </div>
      </section>

      {/* ── El recurso disponible, en la misma página: preguntas frecuentes ── */}
      <div className="border-t border-border">
        <FAQ />
      </div>

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
