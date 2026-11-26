# Design — sworkc.cl

Sistema visual "sala de control": el sitio habla el idioma del producto (lecturas, unidades, estados). Registro: brand. Ver PRODUCT.md para la estrategia.

## Color

Estrategia **Committed**: el azul de marca carga 30–60% de la superficie.

- `--color-brand` **#0a0c77** (azul profundo, identidad; ramp brand-50…950 en `swc/app/globals.css`)
- `--color-cyan` **#00a6d6** (SOLO señal de dato/acción: valores de readouts, links vivos; nunca decoración)
- Tinta navy **#060733** (brand-950) para bandas oscuras (incluida la del panel interactivo del inicio) y footer. Sin grises fuera de paleta.
- Superficies claras: blanco + `#f6f8fc` (neutro tintado hacia el azul de marca)
- Fotografía de faena SIEMPRE bajo veladura azul (gradiente 100° desde rgba(6,7,51,.96) → rgba(10,12,119,.45)); la foto respira a la derecha

## Tipografía

- **Geologica** (única familia; variable `--font-geologica`) — pesos con contraste comprometido: 300 (declaraciones), 600–800 (títulos). Display tracking `-0.02em`, `text-wrap: balance` en h1–h3. Los rótulos pequeños van en Geologica `text-xs` (12 px mínimo), en minúsculas normales: sin `uppercase` ni tracking ancho.
- **JetBrains Mono** — SOLO para cifras y códigos (valores numéricos, horómetros, `OT-2026-0xx`, códigos de equipo). Nunca como disfraz "técnico" de rótulos, rutas ni créditos.
- Sin rótulos sobre los títulos (eyebrows) ni contadores de andamiaje ("MÓDULOS · 10 / 10", "ENLACES · 3").
- Escala hero: `clamp(2.4rem, 6vw, 4.25rem)`.

## Componentes / patrones

- **PageHero** (`components/site/PageHero.tsx`): foto de faena + veladura azul + migas (`sworkc / producto`) + título + fila de readouts `<dl>` con dato real y hairline superior. Sin crédito sobre la foto.
- **Bitácora / spec-ledger**: filas `grid [ícono | título+desc | capacidades]` separadas por hairlines (`border-border`), heading con `border-b-2` azul. Íconos de Tabler desde `components/ui/icons.ts` (sin círculo). Reemplaza toda grilla de tarjetas.
- **Ficha técnica** (`<dl>` clave/valor): filas `[etiqueta | valor]` con hairlines. Usada en terreno, dónde-estamos.
- **Banda de producto**: fondo #060733, marco de "monitor" (borde blanco/15, barra superior con punto cyan), pantalla del sistema redibujada (`components/demo/`) con el rótulo "Datos de ejemplo" dentro de la propia pantalla.
- **Pantallas redibujadas** (`components/demo/`), con los datos de ejemplo de `lib/demo.ts` (equipos CAEX-214, PALA-07, PERF-31, CAR-012; OTs OT-2026-0xx; personas solo por rol). Nunca capturas con datos de prueba.
  - `PanelOperativoDemo`: réplica en HTML de «Visión Operativa» tal como se ve el sistema (tema claro, mayúsculas y colores del producto, no del sitio). Se diseña a 1280 × 838 y mide todo en `--u` (1/1280 del ancho del contenedor, `cqw`), así escala nítido de la tablet a pantalla completa. `encender` reproduce el arranque una vez.
  - `TelefonoDemo`: la app en un teléfono (390 × 844, misma técnica de `--u`): escanear QR (captura real), nueva OT sin señal, OT creada y OT cerrada con checklist, evidencia y firma. La pantalla visible la decide el `data-paso` de un ancestro.
  - `EdeDemo`: réplica HTML del Expediente Digital del Equipo (1120 × 600, misma técnica de `--u`). `EdePeriodo` son radios nativos fuera de la pantalla; el período y el resaltado de tarjetas se aplican por CSS (`:has`) desde la sección con `data-ede`, sin JavaScript.
- **Portada del inicio**: `public/hero/portada.jpg` (foto con la pantalla de la tablet en negro, generada por `swc/scripts/limpiar-portada.mjs`) + `PanelOperativoDemo` alineado a la pantalla en todos los tamaños. Móvil: texto sobre navy y la foto recortada a la tablet debajo. Desde `lg`: foto de fondo y columna de texto que termina antes de la pantalla (`.portada-columna` en `globals.css`, calculada con la misma geometría de la foto). Título fijo, sin máquina de escribir.
- **Marco de teléfono**: borde grueso navy `border-[7px] border-[#060733] rounded-[2.1rem]`, captura móvil real (390px @3x), sin pie de imagen. Usado en la sección terreno de /producto; en desktop va `sticky top-28` junto a la bitácora.
- **RelatedLinks**: enlaces con `border-t-2` azul que se enciende al hover; sin tarjetas.
- **Menú flotante**: píldora blanca que se compacta al bajar (margen, alto y logo; 200 ms ease-out). Cada ítem de los desplegables lleva a una sección distinta (`components/site/nav.ts`): Producto → visión general, módulos, panel, EDE y uso en terreno; Empresa → Nosotros, implementación y contacto. `html { scroll-padding-top: 7rem }` deja todas las anclas bajo el menú; no usar `scroll-mt` sueltos ni `scroll-behavior: smooth` en `html`.

## Movimiento

- Nada aparece por hacer scroll en cada sección (se eliminó `Reveal`). El movimiento se reserva para la entrada de la portada y uno o dos momentos por página. Excepción pedida por el dueño (26/11): «Informática que sostiene la operación minera» se arma con el scroll (título palabra por palabra, párrafo que se enciende, ficha que traza su línea), con `view-timeline` nativo en `QuienesSomos.module.css`; sin soporte o con movimiento reducido queda quieto y completo.
- Lo que se mueve es real: la foto de faena y la pantalla del sistema. Sin ilustraciones, dibujos ni maquetas geométricas (el rajo 3D procedural del bosquejo quedó descartado por eso).
- Portada: al cargar, el panel de la tablet se enciende una vez (cascada de menú e indicadores, cifras que cuentan hasta su valor, barras y dona que se trazan; ~2 s). Desde `lg`, la sección mide dos pantallas con la escena fija y, al bajar, la cámara se acerca a la tablet hasta que el panel llena la pantalla (`components/HeroDolly.tsx`, transformaciones por cuadro, sin cambiar la velocidad del scroll).
- Portada, al terminar el acercamiento: la escena sigue fija un tramo (sección de 2,6 pantallas) y un cursor usa el panel una vez: se posa en «OTs NP abiertas», abre la ficha del CAEX-214, señala la dona y el primer evento. Solo cambian estados de la interfaz (`data-demo` / `data-equipo`), ninguna cifra; si el visitante vuelve a subir se cancela y puede repetirse.
- En pantallas anchas y bajas (si sobran ≥ 420 px junto al panel acercado), guía «Así se usa el panel» y panel se centran juntos, con la guía pegada al panel. Cada paso es un botón que lleva al cursor a esa acción; el activo es una tarjeta con número relleno y barra de avance (`data-guia-activo`, `--guia-ms`).
- Contacto: la columna azul muestra, junto al formulario, «Qué pasa después de escribirnos» (3 pasos con frases que el sitio ya promete) y los datos de contacto; el trabajador va pegado al borde izquierdo (la foto viene recortada ahí) y se oculta entre 1024 y 1279 px; pasos y trabajador entran con `view-timeline`. En móvil el formulario va primero. Se quitó la franja gris de datos y el brillo decorativo.
- Centro de control del inicio («Tu operación, bajo control»): recorrido de una OT en 4 tramos de scroll con la escena fija desde `lg` (`components/RecorridoOT.tsx`). El teléfono cambia de pantalla como la app; al enviarse la OT, su tarjeta viaja del teléfono a «OTs prioritarias» del panel, la fila se abre y los contadores cuentan al nuevo valor; al cerrarla, la firma se traza y la fila queda «Cerrada». Las cifras cambian porque el visitante avanza el recorrido, nunca solas. Móvil y movimiento reducido: paso 2 estático y los tres pasos en texto.
- «Cómo funciona»: al elegir un módulo (clic, o mouse con 140 ms de pausa en escritorio) el centro muestra el recorte de su pantalla real (`components/demo/ModuloDemo.tsx`) y sus filas entran en cascada, con barras y cifras que crecen a su valor. Sin gráficos genéricos (se sacó ApexCharts del sitio) ni adornos de fondo.
- «Cómo funciona» avanza solo un módulo cada 4,5 s en escritorio mientras está en pantalla, con una barra de avance en el módulo activo y un punto que viaja por su conector; se pausa al leer la tarjeta central o con foco de teclado, y se apaga para siempre cuando el visitante elige un módulo con clic.
- Producto, EDE: al elegir 7, 30 o 90 días las cifras entran desde abajo y las detenciones fuera del período se pliegan (7 días muestra el estado vacío real); pasar el mouse por una definición (DISP, MTTR, MTBF, MTBS) marca su tarjeta en la pantalla.
- Páginas interiores (26/11): sin inclinaciones 3D (el dueño las descartó: «queda feo»); profundidad plana con scroll nativo (`globals.css`): `PageHero` separa foto y texto en capas (`.prof-hero*`), las pantallas grandes suben al llegar a la vista (`.prof-entrar`) y la foto de Nosotros se desplaza en su marco (`.prof-ventana`).
- Producto: los módulos son un explorador (`components/site/ExploradorModulos.tsx`): lista a la izquierda y tarjeta con la pantalla real del elegido; avanza solo cada 5 s en escritorio, se pausa al leer la tarjeta y se apaga al elegir. El panel de «La sala de control» se enciende cuando se ve (`AlVer`); en «Uso en terreno» el teléfono cambia de pantalla según el punto que se lee (`TelefonoPasos`).
- Nosotros: la frase se arma palabra por palabra y una vía se llena al recorrer las 4 etapas (`components/ui/revelado.module.css` + `Palabras`, compartidos con Quiénes somos).
- Las cifras de las muestras no cambian solas: un panel que se mueve sin intervención contradice la regla de no prometer "tiempo real".
- Todo respeta `prefers-reduced-motion`.

## Imágenes

- Faena: `swc/public/img/faena/` — Chuquicamata (Diego Delso, CC BY-SA 4.0), Centinela desde la ISS (Alexander Gerst, CC BY-SA 2.0), pala P&H 4100XPB (Sansumaria, CC BY-SA 3.0). **La atribución CC va en el pie de página**: una línea "Fotografías vía Wikimedia Commons" que despliega autor, licencia, enlace a la obra y aviso de recorte (`lib/creditos.ts`). Al agregar una foto, agregarla ahí.
- Producto: pantallas redibujadas en `components/demo/`; la única captura vigente es `public/img/producto/escanear-qr.jpg`. `public/img/faena/pala-ficha.jpg` es un recorte de la pala (misma atribución) para la ficha de equipo del panel. Se eliminaron `panel-operacional.jpg`, `ede.jpg` y `public/hero/final.png` porque traían datos de prueba; la original de la portada se recupera del historial de git (instrucciones en `swc/scripts/limpiar-portada.mjs`).

## Prohibido (además de los bans de la skill)

- Grillas de tarjetas idénticas icono+título+texto; eyebrows sobre secciones; iconos en círculo sobre títulos; cifras/valores de KPI inventados presentados como resultados; cyan como color de relleno; capturas con datos de prueba o nombres de personas reales; créditos impresos sobre las fotos.
