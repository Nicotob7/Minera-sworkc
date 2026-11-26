"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PORTADA } from "../lib/demo";

const { ancho, alto, pantalla } = PORTADA;
const ASPECTO = ancho / alto;
const recortar = (v: number) => Math.min(1, Math.max(0, v));
/** smoothstep: el acercamiento arranca y termina sin tirón. */
const suave = (t: number) => t * t * (3 - 2 * t);
const esperar = (ms: number) => new Promise((r) => window.setTimeout(r, ms));
const CURVA = "cubic-bezier(0.65, 0, 0.35, 1)";

/**
 * Portada desde lg: la sección mide 2,6 pantallas y la escena queda fija mientras se baja.
 * - Primer tramo: la cámara se acerca a la tablet hasta que el panel ocupa la pantalla; el texto
 *   y el velo oscuro se retiran. La velocidad del scroll no se toca (sin scroll-jacking).
 * - Al completarse el acercamiento, un cursor usa el panel una vez: se posa en «OTs NP abiertas»,
 *   abre la ficha del CAEX-214, señala la dona y el primer evento. Solo cambian estados de la
 *   interfaz (data-demo / data-equipo en la capa de la foto), ninguna cifra. Si el visitante
 *   vuelve a subir, se cancela y queda listo para repetirse.
 * Bajo lg o con movimiento reducido no hace nada: la portada queda estática.
 *
 * Mueve los hijos marcados con data-dolly="escena" | "foto" | "texto" | "velo" | "cursor".
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
    const cursor = pieza("cursor");
    if (!seccion || !escena || !foto || !texto || !velo || !cursor) return;

    const activo = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let cuadro = 0;
    let demo: { cancelado: boolean } | null = null;

    /* ── Recorrido del cursor ── */
    const detenerDemo = () => {
      if (demo) demo.cancelado = true;
      demo = null;
      for (const a of cursor.getAnimations({ subtree: true })) a.cancel();
      cursor.style.opacity = "0";
      delete foto.dataset.demo;
      delete foto.dataset.equipo;
    };

    const correrDemo = async (d: { cancelado: boolean }) => {
      const e = escena.getBoundingClientRect();
      // Punta de la flecha: el SVG la tiene en (4, 2) de 24, dibujado a 22 px.
      const punto = (nombre: string, fx = 0.5, fy = 0.5): [number, number] | null => {
        const el = foto.querySelector(`[data-objetivo="${nombre}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return [r.left - e.left + r.width * fx - 3.7, r.top - e.top + r.height * fy - 1.8];
      };
      let pos: [number, number] = [e.width * 0.74, e.height * 0.9];
      const ubicar = ([x, y]: [number, number]) => `translate(${x}px, ${y}px)`;
      const mover = async (destino: [number, number] | null, ms: number) => {
        if (!destino || d.cancelado) return;
        const a = cursor.animate([{ transform: ubicar(pos) }, { transform: ubicar(destino) }], { duration: ms, easing: CURVA, fill: "forwards" });
        pos = destino;
        await a.finished.catch(() => {});
      };
      const clic = async () => {
        if (d.cancelado) return;
        const onda = cursor.querySelector<HTMLElement>("[data-clic]");
        onda?.animate([{ opacity: 0.9, transform: "scale(0.3)" }, { opacity: 0, transform: "scale(1.6)" }], { duration: 450, easing: "ease-out" });
        await cursor.querySelector("svg")?.animate([{ transform: "scale(1)" }, { transform: "scale(0.82)" }, { transform: "scale(1)" }], { duration: 220, easing: "ease-out" }).finished.catch(() => {});
      };
      const paso = async (fn: () => void, ms: number) => {
        if (d.cancelado) return;
        fn();
        await esperar(ms);
      };

      cursor.style.transform = ubicar(pos);
      await cursor.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "forwards" }).finished.catch(() => {});
      await mover(punto("kpi-np", 0.55, 0.45), 850);
      await paso(() => (foto.dataset.demo = "kpi"), 1300);
      await mover(punto("tab-caex", 0.45, 0.6), 900);
      await clic();
      await paso(() => {
        delete foto.dataset.demo;
        foto.dataset.equipo = "caex";
      }, 1500);
      await mover(punto("dona-mant", 0.35, 0.5), 950);
      await paso(() => (foto.dataset.demo = "dona"), 1400);
      await mover(punto("evento", 0.3, 0.5), 850);
      await paso(() => (foto.dataset.demo = "eventos"), 1400);
      if (d.cancelado) return;
      delete foto.dataset.demo;
      await cursor.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" }).finished.catch(() => {});
    };

    /* ── Acercamiento por scroll ── */
    const pintar = () => {
      cuadro = 0;
      if (!activo.matches) {
        detenerDemo();
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
      // El acercamiento ocupa hasta p = 0,6; el resto del tramo fijo es para el recorrido del cursor.
      const t = suave(recortar((p - 0.03) / 0.57));

      foto.style.transformOrigin = `${cx}px ${cy}px`;
      foto.style.transform = `translate3d(${dx * t}px, ${dy * t}px, 0) scale(${1 + (escala - 1) * t})`;
      // El texto sale en el primer tramo, antes de que la tablet llegue a pasar por debajo.
      const salida = recortar(p / 0.11);
      texto.style.opacity = String(1 - salida);
      texto.style.transform = `translateY(${-72 * salida}px)`;
      texto.style.visibility = salida >= 1 ? "hidden" : "";
      velo.style.opacity = String(1 - recortar(t * 1.6));

      // Arranca solo con la escena todavía fija (p < 0,97): si se baja de largo, no corre fuera de vista.
      if (t >= 0.999 && p < 0.97 && !demo) {
        demo = { cancelado: false };
        void correrDemo(demo);
      } else if (t < 0.9 && demo) {
        detenerDemo();
      }
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
      detenerDemo();
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
