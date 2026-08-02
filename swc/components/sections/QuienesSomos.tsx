import { QuienesSomosChart } from "../charts/QuienesSomosChart";

export function QuienesSomos() {
  return (
    <section
      id="nosotros"
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--color-band-gray) 0%, var(--color-band-gray-2) 100%)",
      }}
    >
      <div className="mx-auto grid min-h-[340px] w-full max-w-6xl items-center gap-7 px-6 py-10 sm:py-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
        <div className="max-w-xl text-left text-white">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.28em] text-white">
            Quiénes somos
          </p>

          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight text-white sm:text-[2.35rem]">
            Informática que sostiene la operación minera
          </h2>

          <p className="mt-4 text-base leading-relaxed text-white sm:text-lg">
            Sworkc Technologies crea herramientas digitales para que las operaciones mineras
            registren turnos, mantenciones, fallas y equipos con información clara, trazable y
            lista para decidir.
          </p>
        </div>

        <div className="w-full">
          <QuienesSomosChart />
        </div>
      </div>
    </section>
  );
}
