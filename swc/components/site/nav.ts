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
      { label: "Visión general", href: "/producto", desc: "El sistema de continuidad operacional, en profundidad" },
      { label: "Módulos operacionales", href: "/producto#modulos", desc: "OT, horas, mantención, turnos, insumos y reportes" },
      { label: "Expediente del equipo (EDE)", href: "/producto#ede", desc: "Historial y KPIs por máquina" },
      { label: "Uso con QR en terreno", href: "/producto#qr", desc: "Registro sin fricción desde el equipo" },
      { label: "Modo offline", href: "/producto#offline", desc: "Funciona sin señal y sincroniza al reconectar" },
      { label: "Multiempresa", href: "/producto#multitenant", desc: "Un espacio propio por operación" },
    ],
  },
  {
    id: "empresa",
    label: "Empresa",
    links: [
      { label: "Nosotros", href: "/nosotros", desc: "Quiénes somos y cómo trabajamos" },
      { label: "Contacto", href: "/#contacto", desc: "Solicita una demostración" },
    ],
  },
  {
    id: "recursos",
    label: "Recursos",
    links: [
      { label: "Guías y recursos", href: "/recursos", desc: "Documentación y material de apoyo" },
      { label: "Preguntas frecuentes", href: "/recursos#faq", desc: "Dudas comunes sobre sworkc" },
      { label: "Novedades", href: "/novedades", desc: "Anuncios y notas del producto" },
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
      { label: "Guías y recursos", href: "/recursos" },
      { label: "Preguntas frecuentes", href: "/recursos#faq" },
      { label: "Novedades", href: "/novedades" },
    ],
  },
];
