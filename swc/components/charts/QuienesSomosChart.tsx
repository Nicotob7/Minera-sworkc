"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import type { ApexOptions } from "apexcharts";
import { useReducedMotion } from "../hooks";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const series = [
  {
    name: "Disponibilidad",
    data: [89, 91, 92, 94, 93, 96, 98],
  },
  {
    name: "OT cerradas",
    data: [42, 48, 55, 58, 64, 71, 76],
  },
];

const labelColor = "#ffffff";
const mutedGrid = "rgba(255, 255, 255, 0.24)";

const baseChartOptions: ApexOptions = {
  chart: {
    type: "area",
    height: 220,
    toolbar: { show: false },
    zoom: { enabled: false },
    background: "transparent",
    foreColor: labelColor,
    fontFamily: "var(--font-inter), ui-sans-serif, system-ui, sans-serif",
    animations: {
      enabled: true,
      speed: 720,
      animateGradually: { enabled: true, delay: 110 },
      dynamicAnimation: { enabled: true, speed: 450 },
    },
  },
  colors: ["#00a6d6", "#8f99f0"],
  dataLabels: { enabled: false },
  stroke: {
    curve: "smooth",
    width: [3, 3],
    lineCap: "round",
  },
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      opacityFrom: 0.32,
      opacityTo: 0.04,
      stops: [0, 90, 100],
    },
  },
  grid: {
    borderColor: mutedGrid,
    strokeDashArray: 4,
    padding: { left: 6, right: 12, top: 8, bottom: 0 },
  },
  markers: {
    size: 0,
    hover: { size: 5 },
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    labels: { colors: labelColor },
    markers: { size: 8 },
    itemMargin: { horizontal: 12, vertical: 4 },
  },
  xaxis: {
    categories: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    axisBorder: { show: false },
    axisTicks: { show: false },
    labels: {
      style: { colors: Array(7).fill(labelColor), fontSize: "12px" },
    },
  },
  yaxis: {
    min: 0,
    max: 100,
    tickAmount: 4,
    labels: {
      formatter: (value) => `${Math.round(value)}%`,
      style: { colors: [labelColor], fontSize: "12px" },
    },
  },
  tooltip: {
    theme: "dark",
    x: { show: true },
    y: {
      formatter: (value) => `${Math.round(value)}%`,
    },
  },
};

export function QuienesSomosChart() {
  const reducedMotion = useReducedMotion();
  const options = useMemo<ApexOptions>(
    () => ({
      ...baseChartOptions,
      chart: {
        ...baseChartOptions.chart,
        animations: reducedMotion ? { enabled: false } : baseChartOptions.chart?.animations,
      },
    }),
    [reducedMotion],
  );

  return (
    <div className="relative overflow-hidden rounded-[var(--radius)] border border-white/30 bg-white/10 p-4 shadow-[var(--shadow-md)] backdrop-blur-sm sm:p-5">
      <div className="mb-2">
        <div>
          <p className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-white">
            Vista operacional
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold text-white">
            Continuidad medida en terreno
          </h3>
        </div>
      </div>

      <div
        className="min-h-[190px]"
        role="img"
        aria-label="Continuidad medida en terreno: disponibilidad subiendo de 89% a 98% y OT cerradas de 42 a 76 en la semana"
      >
        <Chart options={options} series={series} type="area" height={210} width="100%" />
      </div>

      <div className="grid grid-cols-3 gap-2 border-t border-white/25 pt-3 sm:gap-3">
        {[
          ["98%", "equipos disponibles"],
          ["76%", "OT cerradas"],
          ["24/7", "monitoreo activo"],
        ].map(([value, label]) => (
          <div key={label}>
            <p className="font-mono text-lg font-medium text-white sm:text-xl">{value}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.08em] text-white sm:text-[10px] sm:tracking-[0.12em]">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
