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

export const FLOTA = { total: 51, operativo: 43, mantencion: 5, fuera: 3 };
export const OTS = { abiertas: 18, noPlanificadas: 4, prioritarias: 6 };

export type Prioridad = "Alta" | "Media";

export const OTS_PRIORITARIAS: {
  tipo: "NP" | "P";
  codigo: string;
  equipo: string;
  detalle: string;
  prioridad: Prioridad;
}[] = [
  { tipo: "NP", codigo: "OT-2026-052", equipo: "CAEX-214", detalle: "Fuga hidráulica en cilindro de levante", prioridad: "Alta" },
  { tipo: "NP", codigo: "OT-2026-049", equipo: "CAR-012", detalle: "Falla del sensor de presión de frenos", prioridad: "Alta" },
  { tipo: "P", codigo: "OT-2026-041", equipo: "PERF-31", detalle: "Mantención preventiva de 500 h", prioridad: "Media" },
  { tipo: "P", codigo: "OT-2026-047", equipo: "PALA-07", detalle: "Inspección de dientes del balde", prioridad: "Media" },
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
