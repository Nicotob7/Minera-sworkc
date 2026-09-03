# Design — sworkc.cl

Sistema visual "sala de control": el sitio habla el idioma del producto (lecturas, unidades, estados). Registro: brand. Ver PRODUCT.md para la estrategia.

## Color

Estrategia **Committed**: el azul de marca carga 30–60% de la superficie.

- `--color-brand` **#0a0c77** (azul profundo, identidad; ramp brand-50…950 en `swc/app/globals.css`)
- `--color-cyan` **#00a6d6** (SOLO señal de dato/acción: valores de readouts, links vivos; nunca decoración)
- Tinta navy **#060733** (brand-950) para bandas oscuras y footer
- Superficies claras: blanco + `#f6f8fc` (neutro tintado hacia el azul de marca)
- Fotografía de faena SIEMPRE bajo veladura azul (gradiente 100° desde rgba(6,7,51,.96) → rgba(10,12,119,.45)); la foto respira a la derecha

## Tipografía

- **Geologica** (única familia; variable `--font-geologica`) — pesos con contraste comprometido: 300 (declaraciones), 600–800 (títulos). Display tracking `-0.02em`, `text-wrap: balance` en h1–h3.
- **JetBrains Mono** — exclusivo para *readouts*: rótulos con dato real (conteos, unidades, estados, rutas `sworkc / producto`, créditos de foto). Un rótulo sin dato no se escribe.
- Escala hero: `clamp(2.4rem, 6vw, 4.25rem)`.

## Componentes / patrones

- **PageHero** (`components/site/PageHero.tsx`): foto de faena + veladura azul + ruta mono + título + fila de readouts `<dl>` con hairline superior + crédito CC en esquina (mono 10px).
- **Bitácora / spec-ledger**: filas `grid [código-mono | título+desc | capacidades-mono]` separadas por hairlines (`border-border`), heading con `border-b-2` azul y contador mono a la derecha. Reemplaza toda grilla de tarjetas.
- **Ficha técnica** (`<dl>` clave/valor): filas `[etiqueta-mono-uppercase | valor]` con hairlines. Usada en terreno, dónde-estamos.
- **Banda de producto real**: fondo #060733, marco de "monitor" (borde blanco/15, barra superior mono con punto cyan), captura REAL del sistema rotulada `PANTALLA REAL · DATOS DEMO`.
- **RelatedLinks**: enlaces con `border-t-2` azul que se enciende al hover; sin tarjetas.
- **Reveal**: visible por defecto en SSR (SEO/sin-JS); JS oculta y anima solo lo que está bajo el viewport; respeta `prefers-reduced-motion`.

## Imágenes

- Faena: `swc/public/img/faena/` — Chuquicamata (Diego Delso, CC BY-SA 4.0), Centinela desde la ISS (Alexander Gerst, CC BY-SA 2.0), pala P&H (Sansumaria, CC BY-SA 3.0). **La atribución CC va como caption mono en la esquina de cada foto — obligatoria.**
- Producto: `swc/public/img/producto/` — capturas reales del sistema (datos demo), siempre rotuladas como demo.

## Prohibido (además de los bans de la skill)

- Grillas de tarjetas idénticas icono+título+texto; eyebrows uppercase decorativos sobre secciones; iconos en círculo sobre títulos; cifras/valores de KPI inventados; cyan como color de relleno.
