import { COLOR_ESTADO, ETIQUETA_ESTADO, FLOTA, OTS, OTS_PRIORITARIAS, type Estado } from "../../lib/demo";

/**
 * Panel «Visión operativa» de sworkc redibujado con datos de ejemplo (lib/demo.ts).
 * SVG estático: escala como una imagen, sin JS. viewBox 900×589 = pantalla de la tablet de la portada.
 * Reemplaza las capturas que traían datos de prueba.
 */

const TEMAS = {
  oscuro: { fondo: "#0d0f14", lateral: "#111319", tarjeta: "#161a22", borde: "#262b36", texto: "#e9edf5", tenue: "#8b93a7", activo: "#2a2312", activoTexto: "#f5b400", tinteRojo: "#3a1517", tinteAzul: "#15233d" },
  claro: { fondo: "#f6f7fa", lateral: "#ffffff", tarjeta: "#ffffff", borde: "#e3e7ee", texto: "#0b1020", tenue: "#5b6680", activo: "#fff4d6", activoTexto: "#8a5300", tinteRojo: "#fde4e4", tinteAzul: "#e3ecfd" },
} as const;

const AMBAR = "#f5b400";
const AZUL = "#2563eb";
const NAV = ["Panel operativo", "Cierre de turno", "Confiabilidad", "Escanear QR", "Gestión de flota", "Mantenimiento", "Configuración"];

export function PanelOperativoDemo({ tema = "claro", className = "" }: { tema?: keyof typeof TEMAS; className?: string }) {
  const t = TEMAS[tema];
  const kpis = [
    { label: "Total activos", valor: FLOTA.total, sufijo: "equipos", frac: 1, color: t.tenue },
    { label: "Operativos", valor: FLOTA.operativo, sufijo: `de ${FLOTA.total}`, frac: FLOTA.operativo / FLOTA.total, color: COLOR_ESTADO.operativo },
    { label: "En mantención", valor: FLOTA.mantencion, sufijo: `de ${FLOTA.total}`, frac: FLOTA.mantencion / FLOTA.total, color: COLOR_ESTADO.mantencion },
    { label: "Fuera de servicio", valor: FLOTA.fuera, sufijo: `de ${FLOTA.total}`, frac: FLOTA.fuera / FLOTA.total, color: COLOR_ESTADO.fuera, alerta: true },
    { label: "OTs activas", valor: OTS.abiertas, sufijo: "abiertas", frac: 0.35, color: AZUL },
    { label: "OTs no planificadas", valor: OTS.noPlanificadas, sufijo: "abiertas", frac: OTS.noPlanificadas / OTS.abiertas, color: COLOR_ESTADO.fuera, alerta: true },
  ];

  // Dona: un círculo por estado con stroke-dasharray, empezando arriba.
  const R = 74;
  const C = 2 * Math.PI * R;
  const segmentos: { e: Estado; largo: number; inicio: number }[] = [];
  let acumulado = 0;
  for (const e of ["operativo", "mantencion", "fuera"] as Estado[]) {
    const largo = (FLOTA[e] / FLOTA.total) * C;
    segmentos.push({ e, largo, inicio: acumulado });
    acumulado += largo;
  }

  return (
    <svg
      viewBox="0 0 900 589"
      role="img"
      aria-label={`Panel de sworkc con datos de ejemplo: ${FLOTA.total} equipos, ${FLOTA.operativo} operativos, ${FLOTA.mantencion} en mantención y ${FLOTA.fuera} fuera de servicio; ${OTS.abiertas} OTs abiertas, ${OTS.noPlanificadas} no planificadas.`}
      className={`block h-auto w-full font-sans ${className}`}
    >
      <rect width="900" height="589" fill={t.fondo} />

      {/* Menú lateral */}
      <rect width="150" height="589" fill={t.lateral} />
      <line x1="150" x2="150" y1="0" y2="589" stroke={t.borde} />
      <text x="20" y="36" fontSize="16" fontWeight="700" fill={t.texto}>sworkc</text>
      {NAV.map((item, i) => {
        const y = 76 + i * 30;
        return (
          <g key={item}>
            {i === 0 && <rect x="10" y={y - 16} width="130" height="24" rx="6" fill={t.activo} />}
            <rect x="21" y={y - 8} width="8" height="8" rx="2" fill="none" stroke={i === 0 ? t.activoTexto : t.tenue} strokeWidth="1.4" />
            <text x="38" y={y} fontSize="10" fontWeight={i === 0 ? 600 : 400} fill={i === 0 ? t.activoTexto : t.tenue}>{item}</text>
          </g>
        );
      })}
      <text x="20" y="552" fontSize="9.5" fontWeight="600" fill={t.texto}>Jefe de mantención</text>
      <text x="20" y="567" fontSize="8.5" fill={t.tenue}>Turno día</text>

      {/* Encabezado */}
      <text x="170" y="40" fontSize="17" fontWeight="700" fill={t.texto}>Visión operativa</text>
      <text x="170" y="57" fontSize="9.5" fill={t.tenue}>Flota, órdenes y mantenimiento · últimos 30 días</text>
      <rect x="684" y="28" width="90" height="20" rx="10" fill="none" stroke={t.borde} />
      <text x="729" y="41.5" fontSize="8.5" fill={t.tenue} textAnchor="middle">Datos de ejemplo</text>
      <rect x="784" y="24" width="100" height="28" rx="6" fill={AMBAR} />
      <text x="834" y="42" fontSize="10" fontWeight="700" fill="#1a1400" textAnchor="middle">+ Nueva OT</text>

      {/* Indicadores */}
      {kpis.map((k, i) => {
        const x = 170 + i * 120;
        return (
          <g key={k.label}>
            <rect x={x} y="72" width="112" height="72" rx="6" fill={t.tarjeta} stroke={k.alerta ? COLOR_ESTADO.fuera : t.borde} />
            <text x={x + 10} y="90" fontSize="8.5" fill={t.tenue}>{k.label}</text>
            <text x={x + 10} y="121" fill={k.alerta ? COLOR_ESTADO.fuera : t.texto}>
              <tspan fontSize="21" fontWeight="700">{k.valor}</tspan>
              <tspan dx="5" fontSize="9" fill={t.tenue}>{k.sufijo}</tspan>
            </text>
            <rect x={x + 10} y="132" width="92" height="3" rx="1.5" fill={t.borde} />
            <rect x={x + 10} y="132" width={92 * k.frac} height="3" rx="1.5" fill={k.color} />
          </g>
        );
      })}

      {/* Distribución de estado */}
      <rect x="170" y="156" width="352" height="416" rx="8" fill={t.tarjeta} stroke={t.borde} />
      <text x="186" y="181" fontSize="10.5" fontWeight="600" fill={t.texto}>Distribución de estado</text>
      <g transform="rotate(-90 286 372)">
        {segmentos.map((s) => (
          <circle
            key={s.e}
            cx="286"
            cy="372"
            r={R}
            fill="none"
            stroke={COLOR_ESTADO[s.e]}
            strokeWidth="24"
            strokeDasharray={`${Math.max(0, s.largo - 2)} ${C}`}
            strokeDashoffset={-s.inicio}
          />
        ))}
      </g>
      <text x="286" y="378" fontSize="26" fontWeight="700" fill={t.texto} textAnchor="middle">{FLOTA.total}</text>
      <text x="286" y="394" fontSize="9" fill={t.tenue} textAnchor="middle">equipos</text>
      {segmentos.map((s, i) => {
        const y = 326 + i * 34;
        return (
          <g key={s.e}>
            <rect x="388" y={y} width="120" height="26" rx="6" fill={t.tarjeta} stroke={t.borde} />
            <circle cx="400" cy={y + 13} r="3.5" fill={COLOR_ESTADO[s.e]} />
            <text x="410" y={y + 16.5} fontSize="9" fill={t.texto}>{ETIQUETA_ESTADO[s.e]}</text>
            <text x="500" y={y + 17} fontSize="10" fontWeight="700" fill={t.texto} textAnchor="end">{FLOTA[s.e]}</text>
          </g>
        );
      })}

      {/* OTs prioritarias */}
      <rect x="532" y="156" width="352" height="416" rx="8" fill={t.tarjeta} stroke={t.borde} />
      <text x="548" y="181" fontSize="10.5" fontWeight="600" fill={t.texto}>OTs prioritarias</text>
      <rect x="636" y="170" width="20" height="15" rx="7.5" fill={t.tinteRojo} />
      <text x="646" y="181" fontSize="8.5" fontWeight="700" fill={COLOR_ESTADO.fuera} textAnchor="middle">{OTS.prioritarias}</text>
      <text x="548" y="208" fontSize="8" fontWeight="600" fill={t.tenue}>Tipo</text>
      <text x="592" y="208" fontSize="8" fontWeight="600" fill={t.tenue}>Orden y equipo</text>
      <text x="868" y="208" fontSize="8" fontWeight="600" fill={t.tenue} textAnchor="end">Prioridad</text>
      <line x1="548" x2="868" y1="216" y2="216" stroke={t.borde} />
      {OTS_PRIORITARIAS.map((ot, i) => {
        const top = 216 + i * 66;
        const color = ot.prioridad === "Alta" ? COLOR_ESTADO.fuera : COLOR_ESTADO.mantencion;
        return (
          <g key={ot.codigo}>
            <rect x="548" y={top + 20} width="30" height="17" rx="8.5" fill={ot.tipo === "NP" ? t.tinteRojo : t.tinteAzul} />
            <text x="563" y={top + 31.5} fontSize="8" fontWeight="700" fill={ot.tipo === "NP" ? COLOR_ESTADO.fuera : AZUL} textAnchor="middle">{ot.tipo}</text>
            <text x="592" y={top + 29} fill={t.texto}>
              <tspan className="font-mono" fontSize="10.5" fontWeight="700">{ot.codigo}</tspan>
              <tspan dx="6" fontSize="9" fill={t.tenue}>{ot.equipo}</tspan>
            </text>
            <text x="592" y={top + 45} fontSize="9" fill={t.tenue}>{ot.detalle}</text>
            <circle cx={868 - ot.prioridad.length * 5.4 - 7} cy={top + 29} r="3" fill={color} />
            <text x="868" y={top + 32} fontSize="9" fontWeight="700" fill={color} textAnchor="end">{ot.prioridad}</text>
            <line x1="548" x2="868" y1={top + 66} y2={top + 66} stroke={t.borde} />
          </g>
        );
      })}
      <text x="548" y="508" fontSize="9" fontWeight="600" fill={t.activoTexto}>
        + {OTS.prioritarias - OTS_PRIORITARIAS.length} más
      </text>
    </svg>
  );
}
