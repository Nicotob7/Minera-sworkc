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

/** Anima la entrada al entrar en viewport (IntersectionObserver). Coherente en todo el sitio. */
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
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
