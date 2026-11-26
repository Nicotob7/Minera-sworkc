"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { PORTADA } from "../lib/demo";
import { crearCursorDemo, type PasoCursor } from "./demo/motorCursor";

const { ancho, alto, pantalla } = PORTADA;
const ASPECTO = ancho / alto;
const recortar = (v: number) => Math.min(1, Math.max(0, v));
/** smoothstep: el acercamiento arranca y termina sin tirón. */
const suave = (t: number) => t * t * (3 - 2 * t);
/** Ancho de la columna de la guía (w-[21rem]) y su separación del panel (mr-10). */
const GUIA_ANCHO = 336;
const GUIA_SEPARACION = 40;

/**
 * Portada desde lg: la sección mide 2,6 pantallas y la escena queda fija mientras se baja.
 * - Primer tramo: la cámara se acerca a la tablet hasta que el panel ocupa la pantalla; el texto
 *   y el velo oscuro se retiran. La velocidad del scroll no se toca (sin scroll-jacking).
 * - Al completarse el acercamiento, un cursor usa el panel una vez (motor en demo/motorCursor.ts):
 *   se posa en «OTs NP abiertas», abre la ficha del CAEX-214, señala la dona y el primer evento.
 *   Solo cambian estados de la interfaz (data-demo / data-equipo en la capa de la foto).
 * - En pantallas anchas, panel y guía se centran juntos y cada paso de la guía es un botón que
 *   lleva al cursor a esa acción (el recorrido automático se detiene).
 * Si el visitante vuelve a subir, todo se cancela y queda listo para repetirse.
 * Bajo lg o con movimiento reducido no hace nada: la portada queda estática.
 *
 * Mueve los hijos marcados con data-dolly="escena" | "foto" | "texto" | "velo" | "guia" y [data-cursor].
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
    const guia = pieza("guia");
    const cursor = seccion?.querySelector<HTMLElement>("[data-cursor]");
    if (!seccion || !escena || !foto || !texto || !velo || !cursor || !guia) return;

    const activo = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let cuadro = 0;

    /** Marca el paso en la guía y reinicia su barra (que dura lo que dura el paso). */
    const activar = (n: number | "fin", ms = 0) => {
      delete guia.dataset.guiaActivo;
      void guia.offsetWidth;
      guia.style.setProperty("--guia-ms", `${ms}ms`);
      guia.dataset.guiaActivo = String(n);
    };
    const estado = (demo?: string) => {
      if (demo) foto.dataset.demo = demo;
      else delete foto.dataset.demo;
    };
    // Mismo orden que la guía de Hero.tsx.
    const PASOS: PasoCursor[] = [
      { objetivo: "kpi-np", fx: 0.55, fy: 0.45, ms: 850, antes: () => (activar(1, 2150), estado()), hacer: () => estado("kpi"), espera: 1300 },
      { objetivo: "tab-caex", fx: 0.45, fy: 0.6, ms: 900, clic: true, antes: () => (activar(2, 2620), estado()), hacer: () => (foto.dataset.equipo = "caex"), espera: 1500 },
      { objetivo: "dona-mant", fx: 0.35, ms: 950, antes: () => (activar(3, 2350), estado()), hacer: () => estado("dona"), espera: 1400 },
      { objetivo: "evento", fx: 0.3, ms: 850, antes: () => (activar(4, 2250), estado()), hacer: () => estado("eventos"), espera: 1400 },
    ];
    const recorrido = crearCursorDemo({
      escena,
      raiz: foto,
      cursor,
      pasos: PASOS,
      alTerminar: () => (estado(), activar("fin")),
      alDetener: () => {
        estado();
        delete foto.dataset.equipo;
        delete guia.dataset.guiaActivo;
      },
    });

    const alClic = (ev: MouseEvent) => {
      const boton = (ev.target as HTMLElement).closest<HTMLElement>("[data-guia-ir]");
      if (boton) void recorrido.irA(Number(boton.dataset.guiaIr));
    };
    guia.addEventListener("click", alClic);

    /* ── Acercamiento por scroll ── */
    const pintar = () => {
      cuadro = 0;
      if (!activo.matches) {
        recorrido.detener();
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
      const tramo = r.height - h;
      const p = tramo > 0 ? recortar(-r.top / tramo) : 0;
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
      if (t >= 0.999 && p < 0.97 && !recorrido.empezado) void recorrido.recorrer();
      else if (t < 0.9 && recorrido.empezado) recorrido.detener();
      // La guía ocupa desde el borde izquierdo hasta el panel; su columna queda pegada a él.
      const visible = conGuia && recorrido.empezado && t >= 0.999;
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
      recorrido.detener();
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
