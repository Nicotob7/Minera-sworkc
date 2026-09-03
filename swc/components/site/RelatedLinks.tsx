import Link from "next/link";
import { ArrowUpRight } from "../ui/icons";
import { Reveal } from "../ui/Reveal";

export type RelatedItem = {
  title: string;
  desc: string;
  href: string;
};

/**
 * Bloque "Contenido relacionado": enlaces cruzados entre páginas hermanas para
 * que el sitio se sienta interconectado. Mismo estilo de tarjeta del sitio.
 */
export function RelatedLinks({
  items,
  title = "Contenido relacionado",
}: {
  items: RelatedItem[];
  title?: string;
}) {
  return (
    <section className="border-t border-border bg-surface-2 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <Reveal variant="up" as="h2" className="font-display text-2xl font-bold tracking-tight text-ink">
          {title}
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex h-full flex-col rounded-[var(--radius-lg)] border border-border bg-white p-5 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400 hover:shadow-[var(--shadow-md)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77]/30"
            >
              <span className="flex items-start justify-between gap-3">
                <h3 className="font-display text-base font-bold tracking-tight text-ink">
                  {item.title}
                </h3>
                <ArrowUpRight
                  size={18}
                  className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-brand-900"
                />
              </span>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
