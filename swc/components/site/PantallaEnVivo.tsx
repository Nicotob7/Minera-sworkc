"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CursorDemo } from "../demo/CursorDemo";
import { crearCursorDemo, type PasoCursor } from "../demo/motorCursor";

/**
 * Una pantalla de ejemplo de Producto que "se usa" sola cuando se ve:
 * - mientras no se ve, sus animaciones de encendido quedan en pausa (data-esperando, globals.css);
 * - en escritorio y sin movimiento reducido, tras encenderse un cursor la recorre una vez
 *   (motor en demo/motorCursor.ts). Si sale de la vista se cancela y se repite al volver.
 * Recorridos: «panel» (OTs NP → ficha del CAEX-214 → dona → eventos) y «ede» (30 días →
 * detención → 7 días → 90 días → historial). En el EDE, si el visitante elige un período, el
 * cursor se detiene y no vuelve: desde ahí manda él.
 */
export function PantallaEnVivo({
  recorrido,
  retraso,
  className,
  children,
}: {
  recorrido: "panel" | "ede";
  /** Espera tras verse, para que termine el encendido (ms). */
  retraso: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const raiz = ref.current;
    const cursor = raiz?.querySelector<HTMLElement>("[data-cursor]");
    if (!raiz || !cursor) return;

    const estado = (demo?: string) => {
      if (demo) raiz.dataset.demo = demo;
      else delete raiz.dataset.demo;
    };
    const radios = [...(raiz.closest("[data-ede]")?.querySelectorAll<HTMLInputElement>('input[name="ede-periodo"]') ?? [])];
    const periodo = (v: string) => {
      const r = radios.find((x) => x.value === v);
      if (r) r.checked = true;
    };

    const PASOS: PasoCursor[] =
      recorrido === "panel"
        ? [
            { objetivo: "kpi-np", fx: 0.55, fy: 0.45, ms: 850, antes: () => estado(), hacer: () => estado("kpi"), espera: 1300 },
            { objetivo: "tab-caex", fx: 0.45, fy: 0.6, ms: 900, clic: true, antes: () => estado(), hacer: () => (raiz.dataset.equipo = "caex"), espera: 1500 },
            { objetivo: "dona-mant", fx: 0.35, ms: 950, antes: () => estado(), hacer: () => estado("dona"), espera: 1400 },
            { objetivo: "evento", fx: 0.3, ms: 850, antes: () => estado(), hacer: () => estado("eventos"), espera: 1400 },
          ]
        : [
            { objetivo: "ede-tab-30", ms: 900, clic: true, hacer: () => periodo("30"), espera: 1700 },
            { objetivo: "ede-detencion", fx: 0.45, ms: 850, hacer: () => estado("detencion"), espera: 1500 },
            { objetivo: "ede-tab-7", ms: 900, clic: true, antes: () => estado(), hacer: () => periodo("7"), espera: 1700 },
            { objetivo: "ede-tab-90", ms: 700, clic: true, hacer: () => periodo("90"), espera: 1300 },
            { objetivo: "ede-historial", fx: 0.4, ms: 950, hacer: () => estado("historial"), espera: 1500 },
          ];

    const motor = crearCursorDemo({
      escena: raiz,
      raiz,
      cursor,
      pasos: PASOS,
      alTerminar: () => estado(),
      alDetener: () => {
        estado();
        delete raiz.dataset.equipo;
      },
    });

    const conCursor = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let espera = 0;
    let mandaElVisitante = false;
    const alElegir = (ev: Event) => {
      if (!ev.isTrusted) return;
      mandaElVisitante = true;
      window.clearTimeout(espera);
      motor.detener();
    };
    radios.forEach((r) => r.addEventListener("change", alElegir));

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true);
          if (conCursor.matches && !mandaElVisitante && !motor.empezado) {
            espera = window.setTimeout(() => void motor.recorrer(), retraso);
          }
        } else {
          window.clearTimeout(espera);
          motor.detener();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(raiz);
    return () => {
      io.disconnect();
      window.clearTimeout(espera);
      motor.detener();
      radios.forEach((r) => r.removeEventListener("change", alElegir));
    };
  }, [recorrido, retraso]);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`} data-esperando={visto ? undefined : ""}>
      {children}
      <CursorDemo />
    </div>
  );
}
