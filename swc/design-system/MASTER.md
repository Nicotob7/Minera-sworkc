# Sistema de Diseño — SWC / Sworkc Technologies

> **Fuente de verdad global.** Toda página del sitio hereda de este archivo. Las
> excepciones por página se documentan en `design-system/pages/<pagina>.md` y
> sobrescriben lo de aquí.
>
> Generado a partir de las skills `ui-ux-pro-max` (`--design-system`), `brand`,
> `design-system` e `impeccable`, y anclado al **logo oficial** (índigo `#030677`).

---

## 1. Marca

| Dato | Valor |
|------|-------|
| Empresa | **Sworkc Technologies** |
| Marca / logotipo | **SWC** — System Workcont Technologies |
| Producto | **sworkc control** — plataforma de continuidad operacional y mantenimiento minero |
| Rubro | Informática industrial · Minería · SaaS B2B |
| Color de marca (logo) | **`#030677`** (índigo profundo, medido del logo) |
| Activos | `public/logo-swc.png` (logotipo+marca), `public/logo-swc-full.jpeg` |

**Personalidad:** técnica, confiable, precisa, "de terreno". Robusta pero
moderna. Nada decorativo de más: cada elemento comunica control y claridad.

**Tono visual objetivo:** *agencia* — elegante, llamativa, rápida y responsiva,
sin perder la seriedad de un producto industrial crítico.

---

## 2. Patrón de página (skill: `ui-ux-pro-max`)

**Real-Time / Operations Landing** — el patrón recomendado para productos de
operaciones/IoT/seguridad.

Secciones base del Home:
1. **Hero** — propuesta + vista previa/estado en vivo del producto.
2. **Métricas / indicadores clave** (equipos operativos, HH, fallas, mantenciones).
3. **Cómo funciona** (flujo OT → registro → alerta → decisión).
4. **CTA** (Solicitar demostración / Hablar con un especialista).

CTA primario en el nav **y** después del bloque de métricas. Señales de
confianza (rubro minero, trazabilidad) visibles.

---

## 3. Paleta de colores

Anclada en el índigo del logo (`#030677` = `brand-900`). Construida como escala
tonal + acento eléctrico + neutros fríos + estados semánticos operacionales.

### 3.1 Marca — Índigo (escala)

| Token | Hex | Uso |
|-------|-----|-----|
| `brand-50`  | `#EEF0FD` | Fondos teñidos muy suaves, hovers claros |
| `brand-100` | `#DEE1FB` | Chips, badges suaves |
| `brand-200` | `#BAC0F7` | Bordes de marca, estados |
| `brand-300` | `#8F99F0` | Detalles, iconografía secundaria |
| `brand-400` | `#6571E8` | Acento claro sobre fondo oscuro |
| `brand-500` | `#3F4DDD` | Índigo vibrante, links, énfasis |
| `brand-600` | `#2A36C9` | Interacción / hover de marca |
| `brand-700` | `#1A23AE` | Gradientes intermedios |
| `brand-800` | `#0A1190` | Gradientes profundos |
| **`brand-900`** | **`#030677`** | **Color de marca (logo).** Nav, títulos, secciones oscuras |
| `brand-950` | `#02043A` | Tinta índigo más profunda |

### 3.2 Acento — Azul eléctrico (CTA / interacción)

Armoniza con el índigo y "salta" sobre blanco y sobre índigo. Cumple WCAG AA.

| Token | Hex | Uso |
|-------|-----|-----|
| `accent` | `#2563EB` | CTA primario sólido (texto blanco, contraste 4.6:1 ✔) |
| `accent-hover` | `#1D4ED8` | Hover del CTA (5.9:1 ✔) |
| `accent-bright` | `#4D7CFF` | Glow, extremo claro de gradientes, acento sobre oscuro |
| `cyan` | `#22D3EE` | Señal "en vivo"/dato, uso **escaso** (puntos de estado, KPIs) |

**Gradientes de marca:**
- Hero / superficies oscuras: `#030677 → #1A23AE → #4D7CFF`
- Botón CTA: `#2563EB → #4D7CFF` (+ glow `accent-bright` a baja opacidad)

### 3.3 Neutros (slate frío, teñido índigo)

| Token | Hex | Uso |
|-------|-----|-----|
| `background` | `#F6F8FD` | Fondo de página |
| `surface` | `#FFFFFF` | Tarjetas, superficies elevadas |
| `surface-2` | `#EEF1F8` | Fondos atenuados, secciones alternas |
| `border` | `#E3E6F0` | Bordes, divisores |
| `ink` | `#0A0E27` | Texto principal (17:1 sobre blanco ✔) |
| `ink-soft` | `#3A4163` | Texto secundario fuerte |
| `muted-foreground` | `#5B6486` | Texto atenuado (≈5:1 sobre blanco ✔) |

### 3.4 Superficies oscuras (hero / footer)

| Token | Hex | Uso |
|-------|-----|-----|
| `dark` | `#05071F` | Fondo oscuro principal |
| `dark-2` | `#0A0E2E` | Tarjetas sobre oscuro |
| `on-dark` | `#EAECFF` | Texto sobre oscuro |
| `on-dark-muted` | `#9CA3D8` | Texto atenuado sobre oscuro |
| `on-dark-border` | `rgba(255,255,255,.08)` | Bordes sobre oscuro |

### 3.5 Estados semánticos (dashboard operacional)

Mapeados a los estados reales del producto. **Nunca** comunicar solo con color:
acompañar con icono/etiqueta.

| Estado | Color | Fondo claro | Texto sobre claro | Significado en producto |
|--------|-------|-------------|-------------------|-------------------------|
| `success` | `#16A34A` | `#DCFCE7` | `#166534` | Equipo operativo |
| `warning` | `#F59E0B` | `#FEF3C7` | `#92400E` | En mantención / alerta |
| `danger`  | `#DC2626` | `#FEE2E2` | `#991B1B` | Detenido / falla |
| `info`    | `#2563EB` | `#DBEAFE` | `#1E40AF` | Información / pendiente |

---

## 4. Tipografía

Sistema de 3 familias (todas Google Fonts variables, self-hosted vía
`next/font` → rápidas y con `display: swap`). Combina precisión técnica con
elegancia de agencia, y mono para los datos (HH, horas máquina, OT, KPIs).

| Rol | Familia | Pesos | Uso |
|-----|---------|-------|-----|
| **Display / Títulos** | **Space Grotesk** | 500 · 600 · 700 | H1–H3, hero, números grandes. Geométrica, "ingenieril", distintiva |
| **Cuerpo / UI** | **Inter** | 400 · 500 · 600 | Párrafos, botones, navegación, formularios. Legibilidad premium |
| **Datos / Mono** | **JetBrains Mono** | 400 · 500 | Métricas, códigos, HH, horas, estados, cifras tabulares |

> Respaldo en skills: *Dashboard Data* (técnico/datos) + *Modern Dark Cinema*
> (Inter, sistema de precisión) + *Developer Mono* (JetBrains Mono). Space Grotesk
> aporta la personalidad "de agencia" en display.

### 4.1 Escala tipográfica (fluida)

| Nivel | Familia / peso | Tamaño | Tracking | Line-height |
|-------|----------------|--------|----------|-------------|
| Display | Space Grotesk 700 | `clamp(2.5rem, 5vw, 4.5rem)` | -0.02em | 1.05 |
| H1 | Space Grotesk 600 | `clamp(2rem, 3.5vw, 3rem)` | -0.02em | 1.1 |
| H2 | Space Grotesk 600 | `clamp(1.5rem, 2.5vw, 2.25rem)` | -0.01em | 1.15 |
| H3 | Space Grotesk 600 | `1.5rem` | -0.01em | 1.2 |
| Lead | Inter 400 | `clamp(1.125rem, 1.6vw, 1.25rem)` | 0 | 1.6 |
| Body | Inter 400 | `1rem` (16px) | 0 | 1.6 |
| Small | Inter 400 | `0.875rem` | 0 | 1.5 |
| Eyebrow/Label | Inter 600 | `0.8125rem` | 0.08em · UPPERCASE | 1.4 |
| Data/Metric | JetBrains Mono 500 | según contexto | 0 · `tabular-nums` | 1.2 |

---

## 5. Efectos, movimiento y forma

- **Radios:** `--radius` base `0.75rem`. Botones `0.625rem`, tarjetas `1rem`,
  pills `999px`.
- **Sombras:** escala consistente y suave (índigo a baja opacidad), no negro puro.
  `sm` tarjetas, `md` hover, `lg` modales/elevación. Glow índigo/azul en CTA.
- **Animación (skill `ui-ux-pro-max`, §7):**
  - Micro-interacciones **150–300ms**; transiciones complejas ≤400ms.
  - Solo `transform`/`opacity` (nunca `width`/`height`/`top`/`left`).
  - Curvas tipo *spring*; entrada `ease-out`, salida `ease-in` (~60-70% más corta).
  - Entrada escalonada de listas 30–50ms por ítem; máx. 1–2 elementos animados por vista.
  - Punto de estado pulsante para "en vivo".
  - **Respetar `prefers-reduced-motion`** siempre.
- **Estilo:** superficies limpias, bento grids para módulos/KPIs, glassmorphism
  sutil solo en nav/overlays (no decorativo).

---

## 6. Reglas de calidad (no negociables)

De `ui-ux-pro-max` (§1–§3 CRITICAL/HIGH) e `impeccable`:

- Contraste texto ≥ **4.5:1** (normal) / 3:1 (grande). Verificado en la paleta.
- Iconos **SVG** (Lucide — ya instalado), nunca emojis como iconos.
- Targets táctiles ≥ 44×44px; `cursor-pointer` en clickeables.
- Foco visible en navegación por teclado; jerarquía de encabezados sin saltos.
- Mobile-first; breakpoints 375 / 768 / 1024 / 1440; sin scroll horizontal.
- Imágenes WebP/AVIF, `width`/`height` declarados (CLS < 0.1), lazy bajo el fold.
- Tokens semánticos (este archivo), **nunca** hex crudo en componentes.
- Un solo CTA primario por vista; acciones secundarias subordinadas.

---

## 7. Implementación

- **Tokens CSS:** definidos en `app/globals.css` (`@theme` de Tailwind v4).
  Disponibles como utilidades: `bg-brand-900`, `text-ink`, `text-accent`,
  `font-display`, `font-mono`, etc.
- **Fuentes:** cargadas en `app/layout.tsx` con `next/font/google`
  (Space Grotesk, Inter, JetBrains Mono → variables CSS).
- **Vista previa:** `app/page.tsx` muestra paleta + tipografía (provisional,
  para validar el sistema antes de construir el sitio).

### Estado
- [x] Skills instaladas en `.claude/skills/`
- [x] Contexto e info de empresa entendidos
- [x] Paleta y tipografía definidas (este archivo)
- [x] Tokens + fuentes cableados en la app
- [ ] Construcción de secciones del sitio (siguiente paso)
