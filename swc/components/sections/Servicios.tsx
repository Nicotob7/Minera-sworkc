"use client";

import { useState, useSyncExternalStore } from "react";
import type { ComponentType } from "react";
import { CheckCircle2, Plus } from "../ui/icons";
import { TechGrid } from "../ui/TechGrid";
import {
  ServicioModuleChart,
  type ModuleChartId,
} from "../charts/ServicioModuleChart";
import { BellIcon } from "../ui/bell";
import { BoxesIcon } from "../ui/boxes";
import { ChartLineIcon } from "../ui/chart-line";
import { ClipboardCheckIcon } from "../ui/clipboard-check";
import { ClockIcon } from "../ui/clock";
import { FileChartLineIcon } from "../ui/file-chart-line";
import { LayoutGridIcon } from "../ui/layout-grid";
import { RefreshCWIcon } from "../ui/refresh-cw";
import { TimerIcon } from "../ui/timer";
import { WrenchIcon } from "../ui/wrench";

type AnimatedIcon = ComponentType<{ size?: number; className?: string }>;

type Module = {
  id: ModuleChartId;
  title: string;
  icon: AnimatedIcon;
  tag: string;
  stat: string;
  desc: string;
  points: string[];
};

const MODULES: Module[] = [
  {
    id: "ot",
    title: "Órdenes de trabajo digitales",
    icon: ClipboardCheckIcon,
    tag: "Operación",
    stat: "4 estados",
    desc: "Cada OT queda creada, asignada, ejecutada y cerrada con evidencia, responsable e historial.",
    points: ["Asignación por equipo", "Cierre con evidencia", "Historial trazable"],
  },
  {
    id: "horas",
    title: "Horas de funcionamiento",
    icon: ClockIcon,
    tag: "Monitoreo",
    stat: "uso real",
    desc: "Controla horas operativas por maquinaria para anticipar mantenciones y proyectar carga.",
    points: ["Conteo por equipo", "Umbrales configurables", "Proyección de uso"],
  },
  {
    id: "alertas",
    title: "Mantenciones y alertas",
    icon: BellIcon,
    tag: "Prevención",
    stat: "alerta temprana",
    desc: "Activa avisos por horas, fechas, criticidad o condiciones que amenazan la continuidad.",
    points: ["Prioridad por criticidad", "Aviso a responsables", "Reglas por operación"],
  },
  {
    id: "estados",
    title: "Estados de maquinaria",
    icon: WrenchIcon,
    tag: "Disponibilidad",
    stat: "flota viva",
    desc: "Visualiza equipos disponibles, detenidos, en reparación, inspección o pendientes.",
    points: ["Estado en vivo", "Detenciones registradas", "Pendientes priorizados"],
  },
  {
    id: "turnos",
    title: "Gestión de turnos",
    icon: RefreshCWIcon,
    tag: "Continuidad",
    stat: "relevo claro",
    desc: "Entrega pendientes, fallas y observaciones al turno siguiente sin depender de memoria o planillas.",
    points: ["Resumen automático", "Pendientes heredados", "Contexto entre turnos"],
  },
  {
    id: "fallas",
    title: "Estadísticas de fallas",
    icon: ChartLineIcon,
    tag: "Análisis",
    stat: "tendencias",
    desc: "Detecta frecuencia, reincidencias y tiempos de detención para decidir con datos reales.",
    points: ["Fallas por equipo", "Tiempos de reparación", "Patrones repetitivos"],
  },
  {
    id: "hh",
    title: "Control de horas-hombre",
    icon: TimerIcon,
    tag: "Productividad",
    stat: "HH medidas",
    desc: "Registra horas hombre por reparación, inspección y mantención para comparar productividad.",
    points: ["HH por actividad", "Comparativa por equipo", "Costo de intervención"],
  },
  {
    id: "insumos",
    title: "Control de insumos",
    icon: BoxesIcon,
    tag: "Inventario",
    stat: "stock visible",
    desc: "Traza repuestos, materiales y consumibles usados por cada intervención o mantención.",
    points: ["Consumo por reparación", "Stock de repuestos", "Alertas de quiebre"],
  },
  {
    id: "dashboard",
    title: "Panel operacional",
    icon: LayoutGridIcon,
    tag: "Control",
    stat: "KPIs en vivo",
    desc: "Reúne disponibilidad, alertas, estados y productividad en una vista de mando operacional.",
    points: ["Indicadores clave", "Tendencias visuales", "Alertas centralizadas"],
  },
  {
    id: "reportes",
    title: "Reportabilidad",
    icon: FileChartLineIcon,
    tag: "Gestión",
    stat: "datos listos",
    desc: "Genera información descargable para supervisión, planificación, mantenimiento y administración.",
    points: ["Informes descargables", "Plantillas por área", "Datos consolidados"],
  },
];

const LEFT_MODULES = MODULES.slice(0, 5);
const RIGHT_MODULES = MODULES.slice(5);

function useIsDesktop() {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined") return () => {};

      const media = window.matchMedia("(min-width: 1024px)");
      media.addEventListener("change", callback);
      return () => media.removeEventListener("change", callback);
    },
    () => window.matchMedia("(min-width: 1024px)").matches,
    () => false,
  );
}

function ModuleNode({
  module,
  active,
  side,
  onSelect,
}: {
  module: Module;
  active: boolean;
  side: "left" | "right";
  onSelect: (id: ModuleChartId) => void;
}) {
  const Icon = module.icon;

  return (
    <li className="relative h-full">
      <span
        aria-hidden
        className={`absolute top-1/2 hidden h-px w-10 -translate-y-1/2 bg-white/24 lg:block ${
          side === "left" ? "-right-10" : "-left-10"
        }`}
      />
      <button
        type="button"
        onClick={() => onSelect(module.id)}
        aria-pressed={active}
        aria-expanded={active}
        className={`group relative flex h-full min-h-[78px] w-full items-center gap-3 rounded-[var(--radius)] border p-3 text-left shadow-[var(--shadow-md)] transition-all duration-150 hover:-translate-y-0.5 ${
          active
            ? "border-white/60 bg-white/[0.14] text-white shadow-[var(--shadow-lg)]"
            : "border-white/14 bg-white/[0.08] text-white backdrop-blur hover:border-white/45 hover:bg-white/[0.12]"
        }`}
      >
        <span
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors duration-150 ${
            active
              ? "border-white/35 bg-white/16 text-white"
              : "border-white/15 bg-white/10 text-white/78 group-hover:text-white"
          }`}
        >
          <Icon size={22} />
        </span>
        <span className="min-w-0 flex-1">
          <span
            className={`block font-mono text-[10px] font-semibold uppercase tracking-[0.15em] ${
              active ? "text-white" : "text-white/70"
            }`}
          >
            {module.tag}
          </span>
          <span className="mt-1 block font-display text-sm font-bold leading-tight xl:text-[15px]">
            {module.title}
          </span>
          <span
            className={`mt-2 inline-flex rounded-[var(--radius-pill)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] ${
              active ? "bg-white/16 text-white" : "bg-white/10 text-white/76"
            }`}
          >
            {module.stat}
          </span>
        </span>
      </button>
    </li>
  );
}

function ActiveDetail({
  module,
  compact = false,
  className = "",
}: {
  module: Module;
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[var(--radius-lg)] border border-white/12 bg-white text-ink shadow-[var(--shadow-lg)] ${className}`}
      style={{ animation: "swc-fade-up 0.18s ease-out both" }}
    >
      <div className={`${compact ? "p-4" : "p-5"} border-b border-border`}>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-900">
          {module.tag}
        </p>
        <h3 className={`${compact ? "text-lg" : "text-xl"} mt-2 font-display font-bold tracking-tight text-ink`}>
          {module.title}
        </h3>
        <p className={`${compact ? "mt-2 text-[13px]" : "mt-3 text-sm"} leading-relaxed text-ink-soft`}>
          {module.desc}
        </p>
        <ul className={`${compact ? "mt-3 gap-1.5" : "mt-4 gap-2"} grid sm:grid-cols-3 lg:grid-cols-1`}>
          {module.points.map((point) => (
            <li key={point} className={`${compact ? "text-[13px]" : "text-sm"} flex items-start gap-2 text-ink`}>
              <CheckCircle2 size={compact ? 15 : 17} className="mt-0.5 shrink-0 text-brand-900" strokeWidth={2.1} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className={`${compact ? "p-3" : "p-4"} ${className.includes("h-full") ? "min-h-0 flex-1" : ""}`}>
        <ServicioModuleChart id={module.id} compact={compact} />
      </div>
    </div>
  );
}

export function Servicios() {
  const [activeId, setActiveId] = useState<ModuleChartId | null>("ot");
  const isDesktop = useIsDesktop();
  const activeModule = MODULES.find((module) => module.id === activeId) ?? null;
  const toggleModule = (id: ModuleChartId) => {
    setActiveId((current) => (current === id ? null : id));
  };

  return (
    <section
      id="servicios"
      className="relative isolate overflow-hidden py-16 text-white sm:py-24"
      style={{ background: "linear-gradient(180deg, #090d22 0%, #070b1c 100%)" }}
    >
      <TechGrid
        variant="dark"
        className="opacity-20 [mask-image:linear-gradient(180deg,black,transparent_82%)]"
      />

      <span
        aria-hidden
        className="pointer-events-none absolute -right-52 top-16 h-72 w-[44rem] rotate-[-12deg] rounded-[999px] border border-white/10"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-56 bottom-20 h-64 w-[38rem] rotate-[10deg] rounded-[999px] border border-white/10"
      />

      <div className="relative mx-auto w-full max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
         
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Cómo funciona sworkc
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/78 sm:text-lg">
            Sworkc conecta cada pieza de la operación en un solo mapa: terreno, turnos,
            mantenimiento, insumos, reportes e indicadores.
          </p>
        </div>

        {/* Desktop concept map */}
        {isDesktop ? (
        <div className="relative mt-12 grid grid-cols-[minmax(0,1fr)_minmax(260px,330px)_minmax(0,1fr)] items-stretch gap-7 lg:h-[460px] xl:h-[480px]">
          <ul className="grid h-full grid-rows-5 gap-4">
            {LEFT_MODULES.map((module) => (
              <ModuleNode
                key={module.id}
                module={module}
                active={activeId === module.id}
                side="left"
                onSelect={toggleModule}
              />
            ))}
          </ul>

          <div className="h-full">
            {activeModule && (
              <ActiveDetail module={activeModule} compact className="flex h-full flex-col" />
            )}
          </div>

          <ul className="grid h-full grid-rows-5 gap-4">
            {RIGHT_MODULES.map((module) => (
              <ModuleNode
                key={module.id}
                module={module}
                active={activeId === module.id}
                side="right"
                onSelect={toggleModule}
              />
            ))}
          </ul>
        </div>
        ) : (
        <div className="relative mt-10">
          <div className="mx-auto grid w-full max-w-md gap-4">
            {MODULES.map((module) => {
              const Icon = module.icon;
              const active = activeId === module.id;
              const panelId = `servicio-mobile-panel-${module.id}`;

              return (
                <article key={module.id} className="relative">
                  <button
                    type="button"
                    aria-expanded={active}
                    aria-controls={panelId}
                    onClick={() => toggleModule(module.id)}
                    className={`flex min-h-[44px] w-full items-center gap-3 rounded-[var(--radius)] border p-3 text-left shadow-[var(--shadow-md)] transition-colors duration-150 ${
                      active
                        ? "border-white/60 bg-white/[0.14] text-white"
                        : "border-white/14 bg-white/[0.08] text-white"
                    }`}
                  >
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full ${
                        active ? "bg-white/16 text-white" : "bg-white/10 text-white/78"
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 flex-1">
                    <span className={`block font-mono text-[10px] font-semibold uppercase tracking-[0.16em] ${active ? "text-white" : "text-white/70"}`}>
                        {module.tag}
                      </span>
                      <span className="mt-1 block font-display text-base font-bold leading-tight">
                        {module.title}
                      </span>
                    </span>
                    <Plus
                      size={18}
                      className={`shrink-0 transition-transform duration-200 ${active ? "rotate-45 text-white" : "text-white/70"}`}
                    />
                  </button>
                  {active && (
                    <div id={panelId} className="mt-3">
                      <ActiveDetail module={module} compact />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </section>
  );
}
