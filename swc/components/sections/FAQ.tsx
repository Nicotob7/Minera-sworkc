"use client";

import { useState } from "react";
import { Plus } from "../ui/icons";

type FaqItem = {
  q: string;
  a: string;
  extra: string;
};

const FAQS: FaqItem[] = [
  {
    q: "¿El sistema sirve para contratistas mineros?",
    a: "Sí. Está pensado para empresas que registran trabajos, controlan equipos y reportan información operacional a sus clientes.",
    extra: "Cada contratista gestiona sus OT, evidencias y reportes, y entrega continuidad clara entre turnos a su mandante.",
  },
  {
    q: "¿Se pueden configurar alertas de mantención?",
    a: "Sí. Según uso, fechas, horas de funcionamiento, criticidad o reglas definidas por la operación.",
    extra: "Las alertas llegan a los responsables para pasar de una gestión reactiva a una preventiva.",
  },
  {
    q: "¿Permite revisar información de turnos anteriores?",
    a: "Sí. Centraliza eventos, pendientes, fallas y trabajos realizados para dar continuidad al turno siguiente.",
    extra: "El relevo deja de depender de conversaciones informales o planillas dispersas.",
  },
  {
    q: "¿Se pueden generar reportes?",
    a: "Sí. Cada OT se descarga en PDF y el reporte de cierre de turno se envía por correo en Excel y PDF, con el estado de la flota, las OTs de la jornada y las fotos de evidencia.",
    extra: "Los indicadores de disponibilidad, MTTR, MTBF y MTBS se consultan en pantalla, por equipo y por período.",
  },
  {
    q: "¿El sistema puede adaptarse a distintos procesos?",
    a: "Sí. Configurable según equipos, roles, flujos de trabajo e indicadores de cada empresa.",
    extra: "Se ajusta a tu operación, no al revés.",
  },
  {
    q: "¿Cómo es la implementación?",
    a: "En etapas: levantamiento de la operación, configuración, capacitación del equipo y puesta en marcha.",
    extra: "Con soporte continuo para que la adopción en terreno sea rápida.",
  },
];

export function FAQ() {
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  const withIndex = FAQS.map((f, i) => ({ ...f, i }));
  const left = withIndex.slice(0, 3);
  const right = withIndex.slice(3);

  return (
    <section id="faq" className="relative bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        {/* Encabezado centrado, normal */}
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-[#0b1020] sm:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-ink-soft">
            Algunas de las consultas más comunes sobre sworkc.
          </p>
        </div>

        {/* Cronograma en 2 columnas — todos los cuadros visibles */}
        <div className="mt-14 grid gap-x-14 gap-y-9 lg:grid-cols-2">
          <Column items={left} openSet={open} onToggle={toggle} />
          <Column items={right} openSet={open} onToggle={toggle} />
        </div>
      </div>
    </section>
  );
}

type Indexed = FaqItem & { i: number };

function Column({
  items,
  openSet,
  onToggle,
}: {
  items: Indexed[];
  openSet: Set<number>;
  onToggle: (i: number) => void;
}) {
  return (
    <div className="space-y-9">
      {items.map((item, idx) => (
        <FaqRow
          key={item.q}
          item={item}
          isLast={idx === items.length - 1}
          open={openSet.has(item.i)}
          onToggle={() => onToggle(item.i)}
        />
      ))}
    </div>
  );
}

function FaqRow({
  item,
  isLast,
  open,
  onToggle,
}: {
  item: Indexed;
  isLast: boolean;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      {/* línea vertical del cronograma (no en el último de la columna) */}
      {!isLast && <span aria-hidden className="absolute left-6 top-0 -bottom-9 w-px bg-black/12" />}

      <div className="relative flex gap-5">
        {/* círculo navy con número en blanco */}
        <span
          className="relative z-10 grid h-12 w-12 shrink-0 place-items-center rounded-full font-mono text-base font-semibold text-white shadow-[var(--shadow-sm)]"
          style={{ background: "#0b1124" }}
        >
          {item.i + 1}
        </span>

        <div className="min-w-0 flex-1 pt-1">
          <h3 className="font-display text-base font-bold tracking-tight text-[#0b1020] sm:text-[17px]">
            {item.q}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.a}</p>

          {/* detalle expandible */}
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
          >
            <div className="overflow-hidden">
              <p className="pt-2 text-sm leading-relaxed text-ink-soft">{item.extra}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggle}
            aria-expanded={open}
            aria-label={`${open ? "Leer menos" : "Leer más"}: ${item.q}`}
            className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 rounded py-2 text-xs font-bold text-[#0a0c77] transition-colors hover:text-[#1c239e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77]/30"
          >
            {open ? "Leer menos" : "Leer más"}
            <Plus size={13} className={`transition-transform duration-300 ${open ? "rotate-45" : ""}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
