"use client";

import { useEffect } from "react";

/**
 * Manejo de anclas del sitio:
 * 1) Scroll suave SOLO para anclas de la misma página (href="#seccion"). No se
 *    usa `html { scroll-behavior: smooth }` porque interfiere con el scroll
 *    programático del router de Next al navegar entre páginas con #ancla.
 * 2) Re-anclaje: si el layout cambia de alto mientras se aterriza en un #ancla
 *    (p. ej. secciones que ajustan su alto al hidratar), se vuelve a alinear la
 *    sección destino durante una ventana corta. Se detiene apenas el usuario
 *    interactúa (rueda, tecla o toque).
 */
export function AnchorSuave() {
  useEffect(() => {
    let ventana = 0; // timestamp hasta el cual re-anclamos

    const arm = () => {
      if (location.hash) ventana = Date.now() + 3000;
    };
    const desarm = () => {
      ventana = 0;
    };
    const reanclar = () => {
      if (Date.now() > ventana) return;
      const id = location.hash.slice(1);
      const el = id ? document.getElementById(id) : null;
      el?.scrollIntoView({ behavior: "auto", block: "start" });
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (!href.includes("#")) return;
      if (href.startsWith("#")) {
        // misma página: scroll suave propio
        const el = document.getElementById(href.slice(1));
        if (!el) return;
        e.preventDefault();
        e.stopPropagation();
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        history.pushState(null, "", href);
      } else {
        // Navegación a otra página con #ancla: armar el re-anclaje de inmediato.
        // No se lee location.hash aquí (la ruta aún no cambió); reanclar() lo lee
        // al momento de cada ajuste, cuando la página nueva ya aterrizó.
        ventana = Date.now() + 4000;
      }
    };

    arm(); // carga inicial con #ancla
    const ro = new ResizeObserver(reanclar);
    ro.observe(document.body);
    document.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", arm);
    window.addEventListener("wheel", desarm, { passive: true });
    window.addEventListener("touchstart", desarm, { passive: true });
    window.addEventListener("keydown", desarm);
    return () => {
      ro.disconnect();
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", arm);
      window.removeEventListener("wheel", desarm);
      window.removeEventListener("touchstart", desarm);
      window.removeEventListener("keydown", desarm);
    };
  }, []);
  return null;
}
