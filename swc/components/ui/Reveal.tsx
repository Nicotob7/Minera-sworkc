"use client";

import { createElement, useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  variant?: "up" | "left" | "right" | "scale";
  delay?: number; // ms
  className?: string;
  threshold?: number;
};

/**
 * Anima la entrada al entrar en viewport. VISIBLE POR DEFECTO: el HTML servido
 * ya muestra el contenido (SEO, sin-JS, capturas). Al hidratar, solo lo que
 * está BAJO el viewport se oculta y se anima cuando entra (IntersectionObserver);
 * lo que ya está en pantalla nunca parpadea.
 */
export function Reveal({
  children,
  as,
  variant = "up",
  delay = 0,
  className = "",
  threshold = 0.15,
}: RevealProps) {
  const Tag: ElementType = as || "div";
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(true); // SSR: visible

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") return; // queda visible
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = el.getBoundingClientRect();
    // Ya está (total o parcialmente) en pantalla: no ocultar, no animar.
    if (rect.top < window.innerHeight * 0.92) return;

    setVisible(false);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setVisible(true);
            io.disconnect();
          }
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return createElement(
    Tag,
    {
      ref,
      className: `reveal reveal-${variant} ${visible ? "is-visible" : ""} ${className}`,
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children,
  );
}
