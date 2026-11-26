import type { CSSProperties } from "react";
import {
  COLOR_DETENIDO,
  COLOR_ESTADO,
  EQUIPO_CAEX,
  EQUIPO_DESTACADO,
  EQUIPOS_VISTA_RAPIDA,
  EVENTOS,
  EVENTOS_MAS,
  FLOTA,
  FLOTA_POR_GRUPO,
  OTS,
  OTS_PRIORITARIAS,
  RECORRIDO_OT,
  ETIQUETA_ESTADO,
  type Estado,
  type TipoEvento,
} from "../../lib/demo";
import {
  Activity,
  AlertTriangle,
  Ban,
  Bell,
  Calendar,
  ChartDonut,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  DeviceDesktop,
  Download,
  Gauge,
  History,
  LayoutDashboard,
  Logout,
  Moon,
  Package,
  Pencil,
  Plus,
  Refresh,
  Scan,
  Settings,
  ShieldCheck,
  SidebarCollapse,
  Sun,
  Tool,
  Truck,
  type IconType,
} from "../ui/icons";
import s from "./PanelOperativoDemo.module.css";

/** Retraso escalonado de la animación de encendido (ver .encender en el CSS). */
const d = (i: number) => ({ "--d": i }) as CSSProperties;
const pct = (v: number) => Math.round((v / FLOTA.total) * 100);
const AZUL_OT = "#3b82f6";
const GRIS = "#4b5563";

const MENU: { label: string; icon: IconType; activo?: boolean; sub?: boolean }[] = [
  { label: "Dashboard operativo", icon: LayoutDashboard, activo: true },
  { label: "Cierre de turno", icon: ClipboardCheck },
  { label: "Confiabilidad", icon: Activity },
  { label: "Escanear QR", icon: Scan },
  { label: "Gestión de flota", icon: Truck },
  { label: "Mantenimiento", icon: Tool, sub: true },
  { label: "Inventario", icon: Package },
  { label: "Configuración", icon: Settings },
];

/** Texto con cifras que cuentan: [valor normal, valor con la OT del recorrido abierta]. */
type Parte = string | [number, number];

const KPIS: {
  label: string;
  sub: string;
  icon: IconType;
  valor: number;
  detalle: string | Parte[];
  color: string;
  frac: number;
  /** Porcentaje de la esquina; los *2 son los valores con la OT del recorrido abierta (data-paso 2). */
  pctN?: number;
  valor2?: number;
  pctN2?: number;
  alerta?: boolean;
}[] = [
  { label: "Total activos", sub: "Inventario", icon: Truck, valor: FLOTA.total, detalle: "equipos", color: GRIS, frac: 1, pctN: 100 },
  { label: "Disponibles", sub: "Operación", icon: ShieldCheck, valor: FLOTA.operativo, detalle: `de ${FLOTA.total} equipos`, color: COLOR_ESTADO.operativo, frac: FLOTA.operativo / FLOTA.total, pctN: pct(FLOTA.operativo) },
  { label: "En mantención", sub: "Seguimiento", icon: Tool, valor: FLOTA.mantencion, detalle: "por OT abierta", color: COLOR_ESTADO.mantencion, frac: FLOTA.mantencion / FLOTA.total, pctN: pct(FLOTA.mantencion) },
  { label: "Detenidos", sub: "Parada", icon: Ban, valor: FLOTA.detenido, detalle: `de ${FLOTA.total}`, color: COLOR_DETENIDO, frac: FLOTA.detenido / FLOTA.total, pctN: pct(FLOTA.detenido) },
  { label: "Fuera de servicio", sub: "Crítico", icon: AlertTriangle, valor: FLOTA.fuera, detalle: `de ${FLOTA.total}`, color: COLOR_ESTADO.fuera, frac: FLOTA.fuera / FLOTA.total, pctN: pct(FLOTA.fuera) },
  { label: "OTs activas", sub: "Trabajo", icon: ClipboardCheck, valor: OTS.abiertas, detalle: [[OTS.noPlanificadas, OTS.noPlanificadas + 1], ` NP · ${OTS.correctivas} CC · ${OTS.planificadas} PL`], color: AZUL_OT, frac: 1, valor2: OTS.abiertas + 1 },
  { label: "OTs NP abiertas", sub: "No planif.", icon: Gauge, valor: OTS.noPlanificadas, detalle: ["de ", [OTS.abiertas, OTS.abiertas + 1], " activas"], color: COLOR_ESTADO.fuera, frac: OTS.noPlanificadas / OTS.abiertas, pctN: Math.round((OTS.noPlanificadas / OTS.abiertas) * 100), valor2: OTS.noPlanificadas + 1, pctN2: Math.round(((OTS.noPlanificadas + 1) / (OTS.abiertas + 1)) * 100), alerta: true },
];

/** Colores de las etiquetas, los mismos tonos del producto. */
const TONO: Record<TipoEvento | "PL" | "NP" | "CC", { fondo: string; texto: string; punto: string }> = {
  PL: { fondo: "#dbeafe", texto: "#1d4ed8", punto: AZUL_OT },
  NP: { fondo: "#fee2e2", texto: "#b91c1c", punto: "#ea580c" },
  CC: { fondo: "#fef3c7", texto: "#b45309", punto: AZUL_OT },
  "Op.": { fondo: "#dcfce7", texto: "#15803d", punto: COLOR_ESTADO.operativo },
  "Mant.": { fondo: "#fef3c7", texto: "#b45309", punto: COLOR_ESTADO.mantencion },
  "F/S": { fondo: "#fee2e2", texto: "#b91c1c", punto: COLOR_ESTADO.fuera },
};

const MAX_GRUPO = Math.max(...FLOTA_POR_GRUPO.map((g) => g.operativo + g.mantencion + g.fuera));

const CUENTAS = [
  { n: FLOTA.total, label: "Tot.", color: "#9ca3af" },
  { n: FLOTA.operativo, label: "Op.", color: COLOR_ESTADO.operativo },
  { n: FLOTA.detenido, label: "Det.", color: COLOR_DETENIDO },
  { n: FLOTA.mantencion, label: "Mant.", color: COLOR_ESTADO.mantencion },
  { n: FLOTA.fuera, label: "F/S", color: COLOR_ESTADO.fuera },
  { n: FLOTA.mantencionVencida, label: "Venc.", color: COLOR_ESTADO.mantencion },
  { n: OTS.abiertas, n2: OTS.abiertas + 1, label: "OT", color: "#6366f1" },
];

const DISTRIBUCION = [
  { label: "Operativo", n: FLOTA.operativo, color: COLOR_ESTADO.operativo },
  { label: "Detenido", n: FLOTA.detenido, color: COLOR_DETENIDO },
  { label: "En mantención", n: FLOTA.mantencion, color: COLOR_ESTADO.mantencion },
  { label: "Fuera de servicio", n: FLOTA.fuera, color: COLOR_ESTADO.fuera },
];

// Segmentos de la dona (pathLength 100) precalculados: inicio acumulado de cada estado.
const SEGMENTOS: { color: string; largo: number; inicio: number }[] = [];
for (let i = 0, ini = 0; i < DISTRIBUCION.length; i++) {
  const largo = (DISTRIBUCION[i].n / FLOTA.total) * 100;
  if (largo > 0) SEGMENTOS.push({ color: DISTRIBUCION[i].color, largo, inicio: ini });
  ini += largo;
}

/** Número que cuenta hacia su valor del paso 2 cuando el panel está en modo recorrido. */
function Contador({ n0, n2, recorrido, className }: { n0: number; n2?: number; recorrido: boolean; className?: string }) {
  return (
    <span
      className={`${s.contador} ${className ?? ""}`}
      style={{ "--n0": n0, "--n2": recorrido ? n2 : undefined } as CSSProperties}
    />
  );
}

function Texto({ partes, recorrido }: { partes: string | Parte[]; recorrido: boolean }) {
  if (typeof partes === "string") return partes;
  return partes.map((p, i) =>
    typeof p === "string" ? <span key={i}>{p}</span> : <Contador key={i} n0={p[0]} n2={p[1]} recorrido={recorrido} />,
  );
}

const CHIP_FICHA: Record<Estado, { fondo: string; texto: string }> = {
  operativo: { fondo: "#dcfce7", texto: "#15803d" },
  mantencion: { fondo: "#fef3c7", texto: "#b45309" },
  fuera: { fondo: "#fee2e2", texto: "#b91c1c" },
};
const TONO_PRIORIDAD: Record<string, { fondo: string; texto: string }> = {
  Alta: { fondo: "#fee2e2", texto: "#b91c1c" },
  Media: { fondo: "#fef3c7", texto: "#b45309" },
};

/** Ficha del equipo elegido en «Estado de la flota». */
function FichaEquipo({ e, foto, className }: { e: typeof EQUIPO_DESTACADO; foto: string; className: string }) {
  const pr = TONO_PRIORIDAD[e.prioridadMax] ?? TONO_PRIORIDAD.Media;
  return (
    <div className={className}>
      <div className={s.fichaFoto}>
        {/* Recortes de /img/faena/pala-electrica.jpg (Sansumaria, CC BY-SA 3.0; crédito en lib/creditos.ts). */}
        {/* eslint-disable-next-line @next/next/no-img-element -- imagen chica dentro de una pantalla dibujada */}
        <img src={foto} alt="" width={720} height={300} loading="lazy" decoding="async" />
        <span className={s.fichaEstado} style={{ background: CHIP_FICHA[e.estado].fondo, color: CHIP_FICHA[e.estado].texto }}>
          {ETIQUETA_ESTADO[e.estado]}
        </span>
      </div>
      <div className={s.fichaNombre}>
        <b>{e.codigo}</b>
        <span>{e.modelo}</span>
        <small>{e.flota}</small>
      </div>
      <div className={s.datos}>
        <div className={s.dato}><span>Horómetro</span><b>{e.horometro}</b></div>
        <div className={s.dato}><span>OTs abiertas</span><b>{e.otsAbiertas}</b></div>
        <div className={s.dato}><span>Prioridad máx.</span><b style={{ color: pr.texto }}>{e.prioridadMax}</b></div>
        <div className={s.dato}><span>Mantención</span><b style={{ color: "#b45309" }}>{e.mantencion}</b></div>
      </div>
      <span className={s.nota}>{e.aviso}</span>
      <span className={s.nota}>
        OT prioritaria{" "}
        <span className={s.otPrioritaria} style={{ background: pr.fondo, color: pr.texto }}>
          {e.prioridadMax} · {e.ot}
        </span>
      </span>
    </div>
  );
}

function Cabecera({ icon: I, titulo, children }: { icon: IconType; titulo: string; children?: React.ReactNode }) {
  return (
    <div className={s.panelCab}>
      <I stroke={1.7} />
      {titulo}
      {children}
    </div>
  );
}

/**
 * Pantalla «Visión Operativa» de sworkc, reconstruida en HTML con los datos de ejemplo de lib/demo.ts.
 * Se diseña a 1280 × 838 y escala con el ancho del contenedor (unidades cqw), así sirve igual
 * dentro de la tablet de la portada que a pantalla completa. `encender` reproduce una sola vez
 * el arranque del panel; las cifras no cambian después.
 * `recorrido` agrega la OT de RECORRIDO_OT (fila en Eventos y en OTs prioritarias) y la hace
 * aparecer y cerrarse según el data-paso de un ancestro (2 abierta, 3 cerrada); los contadores
 * cuentan hacia su nuevo valor (ver .contador en el CSS).
 */
export function PanelOperativoDemo({ encender = false, recorrido = false }: { encender?: boolean; recorrido?: boolean }) {
  return (
    <div
      className={s.marco}
      role="img"
      aria-label={`Panel operativo de sworkc con datos de ejemplo: ${FLOTA.total} equipos, ${FLOTA.operativo} disponibles, ${FLOTA.mantencion} en mantención y ${FLOTA.fuera} fuera de servicio; ${OTS.abiertas} OTs activas, ${OTS.noPlanificadas} no planificadas.`}
    >
      <div className={`${s.pantalla} ${encender ? s.encender : ""}`} aria-hidden>
        <aside className={s.lateral}>
          <div className={s.marca}>
            Sistema minería
            <SidebarCollapse stroke={1.6} />
          </div>
          <div className={s.menu}>
            {MENU.map((m, i) => (
              <div key={m.label} className={m.activo ? s.itemActivo : s.item} style={d(i)}>
                <m.icon stroke={1.6} />
                <span>{m.label}</span>
                {m.sub && <ChevronRight stroke={1.8} className={s.flecha} />}
              </div>
            ))}
          </div>
          <div className={s.sesion}>
            <span className={s.sesionEtiqueta}>Sesión activa</span>
            <b>Jefe de mantención</b>
            <span>Turno A · Faena norte</span>
            <div className={s.salir}>
              <Logout stroke={1.6} />
              Cerrar sesión
            </div>
          </div>
        </aside>

        <div className={s.principal}>
          <div className={s.barra}>
            <span className={s.barraTitulo}>Trazabilidad operativa</span>
            <div className={s.barraAcciones}>
              <div className={s.tema}>
                <span><Sun stroke={1.8} /></span>
                <span><DeviceDesktop stroke={1.8} /></span>
                <span><Moon stroke={1.8} /></span>
              </div>
              <span className={s.circulo}><Bell stroke={1.8} /></span>
              <span className={s.circulo}>J</span>
            </div>
          </div>

          <div className={s.contenido}>
            <div className={s.cabecera}>
              <div>
                <div className={s.titulo}>
                  <LayoutDashboard stroke={1.7} />
                  Visión Operativa
                </div>
                <p className={s.subtitulo}>
                  Estado actual de la flota · OTs y eventos de <b>Últimos 30 días</b>
                </p>
              </div>
              <div className={s.filtrosCol}>
                <div className={s.filtros}>
                  <span className={s.chip}>Datos de ejemplo</span>
                  <span className={s.control}>Todas las faenas <ChevronDown stroke={1.8} /></span>
                  <span className={s.control}><Calendar stroke={1.8} /> Últimos 30 días <ChevronDown stroke={1.8} /></span>
                  <span className={s.control}><Refresh stroke={1.8} /></span>
                  <span className={`${s.control} ${s.boton}`}><Plus stroke={2.2} /> Nueva OT</span>
                </div>
                <div className={s.filtros}>
                  <span className={s.accion}><Pencil stroke={1.8} /> Editar dashboard</span>
                  <span className={`${s.accion} ${s.accionTenue}`}><Download stroke={1.8} /> Reporte</span>
                </div>
              </div>
            </div>

            <div className={s.kpis}>
              {KPIS.map((k, i) => (
                <div key={k.label} className={k.alerta ? s.kpiAlerta : s.kpi} style={d(i)} data-objetivo={k.alerta ? "kpi-np" : undefined}>
                  <div className={s.kpiCab}>
                    <k.icon stroke={1.7} style={{ color: k.color }} />
                    <div>
                      <b>{k.label}</b>
                      <span>{k.sub}</span>
                    </div>
                    {k.pctN !== undefined && (
                      <em
                        className={`${s.contador} ${s.pct}`}
                        style={{ color: k.color, "--n0": k.pctN, "--n2": recorrido ? k.pctN2 : undefined } as CSSProperties}
                      />
                    )}
                  </div>
                  <div className={s.kpiValor}>
                    <span
                      className={`${s.contador} ${s.cifra}`}
                      style={{ "--n0": k.valor, "--n2": recorrido ? k.valor2 : undefined, color: k.alerta ? COLOR_ESTADO.fuera : undefined } as CSSProperties}
                    />
                    <small>
                      <Texto partes={k.detalle} recorrido={recorrido} />
                    </small>
                  </div>
                  <div className={s.kpiBarra}>
                    <i style={{ width: `${k.frac * 100}%`, background: k.color }} />
                  </div>
                </div>
              ))}
            </div>

            <div className={s.grilla}>
              <section className={`${s.panel} ${s.areaTipo}`} style={d(0)}>
                <Cabecera icon={Truck} titulo="Flota por tipo" />
                <div className={s.tipos}>
                  {FLOTA_POR_GRUPO.map((g, i) => {
                    const total = g.operativo + g.mantencion + g.fuera;
                    return (
                      <div key={g.flota} className={s.tipo}>
                        <span>{g.flota}</span>
                        <div className={s.pista}>
                          <div className={s.relleno} style={{ ...d(i), width: `${(total / MAX_GRUPO) * 100}%` }}>
                            {(["operativo", "mantencion", "fuera"] as const).map((e) =>
                              g[e] > 0 ? (
                                <i key={e} style={{ flexGrow: g[e], background: COLOR_ESTADO[e] }}>
                                  {g[e]}
                                </i>
                              ) : null,
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className={`${s.panel} ${s.areaEventos}`} style={d(1)}>
                <Cabecera icon={History} titulo="Eventos" />
                <ul className={s.eventos}>
                  {recorrido && (
                    <li className={s.nuevaFila}>
                      <div>
                        <div className={s.evento}>
                          <span className={s.punto} style={{ background: TONO.NP.punto }} />
                          <b>
                            <span className={s.noCerrada}>{RECORRIDO_OT.codigo} — Creada</span>
                            <span className={s.siCerrada}>{RECORRIDO_OT.codigo} — Cerrada</span>
                          </b>
                          <span className={s.etiqueta} style={{ background: TONO.NP.fondo, color: TONO.NP.texto }}>NP</span>
                          <span className={s.hace}>ahora</span>
                        </div>
                      </div>
                    </li>
                  )}
                  {EVENTOS.map((e, i) => (
                    <li key={e.texto} className={s.evento} style={d(i)} data-objetivo={i === 0 ? "evento" : undefined}>
                      <span className={s.punto} style={{ background: TONO[e.tipo].punto }} />
                      <b>{e.texto}</b>
                      <span className={s.etiqueta} style={{ background: TONO[e.tipo].fondo, color: TONO[e.tipo].texto }}>
                        {e.tipo}
                      </span>
                      <span className={s.hace}>{e.hace}</span>
                    </li>
                  ))}
                </ul>
                <span className={s.mas}>+{EVENTOS_MAS} eventos más</span>
              </section>

              <section className={`${s.panel} ${s.areaEstado}`} style={d(2)}>
                <Cabecera icon={Truck} titulo="Estado de la flota" />
                <div className={s.estado}>
                  <div className={s.cuentas}>
                    {CUENTAS.map((c) => (
                      <div key={c.label} className={s.cuenta} style={{ borderColor: c.color }}>
                        <b>
                          <Contador n0={c.n} n2={"n2" in c ? c.n2 : undefined} recorrido={recorrido} />
                        </b>
                        <span>{c.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className={s.barraFlota}>
                    {(["operativo", "mantencion", "fuera"] as const).map((e) => (
                      <i key={e} style={{ flexGrow: FLOTA[e], background: COLOR_ESTADO[e] }} />
                    ))}
                  </div>
                  <span className={s.nota}>
                    <b>{pct(FLOTA.operativo)}%</b> de la flota operativa
                  </span>
                  <div className={s.separador} />
                  <span className={s.nota}>Vista rápida de equipos con mayor prioridad operacional</span>
                  <div className={s.pestanas}>
                    <ChevronLeft stroke={1.8} />
                    {EQUIPOS_VISTA_RAPIDA.map((c, i) => (
                      <span
                        key={c}
                        className={`${s.pestana} ${i === 0 ? s.tabPala : i === 1 ? s.tabCaex : ""}`}
                        data-objetivo={i === 1 ? "tab-caex" : undefined}
                      >
                        <i style={{ background: i === 1 ? COLOR_ESTADO.mantencion : i === 2 ? COLOR_ESTADO.fuera : COLOR_ESTADO.operativo }} />
                        {c}
                      </span>
                    ))}
                    <ChevronRight stroke={1.8} />
                  </div>
                  {/* La segunda ficha solo existe en la portada: la abre el recorrido del cursor (HeroDolly). */}
                  <div className={s.fichas}>
                    <FichaEquipo e={EQUIPO_DESTACADO} foto="/img/faena/pala-ficha.jpg" className={s.fichaPala} />
                    {encender && <FichaEquipo e={EQUIPO_CAEX} foto="/img/faena/caex-evidencia.jpg" className={s.fichaCaex} />}
                  </div>
                </div>
              </section>

              <section className={`${s.panel} ${s.areaDistribucion}`} style={d(3)}>
                <Cabecera icon={ChartDonut} titulo="Distribución de estado" />
                <div className={s.distribucion}>
                  <div className={s.dona}>
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="#eef0f3" strokeWidth="13" />
                      {SEGMENTOS.map((g, i) => (
                        <circle
                          key={g.color}
                          className={`${s.segmento} ${g.color === COLOR_ESTADO.mantencion ? s.segMant : ""}`}
                          style={d(i)}
                          cx="50"
                          cy="50"
                          r="40"
                          fill="none"
                          stroke={g.color}
                          strokeWidth="13"
                          pathLength={100}
                          strokeDasharray={`${g.largo} ${100 - g.largo}`}
                          strokeDashoffset={-g.inicio}
                        />
                      ))}
                    </svg>
                    <div className={s.donaCentro}>
                      <b>{FLOTA.total}</b>
                      <span>EQ</span>
                    </div>
                  </div>
                  <div className={s.leyenda}>
                    {DISTRIBUCION.map((e) => (
                      <div key={e.label} data-objetivo={e.color === COLOR_ESTADO.mantencion ? "dona-mant" : undefined}>
                        <i style={{ background: e.color }} />
                        {e.label}
                        <b>{e.n}</b>
                        <small>{pct(e.n)}%</small>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className={`${s.panel} ${s.areaPrioritarias}`} style={d(4)}>
                <Cabecera icon={Tool} titulo="OTs prioritarias">
                  <span
                    className={`${s.badge} ${s.contador}`}
                    style={{ "--n0": OTS.prioritarias, "--n2": recorrido ? OTS.prioritarias + 1 : undefined } as CSSProperties}
                  />
                </Cabecera>
                <ul className={s.ots}>
                  {recorrido && (
                    <li className={s.nuevaFila}>
                      <div>
                        <div className={s.ot} data-vuelo-destino>
                          <span className={s.etiqueta} style={{ background: TONO.NP.fondo, color: TONO.NP.texto }}>NP</span>
                          <div>
                            <b>{RECORRIDO_OT.codigo}</b> <small className={s.equipo}>{RECORRIDO_OT.equipo}</small>
                            <small>{RECORRIDO_OT.falla}</small>
                          </div>
                          <span className={`${s.prioridad} ${s.noCerrada}`} style={{ color: COLOR_ESTADO.fuera }}>
                            <i style={{ background: COLOR_ESTADO.fuera }} />
                            {RECORRIDO_OT.prioridad}
                          </span>
                          <span className={`${s.prioridad} ${s.siCerrada}`} style={{ color: "#15803d" }}>
                            <Check stroke={2.6} />
                            Cerrada
                          </span>
                        </div>
                      </div>
                    </li>
                  )}
                  {OTS_PRIORITARIAS.map((ot, i) => (
                    <li key={ot.codigo} className={s.ot} style={d(i)}>
                      <span className={s.etiqueta} style={{ background: TONO[ot.tipo].fondo, color: TONO[ot.tipo].texto }}>
                        {ot.tipo}
                      </span>
                      <div>
                        <b>{ot.codigo}</b> <small className={s.equipo}>{ot.equipo}</small>
                        <small>{ot.detalle}</small>
                      </div>
                      <span className={s.prioridad} style={{ color: ot.prioridad === "Alta" ? COLOR_ESTADO.fuera : "#d97706" }}>
                        <i style={{ background: ot.prioridad === "Alta" ? COLOR_ESTADO.fuera : COLOR_ESTADO.mantencion }} />
                        {ot.prioridad}
                      </span>
                    </li>
                  ))}
                </ul>
                <span className={s.masOts}>+{OTS.prioritarias - OTS_PRIORITARIAS.length} más</span>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
