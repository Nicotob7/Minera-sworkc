"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "./hooks";

type TypewriterProps = {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  /** Reserva el espacio de la frase más larga para que el layout NO cambie de tamaño al escribir. */
  reserve?: boolean;
};

/**
 * Efecto de escritura que rota entre frases.
 * Con prefers-reduced-motion muestra la primera frase estática (sin caret).
 * Con `reserve`, el contenedor siempre mide lo de la frase más larga (no crece/encoge).
 */
export function Typewriter({
  words,
  className,
  typeSpeed = 60,
  deleteSpeed = 32,
  pause = 1600,
  reserve = false,
}: TypewriterProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduced) return;
    const word = words[index % words.length];
    let t: ReturnType<typeof setTimeout>;

    if (!deleting && sub < word.length) {
      t = setTimeout(() => setSub(sub + 1), typeSpeed);
    } else if (!deleting && sub === word.length) {
      t = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && sub > 0) {
      t = setTimeout(() => setSub(sub - 1), deleteSpeed);
    } else {
      t = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }, 0);
    }
    return () => clearTimeout(t);
  }, [sub, deleting, index, words, reduced, typeSpeed, deleteSpeed, pause]);

  const word = words[index % words.length];
  const text = reduced ? words[0] : word.slice(0, sub);
  const caret = !reduced && (
    <span className="tw-caret text-cyan-300" aria-hidden="true">
      |
    </span>
  );

  if (reserve) {
    const longest = words.reduce((a, b) => (b.length > a.length ? b : a), "");
    return (
      <span className={`inline-grid text-left align-top ${className ?? ""}`}>
        {/* dimensionador invisible: fija el ancho/alto al de la frase más larga */}
        <span aria-hidden className="invisible col-start-1 row-start-1">
          {longest}&nbsp;
        </span>
        <span className="col-start-1 row-start-1" aria-label={words[0]}>
          {text}
          {caret}
        </span>
      </span>
    );
  }

  return (
    <span className={className} aria-label={words[0]}>
      {text}
      {caret}
    </span>
  );
}
