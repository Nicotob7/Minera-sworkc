type ComingSoonCardProps = {
  category: string;
  title: string;
  note: string;
  /** Etiqueta del estado; por defecto "Próximamente". */
  status?: string;
};

/**
 * Tarjeta placeholder honesta para secciones sin contenido real todavía
 * (Novedades / Recursos). Mantiene el estilo del sitio pero deja claro que
 * el contenido está en preparación: sin inventar artículos ni cifras.
 */
export function ComingSoonCard({
  category,
  title,
  note,
  status = "Próximamente",
}: ComingSoonCardProps) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-white shadow-[var(--shadow-sm)]">
      {/* Zona de imagen "en preparación": patrón de cuadrícula técnica, sin fotos falsas */}
      <div
        aria-hidden
        className="tech-grid relative h-32 border-b border-border bg-surface-2"
      >
        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-white px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-900 shadow-[var(--shadow-sm)]">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
          {status}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {category}
        </p>
        <h3 className="mt-2 font-display text-base font-bold tracking-tight text-ink">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{note}</p>
      </div>
    </article>
  );
}
