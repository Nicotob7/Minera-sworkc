import Image from "next/image";
import { Typewriter } from "./Typewriter";

/**
 * Hero full-bleed con la foto final (tablet + faena).
 * El texto va a la IZQUIERDA, sobre el paisaje; la TABLET (derecha) queda limpia, sin texto encima.
 * Degradado solo en el lado izquierdo para legibilidad. Mismo criterio en móvil.
 */
export function Hero() {
  return (
    <section
      id="inicio"
      className="relative w-full overflow-hidden bg-[#0d1430] min-h-[88svh] lg:min-h-[92svh]"
    >
      {/* Imagen de fondo, esquina a esquina */}
      <Image
        src="/hero/final.png"
        alt="Tablet mostrando el dashboard de sworkc (Visión Operativa) en una faena minera al atardecer"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_42%] lg:object-center"
      />

      {/* Tinte sutil + degradado IZQUIERDO (oscurece el paisaje para el texto; deja la tablet limpia) */}
      <div aria-hidden className="absolute inset-0" style={{ background: "rgba(9,13,34,0.2)" }} />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(7,10,26,0.95) 0%, rgba(7,10,26,0.8) 20%, rgba(7,10,26,0.42) 40%, rgba(7,10,26,0.06) 56%, transparent 66%)",
        }}
      />

      {/* Texto (izquierda, centrado vertical) */}
      <div className="relative mx-auto flex min-h-[88svh] max-w-7xl items-center px-6 pb-14 pt-28 sm:px-10 lg:min-h-[92svh] lg:px-12">
        <div className="max-w-md lg:max-w-xl">
          <h1
            className="animate-fade-up font-display text-[2.6rem] font-bold leading-[1.08] tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.5)] sm:text-5xl"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="block">Continuidad operacional minera</span>
            <span className="mt-1 block">
              <Typewriter
                reserve
                words={["en tiempo real", "con trazabilidad total", "sin pérdidas entre turnos"]}
                typeSpeed={95}
                deleteSpeed={45}
                pause={2400}
              />
            </span>
          </h1>

          <p
            className="animate-fade-up mt-5 max-w-md text-base leading-relaxed text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)] sm:text-lg"
            style={{ animationDelay: "0.2s" }}
          >
            Digitalizamos órdenes de trabajo, mantenciones y equipos: información de terreno
            convertida en decisiones.
          </p>
        </div>
      </div>
    </section>
  );
}
