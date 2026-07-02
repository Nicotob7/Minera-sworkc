# Auditoría de código y diseño — SWC / Sworkc Technologies

> **Fecha:** 2026-06-26 · **Alcance:** revisión **solo lectura** (no se modificó ningún archivo de código).
> **Método:** auditoría multiagente en paralelo, 8 dimensiones, leyendo archivo por archivo.
> **Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · ApexCharts · iconos Tabler.

Este documento recopila **fortalezas, hallazgos (por severidad), quick wins y oportunidades** (animación, performance, accesibilidad, móvil, SEO y secciones extra). Es una guía de mejora; **no se aplicó ningún cambio**.

---

## 1. Resumen ejecutivo

**Veredicto general:** la base es **sólida y madura** para una landing de una página. Buena separación server/client, carga diferida de ApexCharts, `prefers-reduced-motion` bien cableado (CSS + JS), tipado estricto, datos data-driven y accesibilidad considerada a nivel de estructura. **No hay crashes ni bugs que rompan el render.**

Los temas a mejorar son, sobre todo, de **higiene, performance en móvil, accesibilidad de datos y SEO**:

| Tema crítico | Impacto |
|---|---|
| Hex crudos repetidos (~43x) en vez de tokens del @theme | Mantenibilidad / consistencia de marca |
| Código muerto / componentes huérfanos (LiveDashboard, Tilt, SectionShell, SectionHeading) | Higiene / confusión |
| Charts con `setInterval` permanente, incluso fuera de viewport | **CPU/batería en móvil** |
| Imágenes hero PNG ~2.2MB (2 de 3 sin usar) | **LCP / peso de deploy** |
| Gráficos sin alternativa textual (`role="img"`/`aria-label`) | **Accesibilidad (datos invisibles a lectores)** |
| Contraste de texto blanco a baja opacidad sobre grises medios | **Accesibilidad (WCAG AA)** |
| Inputs a 14px → zoom automático en iOS | **UX móvil del formulario** |
| El sistema `Reveal` (scroll) existe pero **no se usa en el cuerpo** | Sensación "plana" / desaprovecha lo ya construido |
| Metadata pobre, sin OpenGraph/robots/sitemap/JSON-LD | **SEO / compartir en redes** |

**Conteo aproximado de hallazgos:** 🔴 ~10 altos · 🟡 ~26 medios · 🟢 ~27 menores.

---

## 2. ✅ Fortalezas (lo que está bien)

- **Composición raíz clara:** `app/page.tsx` lee como un índice (Navbar → secciones → Footer), orden narrativo coherente.
- **Separación server/client correcta:** Hero, QuienesSomos, FranjaAzul y Footer son Server Components; `"use client"` solo donde hay estado/eventos.
- **ApexCharts con `dynamic(..., { ssr:false })`** → no entra al bundle inicial ni al SSR. Solo **1 chart vivo a la vez** en Servicios.
- **Dashboard sin librería de charts:** sparkline/donut/barras son SVG manual ligero.
- **`prefers-reduced-motion` ejemplar:** regla global en `globals.css` + hook `useReducedMotion` consumido por Typewriter y los 4 charts (los `setInterval` se desactivan).
- **Tipado estricto** (`strict: true`) con tipos claros (Module, Kpi, AlertItem, FormData…).
- **Hooks bien encapsulados** (`useInterval` evita stale closures y limpia; `useReducedMotion` evita mismatch de hidratación).
- **Endpoint `/api/contact` robusto:** `try/catch`, validación de campos, `req.json().catch()`, degradación elegante sin SMTP.
- **A11y de base:** `html lang="es"`, **un único h1**, jerarquía de h2 por sección, `aria-expanded/controls/pressed`, `aria-labelledby`, decorativos con `aria-hidden`, foco visible en muchos controles, zoom de usuario permitido.
- **Fuentes Google con `display:swap`** y subsets acotados; `Typewriter reserve` evita CLS del H1; count-up del KPI con `requestAnimationFrame`.
- **Microinteracciones de buen gusto:** subrayado del navbar, brillo del CTA, icono de envío animado, hover de nodos.
- **Limpieza del modo oscuro casi completa:** `grep dark:` en componentes = **0** ocurrencias (solo quedan restos inertes en `globals.css`).

---

## 3. 🔴 Hallazgos críticos (alta prioridad)

### 3.1 [Duplicación] Hex crudos repetidos en vez de tokens del `@theme`
- **Archivos:** Contacto.tsx, DashboardInteractivo.tsx, FAQ.tsx, FranjaAzul.tsx, Navbar.tsx, Servicios.tsx
- **Detalle:** los mismos colores literales se repiten **~43 veces en 8 archivos** pese a existir tokens equivalentes. Ej.: `#0a0c77` (= `--color-brand-900`), `#0b1020` (= `--color-ink`), `#00a6d6` (= `--color-cyan-500`), `#5b6680` (= `--color-muted-foreground`). El propio `design-system/MASTER.md:179` dice *"nunca hex crudo en componentes"*. Algunos hex incluso **divergen** del token (`#070b1c` vs `--color-dark #070a1f`; `#3a4256` vs `--color-ink-soft #384256`).
- **Recomendación:** sustituir por utilidades de token (`text-brand-900`, `text-ink`, `text-cyan-500`, `border-border`) o `var(--…)`. Empezar por los más repetidos (`#0a0c77`, `#0b1020`).

### 3.2 [Arquitectura/Duplicación/Bugs/Perf] Componentes huérfanos (código muerto)
- **Archivos:** `components/LiveDashboard.tsx`, `components/ui/Tilt.tsx`, `components/ui/SectionShell.tsx`, `components/ui/SectionHeading.tsx`
- **Detalle:** ninguno se importa (grep en todo `swc/` = solo su definición). `LiveDashboard` además **duplica** la lógica de agrupar los 3 charts del Dashboard (y montaría 3 `setInterval` extra si se reactivara). Las secciones reimplementan sus encabezados a mano en lugar de usar `SectionHeading`.
- **Recomendación:** decidir **borrar** (LiveDashboard, Tilt) o **adoptar** (SectionHeading/SectionShell en las secciones). Hoy conviven "encabezados duplicados a mano" + "componente de encabezado sin usar" = lo peor de ambos mundos.

### 3.3 [Performance] Charts con `setInterval` permanente, incluso fuera de viewport
- **Archivos:** `charts/AvailabilityKPI.tsx:35-45`, `FailureBars.tsx:13-23`, `FleetDonut.tsx:19-34`
- **Detalle:** 3 timers (3000/2600/3200 ms) hacen `setState` indefinidamente desde el primer render, **aunque el usuario nunca llegue al Dashboard**. En móvil = goteo continuo de re-renders + repaints (height, stroke-dasharray, path) → CPU/batería.
- **Recomendación:** pausar con un `useInViewport` (reutilizar el `IntersectionObserver` de `Reveal.tsx`) y/o `document.hidden` (`visibilitychange`): pasar `delay=null` a `useInterval` cuando no es visible.

### 3.4 [Performance] Imágenes hero PNG ~2.2MB (2 de 3 sin usar)
- **Archivos:** `public/hero/final.png` (2.28MB, usada), `fondo.png` (2.27MB, **sin usar**), `hero.png` (2.17MB, **sin usar**); `logo-swc-full.jpeg` (59KB, sin usar)
- **Detalle:** partir de un PNG de 2.28MB obliga al optimizador de Next a procesar un origen enorme y deja un fallback pesado.
- **Recomendación:** (1) borrar `fondo.png`, `hero.png`, `logo-swc-full.jpeg`; (2) re-exportar `final.png` a **WebP/AVIF ~1920px** (de 2.28MB a <300KB); (3) forzar formato AVIF en el LCP (ver 6.2).

### 3.5 [Accesibilidad] Gráficos sin alternativa textual
- **Archivos:** `charts/ServicioModuleChart.tsx`, `FleetDonut.tsx`, `FailureBars.tsx`, `AvailabilityKPI.tsx`, `QuienesSomosChart.tsx`
- **Detalle:** ningún gráfico (ApexCharts ni SVG manual) expone su dato en texto ni tiene `role="img"`/`aria-label`. Gran parte del valor del "centro de control" es **invisible** para lectores de pantalla. **Incumple WCAG 1.1.1.**
- **Recomendación:** `role="img"` + `aria-label` con el dato resumido (ej. `aria-label={`Disponibilidad ${pct}%`}`); en FleetDonut marcar el SVG `aria-hidden` y dejar la leyenda `<ul>` como fuente accesible; en ApexCharts, contenedor con `role="img" aria-label` o una tabla `sr-only`.

### 3.6 [Accesibilidad] Contraste insuficiente: texto blanco a baja opacidad sobre grises medios
- **Archivos:** DashboardInteractivo.tsx (fondo `#505861`), QuienesSomos.tsx (fondo `#56616b`)
- **Detalle:** `text-white/55` (~2.5:1) y `/72-/75` (~3.8:1) sobre `#505861` **no alcanzan 4.5:1** (texto que porta información, ej. "sworkc control · faena norte", etiquetas de filtro). **Incumple WCAG 1.4.3.**
- **Recomendación:** mínimo `text-white/85` para texto normal y `text-white` para etiquetas pequeñas, o oscurecer el fondo gris (~`#3b434c`).

### 3.7 [Móvil] Inputs a 14px → zoom automático en iOS
- **Archivo:** `Contacto.tsx:300, 332`
- **Detalle:** inputs/textarea con `text-sm` (14px); iOS hace **zoom al enfocar** campos <16px, justo en el formulario de conversión.
- **Recomendación:** `text-base` (16px) en móvil para inputs y textarea.

### 3.8 [Animación] El sistema `Reveal` (scroll) existe pero **no se usa en el cuerpo**
- **Archivos:** `page.tsx`, `Reveal.tsx`, todas las secciones
- **Detalle:** `Reveal` solo se importa en `Footer` (y `SectionHeading`, que ninguna sección usa). Títulos, párrafos, KPIs, FAQ y la franja **aparecen de golpe** al hacer scroll → la página se siente plana pese a tener toda la maquinaria.
- **Recomendación:** envolver con `Reveal` los bloques de cada sección (título `up`, subtítulo `up delay=80`, visual lateral `left/right`). Coste cero en dependencias; reduced-motion ya cubierto.

### 3.9 [Animación] Cifras estáticas que piden count-up
- **Archivos:** `QuienesSomosChart.tsx` (98%/76%/24-7), `DashboardInteractivo.tsx` (4 KPIs)
- **Detalle:** ya existe el patrón perfecto (count-up `rAF` + easeOutCubic) en `AvailabilityKPI.tsx` pero no se reutiliza.
- **Recomendación:** extraer `useCountUp(target,{duration,decimals})` y aplicarlo a las cifras de Quiénes Somos (al entrar en viewport) y a los KPIs del dashboard (animar valor anterior→nuevo al filtrar). Respetar reduced-motion saltando al valor final.

### 3.10 [SEO] Metadata pobre, sin OpenGraph / robots / sitemap / datos estructurados
- **Archivo:** `app/layout.tsx` + bloque FAQ
- **Detalle:** solo `title`/`description`. Faltan: OpenGraph, Twitter Card, `metadataBase`, `icons`, `robots`, canónica, `theme-color`; no hay `robots.txt` ni `sitemap`; **no hay JSON-LD** pese a que el FAQ es ideal.
- **Recomendación:** completar `metadata`, crear `robots.ts`/`sitemap.ts`, e inyectar JSON-LD de **FAQPage**, **Organization** y **SoftwareApplication**.

---

## 4. 🟡 Hallazgos medios (por dimensión)

**Arquitectura**
- Encabezados de sección **duplicados** (FAQ/Servicios/Dashboard) en lugar de un `SectionHeading` compartido.

**Duplicación**
- **Boilerplate idéntico** en 10 iconos animados (`bell/clock/boxes/…`): mismo andamiaje `forwardRef + useImperativeHandle + handleMouseEnter/Leave` (~50 líneas ×10). → extraer `createAnimatedIcon()`.
- **`QuienesSomosChart` duplica** la config de ApexCharts en vez de reutilizar `baseOptions/axisOptions/palette` de `ServicioModuleChart` (y con hex crudos).
- **Mitad de los alias de `ui/icons.ts` son exports muertos** (incl. `Sun`/`Moon`, restos del modo oscuro).
- **Estilos de input/textarea duplicados literalmente** en `Contacto.tsx` (CampoInput vs CampoMensaje). → extraer `INPUT_CLASS`/sub-componente `Field`.

**Bugs**
- **Éxito del formulario sin `aria-live`:** el error sí se anuncia, el éxito no (`ExitoEstado`). → `role="status" aria-live="polite"` o mover foco al encabezado.
- **El cliente ignora el body JSON de `/api/contact`:** solo evalúa `res.ok`; un `200 {ok:false}` (o `delivered:false` sin SMTP) se mostraría como **éxito falso**. → leer `res.json()` y validar `json?.ok`.
- **Salto de layout en Servicios:** `useIsDesktop` renderiza la vista móvil en SSR; en desktop hay **flash/reflow** tras hidratar. → renderizar ambas variantes con `hidden lg:grid` / `lg:hidden`.

**Accesibilidad**
- Grises claros sobre blanco bajo AA: `text-[#0b1020]/55` y `/60` en FAQ (~4.0-4.3:1); placeholders `#8793a8` (~2.8:1). → usar `--color-ink-soft #384256`.
- **Falta skip-link** ("Saltar al contenido"). → `<a sr-only focus:not-sr-only>` + `id` en `<main>`.
- **`QuienesSomosChart` no respeta reduced-motion** (`animations.enabled:true` estático). → `useMemo` + `useReducedMotion`.
- **Targets táctiles <44px:** "Leer más" del FAQ, chips de filtro (38px), enlaces del menú desktop (py-2).

**Performance**
- `next.config.ts` **vacío:** sin `images.formats:["image/avif","image/webp"]` ni `optimizePackageImports:["@tabler/icons-react"]`.
- **ApexCharts (~587KB min)** para charts decorativos que el Dashboard ya logra con SVG manual. → evaluar reemplazar por SVG o librería liviana.
- **Restos del modo oscuro** (`@custom-variant dark` + tokens `--color-*dark` inertes) inflan el CSS.
- **Exceso de client components** (25 `"use client"`); FAQ podría ser `details/summary` nativo (cero JS).

**Móvil**
- `overflow-x-hidden` global **enmascara** posible desborde de los decorativos de Servicios (offsets negativos). → confinar overflow a la sección y validar en 360-390px.
- Targets táctiles <44px (chips, "Leer más", acordeón Servicios `p-3`).
- Imagen de Contacto con **margen negativo** en móvil (puede cortarse en 360-390px). → margen 0 en base, negativo solo desde `sm`.

**Animaciones**
- **FranjaAzul "¿Sabías que…?" 100% estática** (momento de alto impacto). → `Reveal` + subrayado que se dibuja (scaleX 0→1).
- **Servicios sin stagger** y cambio de detalle abrupto (fade de 0.18s). → `Reveal delay=i*60` + crossfade al cambiar módulo.
- **Feed de alertas se reemplaza de golpe** al cambiar de turno. → stagger de filas (`key=shift`).
- **Sparkline no se dibuja:** el keyframe `swc-dash` está definido pero **sin uso**. → animar `stroke-dashoffset`.

---

## 5. 🟢 Hallazgos menores (resumen)

- **Arquitectura:** alias `@/*` configurado pero **nunca usado** (todo relativo `../../`); `hooks.ts` y `Typewriter.tsx` sueltos en `components/` raíz (mezcla de niveles); **naming mixto** español/inglés; `useIsDesktop` local en Servicios podría compartirse; `next.config.ts` vacío.
- **Duplicación:** listas de navegación duplicadas (Navbar `LINKS` vs Footer `NAV_LINKS`, desincronizables); `CARD_BASE`/`LIGHT_CARD_VARS` con hex que **divergen** del `@theme`; `--color-band-gray` y `--color-band-gray-2` idénticos (redundantes).
- **Bugs:** keys por índice en `FailureBars`/`FleetDonut` (frágil al desplazar el feed); race condition latente count-up vs interval en `AvailabilityKPI`; `Tilt` sin cleanup del transform; listener de scroll del Navbar sin throttle; **menú móvil no se cierra con Escape ni al hacer scroll**.
- **Accesibilidad:** enlaces del menú sin `focus-visible` claro; toggle hamburguesa sin `aria-controls` (panel sin `id`); cambios "en vivo" no anunciados (marcar charts decorativos `aria-hidden`).
- **Performance:** `motion/react` en 11 iconos solo para hover (que en móvil ni se dispara) → CSS puro; `will-change` persistente en `.reveal` (capas de composición vivas); animaciones decorativas en loop infinito (`live-ping`, `glow-pulse`, `kenburns`) → pausar fuera de viewport / `content-visibility:auto`.
- **Móvil:** `object-[center_42%]` del Hero puede recortar la tablet en móvil; feed de alertas de 6 columnas se aprieta en tablets (640-768px).
- **Animaciones:** Hero sin parallax; `tech-grid-animated` definido pero sin uso en Servicios; círculos del FAQ sin feedback de hover/apertura; tarjetas de Contacto y enlaces del Footer sin micro-elevación.

---

## 6. ⚡ Performance — plan priorizado

1. **Imágenes (alto impacto LCP móvil):** borrar `fondo.png`/`hero.png`/`logo-swc-full.jpeg`; re-exportar `final.png` a WebP/AVIF ~1920px (<300KB).
2. **`next.config.ts`:** `images.formats:["image/avif","image/webp"]` + `experimental.optimizePackageImports:["@tabler/icons-react"]`. *(Revisar antes los docs de Next 16 — `AGENTS.md` lo advierte.)*
3. **Pausar los `setInterval` de los charts fuera de viewport / `document.hidden`** (reutilizar el IO de `Reveal`).
4. **Evaluar quitar ApexCharts** (≈587KB) reemplazando por SVG manual; al menos, placeholder con altura fija para evitar CLS.
5. **Iconos:** reemplazar `motion/react` por CSS (hover no aplica en móvil) → saca `motion` del bundle.
6. **CSS:** quitar `@custom-variant dark` + utilidades/tokens dark inertes; quitar/limitar `will-change` de `.reveal`.
7. **Client components:** convertir FAQ a `details/summary` nativo; auditar cada `"use client"`.

---

## 7. ♿ Accesibilidad — plan priorizado

1. `role="img"` + `aria-label` (o `sr-only`) en **todos los gráficos** (3.5).
2. Subir contraste de textos blancos sobre `#505861`/`#56616b` y grises claros del FAQ (3.6 / 4).
3. **Skip-link** + `id` en `<main>`.
4. `QuienesSomosChart` → respetar `reduced-motion`.
5. Targets táctiles ≥44px (FAQ, chips, menú).
6. `focus-visible` consistente en enlaces del menú; `aria-controls` en hamburguesa.
7. `role="status" aria-live` en el éxito del formulario.

---

## 8. 📱 Móvil — plan priorizado

1. Inputs/textarea de Contacto a **16px** (evita zoom iOS).
2. Targets ≥44px (chips, "Leer más", acordeón Servicios).
3. Validar sin `overflow-x-hidden` global y confinar overflow por sección (360-390px).
4. Imagen de Contacto: margen 0 en base, negativo solo desde `sm`.
5. Revisar encuadre del Hero por breakpoint y feed de alertas en tablets.

---

## 9. ✨ Oportunidades de animación (priorizadas)

> El sistema (`Reveal`, keyframes, `useReducedMotion`) ya existe; falta **conectarlo al cuerpo**.

1. **`Reveal` en todas las secciones** (títulos `up`, subtítulos `up delay=80`, visuales `left/right`). — *mayor impacto/esfuerzo.*
2. **`useCountUp`** en las cifras de Quiénes Somos y en los 4 KPIs del Dashboard.
3. **FranjaAzul:** `Reveal` + subrayado que se dibuja (scaleX 0→1, origin left).
4. **Servicios:** stagger lateral de los 10 nodos (`delay=i*60`) + crossfade al cambiar módulo; activar `tech-grid-animated`.
5. **Feed de alertas:** stagger de filas al cambiar de turno (`key=shift`).
6. **Sparkline:** dibujar la línea con `swc-dash` (ya definido).
7. **Nice-to-have:** parallax sutil del Hero; hover premium en círculos del FAQ, tarjetas de Contacto y enlaces del Footer.

*(Todo sin nuevas dependencias y respetando reduced-motion.)*

---

## 10. 🔎 SEO y metadata

- Completar `metadata` en `layout.tsx`: `metadataBase`, `openGraph`, `twitter`, `icons`, `robots`, `alternates.canonical`, `themeColor`.
- Crear `app/robots.ts` y `app/sitemap.ts`.
- Inyectar **JSON-LD**: `FAQPage` (el FAQ ya tiene el contenido), `Organization` (Sworkc Technologies) y `SoftwareApplication` (sworkc control).
- Imagen OG dedicada (1200×630).

---

## 11. ➕ Secciones extra sugeridas (para una landing "más completa")

Según el patrón de landing minera B2B y el contenido de `design-system/MASTER.md`, faltan bloques de conversión:

1. **Prueba social / confianza** — logos de clientes/contratistas, o "Para empresas mineras y contratistas" con sellos de seguridad/continuidad. *(Hoy no hay prueba social above-the-fold.)*
2. **Beneficios con métricas / resultados** — tarjetas con cifras de impacto (menos tiempos muertos, más trazabilidad), idealmente con **count-up**.
3. **Cómo funciona (flujo paso a paso)** — "Terreno → Registro → Alerta → Decisión" como timeline horizontal animado.
4. **Casos de uso por rol/rubro** — supervisión, mantenimiento, planificación, gerencia.
5. **Implementación** — etapas (levantamiento → configuración → capacitación → puesta en marcha → soporte) — ya está en el contenido del MASTER.
6. **Integraciones / telemetría** — con qué se conecta sworkc control.
7. **CTA final fuerte** — un cierre con llamada a la acción antes del footer (hoy se pasa del FAQ directo al footer).

---

## 12. ✅ Quick wins priorizados (consolidados)

**Alto impacto / bajo esfuerzo:**
1. Borrar imágenes sin usar (`fondo.png`, `hero.png`, `logo-swc-full.jpeg`) — ~6.5MB menos.
2. Borrar componentes muertos (`LiveDashboard.tsx`, `Tilt.tsx`; decidir `SectionShell`/`SectionHeading`).
3. Inputs de Contacto a 16px (zoom iOS).
4. `role="img"`+`aria-label` en los charts (gran ganancia a11y, coste mínimo).
5. Envolver títulos/subtítulos en `Reveal` (activa lo ya construido).
6. `next.config.ts`: formatos AVIF/WebP + `optimizePackageImports`.
7. Pausar los `setInterval` de charts fuera de viewport.

**Limpieza:**
8. Quitar alias `Sun`/`Moon` y demás iconos muertos de `ui/icons.ts`.
9. Colapsar `--color-band-gray`/`--color-band-gray-2`; quitar `@custom-variant dark` + tokens dark inertes.
10. Borrar el bloque comentado de `CTAButton` en `QuienesSomos.tsx` (deja un import sin uso → lint).
11. Centralizar enlaces de navegación (Navbar/Footer) en un módulo único.
12. Extraer `INPUT_CLASS`/`Field` en Contacto.

**Correctitud / a11y:**
13. `role="status" aria-live` en el éxito del formulario; leer `res.json()` en el submit.
14. Skip-link + `id` en `<main>`; `aria-controls` en hamburguesa; cerrar menú móvil con Escape.
15. Subir contrastes (blanco/55-75 sobre grises; grises claros del FAQ); targets ≥44px.

---

## 13. 🗺️ Plan de acción sugerido (por fases)

- **Fase 1 — Limpieza (bajo riesgo):** borrar muertos (imágenes + componentes huérfanos + iconos/tokens dark), centralizar nav, extraer INPUT_CLASS, hex→tokens de los 2 más repetidos.
- **Fase 2 — Performance:** imágenes WebP/AVIF + `next.config`, pausar timers fuera de viewport, quitar `motion/react` de iconos, evaluar ApexCharts.
- **Fase 3 — Accesibilidad:** alt textual de charts, contrastes, skip-link, focus-visible, targets, reduced-motion del QuienesSomosChart, aria del formulario.
- **Fase 4 — Móvil:** inputs 16px, targets, overflow por sección, imagen de Contacto.
- **Fase 5 — Animación premium:** `Reveal` en el cuerpo, `useCountUp`, subrayado de la franja, stagger de Servicios/feed, sparkline `dash`.
- **Fase 6 — SEO + secciones extra:** metadata + robots + sitemap + JSON-LD; agregar prueba social, beneficios con métricas, "cómo funciona" y CTA final.

---

*Reporte generado por auditoría multiagente (8 dimensiones · solo lectura). No se modificó código.*
