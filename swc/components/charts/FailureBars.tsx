"use client";

const MAX = 10;
const BARS = [5, 7, 4, 6, 3, 5, 2];

/** Barras de fallas por turno (muestra fija: los valores no cambian solos). */
export function FailureBars() {
  const bars = BARS;
  const current = bars[bars.length - 1];
  const prev = bars[bars.length - 2];
  const down = current <= prev;

  return (
    <div
      role="img"
      aria-label={`Fallas por turno: ${bars.join(", ")}. Actual ${current}, ${down ? "a la baja" : "al alza"}.`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">
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
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
