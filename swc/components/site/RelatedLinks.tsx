import Link from "next/link";
import { ArrowUpRight } from "../ui/icons";

export type RelatedItem = {
  title: string;
  desc: string;
  href: string;
};

/**
 * "Contenido relacionado": enlaces cruzados entre páginas hermanas, en el
 * lenguaje de bitácora del sitio (hairlines, sin tarjetas).
 */
export function RelatedLinks({
  items,
  title = "Contenido relacionado",
}: {
  items: RelatedItem[];
  title?: string;
}) {
  return (
    <section className="border-t border-border bg-[#f6f8fc] py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-2xl font-bold tracking-[-0.01em] text-ink">{title}</h2>
        </div>
        <div className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="group block border-t-2 border-[#0a0c77]/25 pt-4 transition-colors hover:border-[#0a0c77] focus-visible:border-[#0a0c77] focus-visible:outline-none"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-display text-base font-semibold tracking-tight text-ink">
                    {item.title}
                  </span>
                  <ArrowUpRight
                    size={17}
                    className="shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#0a0c77]"
                  />
                </span>
                <span className="mt-1.5 block max-w-[40ch] text-sm leading-relaxed text-ink-soft">
                  {item.desc}
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
