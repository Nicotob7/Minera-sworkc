"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Producto, terreno: el punto que pasa por el centro de la pantalla (data-terreno) elige la pantalla
 * del teléfono (TelefonoDemo lee el data-paso de este contenedor). Sin JS queda en el paso 0.
 */
export function TelefonoPasos({ pasos, className, children }: { pasos: Record<string, string>; className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raiz = ref.current;
    if (!raiz) return;
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) raiz.dataset.animado = "";
    const io = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          const paso = pasos[(e.target as HTMLElement).dataset.terreno ?? ""];
          if (e.isIntersecting && paso) raiz.dataset.paso = paso;
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    raiz.querySelectorAll("[data-terreno]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pasos]);

  return (
    <div ref={ref} className={className} data-paso="0">
      {children}
    </div>
  );
}
