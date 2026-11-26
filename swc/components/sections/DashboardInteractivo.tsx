import { CTAButton } from "../ui/CTAButton";
import { PanelOperativoDemo } from "../demo/PanelOperativoDemo";
import { TelefonoDemo } from "../demo/TelefonoDemo";
import { RecorridoOT } from "../RecorridoOT";
import { RECORRIDO_OT } from "../../lib/demo";
import s from "./DashboardInteractivo.module.css";

const PASOS = [
  {
    titulo: "En terreno",
    texto: `El operador escanea el QR del ${RECORRIDO_OT.equipo} y reporta la falla desde el teléfono. Sin señal, la OT queda guardada y se envía sola al volver la cobertura.`,
  },
  {
    titulo: "En el panel",
    texto: "La OT llega al panel de mantención: aparece en eventos y en prioritarias, y los indicadores se actualizan.",
  },
  {
    titulo: "Cierre con evidencia",
    texto: "El mecánico la cierra con checklist, fotos y firma. Queda en el historial del equipo y en el cierre de turno.",
  },
];

/**
 * Centro de control: el recorrido de una OT con las pantallas de sworkc (datos de ejemplo).
 * Desde lg la escena queda fija y cada tramo de scroll avanza un paso (RecorridoOT);
 * en móvil y con movimiento reducido se ve el paso 2, estático, con los tres pasos en texto.
 */
export function DashboardInteractivo() {
  return (
    <section id="dashboard" aria-labelledby="dashboard-title" className="relative bg-[#060733] text-white">
      <div className="mx-auto max-w-7xl px-6 pt-16 sm:pt-20 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-3xl">
            <h2 id="dashboard-title" className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Tu operación, bajo control en un solo lugar
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              Sigue una orden de trabajo de principio a fin: se reporta en terreno, llega al panel de
              mantención y se cierra con evidencia.
            </p>
          </div>
          <CTAButton
            href="#contacto"
            variant="ghost-dark"
            className="w-full border-white/50 bg-white px-5 py-3 text-[#0b1020] hover:border-white hover:bg-white/90 hover:text-[#0b1020] focus-visible:ring-white sm:w-auto"
          >
            Solicitar una demostración
          </CTAButton>
        </div>
      </div>

      <RecorridoOT className={s.recorrido}>
        <div className={s.escenario}>
          <div className={s.grilla}>
            <ol className={s.pasos}>
              {PASOS.map((p, i) => (
                <li key={p.titulo} className={s.paso}>
                  <span className={s.numero}>{i + 1}</span>
                  <div>
                    <h3>{p.titulo}</h3>
                    <p>{p.texto}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className={s.escena} data-escena>
              <div className={s.monitor}>
                <div className={s.monitorBarra}>
                  <span aria-hidden />
                  Panel de mantención
                </div>
                <PanelOperativoDemo recorrido />
              </div>
              <div className={s.telefono}>
                <TelefonoDemo />
              </div>
            </div>
          </div>
        </div>
      </RecorridoOT>

      <p className="mx-auto max-w-2xl px-6 pb-16 text-center text-sm leading-relaxed text-white/70 sm:pb-20">
        Pantallas de sworkc con datos de ejemplo. En tu operación, el panel se arma con lo que
        registra tu equipo: OT, usos, checklists y cierres de turno.
      </p>
    </section>
  );
}
