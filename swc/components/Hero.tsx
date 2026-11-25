import Image from "next/image";
import { CTAButton } from "./ui/CTAButton";
import { PanelOperativoDemo } from "./demo/PanelOperativoDemo";
import { PORTADA } from "../lib/demo";

const { ancho, alto, pantalla } = PORTADA;

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
        src="/hero/portada.jpg"
        alt="Tablet en una faena minera al atardecer"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_42%] lg:object-center"
      />

      {/* Panel limpio sobre la pantalla de la tablet (desde lg, donde la foto va centrada).
          La caja replica object-cover con unidades de contenedor para quedar alineada a la foto. */}
      <div className="absolute inset-0 hidden [container-type:size] lg:block">
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ width: `max(100cqw, calc(100cqh * ${ancho} / ${alto}))`, aspectRatio: `${ancho} / ${alto}` }}
        >
          <div
            className="absolute overflow-hidden rounded-[0.6%]"
            style={{
              left: `${(pantalla.x / ancho) * 100}%`,
              top: `${(pantalla.y / alto) * 100}%`,
              width: `${(pantalla.w / ancho) * 100}%`,
            }}
          >
            <PanelOperativoDemo tema="oscuro" />
          </div>
        </div>
      </div>

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
            {/* Cortes fijos desde lg (ritmo de la portada); en móvil corta natural. */}
            <span className="lg:block">Continuidad operacional</span>{" "}
            <span className="lg:block">minera conectada</span>{" "}
            <span className="lg:block">entre turnos</span>
          </h1>

          <p
            className="animate-fade-up mt-5 max-w-md text-base leading-relaxed text-white/85 drop-shadow-[0_1px_10px_rgba(0,0,0,0.45)] sm:text-lg"
            style={{ animationDelay: "0.2s" }}
          >
            Digitalizamos órdenes de trabajo, mantenciones y equipos: información de terreno
            convertida en decisiones.
          </p>

          <div
            className="animate-fade-up mt-7 flex flex-col gap-3 sm:flex-row"
            style={{ animationDelay: "0.3s" }}
          >
            <CTAButton href="#contacto" variant="primary">
              Solicitar una demostración
            </CTAButton>
            <CTAButton href="#servicios" variant="ghost-dark" icon={false}>
              Ver cómo funciona
            </CTAButton>
          </div>
        </div>
      </div>
    </section>
  );
}
