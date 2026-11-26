/**
 * Motor del cursor que "usa" una pantalla de ejemplo (portada, panel y EDE de Producto).
 * Mueve un elemento cursor (ver CursorDemo.tsx) sobre objetivos [data-objetivo] dentro de
 * `raiz`, hace clic y aplica estados de la interfaz (data-demo, data-equipo, radios…), nunca
 * cifras. Sin React: lo usan componentes de cliente desde un efecto.
 */

export type PasoCursor = {
  /** Valor de data-objetivo del elemento a señalar, dentro de `raiz`. */
  objetivo: string;
  /** Punto dentro del objetivo (0–1). */
  fx?: number;
  fy?: number;
  /** Duración del movimiento (ms). */
  ms?: number;
  clic?: boolean;
  /** Al empezar el paso (p. ej. marcar la guía). */
  antes?: () => void;
  /** Estado que se aplica al llegar. */
  hacer?: () => void;
  /** Cuánto se queda después de llegar (ms). */
  espera: number;
};

type Corrida = { cancelado: boolean };

const CURVA = "cubic-bezier(0.65, 0, 0.35, 1)";
const esperar = (ms: number) => new Promise((r) => window.setTimeout(r, ms));

export function crearCursorDemo({
  escena,
  raiz,
  cursor,
  pasos,
  alDetener,
  alTerminar,
}: {
  /** Contenedor posicionado donde vive el cursor (sus coordenadas). */
  escena: HTMLElement;
  /** Donde se buscan los objetivos. */
  raiz: HTMLElement;
  cursor: HTMLElement;
  pasos: PasoCursor[];
  /** Deshacer estados al cancelar. */
  alDetener?: () => void;
  /** Al completar el recorrido entero. */
  alTerminar?: () => void;
}) {
  let corrida: Corrida | null = null;
  let visible = false;
  let pos: [number, number] = [0, 0];

  const ubicar = ([x, y]: [number, number]) => `translate(${x}px, ${y}px)`;
  // Punta de la flecha: el SVG la tiene en (4, 2) de 24, dibujado a 22 px.
  const punto = (p: PasoCursor): [number, number] | null => {
    const el = raiz.querySelector(`[data-objetivo="${p.objetivo}"]`);
    if (!el) return null;
    const e = escena.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    return [r.left - e.left + r.width * (p.fx ?? 0.5) - 3.7, r.top - e.top + r.height * (p.fy ?? 0.5) - 1.8];
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
    await cursor
      .querySelector("svg")
      ?.animate([{ transform: "scale(1)" }, { transform: "scale(0.82)" }, { transform: "scale(1)" }], { duration: 220, easing: "ease-out" })
      .finished.catch(() => {});
  };
  const mostrar = async () => {
    if (visible) return;
    visible = true;
    const e = escena.getBoundingClientRect();
    pos = [e.width * 0.74, e.height * 0.9];
    cursor.style.transform = ubicar(pos);
    await cursor.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: "forwards" }).finished.catch(() => {});
  };
  const ocultar = async () => {
    visible = false;
    await cursor.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 400, fill: "forwards" }).finished.catch(() => {});
  };
  const correrPaso = async (c: Corrida, p: PasoCursor) => {
    if (c.cancelado) return;
    p.antes?.();
    await mover(c, punto(p), p.ms ?? 900);
    if (p.clic) await clic(c);
    if (c.cancelado) return;
    p.hacer?.();
    await esperar(p.espera);
  };

  return {
    /** ¿Empezó (o terminó) un recorrido desde el último detener()? */
    get empezado() {
      return corrida !== null;
    },
    /** Recorre todos los pasos una vez. */
    async recorrer() {
      if (corrida) corrida.cancelado = true;
      const c: Corrida = { cancelado: false };
      corrida = c;
      await mostrar();
      for (const p of pasos) {
        if (c.cancelado) return;
        await correrPaso(c, p);
      }
      if (c.cancelado) return;
      alTerminar?.();
      await ocultar();
    },
    /** Corta lo que esté corriendo y muestra solo el paso n (1…). */
    async irA(n: number) {
      if (corrida) corrida.cancelado = true;
      for (const a of cursor.getAnimations({ subtree: true })) if (a.playState === "running") a.finish();
      const c: Corrida = { cancelado: false };
      corrida = c;
      await mostrar();
      const p = pasos[n - 1];
      if (p) await correrPaso(c, p);
    },
    /** Cancela, esconde el cursor y deshace los estados. */
    detener() {
      if (corrida) corrida.cancelado = true;
      corrida = null;
      visible = false;
      for (const a of cursor.getAnimations({ subtree: true })) a.cancel();
      cursor.style.opacity = "0";
      alDetener?.();
    },
  };
}
