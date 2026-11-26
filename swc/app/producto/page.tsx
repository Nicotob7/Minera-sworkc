import type { Metadata } from "next";
import { PageHero } from "../../components/site/PageHero";
import { RelatedLinks } from "../../components/site/RelatedLinks";
import { CTAFinal } from "../../components/site/CTAFinal";
import { PanelOperativoDemo } from "../../components/demo/PanelOperativoDemo";
import { EdeDemo, EdePeriodo } from "../../components/demo/EdeDemo";
import { TelefonoDemo } from "../../components/demo/TelefonoDemo";
import { ExploradorModulos } from "../../components/site/ExploradorModulos";
import { TelefonoPasos } from "../../components/site/TelefonoPasos";
import { AlVer } from "../../components/ui/AlVer";
import {
  BuildingCommunity,
  QrCode,
  WifiOff,
} from "../../components/ui/icons";

export const metadata: Metadata = {
  title: "Producto",
  description:
    "sworkc en profundidad: módulos operacionales (OT, horas, mantención, turnos, materiales y reportes), Expediente Digital del Equipo con KPIs, uso con QR en terreno, modo offline y multiempresa.",
  alternates: { canonical: "https://sworkc.cl/producto" },
};

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
    icon: QrCode,
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
    icon: WifiOff,
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
    icon: BuildingCommunity,
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
        intro="Lo que se registra en la máquina se convierte en información trazable y en decisiones. sworkc conecta terreno, turnos, mantenimiento, materiales e indicadores."
        readouts={[
          { label: "Módulos", value: "10" },
          { label: "KPIs por equipo", value: "4" },
          { label: "Registro", value: "QR + offline" },
          { label: "Acceso", value: "web · Android" },
        ]}
        img={{
          src: "/img/faena/chuquicamata-pan.jpg",
          alt: "Bancos del rajo de la mina Chuquicamata, Calama, Chile",
        }}
      />

      {/* ── Bitácora de módulos: cada proceso de la faena, una línea ── */}
      <section id="modulos" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0a0c77] pb-5">
            <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              Los procesos de la faena, digitalizados
            </h2>
          </div>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-soft">
            Cada módulo cubre una parte de la operación y comparte la misma información:
            sin planillas dispersas ni datos duplicados.
          </p>

          {/* Explorador: lista de módulos + tarjeta con la pantalla real del elegido (avanza solo en escritorio). */}
          <ExploradorModulos />
        </div>
      </section>

      {/* ── Panel operacional real, a lo ancho ── */}
      <section id="panel" className="relative isolate overflow-hidden bg-[#060733] py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <h2 className="max-w-[24ch] font-display text-3xl font-bold tracking-[-0.01em] sm:text-4xl">
              La sala de control de tu operación
            </h2>
          </div>
          <p className="mt-4 max-w-[58ch] text-base font-light leading-relaxed text-white/80">
            Indicadores de flota, distribución de estados y OTs prioritarias en una sola vista.
            Así se ve el panel de sworkc, aquí redibujado con datos de ejemplo.
          </p>

          {/* Sube al llegar a la vista (.prof-entrar) y se enciende cuando se ve (AlVer). */}
          <div className="prof-entrar mt-10">
            <AlVer className="overflow-hidden rounded-xl border border-white/15 bg-[#0b1020] shadow-[0_40px_120px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5 text-xs text-white/60">
                <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
                Visión operativa
              </div>
              <PanelOperativoDemo encender />
            </AlVer>
          </div>
        </div>
      </section>

      {/* ── EDE: expediente redibujado en HTML; período y definiciones lo mueven por CSS (data-ede) ── */}
      <section id="ede" data-ede className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0a0c77] pb-5">
            <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              EDE — el expediente de cada máquina
            </h2>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <p className="max-w-[60ch] text-base leading-relaxed text-ink-soft">
              El Expediente Digital del Equipo reúne la vida operativa de cada máquina:
              detenciones con motivo y duración, intervenciones, repuestos usados y sus
              indicadores de confiabilidad por período.
            </p>
            <EdePeriodo />
          </div>

          <div className="prof-entrar mt-8 overflow-hidden rounded-xl border border-border shadow-[var(--shadow-lg)]">
            <EdeDemo />
          </div>

          <dl className="mt-10 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
            {EDE_KPIS.map((k, i) => (
              <div
                key={k.sigla}
                data-def={i}
                className="border-t border-border py-4 transition-colors duration-200 hover:border-[#f59e0b]"
              >
                <dt>
                  <span className="font-display text-sm font-semibold text-[#0a0c77]">{k.sigla}</span>
                  <span className="ml-1.5 text-xs text-muted-foreground">{k.unidad}</span>
                </dt>
                <dd>
                  <p className="mt-1 font-display text-sm font-semibold text-ink">{k.nombre}</p>
                  <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">{k.desc}</p>
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Calculados sobre los datos reales de tu operación, en el período que elijas. Arriba, datos de ejemplo.
          </p>
        </div>
      </section>

      {/* ── Terreno: pantalla real de teléfono + bitácora QR / offline / multiempresa ── */}
      <section id="terreno" className="border-t border-border bg-[#f6f8fc] py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0a0c77] pb-5">
            <h2 className="max-w-[26ch] font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              Hecho para el terreno, no para la oficina
            </h2>
          </div>

          {/* El punto que pasa por el centro elige la pantalla del teléfono (TelefonoPasos → data-paso). */}
          <TelefonoPasos
            pasos={{ qr: "0", offline: "1", multitenant: "2" }}
            className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-16"
          >
            {/* Teléfono con la app de sworkc: escanear QR, OT sin señal, OT enviada */}
            <div className="order-last lg:order-first">
              <div className="mx-auto w-[270px] max-w-full lg:sticky lg:top-28">
                <TelefonoDemo />
              </div>
            </div>

            {/* Bitácora de capacidades de terreno */}
            <div>
              {TERRENO.map((t, i) => (
                <article
                  key={t.id}
                  className={`grid gap-x-8 gap-y-3 py-8 first:pt-0 last:pb-0 sm:grid-cols-[64px_minmax(0,1fr)] ${i > 0 ? "border-t border-border" : ""}`}
                  {...{ id: t.id }}
                  data-terreno={t.id}
                >
                  <t.icon size={24} stroke={1.6} className="text-[#0a0c77]" aria-hidden />
                  <div>
                    <h3 className="font-display text-xl font-semibold tracking-tight text-ink">
                      {t.title}
                    </h3>
                    <p className="mt-2 max-w-[58ch] text-sm leading-relaxed text-ink-soft">{t.desc}</p>
                    <dl className="mt-4">
                      {t.spec.map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[130px_minmax(0,1fr)] gap-3 border-t border-border py-2">
                          <dt className="text-sm leading-relaxed text-muted-foreground">{k}</dt>
                          <dd className="text-sm text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </TelefonoPasos>
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
