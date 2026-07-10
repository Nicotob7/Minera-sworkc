# Mejoras aplicadas (auditoría) — 2026-06-26

Implementación de las correcciones de la [AUDITORIA.md](AUDITORIA.md), **sin cambiar el diseño** (solo correcciones técnicas). Validado con `next build` (verde) y verificación de que los tokens eliminados no se usaban en código (sin regresión visual).

## 1. SEO + accesibilidad de entrada

- **Metadata completa** en `app/layout.tsx`: `metadataBase`, `title` con `template`, `keywords`, **OpenGraph**, **Twitter Card**, `icons`, `robots`, `alternates.canonical`. `themeColor` movido a `export const viewport` (en Next 16 va ahí).
- **JSON-LD** (`<script application/ld+json>`): `Organization` + `SoftwareApplication` + `FAQPage` (las 6 preguntas).
- **`app/robots.ts`** → `/robots.txt` y **`app/sitemap.ts`** → `/sitemap.xml` (rutas confirmadas en el build).
- **Skip-link** "Saltar al contenido" (sr-only) + `id="contenido"` en `<main>`.
- `SITE_URL = https://www.sworkc.cl` es **placeholder** (actualizar en `layout.tsx`, `robots.ts`, `sitemap.ts` al confirmar dominio).

## 2. Charts: accesibilidad + performance

- Nuevo hook **`useInViewport`** en `components/hooks.ts`.
- **Pausa de timers fuera de pantalla:** `FleetDonut`, `FailureBars` y `AvailabilityKPI` solo corren su `setInterval` cuando están **en viewport** y la pestaña visible (`visibilitychange`). Elimina el goteo de CPU/batería en reposo.
- **Alternativa textual:** `role="img"` + `aria-label` con el dato resumido en los 3 charts SVG y en los 2 ApexCharts (SVG decorativo marcado `aria-hidden` donde corresponde).
- **`QuienesSomosChart`** ahora respeta `prefers-reduced-motion` (animaciones off cuando se pide menos movimiento).

## 3. Navbar + Contacto + Footer

- **Navbar:** foco de teclado visible en enlaces y CTA; `aria-controls`/`id` en el menú móvil; **cierre con Escape** (y al hacer scroll).
- **Contacto:** inputs/textarea a **16px** (`text-base`) → evita el zoom automático de iOS; `handleSubmit` ahora **lee el body JSON** y valida `json?.ok` (no muestra éxito falso); **`role="status" aria-live`** en el estado de éxito.
- **Contacto anti-spam:** teléfono chileno `+569XXXXXXXX`, límites de contenido, honeypot invisible y rate limit por IP (5 mensajes cada 10 minutos). Pendiente ideal a futuro: CAPTCHA/Cloudflare Turnstile o rate limit persistente con Redis/Upstash.
- **Footer:** foco de teclado más claro en los enlaces.

## 4. Secciones: contraste y targets táctiles

- **Dashboard** (fondo gris `#505861`): textos secundarios `text-white/55-/75` → **`text-white/85`** (AA); chips de filtro a **`min-h-[44px]`**.
- **FAQ:** subtítulo y respuestas `#0b1020/55-60` → **`text-ink-soft`** (#384256, AA); botón "Leer más" a `min-h-[44px]`.
- **Servicios:** botón del acordeón móvil a `min-h-[44px]`.
- **Quiénes Somos:** eliminado el bloque comentado de `CTAButton` (código muerto).

## 5. Limpieza + configuración

- **Borrados (código muerto, 0 imports):** `components/LiveDashboard.tsx`, `ui/Tilt.tsx`, `ui/SectionShell.tsx`, `ui/SectionHeading.tsx`.
- **Borradas (imágenes sin usar):** `public/hero/fondo.png`, `public/hero/hero.png` (~2.2MB c/u), `public/logo-swc-full.jpeg`. *(Se conserva `final.png` y `logo-swc.png`.)*
- **`globals.css`:** quitado `@custom-variant dark`, el `will-change` persistente de `.reveal`, y los **tokens de modo oscuro sin uso** (`--color-dark`, `--color-dark-2`, `--color-on-dark`, `--color-on-dark-muted`, `--gradient-dark`, `.glass-dark`). Conservado `.tech-grid-dark` (lo usa `TechGrid`).
- **`next.config.ts`:** `images.formats: ["image/avif","image/webp"]` + `experimental.optimizePackageImports: ["@tabler/icons-react"]`.
- **`icons.ts`:** podados **32 alias de iconos sin uso** (incl. `Sun`/`Moon`, restos del modo oscuro); conservados los 21 en uso.

---

## Pendientes (no aplicados — requieren decisión o cambian la experiencia)

Estos quedaron documentados en [AUDITORIA.md](AUDITORIA.md) para una fase posterior:

- **Imagen del hero a WebP/AVIF** (`final.png` ~2.28MB → <300KB a ~1920px). *Requiere reexportar el asset.*
- **Refactor masivo hex → tokens** (~43 hex repetidos). *Se omitió para no arriesgar cambios de color; algunos hex divergen del token.*
- **Animaciones premium** (usar `Reveal` en el cuerpo, `useCountUp` en cifras, stagger en Servicios/feed, subrayado de la franja). *Cambian la experiencia; se dejaron como opción.*
- **Evaluar reemplazar ApexCharts por SVG** (quitar ~587KB del bundle).
- **FAQ con `details/summary` nativo** y **iconos animados con CSS** (quitar `motion` del bundle).
- **Secciones extra de conversión:** prueba social, beneficios con métricas, "cómo funciona" (flujo), CTA final.
- **Datos reales:** dominio, correo, teléfono, LinkedIn, SMTP.
