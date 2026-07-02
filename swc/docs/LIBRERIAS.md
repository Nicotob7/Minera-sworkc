# Librerías que usa el proyecto

Fuente: `package.json`. Versiones a 2026-06-26.

## Dependencias de producción

| Librería | Versión | Para qué se usa |
|---|---|---|
| **next** | 16.1.1 | Framework (App Router, Turbopack, `next/image`, `next/font`, route handlers, metadata/SEO). |
| **react** / **react-dom** | 19.2.3 | Librería de UI. |
| **@tabler/icons-react** | ^3.44.0 | Set de iconos. Se re-exporta centralizado en `components/ui/icons.ts` (alias estilo lucide). |
| **apexcharts** + **react-apexcharts** | ^5.15.2 / ^2.1.1 | Gráficos de **Quiénes Somos** y **Servicios**. Se cargan con `dynamic(..., { ssr:false })`. |
| **motion** (framer-motion) | ^12.42.0 | Animación de los iconos animados de Servicios (`components/ui/bell.tsx`, `clock.tsx`, etc.) y `send-animated.tsx`. |
| **nodemailer** | ^7.0.12 | Envío de correo del formulario de contacto (`app/api/contact/route.ts`). |

## Dependencias de desarrollo

| Librería | Versión | Para qué |
|---|---|---|
| **tailwindcss** | ^4 | Estilos utility-first. Config vía `@theme` en `app/globals.css` (sin `tailwind.config`). |
| **@tailwindcss/postcss** | ^4 | Plugin PostCSS de Tailwind v4. |
| **typescript** | ^5 | Tipado estático (modo `strict`). |
| **eslint** + **eslint-config-next** | ^9 / 16.1.1 | Linting. |
| **@types/node**, **@types/react**, **@types/react-dom**, **@types/nodemailer** | — | Tipos. |

## Fuentes (Google Fonts vía `next/font`)

| Fuente | Rol |
|---|---|
| **Space Grotesk** | Títulos / display (`font-display`). |
| **Inter** | Cuerpo / UI (`font-sans`). |
| **JetBrains Mono** | Datos, cifras, etiquetas (`font-mono`, `tabular-nums`). |

## Notas

- **No** se usa `lucide-react` (se reemplazó por Tabler vía `icons.ts`).
- ApexCharts es la dependencia más pesada (~587KB); está diferida y solo se monta 1 chart a la vez en Servicios. Ver alternativa (SVG propio) en [AUDITORIA.md](AUDITORIA.md) §6.
- `optimizePackageImports: ["@tabler/icons-react"]` activo en `next.config.ts` para mejorar el tree-shaking de iconos.
