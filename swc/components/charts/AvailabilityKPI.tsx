"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useInterval, useInViewport } from "../hooks";

const BASE = 98.6;
const HISTORY = [98.1, 98.4, 98.2, 98.7, 98.5, 98.9, 98.6, 98.8];

/** KPI de disponibilidad: cuenta hacia arriba al montar y fluctúa en vivo con sparkline. */
export function AvailabilityKPI() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(rootRef);
  const [pageVisible, setPageVisible] = useState(true);
  const [pct, setPct] = useState(BASE);
  const [hist, setHist] = useState<number[]>(HISTORY);
  const [ot, setOt] = useState(1247);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const running = !reduced && inView && pageVisible;

  // Count-up al montar
  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setPct(+(BASE * eased).toFixed(1));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Fluctuación en vivo
  useInterval(
    () => {
      const v = +(98.1 + Math.random() * 1.2).toFixed(1);
      setPct(v);
      setHist((h) => [...h.slice(1), v]);
      setOt((o) =>
        Math.max(1180, Math.min(1320, o + (Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 4))),
      );
    },
    running ? 3000 : null,
  );

  const min = 97.6;
  const max = 99.6;
  const w = 200;
  const h = 44;
  const pts = hist.map((v, i) => {
    const x = (i / (hist.length - 1)) * w;
    const y = h - ((v - min) / (max - min)) * h;
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${w} ${h} L0 ${h} Z`;

  return (
    <div ref={rootRef} role="img" aria-label={`Disponibilidad ${pct.toFixed(1).replace(".", ",")}%`}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Disponibilidad
        </p>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-ink-soft">
          <span className="relative flex h-2 w-2">
            <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-success" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          en vivo
        </span>
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="font-mono text-4xl font-medium tabular-nums text-ink">{pct.toFixed(1).replace(".", ",")}</span>
        <span className="font-mono text-xl text-muted-foreground">%</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-2 h-11 w-full" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="spark-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#spark-grad)" />
        <path
          d={line}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <p className="mt-1 text-xs text-muted-foreground">
        <span className="font-mono font-medium tabular-nums text-ink-soft">
          {ot.toLocaleString("es-CL")}
        </span>{" "}
        OT gestionadas
      </p>
    </div>
  );
}
