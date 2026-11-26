"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PORTADA } from "../lib/demo";

const { ancho, alto, pantalla } = PORTADA;
const ASPECTO = ancho / alto;
const recortar = (v: number) => Math.min(1, Math.max(0, v));
/** smoothstep: el acercamiento arranca y termina sin tirón. */
const suave = (t: number) => t * t * (3 - 2 * t);

/**
 * Portada desde lg: la sección mide dos pantallas y la escena queda fija mientras se baja.
 * En ese tramo la cámara se acerca a la tablet hasta que el panel ocupa la pantalla; el texto
 * y el velo oscuro se retiran. La velocidad del scroll no se toca (sin scroll-jacking).
 * Bajo lg o con movimiento reducido no hace nada: la portada queda estática.
 *
 * Mueve los hijos marcados con data-dolly="escena" | "foto" | "texto" | "velo".
 */
export function HeroDolly({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const seccion = ref.current;
    const pieza = (n: string) => seccion?.querySelector<HTMLElement>(`[data-dolly="${n}"]`);
    const escena = pieza("escena");
    const foto = pieza("foto");
    const texto = pieza("texto");
    const velo = pieza("velo");
    if (!seccion || !escena || !foto || !texto || !velo) return;

    const activo = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let cuadro = 0;

    const pintar = () => {
      cuadro = 0;
      if (!activo.matches) {
        for (const el of [foto, texto, velo]) {
          for (const prop of ["transform", "transform-origin", "opacity", "visibility"]) el.style.removeProperty(prop);
        }
        return;
      }
      // Caja de la foto: replica object-cover centrado (misma regla que el CSS de Hero).
      const w = escena.clientWidth;
      const h = escena.clientHeight;
      const W = Math.max(w, h * ASPECTO);
      const H = W / ASPECTO;
      const cx = ((pantalla.x + pantalla.w / 2) / ancho) * W;
      const cy = ((pantalla.y + pantalla.h / 2) / alto) * H;
      const anchoPantalla = (pantalla.w / ancho) * W;
      const altoPantalla = (pantalla.h / alto) * H;
      // Al final el panel llena la pantalla bajo el menú flotante (~110 px arriba).
      const escala = Math.max(1, Math.min((w * 0.92) / anchoPantalla, (h - 130) / altoPantalla));
      const x0 = (w - W) / 2 + cx; // centro de la pantalla en la escena, sin acercar
      const y0 = (h - H) / 2 + cy;
      // Destino: centrado bajo el menú, pero sin destapar bordes de la foto (lineal en t: si cubre
      // al principio y al final, cubre en todo el tramo).
      const fx = Math.min(Math.max(w / 2, w - (W - cx) * escala), cx * escala);
      const fy = Math.min(Math.max((h + 70) / 2, h - (H - cy) * escala), cy * escala);
      const dx = fx - x0;
      const dy = fy - y0;

      const r = seccion.getBoundingClientRect();
      const recorrido = r.height - h;
      const p = recorrido > 0 ? recortar(-r.top / recorrido) : 0;
      const t = suave(recortar((p - 0.04) / 0.82));

      foto.style.transformOrigin = `${cx}px ${cy}px`;
      foto.style.transform = `translate3d(${dx * t}px, ${dy * t}px, 0) scale(${1 + (escala - 1) * t})`;
      // El texto sale en el primer tramo, antes de que la tablet llegue a pasar por debajo.
      const salida = recortar(p / 0.16);
      texto.style.opacity = String(1 - salida);
      texto.style.transform = `translateY(${-72 * salida}px)`;
      texto.style.visibility = salida >= 1 ? "hidden" : "";
      velo.style.opacity = String(1 - recortar(t * 1.6));
    };

    const pedir = () => {
      if (!cuadro) cuadro = requestAnimationFrame(pintar);
    };
    pedir();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", pedir);
    activo.addEventListener("change", pedir);
    return () => {
      cancelAnimationFrame(cuadro);
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      activo.removeEventListener("change", pedir);
    };
  }, []);

  return (
    <section ref={ref} id="inicio" className={className}>
      {children}
    </section>
  );
}
