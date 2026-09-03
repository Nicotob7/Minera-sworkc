import type { ReactNode } from "react";
import Image from "next/image";
import { Reveal } from "../ui/Reveal";

export type HeroReadout = { label: string; value: string };

type PageHeroProps = {
  /** Ruta dentro del sitio, ej. ["producto"] → "sworkc / producto". */
  path: string;
  title: ReactNode;
  intro: ReactNode;
  /** Lecturas con DATO REAL (conteos, unidades). Sin dato, no va lectura. */
  readouts?: HeroReadout[];
  /** Foto de faena (public/…). Sin foto: banda azul de marca plana. */
  img?: { src: string; alt: string; credit?: string };
  children?: ReactNode;
};

/**
 * Hero de páginas interiores, lenguaje "sala de control": fotografía real de
 * faena bajo una veladura azul de marca, título con peso, y una fila de
 * lecturas en mono con datos reales de la página. El crédito de la foto (CC)
 * va como caption técnico en la esquina.
 */
export function PageHero({ path, title, intro, readouts, img, children }: PageHeroProps) {
  return (
    <section className="relative isolate overflow-hidden bg-[#060733] text-white">
      {img && (
        <>
          <Image
            src={img.src}
            alt={img.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Veladura de marca: el azul manda, la foto respira a la derecha. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(100deg, rgba(6,7,51,0.96) 0%, rgba(10,12,119,0.82) 38%, rgba(10,12,119,0.45) 62%, rgba(6,7,51,0.35) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-24"
            style={{ background: "linear-gradient(180deg, transparent, rgba(6,7,51,0.85))" }}
          />
        </>
      )}

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-36 sm:pb-20 sm:pt-44 lg:px-10">
        <Reveal variant="up" as="div" className="max-w-3xl">
          <p className="font-mono text-[13px] text-cyan-300">
            <span className="text-white/45">sworkc /</span> {path}
          </p>
          <h1 className="mt-5 max-w-[22ch] font-display text-[clamp(2.4rem,6vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.02em] [text-wrap:balance]">
            {title}
          </h1>
          <p className="mt-6 max-w-[52ch] text-base font-light leading-relaxed text-white/85 sm:text-lg">
            {intro}
          </p>
        </Reveal>

        {readouts && readouts.length > 0 && (
          <Reveal variant="up" delay={120} as="div" className="mt-12">
            <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-5 font-mono text-sm">
              {readouts.map((r) => (
                <div key={r.label} className="flex items-baseline gap-2.5">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-white/50">{r.label}</dt>
                  <dd className="font-medium text-cyan-300">{r.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {children}
      </div>

      {img?.credit && (
        <p className="absolute bottom-2.5 right-4 z-10 font-mono text-[10px] text-white/40">
          {img.credit}
        </p>
      )}
    </section>
  );
}
