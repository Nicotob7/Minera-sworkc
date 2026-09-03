"use client";

import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

/** Detecta la preferencia de reducir movimiento (accesibilidad). */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** setInterval declarativo con limpieza. delay=null lo desactiva. */
export function useInterval(callback: () => void, delay: number | null) {
  const saved = useRef(callback);
  useEffect(() => {
    saved.current = callback;
  }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => saved.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

/**
 * Devuelve true cuando el elemento referenciado está (al menos parcialmente)
 * dentro del viewport, usando IntersectionObserver con limpieza.
 * Fallback a true si no hay IntersectionObserver disponible.
 */
export function useInViewport(
  ref: RefObject<Element | null>,
  options?: IntersectionObserverInit,
) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      const id = setTimeout(() => setInView(true), 0);
      return () => clearTimeout(id);
    }
    const observer = new IntersectionObserver((entries) => {
      setInView(entries[0]?.isIntersecting ?? false);
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, options]);
  return inView;
}
