import { Fragment, type CSSProperties } from "react";

/**
 * Parte un texto en palabras con su orden (--i) para los revelados atados al scroll de
 * revelado.module.css; los espacios quedan como texto, así se lee y se copia normal.
 */
export function Palabras({ texto, desde = 0, className }: { texto: string; desde?: number; className: string }) {
  return texto.split(" ").map((p, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className={className} style={{ "--i": desde + i } as CSSProperties}>
        {p}
      </span>
    </Fragment>
  ));
}
