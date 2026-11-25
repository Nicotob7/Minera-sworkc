/**
 * Franja informativa "¿Sabías que...?" — minimal, blanca y tipográfica.
 * Eyebrow simple en negro + titular en tamaño contenido (acorde al resto de la página).
 */
export function FranjaAzul() {
  return (
    <section aria-labelledby="franja-azul-title" className="relative overflow-hidden bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <div className="border-y border-black/10 py-10 sm:py-12">
          {/* Eyebrow simple, en negro */}
          <p className="text-center text-xs font-semibold text-[#0b1020]/75">
            ¿Sabías que...?
          </p>

          {/* Titular en tamaño contenido */}
          <h2
            id="franja-azul-title"
            className="mx-auto mt-5 max-w-4xl text-center font-display text-lg font-semibold leading-snug tracking-tight text-[#0b1020] sm:text-xl lg:text-2xl"
          >
            Centralizar la información de los{" "}
            <span className="relative inline-block whitespace-nowrap">
              cierres de turno
              <span aria-hidden className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-[#0b1020]" />
            </span>{" "}
            y mantener la trazabilidad reduce los errores humanos que terminan deteniendo la operación.
          </h2>
        </div>
      </div>
    </section>
  );
}
