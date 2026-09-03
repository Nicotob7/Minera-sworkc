import type { ReactNode } from "react";
import { Reveal } from "../ui/Reveal";
import { TechGrid } from "../ui/TechGrid";

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  intro: ReactNode;
  /** Contenido extra bajo la intro (ej. bloque de pilares/infografía). */
  children?: ReactNode;
};

/**
 * Hero corto para páginas interiores. Reutiliza el lenguaje visual oscuro del
 * sitio (gradiente de marca + TechGrid + anillos decorativos, igual que Servicios)
 * y deja padding superior para no quedar tapado por el Navbar fijo.
 */
export function PageHero({ eyebrow, title, intro, children }: PageHeroProps) {
  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ background: "linear-gradient(135deg, #0a0c77 0%, #14188a 52%, #070b1c 120%)" }}
    >
      <TechGrid
        variant="dark"
        className="opacity-20 [mask-image:linear-gradient(180deg,black,transparent_88%)]"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-52 -top-16 h-72 w-[44rem] rotate-[-12deg] rounded-[999px] border border-white/10"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-56 bottom-0 h-64 w-[38rem] rotate-[10deg] rounded-[999px] border border-white/10"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-32 sm:pb-16 sm:pt-36 lg:px-10">
        <Reveal variant="up" as="div" className="max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
            {eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {intro}
          </p>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
