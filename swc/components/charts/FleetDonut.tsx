"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useInterval, useInViewport } from "../hooks";

const R = 52;
const C = 2 * Math.PI * R;
const LABELS = ["Operativos", "Mantención", "Detenidos"];
const COLORS = ["var(--color-success)", "var(--color-warning)", "var(--color-danger)"];

/** Anillo de estado de flota. Mueve una unidad entre estados cada ciclo (efecto "en vivo"). */
export function FleetDonut() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(rootRef);
  const [pageVisible, setPageVisible] = useState(true);
  const [data, setData] = useState<number[]>([42, 6, 2]);
  const total = data.reduce((a, b) => a + b, 0);
  const lengths = data.map((v) => (total > 0 ? (v / total) * C : 0));
  const offsets = lengths.map((_, idx) => lengths.slice(0, idx).reduce((sum, len) => sum + len, 0));

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const running = !reduced && inView && pageVisible;

  useInterval(
    () => {
      setData((d) => {
        const next = [...d];
        const i = Math.floor(Math.random() * 3);
        let j = Math.floor(Math.random() * 3);
        if (j === i) j = (j + 1) % 3;
        if (next[i] > 1) {
          next[i] -= 1;
          next[j] += 1;
        }
        return next;
      });
    },
    running ? 3200 : null,
  );

  return (
    <div
      ref={rootRef}
      className="flex items-center gap-4"
      role="img"
      aria-label={`Flota: ${data[0]} operativos, ${data[1]} en mantención, ${data[2]} detenidos`}
    >
      <div className="relative h-[128px] w-[128px] shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90" aria-hidden="true">
          <circle cx="70" cy="70" r={R} fill="none" stroke="var(--color-surface-2)" strokeWidth="13" />
          {lengths.map((len, idx) => (
            <circle
              key={idx}
              cx="70"
              cy="70"
              r={R}
              fill="none"
              stroke={COLORS[idx]}
              strokeWidth="13"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-offsets[idx]}
              style={
                reduced
                  ? undefined
                  : { transition: "stroke-dasharray .8s ease, stroke-dashoffset .8s ease" }
              }
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-2xl font-medium tabular-nums text-ink">{total}</span>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">equipos</span>
        </div>
      </div>
      <ul className="flex flex-col gap-2">
        {LABELS.map((l, idx) => (
          <li key={l} className="flex items-center gap-2 text-sm">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
            <span className="text-ink-soft">{l}</span>
            <span className="ml-auto font-mono font-medium tabular-nums text-ink">{data[idx]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
