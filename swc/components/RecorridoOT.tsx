"use client";

import { useEffect, useRef, type ReactNode } from "react";

const PASOS = 4; // 0 escanear QR · 1 nueva OT sin señal · 2 enviada (viaja al panel) · 3 cerrada
const PASO_ESTATICO = "2"; // móvil, movimiento reducido y sin JS: la OT ya está en el panel
const ESPERA_PANTALLA = 420; // ms: el teléfono termina de cambiar de pantalla antes del vuelo
const DURACION_VUELO = 950;

const recortar = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Recorrido de una OT (inicio, desde lg y sin movimiento reducido): la sección mide varias
 * pantallas, la escena queda fija y el avance del scroll elige el paso (data-paso 0–3).
 * Teléfono (TelefonoDemo) y panel (PanelOperativoDemo recorrido) reaccionan por CSS a ese
 * atributo; al pasar de 1 a 2 la tarjeta de la OT se clona y viaja del teléfono a «OTs prioritarias».
 * En el resto de los casos queda fijo en el paso 2, sin animaciones.
 */
export function RecorridoOT({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    const escena = raiz?.querySelector<HTMLElement>("[data-escena]");
    if (!raiz || !escena) return;

    const activo = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let cuadro = 0;
    let espera = 0;
    let clon: HTMLElement | null = null;

    const cancelarVuelo = () => {
      window.clearTimeout(espera);
      clon?.remove();
      clon = null;
    };

    const volar = () => {
      const origen = raiz.querySelector<HTMLElement>("[data-vuelo-origen]");
      const destino = raiz.querySelector<HTMLElement>("[data-vuelo-destino]");
      if (!origen || !destino) return;
      const e = escena.getBoundingClientRect();
      const o = origen.getBoundingClientRect();
      const d = destino.getBoundingClientRect();
      // El clon vive fuera del teléfono: sus medidas en cqw no resolverían igual, así que se le
      // pasa la unidad del teléfono en px (la tarjeta mide 14 unidades de fuente).
      const u = parseFloat(getComputedStyle(origen).fontSize) / 14;

      const copia = origen.cloneNode(true) as HTMLElement;
      copia.removeAttribute("data-vuelo-origen");
      copia.setAttribute("aria-hidden", "true");
      copia.style.cssText = `position:absolute;left:0;top:0;width:${o.width}px;margin:0;z-index:5;pointer-events:none;transform-origin:0 0;--u:${u}px`;
      escena.appendChild(copia);
      clon = copia;

      const sx = o.left - e.left;
      const sy = o.top - e.top;
      const tx = d.left - e.left;
      const ty = d.top - e.top;
      const k = d.width / o.width;
      // Arco: sube por sobre la línea recta entre origen y destino.
      const mx = (sx + tx) / 2;
      const my = Math.min(sy, ty) - 60;
      const vuelo = copia.animate(
        [
          { transform: `translate(${sx}px, ${sy}px) scale(1)`, boxShadow: "0 6px 18px rgba(17,24,39,0.08)" },
          { transform: `translate(${mx}px, ${my}px) scale(${((1 + k) / 2) * 1.08})`, boxShadow: "0 30px 70px rgba(0,0,0,0.45)", offset: 0.5 },
          { transform: `translate(${tx}px, ${ty}px) scale(${k})`, opacity: 1, offset: 0.86 },
          { transform: `translate(${tx}px, ${ty}px) scale(${k})`, opacity: 0 },
        ],
        { duration: DURACION_VUELO, easing: "cubic-bezier(0.45, 0, 0.2, 1)", fill: "forwards" },
      );
      vuelo.finished.then(() => copia.remove(), () => copia.remove());
    };

    const fijar = (paso: string, animado: boolean) => {
      const anterior = raiz.dataset.paso;
      if (animado) raiz.dataset.animado = "";
      else delete raiz.dataset.animado;
      if (anterior === paso) return;
      raiz.dataset.paso = paso;
      cancelarVuelo();
      if (animado && anterior === "1" && paso === "2") espera = window.setTimeout(volar, ESPERA_PANTALLA);
    };

    const pintar = () => {
      cuadro = 0;
      if (!activo.matches) return fijar(PASO_ESTATICO, false);
      const r = raiz.getBoundingClientRect();
      const recorrido = r.height - window.innerHeight;
      const p = recorrido > 0 ? recortar(-r.top / recorrido) : 0;
      fijar(String(Math.min(PASOS - 1, Math.floor(p * PASOS))), true);
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
      cancelarVuelo();
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", pedir);
      activo.removeEventListener("change", pedir);
    };
  }, []);

  return (
    <div ref={ref} className={className} data-paso={PASO_ESTATICO}>
      {children}
    </div>
  );
}
