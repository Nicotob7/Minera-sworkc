import { COLOR_ESTADO, EDE, ETIQUETA_ESTADO, type Estado } from "../../lib/demo";
import { ArrowLeft, Plus, Truck } from "../ui/icons";
import s from "./EdeDemo.module.css";

/**
 * Expediente Digital del Equipo (EDE) de sworkc, reconstruido en HTML con los datos de ejemplo
 * de lib/demo.ts. Diseño a 1120 × 600; todo se mide en --u (1/1120 del ancho del contenedor).
 *
 * El período lo eligen los botones reales de <EdePeriodo> y las definiciones de la página
 * marcan su tarjeta al pasar el mouse: ambas cosas por CSS (:has) desde un ancestro con
 * `data-ede`, sin JavaScript. Al cambiar de período las cifras se deslizan a su valor y las
 * detenciones fuera del período se pliegan.
 */

export const PERIODOS = ["7", "30", "90"] as const;
export type Periodo = (typeof PERIODOS)[number];

const CLASE_KPI = [s.kpiDisp, s.kpiMttr, s.kpiMtbf, s.kpiMtbs];
const CHIP: Record<Estado, { fondo: string; texto: string }> = {
  operativo: { fondo: "#dcfce7", texto: "#15803d" },
  mantencion: { fondo: "#fef3c7", texto: "#b45309" },
  fuera: { fondo: "#fee2e2", texto: "#b91c1c" },
};
const NAV: [string, string[]][] = [
  ["General", ["Resumen"]],
  ["Operación", ["Inspección", "Uso", "Intervenciones", "EDE"]],
  ["Control", ["Acciones"]],
];

/** Historial con la fecha marcada solo en el primer cambio de cada día. */
const HISTORIAL = EDE.historial.map((h, i) => ({ ...h, nuevaFecha: i === 0 || EDE.historial[i - 1].fecha !== h.fecha }));

/** Un valor por período; el CSS muestra el del período elegido. */
function PorPeriodo({ v7, v30, v90 }: { v7: string; v30: string; v90: string }) {
  return (
    <>
      <span className={s.p7}>{v7}</span>
      <span className={s.p30}>{v30}</span>
      <span className={s.p90}>{v90}</span>
    </>
  );
}

/** Selector de período (radios nativos: teclado y lector de pantalla sin JS). */
export function EdePeriodo() {
  return (
    <fieldset className={s.periodo}>
      <legend>Período del EDE</legend>
      {PERIODOS.map((p) => (
        <label key={p}>
          <input type="radio" name="ede-periodo" value={p} defaultChecked={p === "90"} />
          {p} días
        </label>
      ))}
    </fieldset>
  );
}

export function EdeDemo() {
  return (
    <div
      className={s.marco}
      role="img"
      aria-label={`Expediente digital del equipo ${EDE.equipo} con datos de ejemplo: ${EDE.kpis.map((k) => `${k.sigla} ${k.valor}`).join(", ")} en 90 días; últimas detenciones con motivo y duración, repuestos e historial de cambios.`}
    >
      <div className={s.pantalla} aria-hidden>
        <div className={s.barra}>
          <span className={s.volver}>
            <ArrowLeft stroke={1.8} />
          </span>
          <span className={s.equipoIcono}>
            <Truck stroke={1.7} />
          </span>
          <div className={s.equipo}>
            <b>{EDE.equipo}</b>
            <span>{EDE.descripcion}</span>
          </div>
          <span className={s.estado}>
            <i style={{ background: COLOR_ESTADO[EDE.estado] }} />
            {ETIQUETA_ESTADO[EDE.estado]}
          </span>
          <span className={s.nuevaOt}>
            <Plus stroke={2.2} /> Nueva OT
          </span>
        </div>

        <div className={s.cuerpo}>
          <nav className={s.menu}>
            {NAV.map(([grupo, items]) => (
              <div key={grupo}>
                <span className={s.grupo}>{grupo}</span>
                {items.map((item) => (
                  <span key={item} className={item === "EDE" ? `${s.item} ${s.itemActivo}` : s.item}>
                    {item}
                    {item === "Intervenciones" && <em>{EDE.intervenciones}</em>}
                  </span>
                ))}
              </div>
            ))}
            <span className={s.ejemplo}>Datos de ejemplo</span>
          </nav>

          <div className={s.principal}>
            <div className={s.cabecera}>
              <div>
                <b>EDE, expediente digital del equipo</b>
                <span>
                  Indicadores de los últimos <PorPeriodo v7="7" v30="30" v90="90" /> días
                </span>
              </div>
              <div className={s.tabs}>
                <span className={s.tab7}>7 d</span>
                <span className={s.tab30}>30 d</span>
                <span className={s.tab90}>90 d</span>
              </div>
            </div>

            <div className={s.kpis}>
              {EDE.kpis.map((k, i) => (
                <div key={k.sigla} className={`${s.kpi} ${CLASE_KPI[i]}`}>
                  <span className={s.kpiSigla}>{k.sigla}</span>
                  <b className={s.kpiValor}>
                    <PorPeriodo v7={k.v7} v30={k.v30} v90={k.valor} />
                  </b>
                  <span className={s.kpiAyuda}>{k.ayuda}</span>
                </div>
              ))}
            </div>

            <div className={s.panel}>
              <span className={s.panelTitulo}>Últimas detenciones</span>
              {EDE.detenciones.map((d) => (
                <div
                  key={d.fecha}
                  className={`${s.detencion} ${d.dias <= 7 ? s.en7 : ""} ${d.dias <= 30 ? s.en30 : ""}`}
                >
                  <div>
                    <div className={s.fila}>
                      <span className={s.fecha}>{d.fecha}</span>
                      <span className={s.chip} style={{ background: CHIP[d.estado].fondo, color: CHIP[d.estado].texto }}>
                        {ETIQUETA_ESTADO[d.estado]}
                      </span>
                      <b>{d.horas}</b>
                      <span>{d.causa}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className={s.vacio}>
                <div>
                  <span>Sin detenciones en los últimos 7 días.</span>
                </div>
              </div>
            </div>

            <div className={s.panel}>
              <span className={s.panelTitulo}>Repuestos solicitados</span>
              <div className={`${s.repuesto} ${s.repuestoCab}`}>
                <span>OT</span>
                <span>Repuesto</span>
                <span>Plan.</span>
                <span>Usado</span>
              </div>
              {EDE.repuestos.map((r) => (
                <div key={r.ot} className={s.repuesto}>
                  <b>{r.ot}</b>
                  <span>{r.repuesto}</span>
                  <span>{r.plan}</span>
                  <span>{r.usado}</span>
                </div>
              ))}
            </div>
          </div>

          <aside className={s.historial}>
            <span className={s.panelTitulo}>Historial de cambios</span>
            {HISTORIAL.map((h) => {
              return (
                <div key={`${h.fecha}-${h.hora}`}>
                  {h.nuevaFecha && <span className={s.historialFecha}>{h.fecha}</span>}
                  <div className={s.cambio}>
                    <span className={s.hora}>{h.hora}</span>
                    <div>
                      <b>{h.rol}</b>
                      <span>{h.accion}</span>
                      {h.de && (
                        <span className={s.deA}>
                          {h.de} → <b>{h.a}</b>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </aside>
        </div>
      </div>
    </div>
  );
}
