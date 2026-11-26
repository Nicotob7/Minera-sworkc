import type { CSSProperties, ReactNode } from "react";
import { COLOR_DETENIDO, COLOR_ESTADO, EDE, EQUIPO_DESTACADO, FLOTA, OTS, RECORRIDO_OT as OT } from "../../lib/demo";
import { AlertTriangle, Bell, Check, Clock, FileText, Tool } from "../ui/icons";
import s from "./ModuloDemo.module.css";

export type ModuloId =
  | "ot"
  | "horas"
  | "alertas"
  | "estados"
  | "turnos"
  | "fallas"
  | "hh"
  | "insumos"
  | "dashboard"
  | "reportes";

/** Escalonado de entrada (ver .fila en el CSS). */
const i = (n: number) => ({ "--i": n }) as CSSProperties;
const AMBAR_TEXTO = "#b45309";

function Chip({ color, fondo, children }: { color: string; fondo: string; children: ReactNode }) {
  return (
    <span className={s.chip} style={{ color, background: fondo }}>
      {children}
    </span>
  );
}

const CHIP_ESTADO = {
  operativo: { texto: "Operativo", color: "#15803d", fondo: "#dcfce7" },
  mantencion: { texto: "En mantención", color: AMBAR_TEXTO, fondo: "#fef3c7" },
  fuera: { texto: "Fuera de servicio", color: "#b91c1c", fondo: "#fee2e2" },
  detenido: { texto: "Detenido", color: "#c2410c", fondo: "#ffedd5" },
};

/* ── Un recorte por módulo, con la forma de la pantalla real del producto ── */

const ETAPAS_OT = ["Creada", "Asignada", "Seg. firmada", "Iniciada", "Trabajo finalizado", "Cerrada"];

function Ot() {
  const actual = 3; // Iniciada
  return (
    <>
      <div className={`${s.fila} ${s.cabOt}`} style={i(0)}>
        <Chip color="#b91c1c" fondo="#fee2e2">NP</Chip>
        <b>{OT.codigo}</b>
        <span className={s.tenue}>{OT.equipo}</span>
        <Chip color="#1d4ed8" fondo="#dbeafe">En progreso</Chip>
      </div>
      <ol className={s.etapas}>
        {ETAPAS_OT.map((e, n) => (
          <li key={e} className={`${s.fila} ${n < actual ? s.hecha : n === actual ? s.actual : ""}`} style={i(n + 1)}>
            <span className={s.marca}>{n < actual && <Check stroke={3} />}</span>
            {e}
          </li>
        ))}
      </ol>
      <div className={`${s.fila} ${s.pie}`} style={i(7)}>
        <span>{OT.cerradaPor}</span>
        <span>2 fotos · 6 eventos</span>
      </div>
    </>
  );
}

function Horas() {
  const proxima = 31518.2;
  const actual = 31480.2;
  const ultimaMant = 30518.2;
  return (
    <>
      <div className={`${s.fila} ${s.equipoCab}`} style={i(0)}>
        <b>{EQUIPO_DESTACADO.codigo}</b>
        <span className={s.tenue}>{EQUIPO_DESTACADO.modelo}</span>
      </div>
      <div className={`${s.fila} ${s.grande}`} style={i(1)}>
        {EQUIPO_DESTACADO.horometro}
        <small>horómetro</small>
      </div>
      <div className={`${s.fila} ${s.progreso}`} style={i(2)}>
        <div className={s.barra}>
          <i style={{ width: `${((actual - ultimaMant) / (proxima - ultimaMant)) * 100}%`, background: COLOR_ESTADO.mantencion }} />
        </div>
        <span>
          <b style={{ color: AMBAR_TEXTO }}>{EQUIPO_DESTACADO.aviso}</b> de 1.000 h
        </span>
      </div>
      <ul className={s.lista}>
        {[
          ["Turno A", "8,5 h"],
          ["Turno B", "7,9 h"],
          ["Turno C", "8,1 h"],
        ].map(([t, h], n) => (
          <li key={t} className={s.fila} style={i(n + 3)}>
            <span>Uso · {t}</span>
            <b>{h}</b>
          </li>
        ))}
      </ul>
    </>
  );
}

function Alertas() {
  const avisos = [
    { icono: AlertTriangle, color: COLOR_ESTADO.fuera, titulo: "Mantención vencida", detalle: "CAEX-214 · pauta de 500 h", hace: "hace 2 h" },
    { icono: Clock, color: COLOR_ESTADO.mantencion, titulo: EQUIPO_DESTACADO.aviso, detalle: `${EQUIPO_DESTACADO.codigo} · pauta de 1.000 h`, hace: "hace 3 h" },
    { icono: Tool, color: COLOR_ESTADO.fuera, titulo: `OT ${OT.tipo} prioridad ${OT.prioridad.toLowerCase()}`, detalle: `${OT.equipo} · aviso al jefe de turno`, hace: "hace 5 h" },
  ];
  return (
    <ul className={s.avisos}>
      {avisos.map((a, n) => (
        <li key={a.titulo} className={`${s.fila} ${s.desdeDerecha}`} style={i(n)}>
          <span className={s.avisoIcono} style={{ color: a.color }}>
            <a.icono stroke={1.9} />
          </span>
          <div>
            <b>{a.titulo}</b>
            <span>{a.detalle}</span>
          </div>
          <span className={s.tenue}>{a.hace}</span>
        </li>
      ))}
    </ul>
  );
}

function Estados() {
  const equipos: { codigo: string; modelo: string; estado: keyof typeof CHIP_ESTADO }[] = [
    { codigo: OT.equipo, modelo: "Camión de extracción", estado: "detenido" },
    { codigo: "CAEX-214", modelo: "Camión de extracción", estado: "mantencion" },
    { codigo: "CAR-012", modelo: "Cargador frontal", estado: "fuera" },
    { codigo: "PERF-31", modelo: "Perforadora", estado: "operativo" },
    { codigo: "PALA-07", modelo: "Pala eléctrica", estado: "operativo" },
  ];
  return (
    <>
      <ul className={s.lista}>
        {equipos.map((e, n) => (
          <li key={e.codigo} className={s.fila} style={i(n)}>
            <span>
              <b>{e.codigo}</b> <span className={s.tenue}>{e.modelo}</span>
            </span>
            <Chip color={CHIP_ESTADO[e.estado].color} fondo={CHIP_ESTADO[e.estado].fondo}>
              {CHIP_ESTADO[e.estado].texto}
            </Chip>
          </li>
        ))}
      </ul>
      <div className={`${s.fila} ${s.barraEstados}`} style={i(5)}>
        <i style={{ flexGrow: FLOTA.operativo, background: COLOR_ESTADO.operativo }} />
        <i style={{ flexGrow: FLOTA.mantencion, background: COLOR_ESTADO.mantencion }} />
        <i style={{ flexGrow: 1, background: COLOR_DETENIDO }} />
        <i style={{ flexGrow: FLOTA.fuera, background: COLOR_ESTADO.fuera }} />
      </div>
    </>
  );
}

function Turnos() {
  const filas = [
    ["OTs abiertas que pasan", "3"],
    ["Fallas reportadas", "2"],
    ["Usos registrados", "14"],
    ["Equipos detenidos", "1"],
  ];
  return (
    <>
      <div className={`${s.fila} ${s.relevo}`} style={i(0)}>
        <Chip color="#374151" fondo="#e5e7eb">Turno A</Chip>
        <span className={s.flecha} />
        <Chip color={AMBAR_TEXTO} fondo="#fef3c7">Turno B</Chip>
      </div>
      <ul className={s.lista}>
        {filas.map(([k, v], n) => (
          <li key={k} className={s.fila} style={i(n + 1)}>
            <span>{k}</span>
            <b>{v}</b>
          </li>
        ))}
      </ul>
      <div className={`${s.fila} ${s.nota}`} style={i(5)}>
        «Rampa 3 con barro: {OT.equipo} detenido por manguera de dirección.»
      </div>
    </>
  );
}

function Fallas() {
  const causas = [
    ["Sistema hidráulico", 9],
    ["Neumáticos", 6],
    ["Frenos", 4],
    ["Sistema eléctrico", 3],
    ["Motor", 2],
  ] as const;
  const kpis = EDE.kpis.filter((k) => k.sigla === "MTBF" || k.sigla === "MTTR");
  return (
    <>
      <div className={`${s.fila} ${s.kpis}`} style={i(0)}>
        {kpis.map((k) => (
          <div key={k.sigla}>
            <span>{k.sigla}</span>
            <b>{k.valor}</b>
          </div>
        ))}
      </div>
      <ul className={s.pareto}>
        {causas.map(([c, n], j) => (
          <li key={c} className={s.fila} style={i(j + 1)}>
            <span>{c}</span>
            <div className={s.barra}>
              <i style={{ width: `${(n / causas[0][1]) * 100}%`, background: j === 0 ? COLOR_ESTADO.fuera : "#94a3b8" }} />
            </div>
            <b>{n}</b>
          </li>
        ))}
      </ul>
    </>
  );
}

function Hh() {
  const filas = [
    { ot: OT.codigo, rol: "Mecánico", estimadas: 2, reales: 2.4 },
    { ot: OT.codigo, rol: "Ayudante", estimadas: 2, reales: 2.4 },
    { ot: "OT-2026-047", rol: "Mecánico", estimadas: 3, reales: 3.1 },
  ];
  const max = 3.5;
  const coma = (n: number) => n.toLocaleString("es-CL", { minimumFractionDigits: 1 });
  return (
    <>
      <ul className={s.hh}>
        {filas.map((f, n) => (
          <li key={`${f.ot}-${f.rol}`} className={s.fila} style={i(n)}>
            <span>
              <b>{f.rol}</b> <span className={s.tenue}>{f.ot}</span>
            </span>
            <div className={s.dobleBarra}>
              <i style={{ width: `${(f.estimadas / max) * 100}%` }} />
              <i style={{ width: `${(f.reales / max) * 100}%` }} />
            </div>
            <b>{coma(f.reales)} h</b>
          </li>
        ))}
      </ul>
      <div className={`${s.fila} ${s.leyendaHh}`} style={i(3)}>
        <span><i className={s.estimada} /> Estimadas 7,0 h</span>
        <span><i className={s.real} /> Reales 7,9 h</span>
      </div>
    </>
  );
}

function Insumos() {
  const items = [
    ["Manguera hidráulica 1\"", "1 un", true],
    ["Aceite hidráulico ISO 46", "12 L", true],
    ["Abrazaderas", "4 un", true],
    ["Filtro de retorno", "1 un", false],
  ] as const;
  return (
    <>
      <div className={`${s.fila} ${s.cabOt}`} style={i(0)}>
        <b>{OT.codigo}</b>
        <span className={s.tenue}>{OT.equipo}</span>
      </div>
      <ul className={s.lista}>
        {items.map(([nombre, cant, usado], n) => (
          <li key={nombre} className={s.fila} style={i(n + 1)}>
            <span className={s.conMarca}>
              <span className={`${s.marca} ${usado ? s.marcaHecha : ""}`}>{usado && <Check stroke={3} />}</span>
              {nombre}
            </span>
            <b>{cant}</b>
          </li>
        ))}
      </ul>
      <div className={`${s.fila} ${s.pie}`} style={i(5)}>
        <span>Planificado 4 · Utilizado 3</span>
        <span>Va al EDE del equipo</span>
      </div>
    </>
  );
}

function Dashboard() {
  const kpis = [
    { label: "Equipos", n: FLOTA.total, frac: 1, color: "#4b5563" },
    { label: "Disponibles", n: FLOTA.operativo, frac: FLOTA.operativo / FLOTA.total, color: COLOR_ESTADO.operativo },
    { label: "OTs activas", n: OTS.abiertas, frac: 1, color: "#3b82f6" },
    { label: "OTs NP", n: OTS.noPlanificadas, frac: OTS.noPlanificadas / OTS.abiertas, color: COLOR_ESTADO.fuera },
  ];
  return (
    <div className={s.tablero}>
      {kpis.map((k, n) => (
        <div key={k.label} className={`${s.fila} ${s.kpi}`} style={i(n)}>
          <span>{k.label}</span>
          <b className={s.contador} style={{ "--n0": k.n } as CSSProperties} />
          <div className={s.barra}>
            <i style={{ width: `${k.frac * 100}%`, background: k.color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function Reportes() {
  const archivos = [
    { nombre: `${OT.codigo}.pdf`, detalle: "OT con evidencia y firmas · 412 KB", tipo: "PDF", color: "#b91c1c", fondo: "#fee2e2" },
    { nombre: "Cierre turno A · 26-11.xlsx", detalle: "Resumen, gráficos y fotos · 1,2 MB", tipo: "XLSX", color: "#15803d", fondo: "#dcfce7" },
    { nombre: "Cierre turno A · 26-11.pdf", detalle: "Para imprimir o archivar · 380 KB", tipo: "PDF", color: "#b91c1c", fondo: "#fee2e2" },
  ];
  return (
    <>
      <ul className={s.archivos}>
        {archivos.map((a, n) => (
          <li key={a.nombre} className={s.fila} style={i(n)}>
            <span className={s.archivoIcono} style={{ color: a.color, background: a.fondo }}>
              <FileText stroke={1.8} />
            </span>
            <div>
              <b>{a.nombre}</b>
              <span>{a.detalle}</span>
            </div>
            <Chip color={a.color} fondo={a.fondo}>{a.tipo}</Chip>
          </li>
        ))}
      </ul>
      <div className={`${s.fila} ${s.enviado}`} style={i(3)}>
        <Bell stroke={1.9} /> Enviado por correo a 6 destinatarios · 08:00
      </div>
    </>
  );
}

const MODULOS: Record<ModuloId, { pantalla: string; Contenido: () => ReactNode }> = {
  ot: { pantalla: "Órdenes de trabajo", Contenido: Ot },
  horas: { pantalla: "Ficha del equipo", Contenido: Horas },
  alertas: { pantalla: "Notificaciones", Contenido: Alertas },
  estados: { pantalla: "Gestión de flota", Contenido: Estados },
  turnos: { pantalla: "Cierre de turno", Contenido: Turnos },
  fallas: { pantalla: "Confiabilidad", Contenido: Fallas },
  hh: { pantalla: "Horas-hombre por OT", Contenido: Hh },
  insumos: { pantalla: "Materiales de la OT", Contenido: Insumos },
  dashboard: { pantalla: "Dashboard operativo", Contenido: Dashboard },
  reportes: { pantalla: "Reportes", Contenido: Reportes },
};

/**
 * Recorte de la pantalla de sworkc que corresponde a un módulo (datos de ejemplo de lib/demo.ts).
 * Al cambiar de módulo el padre lo vuelve a montar (key) y las filas entran en cascada:
 * es la respuesta visible a que el visitante eligió otro módulo.
 */
export function ModuloDemo({ modulo }: { modulo: ModuloId }) {
  const { pantalla, Contenido } = MODULOS[modulo];
  return (
    <div className={s.pantalla} role="img" aria-label={`Pantalla «${pantalla}» de sworkc con datos de ejemplo.`}>
      <div className={s.cab} aria-hidden>
        <span className={s.punto} />
        {pantalla}
        <span className={s.ejemplo}>Datos de ejemplo</span>
      </div>
      <div className={s.cuerpo} aria-hidden>
        <Contenido />
      </div>
    </div>
  );
}
