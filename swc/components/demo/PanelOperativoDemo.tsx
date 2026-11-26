import type { CSSProperties } from "react";
import {
  COLOR_DETENIDO,
  COLOR_ESTADO,
  EQUIPO_DESTACADO,
  EQUIPOS_VISTA_RAPIDA,
  EVENTOS,
  EVENTOS_MAS,
  FLOTA,
  FLOTA_POR_GRUPO,
  OTS,
  OTS_PRIORITARIAS,
  type TipoEvento,
} from "../../lib/demo";
import {
  Activity,
  AlertTriangle,
  Ban,
  Bell,
  Calendar,
  ChartDonut,
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

const KPIS: {
  label: string;
  sub: string;
  icon: IconType;
  valor: number;
  detalle: string;
  color: string;
  frac: number;
  pct?: string;
  alerta?: boolean;
}[] = [
  { label: "Total activos", sub: "Inventario", icon: Truck, valor: FLOTA.total, detalle: "equipos", color: GRIS, frac: 1, pct: "100%" },
  { label: "Disponibles", sub: "Operación", icon: ShieldCheck, valor: FLOTA.operativo, detalle: `de ${FLOTA.total} equipos`, color: COLOR_ESTADO.operativo, frac: FLOTA.operativo / FLOTA.total, pct: `${pct(FLOTA.operativo)}%` },
  { label: "En mantención", sub: "Seguimiento", icon: Tool, valor: FLOTA.mantencion, detalle: "por OT abierta", color: COLOR_ESTADO.mantencion, frac: FLOTA.mantencion / FLOTA.total, pct: `${pct(FLOTA.mantencion)}%` },
  { label: "Detenidos", sub: "Parada", icon: Ban, valor: FLOTA.detenido, detalle: `de ${FLOTA.total}`, color: COLOR_DETENIDO, frac: FLOTA.detenido / FLOTA.total, pct: `${pct(FLOTA.detenido)}%` },
  { label: "Fuera de servicio", sub: "Crítico", icon: AlertTriangle, valor: FLOTA.fuera, detalle: `de ${FLOTA.total}`, color: COLOR_ESTADO.fuera, frac: FLOTA.fuera / FLOTA.total, pct: `${pct(FLOTA.fuera)}%` },
  { label: "OTs activas", sub: "Trabajo", icon: ClipboardCheck, valor: OTS.abiertas, detalle: `${OTS.noPlanificadas} NP · ${OTS.correctivas} CC · ${OTS.planificadas} PL`, color: AZUL_OT, frac: 1 },
  { label: "OTs NP abiertas", sub: "No planif.", icon: Gauge, valor: OTS.noPlanificadas, detalle: `de ${OTS.abiertas} activas`, color: COLOR_ESTADO.fuera, frac: OTS.noPlanificadas / OTS.abiertas, pct: `${Math.round((OTS.noPlanificadas / OTS.abiertas) * 100)}%`, alerta: true },
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
  { n: OTS.abiertas, label: "OT", color: "#6366f1" },
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
 */
export function PanelOperativoDemo({ encender = false }: { encender?: boolean }) {
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
                <div key={k.label} className={k.alerta ? s.kpiAlerta : s.kpi} style={d(i)}>
                  <div className={s.kpiCab}>
                    <k.icon stroke={1.7} style={{ color: k.color }} />
                    <div>
                      <b>{k.label}</b>
                      <span>{k.sub}</span>
                    </div>
                    {k.pct && <em style={{ color: k.color }}>{k.pct}</em>}
                  </div>
                  <div className={s.kpiValor}>
                    <span className={s.cifra} style={{ "--n": k.valor, color: k.alerta ? COLOR_ESTADO.fuera : undefined } as CSSProperties} />
                    <small>{k.detalle}</small>
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
                  {EVENTOS.map((e, i) => (
                    <li key={e.texto} className={s.evento} style={d(i)}>
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
                        <b>{c.n}</b>
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
                      <span key={c} className={i === 0 ? `${s.pestana} ${s.pestanaActiva}` : s.pestana}>
                        <i style={{ background: i === 1 ? COLOR_ESTADO.mantencion : i === 2 ? COLOR_ESTADO.fuera : COLOR_ESTADO.operativo }} />
                        {c}
                      </span>
                    ))}
                    <ChevronRight stroke={1.8} />
                  </div>
                  <div className={s.fichaFoto}>
                    {/* Recorte de /img/faena/pala-electrica.jpg (Sansumaria, CC BY-SA 3.0; crédito en lib/creditos.ts). */}
                    {/* eslint-disable-next-line @next/next/no-img-element -- imagen chica dentro de una pantalla dibujada */}
                    <img src="/img/faena/pala-ficha.jpg" alt="" width={720} height={300} loading="lazy" decoding="async" />
                    <span className={s.fichaEstado}>Operativo</span>
                  </div>
                  <div className={s.fichaNombre}>
                    <b>{EQUIPO_DESTACADO.codigo}</b>
                    <span>{EQUIPO_DESTACADO.modelo}</span>
                    <small>{EQUIPO_DESTACADO.flota}</small>
                  </div>
                  <div className={s.datos}>
                    <div className={s.dato}><span>Horómetro</span><b>{EQUIPO_DESTACADO.horometro}</b></div>
                    <div className={s.dato}><span>OTs abiertas</span><b>{EQUIPO_DESTACADO.otsAbiertas}</b></div>
                    <div className={s.dato}><span>Prioridad máx.</span><b style={{ color: "#b45309" }}>{EQUIPO_DESTACADO.prioridadMax}</b></div>
                    <div className={s.dato}><span>Mantención</span><b style={{ color: "#b45309" }}>{EQUIPO_DESTACADO.mantencion}</b></div>
                  </div>
                  <span className={s.nota}>{EQUIPO_DESTACADO.aviso}</span>
                  <span className={s.nota}>
                    OT prioritaria <span className={s.otPrioritaria}>Media · {EQUIPO_DESTACADO.ot}</span>
                  </span>
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
                          className={s.segmento}
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
                      <div key={e.label}>
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
                  <span className={s.badge}>{OTS.prioritarias}</span>
                </Cabecera>
                <ul className={s.ots}>
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
