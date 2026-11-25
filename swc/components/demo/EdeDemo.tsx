import { COLOR_ESTADO, EDE, ETIQUETA_ESTADO } from "../../lib/demo";

/**
 * Expediente Digital del Equipo (EDE) de sworkc redibujado con datos de ejemplo (lib/demo.ts).
 * SVG estático: escala como una imagen, sin JS. Reemplaza la captura que traía datos de prueba.
 */

const C = { fondo: "#ffffff", panel: "#f6f7fa", borde: "#e3e7ee", texto: "#0b1020", tenue: "#5b6680", azul: "#2563eb", ambar: "#f5b400", activo: "#fff4d6", activoTexto: "#8a5300" };
const NAV: [string, string[]][] = [
  ["General", ["Resumen"]],
  ["Operación", ["Inspección", "Uso", "Intervenciones", "EDE"]],
  ["Control", ["Acciones"]],
];

/** Parte un texto en líneas de hasta `max` caracteres, por palabras. */
function lineas(texto: string, max: number) {
  const out: string[] = [];
  for (const p of texto.split(" ")) {
    const ultima = out[out.length - 1];
    if (ultima !== undefined && (ultima + " " + p).length <= max) out[out.length - 1] = ultima + " " + p;
    else out.push(p);
  }
  return out;
}

export function EdeDemo({ className = "" }: { className?: string }) {
  // Posiciones del menú: grupo (rótulo) + sus ítems, apilados.
  const menu: { grupo: string; y: number; filas: { item: string; y: number }[] }[] = [];
  let navY = 96;
  for (const [grupo, items] of NAV) {
    const y = navY;
    navY += 22;
    const filas = items.map((item, i) => ({ item, y: navY + i * 24 }));
    navY += items.length * 24 + 10;
    menu.push({ grupo, y, filas });
  }

  return (
    <svg
      viewBox="0 0 900 600"
      role="img"
      aria-label={`Expediente digital del equipo ${EDE.equipo} con datos de ejemplo: ${EDE.kpis.map((k) => `${k.sigla} ${k.valor}`).join(", ")}; últimas detenciones con motivo y duración, repuestos e historial de cambios.`}
      className={`block h-auto w-full font-sans ${className}`}
    >
      <rect width="900" height="600" fill={C.fondo} />

      {/* Encabezado del equipo */}
      <circle cx="28" cy="32" r="14" fill={C.panel} />
      <path d="M32 26 l-6 6 l6 6" fill="none" stroke={C.texto} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="52" y="18" width="28" height="28" rx="6" fill={C.activo} />
      <rect x="59" y="27" width="10" height="8" rx="1.5" fill="none" stroke={C.activoTexto} strokeWidth="1.5" />
      <rect x="69" y="30" width="5" height="5" rx="1" fill="none" stroke={C.activoTexto} strokeWidth="1.5" />
      <text x="92" y="30" fontSize="15" fontWeight="700" fill={C.texto}>{EDE.equipo}</text>
      <text x="92" y="46" fontSize="9.5" fill={C.tenue}>{EDE.descripcion}</text>
      <rect x="690" y="20" width="92" height="24" rx="12" fill={C.fondo} stroke={C.borde} />
      <circle cx="704" cy="32" r="3.5" fill={COLOR_ESTADO[EDE.estado]} />
      <text x="713" y="35.5" fontSize="9.5" fontWeight="700" fill={C.texto}>{ETIQUETA_ESTADO[EDE.estado]}</text>
      <rect x="792" y="18" width="92" height="28" rx="6" fill={C.ambar} />
      <text x="838" y="36" fontSize="10" fontWeight="700" fill="#1a1400" textAnchor="middle">+ Nueva OT</text>
      <line x1="0" x2="900" y1="64" y2="64" stroke={C.borde} />

      {/* Menú del equipo */}
      <line x1="140" x2="140" y1="64" y2="600" stroke={C.borde} />
      {menu.map(({ grupo, y: yGrupo, filas }) => (
        <g key={grupo}>
          <text x="20" y={yGrupo} fontSize="8" fontWeight="600" fill={C.tenue}>{grupo}</text>
          {filas.map(({ item, y }) => {
            const activo = item === "EDE";
            return (
              <g key={item}>
                {activo && <rect x="8" y={y - 15} width="124" height="22" rx="6" fill={C.activo} />}
                <text x="20" y={y} fontSize="10" fontWeight={activo ? 600 : 400} fill={activo ? C.activoTexto : C.texto}>{item}</text>
                {item === "Intervenciones" && (
                  <>
                    <rect x="106" y={y - 11} width="20" height="14" rx="7" fill={C.panel} />
                    <text x="116" y={y - 1} fontSize="8" fontWeight="600" fill={C.tenue} textAnchor="middle">{EDE.intervenciones}</text>
                  </>
                )}
              </g>
            );
          })}
        </g>
      ))}
      <rect x="12" y="562" width="116" height="20" rx="10" fill={C.panel} />
      <text x="70" y="575.5" fontSize="8.5" fill={C.tenue} textAnchor="middle">Datos de ejemplo</text>

      {/* Indicadores */}
      <text x="156" y="96" fontSize="13" fontWeight="700" fill={C.texto}>EDE, expediente digital del equipo</text>
      <text x="156" y="122" fontSize="9" fill={C.tenue}>Indicadores de los últimos 90 días</text>
      <rect x="548" y="108" width="92" height="22" rx="7" fill={C.panel} />
      <rect x="606" y="110" width="32" height="18" rx="5" fill={C.fondo} stroke={C.borde} />
      {["7 d", "30 d", "90 d"].map((p, i) => (
        <text key={p} x={562 + i * 30} y="122.5" fontSize="8.5" fontWeight={i === 2 ? 700 : 400} fill={i === 2 ? C.texto : C.tenue} textAnchor="middle">{p}</text>
      ))}
      {EDE.kpis.map((k, i) => {
        const x = 156 + i * 123;
        return (
          <g key={k.sigla}>
            <rect x={x} y="138" width="115" height="86" rx="8" fill={C.fondo} stroke={C.borde} />
            <text x={x + 12} y="157" fontSize="8.5" fontWeight="600" fill={C.tenue}>{k.sigla}</text>
            <text x={x + 12} y="183" className="font-mono" fontSize="17" fontWeight="700" fill={C.texto}>{k.valor}</text>
            <text x={x + 12} y="201" fontSize="8" fill={C.tenue}>
              {lineas(k.ayuda, 22).map((l, j) => (
                <tspan key={j} x={x + 12} dy={j ? 11 : 0}>{l}</tspan>
              ))}
            </text>
          </g>
        );
      })}

      {/* Últimas detenciones */}
      <rect x="156" y="236" width="484" height="212" rx="8" fill={C.fondo} stroke={C.borde} />
      <text x="172" y="259" fontSize="10" fontWeight="700" fill={C.texto}>Últimas detenciones</text>
      {EDE.detenciones.map((d, i) => {
        const y = 286 + i * 34;
        const ancho = ETIQUETA_ESTADO[d.estado].length * 4.6 + 16;
        return (
          <g key={d.fecha + d.causa}>
            {i > 0 && <line x1="172" x2="624" y1={y - 17} y2={y - 17} stroke={C.borde} />}
            <text x="172" y={y + 3} className="font-mono" fontSize="8.5" fill={C.tenue}>{d.fecha}</text>
            <rect x="244" y={y - 8} width={ancho} height="16" rx="8" fill={d.estado === "fuera" ? "#fde4e4" : "#fff4d6"} />
            <text x={244 + ancho / 2} y={y + 3} fontSize="8" fontWeight="600" fill={d.estado === "fuera" ? COLOR_ESTADO.fuera : C.activoTexto} textAnchor="middle">{ETIQUETA_ESTADO[d.estado]}</text>
            <text x="350" y={y + 3} className="font-mono" fontSize="8.5" fill={C.texto}>{d.horas}</text>
            <text x="394" y={y + 3} fontSize="8.5" fill={C.tenue}>{d.causa}</text>
          </g>
        );
      })}

      {/* Repuestos */}
      <rect x="156" y="460" width="484" height="124" rx="8" fill={C.fondo} stroke={C.borde} />
      <text x="172" y="483" fontSize="10" fontWeight="700" fill={C.texto}>Repuestos solicitados</text>
      {["OT", "Repuesto", "Plan.", "Usado"].map((h, i) => (
        <text key={h} x={[172, 300, 560, 624][i]} y="503" fontSize="8" fontWeight="600" fill={C.tenue} textAnchor={i > 1 ? "end" : "start"}>{h}</text>
      ))}
      {[
        ["OT-2026-044", "Filtro hidráulico", "2 u", "2 u"],
        ["OT-2026-041", "Aceite 15W40", "20 L", "18 L"],
      ].map((r, i) => {
        const y = 530 + i * 28;
        return (
          <g key={r[0]}>
            <line x1="172" x2="624" y1={y - 16} y2={y - 16} stroke={C.borde} />
            <text x="172" y={y} className="font-mono" fontSize="9" fontWeight="700" fill={C.texto}>{r[0]}</text>
            <text x="300" y={y} fontSize="9" fill={C.texto}>{r[1]}</text>
            <text x="560" y={y} className="font-mono" fontSize="9" fill={C.tenue} textAnchor="end">{r[2]}</text>
            <text x="624" y={y} className="font-mono" fontSize="9" fill={C.texto} textAnchor="end">{r[3]}</text>
          </g>
        );
      })}

      {/* Historial de cambios */}
      <line x1="656" x2="656" y1="64" y2="600" stroke={C.borde} />
      <text x="672" y="96" fontSize="10" fontWeight="700" fill={C.texto}>Historial de cambios</text>
      {EDE.historial.map((h, i) => {
        const y = 128 + i * 90;
        const nuevaFecha = i === 0 || EDE.historial[i - 1].fecha !== h.fecha;
        return (
          <g key={h.fecha + h.hora}>
            {nuevaFecha && <text x="672" y={y} fontSize="8" fontWeight="700" fill={C.tenue}>{h.fecha}</text>}
            <text x="672" y={y + 22} className="font-mono" fontSize="8" fill={C.tenue}>{h.hora}</text>
            <rect x="704" y={y + 12} width="2" height={h.de ? 48 : 30} rx="1" fill={C.azul} />
            <text x="714" y={y + 22} fontSize="9" fontWeight="700" fill={C.texto}>{h.rol}</text>
            <text x="714" y={y + 36} fontSize="9" fill={C.azul}>{h.accion}</text>
            {h.de && (
              <text x="714" y={y + 52} fontSize="8.5" fill={C.tenue}>
                {h.de} → <tspan fill={C.texto} fontWeight="600">{h.a}</tspan>
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
