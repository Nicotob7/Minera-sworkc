import type { ReactNode } from "react";
import Image from "next/image";

export type HeroReadout = { label: string; value: string };

type PageHeroProps = {
  /** Ruta dentro del sitio, ej. ["producto"] → "sworkc / producto". */
  path: string;
  title: ReactNode;
  intro: ReactNode;
  /** Lecturas con DATO REAL (conteos, unidades). Sin dato, no va lectura. */
  readouts?: HeroReadout[];
  /** Foto de faena (public/…). Sin foto: banda azul de marca plana. */
  img?: { src: string; alt: string };
  children?: ReactNode;
};

/**
 * Hero de páginas interiores, lenguaje "sala de control": fotografía real de
 * faena bajo una veladura azul de marca, título con peso, y una fila de
 * lecturas con datos reales de la página. Los créditos de las fotos (CC) van
 * en el pie de página (lib/creditos.ts), no sobre la imagen.
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
        <div className="max-w-3xl">
          <p className="text-sm text-cyan-300">
            <span className="text-white/60">sworkc /</span> {path}
          </p>
          <h1 className="mt-5 max-w-[22ch] font-display text-[clamp(2.4rem,6vw,4.25rem)] font-bold leading-[1.02] tracking-[-0.02em] [text-wrap:balance]">
            {title}
          </h1>
          <p className="mt-6 max-w-[52ch] text-base font-light leading-relaxed text-white/85 sm:text-lg">
            {intro}
          </p>
        </div>

        {readouts && readouts.length > 0 && (
          <div className="mt-12">
            <dl className="flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-5 text-sm">
              {readouts.map((r) => (
                <div key={r.label} className="flex items-baseline gap-2.5">
                  <dt className="text-xs text-white/65">{r.label}</dt>
                  <dd className="font-semibold text-cyan-300">{r.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {children}
      </div>
    </section>
  );
}
