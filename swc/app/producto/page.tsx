import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageHero } from "../../components/site/PageHero";
import { FeatureCard, type Feature } from "../../components/site/FeatureCard";
import { RelatedLinks } from "../../components/site/RelatedLinks";
import { CTAFinal } from "../../components/site/CTAFinal";
import { Reveal } from "../../components/ui/Reveal";
import { CheckCircle2, Gauge, QrCode, WifiOff, BuildingCommunity } from "../../components/ui/icons";
import { ClipboardCheckIcon } from "../../components/ui/clipboard-check";
import { ClockIcon } from "../../components/ui/clock";
import { BellIcon } from "../../components/ui/bell";
import { WrenchIcon } from "../../components/ui/wrench";
import { RefreshCWIcon } from "../../components/ui/refresh-cw";
import { ChartLineIcon } from "../../components/ui/chart-line";
import { TimerIcon } from "../../components/ui/timer";
import { BoxesIcon } from "../../components/ui/boxes";
import { LayoutGridIcon } from "../../components/ui/layout-grid";
import { FileChartLineIcon } from "../../components/ui/file-chart-line";

export const metadata: Metadata = {
  title: "Producto",
  description:
    "sworkc en profundidad: módulos operacionales (OT, horas, mantención, turnos, insumos y reportes), Expediente Digital del Equipo con KPIs, uso con QR en terreno, modo offline y multiempresa.",
  alternates: { canonical: "https://sworkc.cl/producto" },
};

/* Pilares (infografía superior): 3 ideas fuerza con iconos ya existentes. */
const PILARES: Feature[] = [
  {
    icon: ClipboardCheckIcon,
    tag: "Captura en terreno",
    title: "El trabajo se registra donde ocurre",
    desc: "Órdenes de trabajo, estados de equipo y cierres de turno quedan documentados desde la operación, con responsable e historial.",
  },
  {
    icon: BellIcon,
    tag: "Prevención",
    title: "La mantención se anticipa",
    desc: "Alertas por horas de uso, fechas o criticidad para pasar de una gestión reactiva a una preventiva.",
  },
  {
    icon: ChartLineIcon,
    tag: "Decisión con datos",
    title: "Los indicadores quedan a la vista",
    desc: "Disponibilidad, fallas, HH e insumos consolidados en un panel operacional y en reportes descargables.",
  },
];

/* Módulos reales del sistema (mismos que la sección "Cómo funciona" del home). */
const MODULOS: Feature[] = [
  {
    icon: ClipboardCheckIcon,
    tag: "Operación",
    title: "Órdenes de trabajo digitales",
    desc: "Cada OT se crea, asigna, ejecuta y cierra con evidencia, responsable e historial trazable.",
    points: ["Asignación por equipo", "Cierre con evidencia", "Historial trazable"],
  },
  {
    icon: ClockIcon,
    tag: "Monitoreo",
    title: "Horas de funcionamiento",
    desc: "Control de horas operativas por maquinaria para anticipar mantenciones y proyectar carga.",
    points: ["Conteo por equipo", "Umbrales configurables", "Proyección de uso"],
  },
  {
    icon: BellIcon,
    tag: "Prevención",
    title: "Mantenciones y alertas",
    desc: "Avisos por horas, fechas, criticidad o condiciones que amenazan la continuidad operacional.",
    points: ["Prioridad por criticidad", "Aviso a responsables", "Reglas por operación"],
  },
  {
    icon: WrenchIcon,
    tag: "Disponibilidad",
    title: "Estados de maquinaria",
    desc: "Equipos disponibles, detenidos, en reparación, inspección o pendientes, actualizados en el momento.",
    points: ["Estado en vivo", "Detenciones registradas", "Pendientes priorizados"],
  },
  {
    icon: RefreshCWIcon,
    tag: "Continuidad",
    title: "Gestión de turnos",
    desc: "Pendientes, fallas y observaciones se entregan al turno siguiente sin depender de memoria o planillas.",
    points: ["Resumen de cierre", "Pendientes heredados", "Contexto entre turnos"],
  },
  {
    icon: ChartLineIcon,
    tag: "Análisis",
    title: "Estadísticas de fallas",
    desc: "Frecuencia, reincidencias y tiempos de detención para decidir con datos reales de la operación.",
    points: ["Fallas por equipo", "Tiempos de reparación", "Patrones repetitivos"],
  },
  {
    icon: TimerIcon,
    tag: "Productividad",
    title: "Control de horas-hombre",
    desc: "Registro de HH por reparación, inspección y mantención para comparar productividad y costo.",
    points: ["HH por actividad", "Comparativa por equipo", "Costo de intervención"],
  },
  {
    icon: BoxesIcon,
    tag: "Inventario",
    title: "Control de insumos",
    desc: "Traza repuestos, materiales y consumibles usados en cada intervención o mantención.",
    points: ["Consumo por reparación", "Stock de repuestos", "Alertas de quiebre"],
  },
  {
    icon: LayoutGridIcon,
    tag: "Control",
    title: "Panel operacional",
    desc: "Disponibilidad, alertas, estados y productividad reunidos en una vista de mando.",
    points: ["Indicadores clave", "Tendencias visuales", "Alertas centralizadas"],
  },
  {
    icon: FileChartLineIcon,
    tag: "Gestión",
    title: "Reportabilidad",
    desc: "Información descargable para supervisión, planificación, mantenimiento y administración.",
    points: ["Informes descargables", "Datos consolidados", "Por área o equipo"],
  },
];

/* KPIs reales del Expediente Digital del Equipo (definiciones, sin cifras). */
const EDE_KPIS = [
  { sigla: "Disponibilidad", desc: "Proporción del tiempo en que el equipo está operativo." },
  { sigla: "MTTR", desc: "Tiempo medio de reparación tras una detención." },
  { sigla: "MTBF", desc: "Tiempo medio entre fallas del equipo." },
  { sigla: "MTBS", desc: "Tiempo medio entre detenciones (programadas o no)." },
];

/** Sección "split" reutilizable dentro de esta página (texto + panel visual). */
function SplitFeature({
  id,
  icon: Icon,
  eyebrow,
  title,
  intro,
  points,
  reverse = false,
  aside,
}: {
  id: string;
  icon: Feature["icon"];
  eyebrow: string;
  title: string;
  intro: string;
  points: string[];
  reverse?: boolean;
  aside: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 border-t border-border bg-white py-16 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 lg:grid-cols-2 lg:gap-14 lg:px-10">
        <Reveal variant={reverse ? "right" : "left"} as="div" className={reverse ? "lg:order-2" : ""}>
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-brand-900">
            <Icon size={24} />
          </span>
          <p className="mt-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-900">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-soft">{intro}</p>
          <ul className="mt-5 space-y-2.5">
            {points.map((point) => (
              <li key={point} className="flex items-start gap-2.5 text-sm text-ink">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-900" strokeWidth={2.1} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal variant={reverse ? "left" : "right"} as="div" className={reverse ? "lg:order-1" : ""}>
          {aside}
        </Reveal>
      </div>
    </section>
  );
}

export default function ProductoPage() {
  return (
    <main id="contenido" className="flex-1">
      <PageHero
        eyebrow="Producto"
        title="Toda la operación minera, en un solo sistema"
        intro="sworkc conecta terreno, turnos, mantenimiento, insumos e indicadores. Lo que se registra en la máquina se convierte en información trazable y en decisiones para sostener la continuidad operacional."
      >
        {/* Infografía: 3 pilares */}
        <div className="mt-12 grid gap-5 sm:grid-cols-3">
          {PILARES.map((p, i) => (
            <Reveal key={p.title} variant="up" delay={i * 80} as="div" className="h-full">
              <FeatureCard {...p} />
            </Reveal>
          ))}
        </div>
      </PageHero>

      {/* Módulos operacionales */}
      <section id="modulos" className="scroll-mt-28 bg-surface-2 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.22em] text-brand-900">
              Módulos operacionales
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
              Los procesos de la faena, digitalizados
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-soft">
              Cada módulo cubre una parte de la operación y comparte la misma información: sin planillas
              dispersas ni datos duplicados.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {MODULOS.map((m, i) => (
              <Reveal key={m.title} variant="up" delay={(i % 3) * 70} as="div" className="h-full">
                <FeatureCard {...m} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EDE — Expediente Digital del Equipo */}
      <SplitFeature
        id="ede"
        icon={Gauge}
        eyebrow="Expediente Digital del Equipo (EDE)"
        title="El historial completo de cada máquina"
        intro="El EDE reúne la vida operativa de un equipo: sus detenciones, las intervenciones realizadas, los repuestos usados y sus indicadores de confiabilidad, en una sola ficha."
        points={[
          "Detenciones e intervenciones en una línea de tiempo",
          "Repuestos y materiales asociados a cada trabajo",
          "Indicadores de confiabilidad por período",
        ]}
        aside={
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface-2 p-6 shadow-[var(--shadow-md)]">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Indicadores del EDE
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {EDE_KPIS.map((kpi) => (
                <div
                  key={kpi.sigla}
                  className="rounded-[var(--radius)] border border-border bg-white p-4 shadow-[var(--shadow-sm)]"
                >
                  <p className="font-display text-lg font-bold text-brand-900">{kpi.sigla}</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">{kpi.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Los valores se calculan sobre los datos reales de tu operación en el período seleccionado.
            </p>
          </div>
        }
      />

      {/* Uso con QR en terreno */}
      <SplitFeature
        id="qr"
        icon={QrCode}
        eyebrow="Uso con QR en terreno"
        title="Del código a la ficha del equipo"
        intro="Cada equipo puede identificarse con un código QR. Escanearlo abre directamente su ficha para registrar uso, estados o trabajos, sin buscar entre listados."
        points={[
          "Acceso directo a la ficha del equipo",
          "Etiquetas de QR imprimibles y descargables",
          "Alternativa de selección manual cuando no hay QR a mano",
        ]}
        reverse
        aside={
          <div className="grid place-items-center rounded-[var(--radius-lg)] border border-border bg-white p-10 shadow-[var(--shadow-md)]">
            <span className="grid h-40 w-40 place-items-center rounded-[var(--radius-lg)] border border-brand-100 bg-brand-50 text-brand-900">
              <QrCode size={96} />
            </span>
            <p className="mt-5 text-center text-sm leading-relaxed text-ink-soft">
              Registro en la máquina, con el contexto correcto desde el primer toque.
            </p>
          </div>
        }
      />

      {/* Modo offline */}
      <SplitFeature
        id="offline"
        icon={WifiOff}
        eyebrow="Modo offline"
        title="La faena no siempre tiene señal"
        intro="sworkc permite continuar registrando trabajos y estados aunque no haya conexión, y sincroniza la información cuando el dispositivo vuelve a tener red."
        points={[
          "Registro sin conexión en terreno",
          "Sincronización al recuperar la señal",
          "Continuidad de la operación en zonas sin cobertura",
        ]}
        aside={
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface-2 p-8 text-center shadow-[var(--shadow-md)]">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-brand-100 bg-white text-brand-900 shadow-[var(--shadow-sm)]">
              <WifiOff size={40} />
            </span>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              El trabajo de terreno se guarda en el dispositivo y se envía al reconectar. Sin datos perdidos.
            </p>
          </div>
        }
      />

      {/* Multiempresa / multi-tenant */}
      <SplitFeature
        id="multitenant"
        icon={BuildingCommunity}
        eyebrow="Multiempresa"
        title="Un espacio propio para cada operación"
        intro="Cada empresa opera en su propio entorno, con sus equipos, usuarios y configuración. La plataforma se adapta a distintos procesos, roles e indicadores."
        points={[
          "Entorno independiente por empresa",
          "Acceso por subdominio propio",
          "Roles, flujos e indicadores configurables",
        ]}
        reverse
        aside={
          <div className="rounded-[var(--radius-lg)] border border-border bg-white p-8 text-center shadow-[var(--shadow-md)]">
            <span className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-brand-100 bg-brand-50 text-brand-900">
              <BuildingCommunity size={40} />
            </span>
            <p className="mt-5 font-mono text-sm font-semibold text-brand-900">tuempresa.sworkc.cl</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Cada operación entra a su propio espacio, con su información separada del resto.
            </p>
          </div>
        }
      />

      <RelatedLinks
        items={[
          { title: "Nosotros", desc: "Quiénes somos y cómo implementamos sworkc por etapas.", href: "/nosotros" },
          { title: "Preguntas frecuentes", desc: "Dudas comunes sobre alcance, alertas y reportes.", href: "/#faq" },
          { title: "Contacto", desc: "Agenda una demostración enfocada en tu operación.", href: "/#contacto" },
        ]}
      />

      <CTAFinal
        title="Conoce sworkc con tus propios equipos"
        text="Te mostramos cómo se vería la plataforma con tus máquinas, turnos y mantenciones."
      />
    </main>
  );
}
