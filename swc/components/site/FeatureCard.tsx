import type { ComponentType } from "react";
import { CheckCircle2 } from "../ui/icons";

/** Icono reutilizable del set del sitio (animados de motion o Tabler). */
export type SiteIcon = ComponentType<{ size?: number; className?: string }>;

export type Feature = {
  icon: SiteIcon;
  tag?: string;
  title: string;
  desc: string;
  points?: string[];
  /** id para anclas de navegación (scroll-mt para no quedar bajo el Navbar). */
  id?: string;
};

/**
 * Tarjeta blanca hermana de las que ya usa el sitio (ver Servicios / ActiveDetail):
 * círculo de icono en marca, tag mono, título display y viñetas con check.
 * Sirve tanto para "pilares" (sin points) como para módulos (con points).
 */
export function FeatureCard({ icon: Icon, tag, title, desc, points, id }: Feature) {
  return (
    <article
      id={id}
      className={`group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-white p-6 shadow-[var(--shadow-md)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lg)] ${
        id ? "scroll-mt-28" : ""
      }`}
    >
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-brand-100 bg-brand-50 text-brand-900">
        <Icon size={24} />
      </span>
      {tag && (
        <p className="mt-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-900">
          {tag}
        </p>
      )}
      <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{desc}</p>
      {points && points.length > 0 && (
        <ul className="mt-4 space-y-2">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-ink">
              <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-900" strokeWidth={2.1} />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
