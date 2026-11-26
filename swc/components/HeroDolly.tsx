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
/** Ancho de la columna de la guía (w-[21rem]) y su separación del panel (mr-10). */
const GUIA_ANCHO = 336;
const GUIA_SEPARACION = 40;

type Corrida = { cancelado: boolean };

/**
 * Portada desde lg: la sección mide 2,6 pantallas y la escena queda fija mientras se baja.
 * - Primer tramo: la cámara se acerca a la tablet hasta que el panel ocupa la pantalla; el texto
 *   y el velo oscuro se retiran. La velocidad del scroll no se toca (sin scroll-jacking).
 * - Al completarse el acercamiento, un cursor usa el panel una vez: se posa en «OTs NP abiertas»,
 *   abre la ficha del CAEX-214, señala la dona y el primer evento. Solo cambian estados de la
 *   interfaz (data-demo / data-equipo en la capa de la foto), ninguna cifra.
 * - En pantallas anchas, panel y guía se centran juntos y cada paso de la guía es un botón que
 *   lleva al cursor a esa acción (el recorrido automático se detiene).
 * Si el visitante vuelve a subir, todo se cancela y queda listo para repetirse.
 * Bajo lg o con movimiento reducido no hace nada: la portada queda estática.
 *
 * Mueve los hijos marcados con data-dolly="escena" | "foto" | "texto" | "velo" | "cursor" | "guia".
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
    const guia = pieza("guia");
    if (!seccion || !escena || !foto || !texto || !velo || !cursor || !guia) return;

    const activo = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let cuadro = 0;
    let corrida: Corrida | null = null; // no nula: el recorrido ya empezó (o el visitante eligió un paso)
    let cursorVisible = false;
    let pos: [number, number] = [0, 0];

    /* ── Cursor ── */
    const ubicar = ([x, y]: [number, number]) => `translate(${x}px, ${y}px)`;
    // Punta de la flecha: el SVG la tiene en (4, 2) de 24, dibujado a 22 px.
    const punto = (nombre: string, fx = 0.5, fy = 0.5): [number, number] | null => {
      const el = foto.querySelector(`[data-objetivo="${nombre}"]`);
      if (!el) return null;
      const e = escena.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return [r.left - e.left + r.width * fx - 3.7, r.top - e.top + r.height * fy - 1.8];
    };
    const mover = async (c: Corrida, destino: [number, number] | null, ms: number) => {
      if (!destino || c.cancelado) return;
      const a = cursor.animate([{ transform: ubicar(pos) }, { transform: ubicar(destino) }], { duration: ms, easing: CURVA, fill: "forwards" });
      pos = destino;
      await a.finished.catch(() => {});
      cursor.style.transform = ubicar(destino);
    };
    const clic = async (c: Corrida) => {
      if (c.cancelado) return;
      cursor.querySelector<HTMLElement>("[data-clic]")?.animate(
        [{ opacity: 0.9, transform: "scale(0.3)" }, { opacity: 0, transform: "scale(1.6)" }],
        { duration: 450, easing: "ease-out" },
      );
      await cursor.querySelector("svg")?.animate([{ transform: "scale(1)" }, { transform: "scale(0.82)" }, { transform: "scale(1)" }], { duration: 220, easing: "ease-out" }).finished.catch(() => {});
    };
    const mostrarCursor = async () => {
      if (cursorVisible) return;
      cursorVisible = true;
      const e = escena.getBoundingClientRect();
      pos = [e.width * 0.74, e.height * 0.9];
      cursor.style.transform = ubicar(pos);
      await cursor.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "forwards" }).finished.catch(() => {});
    };
    /** Marca el paso en la guía y reinicia su barra (que dura lo que dura el paso). */
    const activar = (n: number | "fin", ms = 0) => {
      delete guia.dataset.guiaActivo;
      void guia.offsetWidth;
      guia.style.setProperty("--guia-ms", `${ms}ms`);
      guia.dataset.guiaActivo = String(n);
    };

    /* ── Los cuatro pasos (mismo orden que la guía de Hero.tsx) ── */
    const PASOS: ((c: Corrida) => Promise<void>)[] = [
      async (c) => {
        activar(1, 2150);
        delete foto.dataset.demo;
        await mover(c, punto("kpi-np", 0.55, 0.45), 850);
        if (c.cancelado) return;
        foto.dataset.demo = "kpi";
        await esperar(1300);
      },
      async (c) => {
        activar(2, 2620);
        delete foto.dataset.demo;
        await mover(c, punto("tab-caex", 0.45, 0.6), 900);
        await clic(c);
        if (c.cancelado) return;
        foto.dataset.equipo = "caex";
        await esperar(1500);
      },
      async (c) => {
        activar(3, 2350);
        delete foto.dataset.demo;
        await mover(c, punto("dona-mant", 0.35, 0.5), 950);
        if (c.cancelado) return;
        foto.dataset.demo = "dona";
        await esperar(1400);
      },
      async (c) => {
        activar(4, 2250);
        delete foto.dataset.demo;
        await mover(c, punto("evento", 0.3, 0.5), 850);
        if (c.cancelado) return;
        foto.dataset.demo = "eventos";
        await esperar(1400);
      },
    ];

    const recorrer = async (c: Corrida) => {
      await mostrarCursor();
      for (const paso of PASOS) {
        if (c.cancelado) return;
        await paso(c);
      }
      if (c.cancelado) return;
      delete foto.dataset.demo;
      activar("fin");
      await cursor.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" }).finished.catch(() => {});
      cursorVisible = false;
    };

    /** Clic en un paso de la guía: corta lo que esté corriendo y muestra solo ese paso. */
    const irA = async (n: number) => {
      if (corrida) corrida.cancelado = true;
      for (const a of cursor.getAnimations({ subtree: true })) if (a.playState === "running") a.finish();
      const c: Corrida = { cancelado: false };
      corrida = c;
      await mostrarCursor();
      await PASOS[n - 1]?.(c);
    };
    const alClic = (ev: MouseEvent) => {
      const boton = (ev.target as HTMLElement).closest<HTMLElement>("[data-guia-ir]");
      if (boton) void irA(Number(boton.dataset.guiaIr));
    };
    guia.addEventListener("click", alClic);

    const detener = () => {
      if (corrida) corrida.cancelado = true;
      corrida = null;
      cursorVisible = false;
      for (const a of cursor.getAnimations({ subtree: true })) a.cancel();
      cursor.style.opacity = "0";
      delete foto.dataset.demo;
      delete foto.dataset.equipo;
      delete guia.dataset.guiaActivo;
    };

    /* ── Acercamiento por scroll ── */
    const pintar = () => {
      cuadro = 0;
      if (!activo.matches) {
        detener();
        for (const prop of ["opacity", "visibility", "width"]) guia.style.removeProperty(prop);
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
      const anchoFinal = anchoPantalla * escala;
      const x0 = (w - W) / 2 + cx; // centro de la pantalla en la escena, sin acercar
      const y0 = (h - H) / 2 + cy;
      // Si sobra ancho (pantallas anchas y bajas), guía y panel se centran juntos; si no, el panel
      // va centrado y no hay guía. En ambos casos sin destapar bordes de la foto (lineal en t: si
      // cubre al principio y al final, cubre en todo el tramo).
      const conGuia = w - anchoFinal >= 420;
      const grupo = GUIA_ANCHO + GUIA_SEPARACION + anchoFinal;
      const deseado = conGuia ? (w - grupo) / 2 + GUIA_ANCHO + GUIA_SEPARACION + anchoFinal / 2 : w / 2;
      const fx = Math.min(Math.max(deseado, w - (W - cx) * escala), cx * escala);
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
      if (t >= 0.999 && p < 0.97 && !corrida) {
        corrida = { cancelado: false };
        void recorrer(corrida);
      } else if (t < 0.9 && corrida) {
        detener();
      }
      // La guía ocupa desde el borde izquierdo hasta el panel; su columna queda pegada a él.
      const visible = conGuia && corrida !== null && t >= 0.999;
      guia.style.width = `${Math.max(0, fx - anchoFinal / 2)}px`;
      guia.style.opacity = visible ? "1" : "0";
      guia.style.visibility = visible ? "visible" : "hidden";
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
      detener();
      guia.removeEventListener("click", alClic);
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
