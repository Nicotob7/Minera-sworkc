"use client";

import { useMemo, useState, type CSSProperties, type ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gauge,
  Radio,
  ShieldAlert,
  SlidersHorizontal,
  Tool,
  type LucideIcon,
} from "../ui/icons";
import { CTAButton } from "../ui/CTAButton";
import { AvailabilityKPI } from "../charts/AvailabilityKPI";
import { FailureBars } from "../charts/FailureBars";
import { FleetDonut } from "../charts/FleetDonut";

type RangeKey = "hoy" | "7d" | "30d";
const SHIFTS = ["Turno A", "Turno B", "Turno C"] as const;
type Shift = (typeof SHIFTS)[number];
type AlertLevel = "ok" | "warn" | "crit";

type Kpi = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  delta: string;
  up: boolean;
  icon: LucideIcon;
};

type AlertItem = {
  id: string;
  level: AlertLevel;
  equipo: string;
  msg: string;
  time: string;
};

const RANGES: { key: RangeKey; label: string }[] = [
  { key: "hoy", label: "Hoy" },
  { key: "7d", label: "7 días" },
  { key: "30d", label: "30 días" },
];

const KPI_DATA: Record<RangeKey, Kpi[]> = {
  hoy: [
    { id: "disp", label: "Disponibilidad", value: "98.6", unit: "%", delta: "+0.4", up: true, icon: Gauge },
    { id: "online", label: "Equipos en línea", value: "48", unit: "/50", delta: "+2", up: true, icon: Radio },
    { id: "ot", label: "OT abiertas", value: "27", delta: "-5", up: true, icon: Tool },
    { id: "mant", label: "Mantenciones próximas", value: "9", delta: "+1", up: false, icon: Clock },
  ],
  "7d": [
    { id: "disp", label: "Disponibilidad", value: "97.9", unit: "%", delta: "+1.1", up: true, icon: Gauge },
    { id: "online", label: "Equipos en línea", value: "47", unit: "/50", delta: "+3", up: true, icon: Radio },
    { id: "ot", label: "OT abiertas", value: "142", delta: "-18", up: true, icon: Tool },
    { id: "mant", label: "Mantenciones próximas", value: "31", delta: "+4", up: false, icon: Clock },
  ],
  "30d": [
    { id: "disp", label: "Disponibilidad", value: "98.1", unit: "%", delta: "+2.3", up: true, icon: Gauge },
    { id: "online", label: "Equipos en línea", value: "49", unit: "/50", delta: "+6", up: true, icon: Radio },
    { id: "ot", label: "OT abiertas", value: "584", delta: "-63", up: true, icon: Tool },
    { id: "mant", label: "Mantenciones próximas", value: "112", delta: "+12", up: false, icon: Clock },
  ],
};

const ALERTS: Record<Shift, AlertItem[]> = {
  "Turno A": [
    { id: "a1", level: "crit", equipo: "CAEX-214", msg: "Temperatura de motor sobre umbral", time: "00:42" },
    { id: "a2", level: "warn", equipo: "PALA-07", msg: "Presión hidráulica al límite", time: "01:15" },
    { id: "a3", level: "ok", equipo: "CAEX-188", msg: "Mantención preventiva completada", time: "02:03" },
    { id: "a4", level: "warn", equipo: "PERF-31", msg: "Vibración elevada en husillo", time: "02:51" },
  ],
  "Turno B": [
    { id: "b1", level: "warn", equipo: "CAEX-176", msg: "Nivel de combustible bajo", time: "08:11" },
    { id: "b2", level: "ok", equipo: "PALA-03", msg: "Ciclo de carga dentro de rango", time: "09:04" },
    { id: "b3", level: "crit", equipo: "CARG-12", msg: "Falla de freno detectada", time: "09:48" },
    { id: "b4", level: "ok", equipo: "CAEX-209", msg: "OT cerrada por cuadrilla 2", time: "10:32" },
  ],
  "Turno C": [
    { id: "c1", level: "ok", equipo: "CAEX-233", msg: "Telemetría estable últimas 4 h", time: "16:25" },
    { id: "c2", level: "crit", equipo: "PALA-07", msg: "Detención no programada", time: "17:02" },
    { id: "c3", level: "warn", equipo: "CAEX-190", msg: "Neumático con baja presión", time: "17:44" },
    { id: "c4", level: "ok", equipo: "CARG-08", msg: "Recarga de fluidos finalizada", time: "18:30" },
  ],
};

const LEVEL_STYLE: Record<
  AlertLevel,
  { dot: string; pill: string; text: string; icon: LucideIcon }
> = {
  ok: {
    dot: "bg-success",
    pill: "bg-success-bg text-success-fg",
    text: "Normal",
    icon: CheckCircle2,
  },
  warn: {
    dot: "bg-warning",
    pill: "bg-warning-bg text-warning-fg",
    text: "Alerta",
    icon: AlertTriangle,
  },
  crit: {
    dot: "bg-danger",
    pill: "bg-danger-bg text-danger-fg",
    text: "Crítico",
    icon: ShieldAlert,
  },
};

const LIGHT_CARD_VARS = {
  "--color-ink": "#0b1020",
  "--color-ink-soft": "#43516a",
  "--color-muted-foreground": "#6b7892",
  "--color-border": "#dce4ef",
  "--color-surface-2": "#eef3f9",
  "--color-brand-200": "#c8d0ff",
  "--gradient-cta": "linear-gradient(135deg, #0a0c77, #2029a8)",
} as CSSProperties;

const CARD_BASE =
  "rounded-[var(--radius)] border border-[#dce4ef] bg-white text-[#0b1020] shadow-[0_18px_45px_rgba(7,11,28,0.16)]";

export function DashboardInteractivo() {
  const [range, setRange] = useState<RangeKey>("hoy");
  const [shift, setShift] = useState<Shift>("Turno A");

  const kpis = KPI_DATA[range];
  const alerts = ALERTS[shift];
  const critCount = useMemo(() => alerts.filter((a) => a.level === "crit").length, [alerts]);

  return (
    <section
      id="dashboard"
      aria-labelledby="dashboard-title"
      className="relative overflow-hidden py-14 text-white sm:py-16 lg:py-20"
      style={{ backgroundColor: "#505861" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
          <div className="max-w-3xl">
           
            <h2 id="dashboard-title" className="mt-4 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Tu operación, bajo control en tiempo real
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Un centro de control unificado donde disponibilidad, flota y alertas conviven en una sola vista.
              Filtra por rango o turno y observa cómo responde el panel.
            </p>
          </div>

          <CTAButton
            href="#contacto"
            variant="ghost-dark"
            className="w-full border-white/50 bg-white px-5 py-3 text-[#0b1020] hover:border-white hover:bg-white/90 hover:text-[#0b1020] focus-visible:ring-white sm:w-auto"
          >
            Contactar al equipo
          </CTAButton>
        </div>

        <div className="mt-8 grid gap-3 rounded-[var(--radius-lg)] border border-white/20 bg-white/10 p-3 shadow-[0_22px_60px_rgba(7,11,28,0.16)] backdrop-blur sm:grid-cols-2">
          <FilterGroup label="Rango">
            <ChipRow
              ariaLabel="Filtrar por rango"
              options={RANGES.map((r) => ({ key: r.key, label: r.label }))}
              active={range}
              onSelect={(key) => setRange(key as RangeKey)}
            />
          </FilterGroup>

          <FilterGroup label="Turno">
            <ChipRow
              ariaLabel="Filtrar por turno"
              options={SHIFTS.map((s) => ({ key: s, label: s }))}
              active={shift}
              onSelect={(key) => setShift(key as Shift)}
            />
          </FilterGroup>
        </div>

        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-[var(--radius-xl)] border border-white/10 bg-[#090d22] shadow-[0_28px_90px_rgba(7,11,28,0.34)]">
          <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-[var(--radius-sm)] bg-white/10 text-white">
                <Gauge size={19} />
              </span>
              <div>
                <h3 className="font-display text-base font-semibold tracking-tight text-white sm:text-lg">
                  Centro de control operacional
                </h3>
                <p className="font-mono text-[11px] uppercase tracking-wide text-white/85">
                  sworkc control · faena norte
                </p>
              </div>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white">
              <span className="relative flex h-2 w-2">
                <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-success" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              En vivo
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 lg:grid-cols-12">
            <div className="grid grid-cols-2 gap-3 lg:col-span-12 lg:grid-cols-4">
              {kpis.map((k) => {
                const Icon = k.icon;
                return (
                  <article key={k.id} className={`${CARD_BASE} p-3`} style={LIGHT_CARD_VARS}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="grid h-8 w-8 place-items-center rounded-[var(--radius-sm)] bg-[#eef3f9] text-[#0a0c77]">
                        <Icon size={16} />
                      </span>
                      <span
                        className={`font-mono text-[11px] font-semibold tabular-nums ${
                          k.up ? "text-success" : "text-warning"
                        }`}
                      >
                        {k.delta}
                      </span>
                    </div>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="font-mono text-2xl font-semibold tabular-nums">{k.value}</span>
                      {k.unit && <span className="font-mono text-xs text-[#6b7892]">{k.unit}</span>}
                    </div>
                    <p className="mt-0.5 text-xs text-[#43516a]">{k.label}</p>
                  </article>
                );
              })}
            </div>

            <article className={`${CARD_BASE} p-4 lg:col-span-5`} style={LIGHT_CARD_VARS}>
              <AvailabilityKPI />
            </article>

            <article className={`${CARD_BASE} p-4 lg:col-span-4`} style={LIGHT_CARD_VARS}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#6b7892]">Estado de flota</p>
              <FleetDonut />
            </article>

            <article className={`${CARD_BASE} p-4 lg:col-span-3`} style={LIGHT_CARD_VARS}>
              <FailureBars />
            </article>

            <article className={`${CARD_BASE} p-4 lg:col-span-12`} style={LIGHT_CARD_VARS}>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6b7892]">Feed de alertas</p>
                  <span className="font-mono text-[11px] text-[#6b7892]">· {shift}</span>
                </div>
                <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-danger-bg px-2.5 py-1 text-[11px] font-semibold text-danger-fg">
                  <span className="relative flex h-2 w-2">
                    <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-danger" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-danger" />
                  </span>
                  {critCount} crítica{critCount === 1 ? "" : "s"}
                </span>
              </div>

              <ul className="divide-y divide-[#dce4ef]">
                {alerts.map((a) => {
                  const s = LEVEL_STYLE[a.level];
                  const Icon = s.icon;

                  return (
                    <li key={a.id} className="grid gap-2 py-2.5 sm:grid-cols-[auto_auto_auto_1fr_auto_auto] sm:items-center">
                      <span className="relative hidden h-2.5 w-2.5 sm:flex">
                        {a.level !== "ok" && (
                          <span className={`live-ping absolute inline-flex h-full w-full rounded-full ${s.dot}`} />
                        )}
                        <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${s.dot}`} />
                      </span>
                      <Icon
                        size={15}
                        className={
                          a.level === "crit"
                            ? "text-danger"
                            : a.level === "warn"
                              ? "text-warning"
                              : "text-success"
                        }
                      />
                      <span className="font-mono text-xs font-semibold text-[#0b1020]">{a.equipo}</span>
                      <span className="min-w-0 text-sm text-[#43516a]">{a.msg}</span>
                      <span className={`w-fit rounded-[var(--radius-pill)] px-2 py-0.5 text-[10px] font-semibold ${s.pill}`}>
                        {s.text}
                      </span>
                      <span className="font-mono text-xs tabular-nums text-[#6b7892]">{a.time}</span>
                    </li>
                  );
                })}
              </ul>
            </article>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-sm leading-relaxed text-white/85">
          Lo que ves aquí es una muestra. En producción, sworkc control conecta telemetría, OT y
          planificación en un único centro de mando.
        </p>
      </div>
    </section>
  );
}

type ChipOption = { key: string; label: string };

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-[var(--radius)] border border-white/10 bg-white/10 p-2 sm:flex-row sm:items-center">
      <div className="flex min-w-20 items-center gap-2 px-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85">
        <SlidersHorizontal size={13} />
        {label}
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

function ChipRow({
  options,
  active,
  onSelect,
  ariaLabel,
}: {
  options: ChipOption[];
  active: string;
  onSelect: (key: string) => void;
  ariaLabel: string;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="grid grid-cols-3 gap-1 rounded-[var(--radius)] bg-white/10 p-1">
      {options.map((o) => {
        const isActive = o.key === active;

        return (
          <button
            key={o.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelect(o.key)}
            className={`min-h-[44px] rounded-[var(--radius-sm)] px-3 text-xs font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
              isActive ? "bg-white text-[#0b1020] shadow-sm" : "text-white/85 hover:bg-white/10 hover:text-white"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
