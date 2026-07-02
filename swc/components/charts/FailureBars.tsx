"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion, useInterval, useInViewport } from "../hooks";

const MAX = 10;

/** Barras de fallas por turno. Avanza el "feed" cada ciclo (desplaza y agrega un turno). */
export function FailureBars() {
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInViewport(rootRef);
  const [pageVisible, setPageVisible] = useState(true);
  const [bars, setBars] = useState<number[]>([5, 7, 4, 6, 3, 5, 2]);

  useEffect(() => {
    const update = () => setPageVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const running = !reduced && inView && pageVisible;

  useInterval(
    () => {
      setBars((b) => {
        const last = b[b.length - 1];
        let v = last + (Math.random() < 0.5 ? -1 : 1);
        v = Math.max(1, Math.min(9, v));
        return [...b.slice(1), v];
      });
    },
    running ? 2600 : null,
  );

  const current = bars[bars.length - 1];
  const prev = bars[bars.length - 2];
  const down = current <= prev;

  return (
    <div
      ref={rootRef}
      role="img"
      aria-label={`Fallas por turno: ${bars.join(", ")}. Actual ${current}, ${down ? "a la baja" : "al alza"}.`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Fallas por turno
          </p>
          <p className="mt-1 font-mono text-2xl font-medium tabular-nums text-ink">{current}</p>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-[var(--radius-pill)] px-2 py-1 text-[11px] font-medium ${
            down ? "bg-success-bg text-success-fg" : "bg-danger-bg text-danger-fg"
          }`}
        >
          {down ? "▼" : "▲"} {down ? "a la baja" : "al alza"}
        </span>
      </div>
      <div className="mt-3 flex h-[72px] items-end gap-1.5">
        {bars.map((v, i) => {
          const isLast = i === bars.length - 1;
          return (
            <div
              key={i}
              className="flex-1 rounded-t-[3px]"
              style={{
                height: `${(v / MAX) * 100}%`,
                background: isLast ? "var(--gradient-cta)" : "var(--color-brand-200)",
                transition: reduced ? undefined : "height .5s cubic-bezier(.22,.61,.36,1)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
