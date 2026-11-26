import Image from "next/image";
import type { CSSProperties } from "react";
import { CTAButton } from "./ui/CTAButton";
import { HeroDolly } from "./HeroDolly";
import { PanelOperativoDemo } from "./demo/PanelOperativoDemo";
import { PORTADA } from "../lib/demo";

const { ancho, alto, pantalla } = PORTADA;
const porc = (v: number, total: number) => `${(v / total) * 100}%`;

/** Los cuatro pasos del cursor sobre el panel (mismo orden que HeroDolly). */
const GUIA = [
  { titulo: "OTs no planificadas", texto: "Las órdenes que nadie programó, a la vista apenas entras." },
  { titulo: "Ficha del equipo", texto: "Un clic en el CAEX-214: horómetro, OTs abiertas y prioridad." },
  { titulo: "Estado de la flota", texto: "Cuántos equipos están operativos, en mantención o fuera de servicio." },
  { titulo: "Eventos del turno", texto: "Lo último que pasó: OTs creadas, cerradas y cambios de estado." },
];

/**
 * Portada: foto de la tablet en faena con el panel de sworkc (HTML, datos de ejemplo) en su pantalla.
 * - Móvil y tablet: texto sobre fondo navy y, debajo, la foto recortada a la tablet.
 * - Desde lg: la foto llena la escena (object-cover replicado con unidades de contenedor) y
 *   HeroDolly acerca la cámara a la pantalla al bajar.
 * Al cargar, el panel se enciende una vez (PanelOperativoDemo `encender`).
 */
export function Hero() {
  return (
    <HeroDolly className="relative bg-[#060733] lg:h-[92svh] lg:motion-safe:h-[260svh]">
      <div data-dolly="escena" className="relative lg:sticky lg:top-0 lg:h-[92svh] lg:overflow-hidden lg:motion-safe:h-svh">
        {/* Texto: en lg va a la izquierda, sobre el paisaje, y termina antes de la pantalla */}
        <div
          data-dolly="texto"
          className="relative z-10 mx-auto flex max-w-7xl px-6 pb-10 pt-28 sm:px-10 lg:h-full lg:items-center lg:px-12 lg:pb-6"
        >
          <div className="portada-columna max-w-xl">
            <h1
              className="portada-titulo animate-fade-up font-display text-[2.4rem] font-bold leading-[1.06] tracking-tight text-white sm:text-5xl"
              style={{ animationDelay: "0.1s" }}
            >
              {/* Cortes fijos desde lg para que el título no entre en la pantalla de la tablet. */}
              <span className="lg:block">Continuidad</span>{" "}
              <span className="lg:block">operacional</span>{" "}
              <span className="lg:block">minera conectada</span>{" "}
              <span className="lg:block">entre turnos</span>
            </h1>

            <p
              className="animate-fade-up mt-5 max-w-md text-base leading-relaxed text-white/85 sm:text-lg"
              style={{ animationDelay: "0.2s" }}
            >
              Digitalizamos órdenes de trabajo, mantenciones y equipos: información de terreno
              convertida en decisiones.
            </p>

            <div className="animate-fade-up mt-7 flex flex-col gap-3 sm:flex-row lg:flex-wrap" style={{ animationDelay: "0.3s" }}>
              <CTAButton href="#contacto" variant="primary">
                Solicitar una demostración
              </CTAButton>
              <CTAButton href="#servicios" variant="ghost-dark" icon={false}>
                Ver cómo funciona
              </CTAButton>
            </div>
          </div>
        </div>

        {/* Foto + panel. Móvil: banda recortada a la tablet. lg: capa de fondo con caja "cover". */}
        <div className="relative h-[80vw] overflow-hidden sm:h-[58vw] lg:absolute lg:inset-0 lg:h-auto lg:[container-type:size]">
          <div
            className="absolute left-1/2 top-1/2 w-[150%] -translate-x-[67.6%] -translate-y-[54.7%] sm:w-[118%] lg:w-[max(100cqw,calc(100cqh*1672/941))] lg:-translate-x-1/2 lg:-translate-y-1/2"
            style={{ aspectRatio: `${ancho} / ${alto}` } as CSSProperties}
          >
            <div data-dolly="foto" className="absolute inset-0">
              <Image
                src="/hero/portada.jpg"
                alt="Tablet con el panel de sworkc en una faena minera al atardecer"
                fill
                priority
                sizes="(min-width: 1024px) 100vw, 150vw"
                className="object-cover"
              />
              <div
                className="absolute overflow-hidden rounded-[0.5%]"
                style={{ left: porc(pantalla.x, ancho), top: porc(pantalla.y, alto), width: porc(pantalla.w, ancho) }}
              >
                <PanelOperativoDemo encender />
              </div>
            </div>
          </div>
          {/* Móvil: la foto nace del navy del texto */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-[#060733] lg:hidden" />
        </div>

        {/* Pantallas anchas: guía a la izquierda del panel acercado, sincronizada con el cursor (HeroDolly
            la muestra solo si sobra ancho y marca el paso activo con data-guia-activo). */}
        <div data-dolly="guia" aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden items-center opacity-0 transition-opacity duration-500 lg:flex">
          <div className="absolute inset-0 bg-gradient-to-r from-[#060733]/92 via-[#060733]/70 to-transparent" />
          <div className="relative ml-12 mr-6 max-w-[21rem] pt-16">
            <p className="text-sm font-semibold text-white/60">Así se usa el panel</p>
            <ol className="mt-5 space-y-5">
              {GUIA.map((g, i) => (
                <li key={g.titulo} data-guia={i + 1} className="guia-paso grid grid-cols-[28px_minmax(0,1fr)] gap-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full border border-white/35 font-mono text-xs text-white/85">{i + 1}</span>
                  <div>
                    <p className="font-display text-base font-semibold text-white">{g.titulo}</p>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{g.texto}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* lg: cursor que recorre el panel cuando la cámara termina de acercarse (lo mueve HeroDolly) */}
        <div data-dolly="cursor" aria-hidden className="pointer-events-none absolute left-0 top-0 z-20 hidden opacity-0 lg:block">
          <span data-clic className="absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-[#0a0c77]/60 opacity-0" />
          <svg width="22" height="22" viewBox="0 0 24 24" className="relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
            <path d="M4 2 L4 19.5 L8.6 15.2 L11.7 21.8 L14.6 20.5 L11.5 14 L17.8 14 Z" fill="#0b1020" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </div>

        {/* lg: velo izquierdo para el texto; se retira al acercarse a la tablet */}
        <div
          data-dolly="velo"
          aria-hidden
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(6,7,30,0.94) 0%, rgba(6,7,30,0.78) 18%, rgba(6,7,30,0.4) 30%, rgba(6,7,30,0.08) 38%, transparent 44%), rgba(9,13,34,0.18)",
          }}
        />
      </div>
    </HeroDolly>
  );
}
