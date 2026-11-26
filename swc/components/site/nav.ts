/**
 * Estructura de navegación del sitio (fuente única para Navbar y Footer).
 * Los enlaces a secciones del home usan la forma "/#ancla" para que funcionen
 * desde cualquier página del sitio multipágina, no solo desde el home.
 */

export type NavLink = { label: string; href: string; desc?: string };

export type NavGroup = {
  id: string;
  label: string;
  /** Panel ancho (mega-menú de 2 columnas) para grupos con más ítems. */
  wide?: boolean;
  links: NavLink[];
};

/** Ítems planos del navbar (sin desplegable), a los costados de los grupos. */
export const NAV_INICIO: NavLink = { label: "Inicio", href: "/" };
export const NAV_CONTACTO: NavLink = { label: "Contacto", href: "/#contacto" };

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "producto",
    label: "Producto",
    wide: true,
    links: [
      // Un ítem por sección de /producto (antes QR, offline y multiempresa llevaban a la misma).
      { label: "Visión general", href: "/producto", desc: "El sistema de continuidad operacional, en profundidad" },
      { label: "Módulos operacionales", href: "/producto#modulos", desc: "OT, horas, mantención, turnos, materiales y reportes" },
      { label: "Panel operacional", href: "/producto#panel", desc: "Flota, estados y OTs prioritarias en una vista" },
      { label: "Expediente del equipo (EDE)", href: "/producto#ede", desc: "Historial y KPIs por máquina" },
      { label: "Uso en terreno", href: "/producto#terreno", desc: "QR en el equipo, sin señal y un espacio por empresa" },
    ],
  },
  {
    id: "empresa",
    label: "Empresa",
    links: [
      { label: "Nosotros", href: "/nosotros", desc: "Quiénes somos y por qué existe sworkc" },
      { label: "Implementación por etapas", href: "/nosotros#implementacion", desc: "Levantamiento, configuración, capacitación y puesta en marcha" },
      { label: "Contacto", href: "/#contacto", desc: "Solicita una demostración" },
    ],
  },
  {
    id: "recursos",
    label: "Recursos",
    links: [
      { label: "Así funciona sworkc", href: "/recursos#video", desc: "Video de 1:55 con la plataforma en uso" },
      { label: "Preguntas frecuentes", href: "/recursos#faq", desc: "Dudas comunes sobre sworkc" },
    ],
  },
];

/** Enlaces principales para el pie de página (planos, por columnas). */
export const FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  {
    title: "Producto",
    links: [
      { label: "Visión general", href: "/producto" },
      { label: "Módulos", href: "/producto#modulos" },
      { label: "Expediente del equipo", href: "/producto#ede" },
      { label: "Uso en terreno", href: "/producto#terreno" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { label: "Nosotros", href: "/nosotros" },
      { label: "Contacto", href: "/#contacto" },
    ],
  },
  {
    title: "Recursos",
    links: [
      { label: "Así funciona sworkc", href: "/recursos#video" },
      { label: "Preguntas frecuentes", href: "/recursos#faq" },
    ],
  },
];
