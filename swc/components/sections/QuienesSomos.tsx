import Link from "next/link";
import { Fragment, type CSSProperties } from "react";
import { ArrowUpRight } from "../ui/icons";
import s from "./QuienesSomos.module.css";

/* Ficha real de la empresa: los mismos datos verificables de /nosotros. */
const FICHA: [string, string][] = [
  ["Sede", "Chile"],
  ["Foco", "Minería y contratistas"],
  ["Plataforma", "Web · PWA · Android"],
  ["Implementación", "4 etapas"],
];

/** Parte un texto en palabras con su orden (--i) para el revelado atado al scroll; los espacios quedan como texto. */
function Palabras({ texto, desde = 0, className }: { texto: string; desde?: number; className: string }) {
  return texto.split(" ").map((p, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className={className} style={{ "--i": desde + i } as CSSProperties}>
        {p}
      </span>
    </Fragment>
  ));
}

export function QuienesSomos() {
  return (
    <section id="nosotros" className={`${s.seccion} bg-white py-20 sm:py-28`}>
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-20">
          <div>
            <h2 className="max-w-[24ch] font-display text-[clamp(1.9rem,3.2vw,2.5rem)] font-light leading-[1.16] tracking-[-0.01em] text-ink [text-wrap:balance]">
              <Palabras texto="Informática que" className={s.palabra} />{" "}
              <strong className="font-bold text-[#0a0c77]">
                <Palabras texto="sostiene la operación minera" desde={2} className={s.palabra} />
              </strong>
            </h2>
            <p className="mt-6 max-w-[58ch] text-base leading-relaxed text-ink-soft">
              <Palabras
                texto="Sworkc Technologies crea herramientas digitales para que las operaciones mineras registren turnos, mantenciones, fallas y equipos con información clara, trazable y lista para decidir."
                className={s.leer}
              />
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
          </div>

          <div className="lg:self-end">
            <dl className={s.ficha}>
              {FICHA.map(([k, v], i) => (
                <div
                  key={k}
                  className={`${s.fila} grid grid-cols-[130px_minmax(0,1fr)] gap-3 border-b border-border py-2.5`}
                  style={{ "--i": i } as CSSProperties}
                >
                  <dt className="text-xs leading-relaxed text-muted-foreground">
                    {k}
                  </dt>
                  <dd className="text-sm text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
