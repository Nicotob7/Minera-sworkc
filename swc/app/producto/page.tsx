import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "../../components/site/PageHero";
import { RelatedLinks } from "../../components/site/RelatedLinks";
import { CTAFinal } from "../../components/site/CTAFinal";
import { Reveal } from "../../components/ui/Reveal";

export const metadata: Metadata = {
  title: "Producto",
  description:
    "sworkc en profundidad: módulos operacionales (OT, horas, mantención, turnos, insumos y reportes), Expediente Digital del Equipo con KPIs, uso con QR en terreno, modo offline y multiempresa.",
  alternates: { canonical: "https://sworkc.cl/producto" },
};

/* ── Módulos reales del sistema: bitácora de especificación, no tarjetas ── */
const MODULOS = [
  { code: "OT", title: "Órdenes de trabajo digitales", desc: "Cada OT se crea, asigna, ejecuta y cierra con evidencia, responsable e historial trazable.", points: ["Asignación por equipo", "Cierre con evidencia", "Historial trazable"] },
  { code: "HRS", title: "Horas de funcionamiento", desc: "Control de horas operativas por maquinaria para anticipar mantenciones y proyectar carga.", points: ["Conteo por equipo", "Umbrales configurables", "Proyección de uso"] },
  { code: "MNT", title: "Mantenciones y alertas", desc: "Avisos por horas, fechas, criticidad o condiciones que amenazan la continuidad.", points: ["Prioridad por criticidad", "Aviso a responsables", "Reglas por operación"] },
  { code: "EST", title: "Estados de maquinaria", desc: "Equipos disponibles, detenidos, en reparación o inspección, actualizados en el momento.", points: ["Estado en vivo", "Detenciones registradas", "Pendientes priorizados"] },
  { code: "TRN", title: "Gestión de turnos", desc: "Pendientes, fallas y observaciones se entregan al turno siguiente sin depender de memoria.", points: ["Resumen de cierre", "Pendientes heredados", "Contexto entre turnos"] },
  { code: "FLL", title: "Estadísticas de fallas", desc: "Frecuencia, reincidencias y tiempos de detención para decidir con datos reales.", points: ["Fallas por equipo", "Tiempos de reparación", "Patrones repetitivos"] },
  { code: "HH", title: "Control de horas-hombre", desc: "Registro de HH por reparación, inspección y mantención para comparar productividad.", points: ["HH por actividad", "Comparativa por equipo", "Costo de intervención"] },
  { code: "INS", title: "Control de insumos", desc: "Traza repuestos, materiales y consumibles usados en cada intervención.", points: ["Consumo por reparación", "Stock de repuestos", "Alertas de quiebre"] },
  { code: "PAN", title: "Panel operacional", desc: "Disponibilidad, alertas, estados y productividad reunidos en una vista de mando.", points: ["Indicadores clave", "Tendencias visuales", "Alertas centralizadas"] },
  { code: "REP", title: "Reportabilidad", desc: "Información descargable para supervisión, planificación, mantenimiento y administración.", points: ["Informes descargables", "Datos consolidados", "Por área o equipo"] },
];

/* KPIs reales del EDE: definiciones, sin cifras inventadas. */
const EDE_KPIS = [
  { sigla: "DISP", nombre: "Disponibilidad", unidad: "%", desc: "Proporción del período en que el equipo está operativo." },
  { sigla: "MTTR", nombre: "Tiempo medio de reparación", unidad: "h", desc: "Duración media de las reparaciones tras una detención." },
  { sigla: "MTBF", nombre: "Tiempo medio entre fallas", unidad: "h", desc: "Horas operativas entre fallas del equipo." },
  { sigla: "MTBS", nombre: "Tiempo medio entre paradas", unidad: "h", desc: "Horas operativas entre detenciones, programadas o no." },
];

/* Capacidades de terreno (QR / offline / multiempresa) como ficha técnica. */
const TERRENO = [
  {
    id: "qr",
    code: "QR",
    title: "Del código a la ficha del equipo",
    desc: "Cada equipo se identifica con un código QR pegado en la máquina. Escanearlo abre su ficha para registrar uso, estados o trabajos, sin buscar entre listados.",
    spec: [
      ["Acceso", "Escaneo con la cámara del teléfono"],
      ["Etiquetas", "Imprimibles y descargables con código y flota"],
      ["Respaldo", "Selección manual cuando no hay QR a mano"],
    ],
  },
  {
    id: "offline",
    code: "OFF",
    title: "La faena no siempre tiene señal",
    desc: "sworkc permite seguir registrando trabajos y estados sin conexión. La información se guarda en el dispositivo y se sincroniza al recuperar la red.",
    spec: [
      ["Registro", "Checklists, uso y estados sin conexión"],
      ["Sincronización", "Automática al volver la señal"],
      ["Cobertura", "Continuidad en zonas sin red"],
    ],
  },
  {
    id: "multitenant",
    code: "ORG",
    title: "Un espacio propio para cada operación",
    desc: "Cada empresa opera en su propio entorno con sus equipos, usuarios y configuración, accediendo por un subdominio propio.",
    spec: [
      ["Acceso", "tuempresa.sworkc.cl"],
      ["Aislamiento", "Información separada por empresa"],
      ["Configuración", "Roles, flujos e indicadores propios"],
    ],
  },
];

export default function ProductoPage() {
  return (
    <main id="contenido" className="flex-1">
      <PageHero
        path="producto"
        title="Toda la operación minera, en un solo sistema"
        intro="Lo que se registra en la máquina se convierte en información trazable y en decisiones. sworkc conecta terreno, turnos, mantenimiento, insumos e indicadores."
        readouts={[
          { label: "Módulos", value: "10" },
          { label: "KPIs por equipo", value: "4" },
          { label: "Registro", value: "QR + offline" },
          { label: "Acceso", value: "web · Android" },
        ]}
        img={{
          src: "/img/faena/chuquicamata-pan.jpg",
          alt: "Bancos del rajo de la mina Chuquicamata, Calama, Chile",
          credit: "Chuquicamata, Calama · foto Diego Delso · CC BY-SA 4.0",
        }}
      />

      {/* ── Bitácora de módulos: cada proceso de la faena, una línea ── */}
      <section id="modulos" className="scroll-mt-28 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal variant="up" as="div" className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0a0c77] pb-5">
            <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              Los procesos de la faena, digitalizados
            </h2>
            <p className="font-mono text-xs text-muted-foreground">MÓDULOS · 10 / 10</p>
          </Reveal>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-soft">
            Cada módulo cubre una parte de la operación y comparte la misma información:
            sin planillas dispersas ni datos duplicados.
          </p>

          <div className="mt-10">
            {MODULOS.map((m, i) => (
              <Reveal
                key={m.code}
                variant="up"
                delay={Math.min(i, 4) * 40}
                as="div"
                className="group grid gap-x-8 gap-y-2 border-b border-border py-5 transition-colors hover:bg-[#f6f8fc] sm:grid-cols-[64px_minmax(0,1.1fr)_minmax(0,1fr)] sm:items-baseline sm:py-6"
              >
                <span className="font-mono text-sm font-medium text-[#0a0c77]">{m.code}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">
                    {m.title}
                  </h3>
                  <p className="mt-1 max-w-[48ch] text-sm leading-relaxed text-ink-soft">{m.desc}</p>
                </div>
                <p className="font-mono text-xs leading-loose text-muted-foreground">
                  {m.points.join("  ·  ")}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Panel operacional real, a lo ancho ── */}
      <section className="relative isolate overflow-hidden bg-[#060733] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal variant="up" as="div" className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <h2 className="max-w-[24ch] font-display text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
              La sala de control de tu operación
            </h2>
            <p className="font-mono text-xs text-cyan-300">PANTALLA REAL · DATOS DEMO</p>
          </Reveal>
          <p className="mt-4 max-w-[58ch] text-base font-light leading-relaxed text-white/80">
            Indicadores de flota, distribución de estados y OTs prioritarias en una sola vista.
            Lo que ves aquí es el panel real de sworkc con datos de demostración.
          </p>

          <Reveal variant="up" delay={100} as="div" className="mt-10">
            <div className="overflow-hidden rounded-xl border border-white/15 bg-[#0b1020] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 font-mono text-[11px] text-white/50">
                <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
                visión operativa — flota · estados · OTs prioritarias
              </div>
              <Image
                src="/img/producto/panel-operacional.jpg"
                alt="Panel operacional de sworkc: indicadores de flota, distribución de estados y OTs prioritarias con datos de demostración"
                width={2000}
                height={1156}
                className="w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── EDE: expediente con captura real + definiciones de KPI ── */}
      <section id="ede" className="scroll-mt-28 bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal variant="up" as="div" className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0a0c77] pb-5">
            <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              EDE — el expediente de cada máquina
            </h2>
            <p className="font-mono text-xs text-muted-foreground">KPIS · 4 / PERÍODOS · 7-30-90 D</p>
          </Reveal>

          <div className="mt-10 grid items-start gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
            <Reveal variant="left" as="div" className="flex flex-col">
              <div className="overflow-hidden rounded-xl border border-border shadow-[var(--shadow-lg)]">
                <Image
                  src="/img/producto/ede.jpg"
                  alt="Expediente Digital del Equipo en sworkc: KPIs de disponibilidad, MTTR, MTBF y MTBS, últimas detenciones, repuestos e historial de cambios"
                  width={2000}
                  height={1901}
                  className="w-full"
                />
              </div>
              <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                EDE de un cargador frontal · período 90 días · datos de demostración
              </p>
            </Reveal>

            <Reveal variant="right" as="div">
              <p className="max-w-[48ch] text-base leading-relaxed text-ink-soft">
                El Expediente Digital del Equipo reúne la vida operativa de cada máquina:
                detenciones con motivo y duración, intervenciones, repuestos usados y sus
                indicadores de confiabilidad por período.
              </p>
              <dl className="mt-8">
                {EDE_KPIS.map((k) => (
                  <div key={k.sigla} className="grid grid-cols-[86px_minmax(0,1fr)] gap-4 border-t border-border py-4 last:border-b">
                    <dt>
                      <span className="font-mono text-sm font-medium text-[#0a0c77]">{k.sigla}</span>
                      <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">{k.unidad}</span>
                    </dt>
                    <dd>
                      <p className="font-display text-sm font-semibold text-ink">{k.nombre}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{k.desc}</p>
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
                Calculados sobre los datos reales de tu operación, en el período que elijas.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Terreno: pantalla real de teléfono + bitácora QR / offline / multiempresa ── */}
      <section className="border-t border-border bg-[#f6f8fc] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal variant="up" as="div" className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0a0c77] pb-5">
            <h2 className="max-w-[26ch] font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              Hecho para el terreno, no para la oficina
            </h2>
            <p className="font-mono text-xs text-muted-foreground">PANTALLA REAL · ANDROID</p>
          </Reveal>

          <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16">
            {/* Teléfono con la pantalla real de Escanear QR */}
            <Reveal variant="left" as="div" className="order-last lg:order-first">
              <div className="mx-auto w-[270px] max-w-full lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-[2.1rem] border-[7px] border-[#060733] bg-[#060733] shadow-[0_35px_90px_rgba(6,7,51,0.35)]">
                  <Image
                    src="/img/producto/escanear-qr.jpg"
                    alt="Pantalla Escanear QR de sworkc en un teléfono: abrir cámara, elegir equipo sin QR y pasos de cómo funciona"
                    width={900}
                    height={1948}
                    className="w-full"
                  />
                </div>
                <p className="mt-3 text-center font-mono text-[11px] text-muted-foreground">
                  Registro por QR en terreno · pantalla real
                </p>
              </div>
            </Reveal>

            {/* Bitácora de capacidades de terreno */}
            <div>
              {TERRENO.map((t, i) => (
                <Reveal
                  key={t.id}
                  variant="up"
                  delay={i * 80}
                  as="article"
                  className={`scroll-mt-28 grid gap-x-8 gap-y-3 py-8 first:pt-0 last:pb-0 sm:grid-cols-[64px_minmax(0,1fr)] ${i > 0 ? "border-t border-border" : ""}`}
                  {...{ id: t.id }}
                >
                  <p className="font-mono text-sm font-medium text-[#0a0c77]">{t.code}</p>
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                      {t.title}
                    </h3>
                    <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-soft">{t.desc}</p>
                    <dl className="mt-4">
                      {t.spec.map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[130px_minmax(0,1fr)] gap-3 border-t border-border py-2">
                          <dt className="font-mono text-[11px] uppercase tracking-[0.1em] leading-relaxed text-muted-foreground">{k}</dt>
                          <dd className="text-sm text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <RelatedLinks
        items={[
          { title: "Nosotros", desc: "Quiénes somos y cómo implementamos sworkc por etapas.", href: "/nosotros" },
          { title: "Preguntas frecuentes", desc: "Dudas comunes sobre alcance, alertas y reportes.", href: "/recursos#faq" },
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
