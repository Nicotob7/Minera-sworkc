"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Deja en pausa las animaciones de su interior (data-esperando, ver globals.css) hasta que el bloque
 * se ve en un 30 %: así una pantalla que se "enciende" lo hace cuando el visitante llega a ella y no
 * al cargar la página. Sin JS no se pausa nada (la regla está bajo @media (scripting: enabled)).
 * Ojo: no poner dentro animaciones atadas al scroll (.prof-entrar…): también quedarían en pausa.
 */
export function AlVer({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisto(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} data-esperando={visto ? undefined : ""}>
      {children}
    </div>
  );
}
