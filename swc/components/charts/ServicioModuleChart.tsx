"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexOptions,
} from "apexcharts";
import { useReducedMotion } from "../hooks";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ModuleChartId =
  | "ot"
  | "horas"
  | "alertas"
  | "estados"
  | "turnos"
  | "fallas"
  | "hh"
  | "insumos"
  | "dashboard"
  | "reportes";

type ChartType = "area" | "bar" | "donut" | "line" | "radialBar";
type Series = ApexAxisChartSeries | ApexNonAxisChartSeries;

type ChartConfig = {
  type: ChartType;
  series: Series;
  options: ApexOptions;
  title: string;
  caption: string;
};

const palette = {
  brand: "#070b78",
  brandSoft: "#8187c7",
  cyan: "#2f5f97",
  cyanSoft: "#7f99bf",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626",
  ink: "#0b1020",
  muted: "#5b6680",
  grid: "#dfe7f2",
  panel: "#f5f8fd",
};

function baseOptions(options: ApexOptions): ApexOptions {
  return {
    chart: {
      toolbar: { show: false },
      zoom: { enabled: false },
      sparkline: { enabled: false },
      background: "transparent",
      fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
      animations: {
        enabled: true,
        speed: 180,
        animateGradually: { enabled: true, delay: 18 },
        dynamicAnimation: { enabled: true, speed: 160 },
      },
    },
    colors: [palette.brand, palette.cyan, palette.success, palette.warning, palette.danger],
    dataLabels: { enabled: false },
    grid: {
      borderColor: palette.grid,
      strokeDashArray: 4,
      padding: { left: 10, right: 12, top: 8, bottom: 2 },
    },
    legend: {
      labels: { colors: palette.ink },
      markers: { size: 8 },
      itemMargin: { horizontal: 12, vertical: 4 },
    },
    tooltip: { theme: "light" },
    stroke: { width: 3, curve: "smooth", lineCap: "round" },
    ...options,
  };
}

function axisOptions(categories: string[], options: ApexOptions = {}): ApexOptions {
  return baseOptions({
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: palette.muted, fontSize: "12px", fontWeight: 500 } },
    },
    yaxis: {
      labels: { style: { colors: [palette.muted], fontSize: "12px", fontWeight: 500 } },
    },
    ...options,
  });
}

function barOptions(categories: string[], horizontal = false): ApexOptions {
  return axisOptions(categories, {
    colors: [palette.brandSoft],
    stroke: { show: true, width: 3, colors: [palette.brand] },
    plotOptions: {
      bar: {
        horizontal,
        borderRadius: 10,
        borderRadiusApplication: "end",
        columnWidth: "36%",
        barHeight: "52%",
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        type: horizontal ? "horizontal" : "vertical",
        opacityFrom: 0.9,
        opacityTo: 0.72,
        colorStops: [
          { offset: 0, color: "#9aa0dc", opacity: 0.95 },
          { offset: 100, color: "#737abb", opacity: 0.78 },
        ],
      },
    },
  });
}

const CHARTS: Record<ModuleChartId, ChartConfig> = {
  ot: {
    type: "bar",
    series: [{ name: "OT cerradas", data: [18, 24, 29, 37] }],
    options: barOptions(["Crear", "Asignar", "Ejecutar", "Cerrar"]),
    title: "Ciclo de órdenes",
    caption: "Avance semanal por estado",
  },
  horas: {
    type: "bar",
    series: [{ name: "Horas", data: [86, 62, 73, 41, 57] }],
    options: barOptions(["EXC", "CAM", "GRU", "PER", "BOM"]),
    title: "Uso de maquinaria",
    caption: "Horas acumuladas por equipo",
  },
  alertas: {
    type: "radialBar",
    series: [82, 58, 34],
    options: baseOptions({
      labels: ["Críticas", "Medias", "OK"],
      colors: [palette.danger, palette.warning, palette.success],
      plotOptions: {
        radialBar: {
          hollow: { size: "34%" },
          track: { background: "#eef2f8" },
          dataLabels: {
            name: { color: palette.muted, fontSize: "12px" },
            value: { color: palette.ink, fontSize: "20px", fontWeight: 700 },
            total: { show: true, label: "Alertas", color: palette.muted },
          },
        },
      },
    }),
    title: "Prioridad de alertas",
    caption: "Distribución operacional",
  },
  estados: {
    type: "donut",
    series: [58, 22, 12, 8],
    options: baseOptions({
      labels: ["Disponibles", "Reparación", "Detenidos", "Inspección"],
      colors: [palette.success, palette.cyan, palette.warning, palette.brandSoft],
      legend: { position: "bottom", labels: { colors: palette.ink } },
      plotOptions: {
        pie: {
          donut: {
            size: "68%",
            labels: {
              show: true,
              name: { color: palette.muted },
              value: { color: palette.ink, fontSize: "22px", fontWeight: 700 },
            },
          },
        },
      },
    }),
    title: "Estado de flota",
    caption: "Disponibilidad por condición",
  },
  turnos: {
    type: "area",
    series: [{ name: "Pendientes transferidos", data: [9, 8, 7, 5, 4, 3] }],
    options: axisOptions(["T-A", "T-B", "T-C", "T-A", "T-B", "T-C"], {
      fill: {
        type: "gradient",
        gradient: { opacityFrom: 0.36, opacityTo: 0.04 },
      },
    }),
    title: "Entrega de turno",
    caption: "Pendientes transferidos",
  },
  fallas: {
    type: "area",
    series: [
      { name: "Fallas", data: [38, 52, 44, 67, 49, 73, 58, 81] },
      { name: "Reincidencias", data: [16, 19, 17, 24, 18, 27, 22, 31] },
    ],
    options: axisOptions(["1", "2", "3", "4", "5", "6", "7", "8"], {
      fill: {
        type: "gradient",
        gradient: { opacityFrom: 0.28, opacityTo: 0.03 },
      },
    }),
    title: "Fallas y reincidencias",
    caption: "Tendencia por periodo",
  },
  hh: {
    type: "bar",
    series: [{ name: "HH", data: [58, 30, 49, 36] }],
    options: barOptions(["Reparación", "Inspección", "Mantención", "Apoyo"], true),
    title: "Horas hombre",
    caption: "Carga por actividad",
  },
  insumos: {
    type: "bar",
    series: [{ name: "Cantidad utilizada", data: [14, 9, 6, 11] }],
    options: barOptions(["Filtros", "Aceites", "Mangueras", "Sellos"], true),
    title: "Materiales por intervención",
    caption: "Consumo registrado en las OT",
  },
  dashboard: {
    type: "line",
    series: [
      { name: "Disponibilidad", data: [87, 89, 91, 90, 94, 96, 98] },
      { name: "OT cerradas", data: [12, 15, 14, 18, 17, 21, 19] },
    ],
    options: axisOptions(["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]),
    title: "Indicadores clave",
    caption: "Disponibilidad y OT cerradas",
  },
  reportes: {
    type: "bar",
    series: [{ name: "Documentos", data: [38, 12] }],
    options: barOptions(["OT en PDF", "Cierre de turno"]),
    title: "Reportabilidad",
    caption: "Documentos generados en el período",
  },
};

export function ServicioModuleChart({ id, compact = false }: { id: ModuleChartId; compact?: boolean }) {
  const config = CHARTS[id];
  const reducedMotion = useReducedMotion();
  const options = useMemo<ApexOptions>(
    () => ({
      ...config.options,
      chart: {
        ...config.options.chart,
        animations: reducedMotion ? { enabled: false } : config.options.chart?.animations,
      },
    }),
    [config.options, reducedMotion],
  );

  return (
    <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-[#dce6f2] bg-[#f5f8fd] p-3 shadow-[0_18px_50px_rgba(7,11,120,0.10)] sm:p-4">
      <div className="mb-2 flex items-start justify-between gap-3 sm:mb-3">
        <div>
          <p className="font-display text-sm font-bold tracking-tight text-ink sm:text-base">{config.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{config.caption}</p>
        </div>
        <span className="rounded-[var(--radius-pill)] border border-[#dce6f2] bg-white px-2.5 py-1 text-xs font-semibold text-brand-900">
          Datos demo
        </span>
      </div>
      <div role="img" aria-label={`${config.title}: ${config.caption}`}>
        <Chart
          options={options}
          series={config.series}
          type={config.type}
          height={compact ? 205 : 240}
          width="100%"
        />
      </div>
    </div>
  );
}

export type { ModuleChartId };
