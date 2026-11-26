// Datos de EJEMPLO para las pantallas del sistema que el sitio redibuja (portada, Producto, EDE).
// Equipos y OTs ficticios con el formato real del producto. No son clientes, personas ni resultados:
// las personas aparecen solo por su rol. Una sola fuente para que las pantallas no se contradigan.

export type Estado = "operativo" | "mantencion" | "fuera";

export const COLOR_ESTADO: Record<Estado, string> = {
  operativo: "#16a34a",
  mantencion: "#f59e0b",
  fuera: "#dc2626",
};

export const ETIQUETA_ESTADO: Record<Estado, string> = {
  operativo: "Operativo",
  mantencion: "En mantención",
  fuera: "Fuera de servicio",
};

/** Detenido no se usa en las otras pantallas: aparte para no agrandar `Estado`. */
export const COLOR_DETENIDO = "#f97316";

export const FLOTA = { total: 51, operativo: 43, detenido: 0, mantencion: 5, fuera: 3, mantencionVencida: 2 };
/** OTs activas por tipo, como las cuenta el producto: NP no planificada, CC corrección de condición, PL planificada. */
export const OTS = { abiertas: 18, noPlanificadas: 4, correctivas: 5, planificadas: 9, prioritarias: 6 };

/** Equipos por flota (suman FLOTA). */
export const FLOTA_POR_GRUPO = [
  { flota: "Flota extracción", operativo: 21, mantencion: 2, fuera: 1 },
  { flota: "Flota apoyo", operativo: 10, mantencion: 2, fuera: 1 },
  { flota: "Flota perforación", operativo: 7, mantencion: 0, fuera: 1 },
  { flota: "Flota carguío", operativo: 5, mantencion: 1, fuera: 0 },
];

export type TipoEvento = "PL" | "NP" | "CC" | "Op." | "Mant." | "F/S";

export const EVENTOS: { texto: string; tipo: TipoEvento; hace: string }[] = [
  { texto: "OT-2026-054 — Creada", tipo: "PL", hace: "hace 1 h" },
  { texto: "CAEX-214 — En mantención", tipo: "Mant.", hace: "hace 2 h" },
  { texto: "OT-2026-053 — Cerrada", tipo: "CC", hace: "hace 3 h" },
  { texto: "OT-2026-052 — Creada", tipo: "NP", hace: "hace 5 h" },
  { texto: "PERF-31 — Operativo", tipo: "Op.", hace: "hace 8 h" },
  { texto: "OT-2026-051 — Creada", tipo: "PL", hace: "hace 1 día" },
  { texto: "CAR-012 — Fuera de servicio", tipo: "F/S", hace: "hace 1 día" },
  { texto: "OT-2026-050 — Cerrada", tipo: "PL", hace: "hace 2 días" },
];
export const EVENTOS_MAS = 34;

/** Equipo destacado en «Estado de la flota» (la foto es un recorte de la pala de lib/creditos.ts). */
export const EQUIPO_DESTACADO = {
  codigo: "PALA-07",
  modelo: "Pala eléctrica de cable",
  flota: "Flota carguío · Pala",
  estado: "operativo" as Estado,
  horometro: "31.480,2 h",
  otsAbiertas: 1,
  prioridadMax: "Media",
  mantencion: "Próxima",
  aviso: "Faltan 38 h para la mantención",
  ot: "OT-2026-047",
};
export const EQUIPOS_VISTA_RAPIDA = ["PALA-07", "CAEX-214", "CAR-012", "PERF-31"];

export type Prioridad = "Alta" | "Media";

export const OTS_PRIORITARIAS: {
  tipo: "NP" | "CC" | "PL";
  codigo: string;
  equipo: string;
  detalle: string;
  prioridad: Prioridad;
}[] = [
  { tipo: "NP", codigo: "OT-2026-052", equipo: "CAEX-214", detalle: "Fuga hidráulica en cilindro de levante", prioridad: "Alta" },
  { tipo: "NP", codigo: "OT-2026-049", equipo: "CAR-012", detalle: "Falla del sensor de presión de frenos", prioridad: "Alta" },
  { tipo: "PL", codigo: "OT-2026-041", equipo: "PERF-31", detalle: "Mantención preventiva de 500 h", prioridad: "Media" },
  { tipo: "PL", codigo: "OT-2026-047", equipo: "PALA-07", detalle: "Inspección de dientes del balde", prioridad: "Media" },
];

/** Expediente Digital del Equipo (EDE) de ejemplo. */
export const EDE = {
  equipo: "CAEX-214",
  descripcion: "Camión de extracción · Flota norte",
  estado: "operativo" as Estado,
  intervenciones: 12,
  kpis: [
    { sigla: "Disponibilidad", valor: "92,6 %", ayuda: "del período en estado operativo" },
    { sigla: "MTTR", valor: "6,4 h", ayuda: "duración media de reparación" },
    { sigla: "MTBF", valor: "182,5 h", ayuda: "horas operativas entre fallas" },
    { sigla: "MTBS", valor: "410,3 h", ayuda: "horas operativas entre paradas" },
  ],
  detenciones: [
    { fecha: "12 nov 2026", estado: "mantencion" as Estado, horas: "6,2 h", causa: "Mantención preventiva de 500 h" },
    { fecha: "03 nov 2026", estado: "fuera" as Estado, horas: "9,8 h", causa: "Fuga hidráulica en cilindro de levante" },
    { fecha: "21 oct 2026", estado: "mantencion" as Estado, horas: "4,1 h", causa: "Cambio de neumático posterior" },
    { fecha: "08 oct 2026", estado: "fuera" as Estado, horas: "7,5 h", causa: "Falla del sensor de presión de frenos" },
    { fecha: "24 sep 2026", estado: "mantencion" as Estado, horas: "3,0 h", causa: "Lubricación y revisión de frenos" },
  ],
  historial: [
    { fecha: "12 nov 2026", hora: "08:14", rol: "Jefe de turno", accion: "cambió el estado", de: "Operativo", a: "En mantención" },
    { fecha: "12 nov 2026", hora: "14:32", rol: "Mecánico", accion: "cerró la OT-2026-044", de: "", a: "" },
    { fecha: "03 nov 2026", hora: "22:05", rol: "Operador", accion: "reportó una falla", de: "", a: "" },
    { fecha: "03 nov 2026", hora: "22:11", rol: "Jefe de turno", accion: "cambió el estado", de: "Operativo", a: "Fuera de servicio" },
    { fecha: "29 oct 2026", hora: "07:50", rol: "Operador", accion: "actualizó el horómetro", de: "12.402", a: "12.480" },
  ],
};

/** Rectángulo de la pantalla de la tablet dentro de public/hero/portada.jpg (ver scripts/limpiar-portada.mjs). */
export const PORTADA = { ancho: 1672, alto: 941, pantalla: { x: 683, y: 221, w: 900, h: 589 } };

/** OT de ejemplo que recorre la sección «Centro de control» del inicio: terreno → panel → cierre. */
export const RECORRIDO_OT = {
  codigo: "OT-2026-055",
  tipo: "NP" as const,
  equipo: "CAEX-221",
  modelo: "Camión de extracción",
  flota: "Flota extracción",
  falla: "Corte en manguera hidráulica de dirección",
  prioridad: "Alta",
  trabajo: "Cambio de manguera hidráulica de dirección y prueba en vacío.",
  checklist: ["Equipo bloqueado (LOTO)", "Manguera reemplazada", "Prueba de dirección conforme"],
  reparacion: "2,4 h",
  cerradaPor: "Mecánico · Turno B",
};
