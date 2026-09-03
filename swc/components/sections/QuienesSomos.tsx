import Link from "next/link";
import { ArrowUpRight } from "../ui/icons";
import { Reveal } from "../ui/Reveal";

/* Ficha real de la empresa: los mismos datos verificables de /nosotros. */
const FICHA: [string, string][] = [
  ["Sede", "Chile"],
  ["Foco", "Minería y contratistas"],
  ["Plataforma", "Web · PWA · Android"],
  ["Implementación", "4 etapas"],
];

export function QuienesSomos() {
  return (
    <section id="nosotros" className="scroll-mt-28 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-20">
          <Reveal variant="up" as="div">
            <p className="font-mono text-[13px] text-[#0a0c77]">quiénes somos</p>
            <h2 className="mt-5 max-w-[24ch] font-display text-[clamp(1.9rem,3.8vw,2.9rem)] font-light leading-[1.16] tracking-[-0.01em] text-ink [text-wrap:balance]">
              Informática que{" "}
              <strong className="font-bold text-[#0a0c77]">sostiene la operación minera</strong>
            </h2>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-ink-soft">
              Sworkc Technologies crea herramientas digitales para que las operaciones mineras
              registren turnos, mantenciones, fallas y equipos con información clara, trazable y
              lista para decidir.
            </p>
            <Link
              href="/nosotros"
              className="group mt-7 inline-flex items-center gap-2 font-display text-sm font-semibold text-[#0a0c77] underline-offset-4 hover:underline"
            >
              Conoce cómo trabajamos
              <ArrowUpRight
                size={16}
                className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>

          <Reveal variant="up" delay={120} as="div" className="lg:self-end">
            <dl className="border-t-2 border-[#0a0c77]">
              {FICHA.map(([k, v]) => (
                <div
                  key={k}
                  className="grid grid-cols-[130px_minmax(0,1fr)] gap-3 border-b border-border py-2.5"
                >
                  <dt className="font-mono text-[11px] uppercase tracking-[0.1em] leading-relaxed text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="text-sm text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
