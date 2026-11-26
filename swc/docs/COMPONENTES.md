# Componentes del proyecto

Inventario de qué componentes existen y qué hace cada uno. (C) = Client Component (`"use client"`), (S) = Server Component.

## `app/`

| Archivo | Tipo | Rol |
|---|---|---|
| `layout.tsx` | S | Raíz HTML. Carga fuentes, `metadata`/`viewport` (SEO), **JSON-LD** (Organization + SoftwareApplication + FAQPage) y **skip-link**. |
| `page.tsx` | S | Compone la página: `Navbar` + `<main id="contenido">` con las 7 secciones + `Footer`. |
| `globals.css` | — | Tailwind v4: tokens en `@theme`, gradientes, keyframes y utilidades de animación (`reveal`, `float`, `glow-pulse`, `live-ping`, etc.). |
| `robots.ts` / `sitemap.ts` | S | Generan `/robots.txt` y `/sitemap.xml`. |
| `api/contact/route.ts` | S | `POST` del formulario. Valida y envía por **nodemailer** si hay SMTP; si no, degrada con `ok:true`. |

## `components/` (raíz)

| Componente | Tipo | Rol |
|---|---|---|
| `Hero.tsx` | S | Portada: `portada.jpg` con `PanelOperativoDemo encender` en la pantalla de la tablet. Móvil: texto arriba y foto recortada a la tablet; desde `lg`: foto de fondo, columna de texto `.portada-columna`. |
| `HeroDolly.tsx` | C | Envuelve la portada: desde `lg` y sin movimiento reducido, la sección mide dos pantallas y al bajar acerca la cámara a la tablet (mueve los hijos `data-dolly`). |
| `Navbar.tsx` | C | Navbar blanco flotante sticky que se compacta al bajar: logo, enlaces, CTA, menú móvil. Foco de teclado, `aria-controls`, cierre con Escape. |
| `hooks.ts` | C | `useReducedMotion`. |

## `components/demo/` — pantallas del sistema redibujadas

| Componente | Tipo | Rol |
|---|---|---|
| `PanelOperativoDemo.tsx` | S | Réplica HTML de «Visión Operativa» (diseño 1280 × 838, escala con `cqw`; estilos en `PanelOperativoDemo.module.css`). `encender` anima el arranque una vez. Datos de `lib/demo.ts`. |
| `EdeDemo.tsx` | S | Expediente Digital del Equipo en SVG para /producto. Datos de `lib/demo.ts`. |

## `components/ui/` — primitivas e iconos

| Componente | Tipo | Rol |
|---|---|---|
| `CTAButton.tsx` | S | Botón/CTA con degradado e icono que se desliza al hover. Variantes primary/cyan/ghost. |
| `TechGrid.tsx` | S | Capa decorativa de cuadrícula técnica (light/dark, opcional animada). |
| `icons.ts` | — | Re-exporta los iconos de **Tabler** con alias estilo lucide (punto único para cambiar de librería). Solo los iconos en uso. |
| `send-animated.tsx` | C | Icono de "enviar" animado (motion) usado en el submit de Contacto. |
| `bell · boxes · chart-line · clipboard-check · clock · file-chart-line · layout-grid · refresh-cw · timer · wrench` | C | Iconos **animados** (motion) usados en las tarjetas/módulos de Servicios (animan al hover). |

## `components/charts/`

| Componente | Tipo | Rol |
|---|---|---|
| `FleetDonut.tsx` | C | Anillo de estado de flota (SVG propio). "En vivo": el `setInterval` se **pausa fuera de viewport**. `role="img"` accesible. |
| `FailureBars.tsx` | C | Barras de fallas por turno (SVG propio), feed que avanza. Pausa fuera de viewport + `role="img"`. |
| `AvailabilityKPI.tsx` | C | KPI de disponibilidad con **count-up** (`requestAnimationFrame`) + sparkline (SVG). Pausa fuera de viewport. |
| `QuienesSomosChart.tsx` | C | Área chart de Quiénes Somos (**ApexCharts**, `dynamic ssr:false`). Respeta reduced-motion. |
| `ServicioModuleChart.tsx` | C | Mini-gráficos por módulo (**ApexCharts**), 10 variantes generadas con un factory `baseOptions/axisOptions/palette`. |

## `components/sections/`

| Sección | Tipo | Rol |
|---|---|---|
| `QuienesSomos.tsx` | C | Texto editorial + gráfico de tendencia. |
| `Servicios.tsx` | C | Los 10 módulos como mapa/panel interactivo (desktop) / acordeón (móvil), con icono animado, detalle y mini-gráfico por módulo. |
| `DashboardInteractivo.tsx` | C | "Centro de control operacional": fila de KPIs, filtros (Rango/Turno), charts en vivo (FleetDonut/FailureBars/AvailabilityKPI) y feed de alertas. |
| `FranjaAzul.tsx` | S | Franja blanca tipográfica "¿Sabías que…?" (dato de alto impacto). |
| `Contacto.tsx` | C | Full-bleed: panel de imagen (trabajador) + formulario premium → `POST /api/contact`, con estados loading/success/error. |
| `FAQ.tsx` | C | Cronograma en 2 columnas: 6 preguntas numeradas con acordeón ("Leer más"). |
| `Footer.tsx` | S | Footer azul oscuro simple: nombre "Sworkc Technologies", enlaces y copyright. |

## Eliminados en la limpieza (2026-06-26)

`components/LiveDashboard.tsx`, `components/ui/Tilt.tsx`, `components/ui/SectionShell.tsx`, `components/ui/SectionHeading.tsx` — eran **código muerto** (0 imports). Ver [MEJORAS-AUDITORIA.md](MEJORAS-AUDITORIA.md).
