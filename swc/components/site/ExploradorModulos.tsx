"use client";

import { useEffect, useRef, useState } from "react";
import { ModuloDemo, type ModuloId } from "../demo/ModuloDemo";
import { useReducedMotion } from "../hooks";
import {
  ArrowsExchange,
  Bell,
  ChartBar,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  Hourglass,
  LayoutDashboard,
  Package,
  Truck,
  type IconType,
} from "../ui/icons";

/** Escritorio: el explorador avanza solo un módulo cada AUTO_MS mientras está en pantalla. */
const AUTO_MS = 5000;

/* Módulos reales del sistema (mismo orden que ModuloDemo). */
const MODULOS: { id: ModuloId; icon: IconType; title: string; desc: string; points: string[] }[] = [
  { id: "ot", icon: ClipboardCheck, title: "Órdenes de trabajo digitales", desc: "Cada OT se crea, asigna, ejecuta y cierra con evidencia, responsable e historial trazable.", points: ["Asignación por equipo", "Cierre con evidencia", "Historial trazable"] },
  { id: "horas", icon: Clock, title: "Horas de funcionamiento", desc: "Control del horómetro de cada máquina para anticipar la próxima mantención.", points: ["Conteo por equipo", "Umbrales configurables", "Horas hasta la mantención"] },
  { id: "alertas", icon: Bell, title: "Mantenciones y alertas", desc: "Avisos por horas, fechas, criticidad o condiciones que amenazan la continuidad.", points: ["Prioridad por criticidad", "Aviso a responsables", "Reglas por operación"] },
  { id: "estados", icon: Truck, title: "Estados de maquinaria", desc: "Equipos disponibles, detenidos, en reparación o inspección, actualizados apenas se registran en terreno.", points: ["Estado por equipo", "Detenciones registradas", "Pendientes priorizados"] },
  { id: "turnos", icon: ArrowsExchange, title: "Gestión de turnos", desc: "Pendientes, fallas y observaciones se entregan al turno siguiente sin depender de memoria.", points: ["Resumen de cierre", "Pendientes heredados", "Contexto entre turnos"] },
  { id: "fallas", icon: ChartBar, title: "Estadísticas de fallas", desc: "Frecuencia, reincidencias y tiempos de detención para decidir con datos reales.", points: ["Fallas por equipo", "Tiempos de reparación", "Patrones repetitivos"] },
  { id: "hh", icon: Hourglass, title: "Control de horas-hombre", desc: "Registro de HH por reparación, inspección y mantención para comparar productividad.", points: ["HH por actividad", "Comparativa por equipo", "HH estimadas vs reales"] },
  { id: "insumos", icon: Package, title: "Materiales y repuestos por OT", desc: "Traza repuestos, materiales y consumibles usados en cada intervención.", points: ["Consumo por reparación", "Planificado vs utilizado", "Repuestos por equipo en el EDE"] },
  { id: "dashboard", icon: LayoutDashboard, title: "Panel operacional", desc: "Disponibilidad, alertas, estados y productividad reunidos en una vista de mando.", points: ["Indicadores clave", "Tendencias visuales", "Alertas centralizadas"] },
  { id: "reportes", icon: FileText, title: "Reportabilidad", desc: "Cada OT se descarga en PDF y el reporte de cierre de turno se envía por correo en Excel y PDF.", points: ["OT en PDF descargable", "Cierre de turno por correo (Excel y PDF)", "Datos consolidados"] },
];

/**
 * Producto, módulos: lista seleccionable a la izquierda y, a la derecha, una tarjeta con la
 * descripción y la pantalla real del módulo (ModuloDemo, datos de ejemplo). En escritorio avanza
 * solo mientras está en pantalla; se pausa al leer la tarjeta o con foco de teclado y se apaga
 * para siempre cuando el visitante elige un módulo. En móvil la lista es una fila desplazable.
 */
export function ExploradorModulos() {
  const [activo, setActivo] = useState<ModuloId>("ot");
  const reducido = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [enVista, setEnVista] = useState(false);
  const [pausa, setPausa] = useState(false);
  const [automatico, setAutomatico] = useState(true);
  const [ciclo, setCiclo] = useState(0);
  const [escritorio, setEscritorio] = useState(false);
  const corriendo = escritorio && automatico && enVista && !pausa && !reducido;
  const m = MODULOS.find((x) => x.id === activo) ?? MODULOS[0];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(min-width: 1024px)");
    const alCambiar = () => setEscritorio(mq.matches);
    mq.addEventListener("change", alCambiar);
    const io = new IntersectionObserver(([e]) => {
      setEnVista(e.isIntersecting);
      setEscritorio(mq.matches);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => {
      io.disconnect();
      mq.removeEventListener("change", alCambiar);
    };
  }, []);

  useEffect(() => {
    if (!corriendo) return;
    const t = window.setTimeout(() => {
      setActivo((cur) => MODULOS[(MODULOS.findIndex((x) => x.id === cur) + 1) % MODULOS.length].id);
    }, AUTO_MS);
    return () => window.clearTimeout(t);
  }, [corriendo, activo, ciclo]);

  const elegir = (id: ModuloId) => {
    setAutomatico(false);
    setActivo(id);
  };
  const reanudar = () => {
    setPausa(false);
    setCiclo((c) => c + 1);
  };

  return (
    <div
      ref={ref}
      onFocus={() => setPausa(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && reanudar()}
      className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-10"
    >
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0">
        {MODULOS.map((x) => {
          const on = x.id === activo;
          return (
            <button
              key={x.id}
              type="button"
              aria-pressed={on}
              aria-controls="modulo-detalle"
              onClick={() => elegir(x.id)}
              className={`relative flex min-h-[44px] shrink-0 items-center gap-3 overflow-hidden rounded-[var(--radius)] px-3.5 py-2.5 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77]/60 active:scale-[0.98] ${
                on ? "bg-[#0a0c77] text-white shadow-[0_10px_24px_rgba(10,12,119,0.22)]" : "bg-[#f6f8fc] text-ink hover:bg-[#eef1f8] lg:bg-transparent"
              }`}
            >
              <x.icon size={20} stroke={1.6} className={on ? "text-white" : "text-[#0a0c77]"} aria-hidden />
              <span className="whitespace-nowrap font-display text-[15px] font-semibold lg:whitespace-normal">{x.title}</span>
              {on && corriendo && (
                <span aria-hidden className="absolute inset-x-3 bottom-1 h-0.5 overflow-hidden rounded-full bg-white/15">
                  <span
                    key={`${activo}-${ciclo}`}
                    className="block h-full origin-left rounded-full bg-white/80"
                    style={{ animation: `swc-progreso ${AUTO_MS}ms linear both` }}
                  />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        id="modulo-detalle"
        onPointerEnter={() => setPausa(true)}
        onPointerLeave={reanudar}
        className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-[var(--shadow-lg)] lg:min-h-[32rem]"
      >
        {/* key: al cambiar de módulo el texto y la pantalla entran de nuevo. */}
        <div key={activo} className="border-b border-border p-6 lg:p-8" style={{ animation: "swc-aparecer 320ms cubic-bezier(0.23, 1, 0.32, 1) both" }}>
          <h3 className="font-display text-2xl font-bold tracking-tight text-ink">{m.title}</h3>
          <p className="mt-2 max-w-[58ch] text-base leading-relaxed text-ink-soft">{m.desc}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {m.points.map((p) => (
              <li key={p} className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f3f9] px-3 py-1 text-sm text-ink">
                <CheckCircle2 size={15} className="text-[#0a0c77]" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-1 items-start justify-center bg-[#f6f8fc] p-5 lg:p-8">
          <div className="w-full max-w-[34rem] lg:[zoom:1.2]">
            <ModuloDemo key={activo} modulo={activo} />
          </div>
        </div>
      </div>
    </div>
  );
}
