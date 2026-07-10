# Con qué se hizo — proyecto SWC

## 1. Qué es

Landing page corporativa de **Sworkc Technologies**, empresa de informática para minería. Promociona el producto **sworkc control**: plataforma digital de **continuidad operacional y mantenimiento minero** (OT digitales, mantenciones, alertas, estados de equipos, dashboards, HH e insumos). Público B2B (empresas mineras y contratistas), idioma español (Chile).

## 2. Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | **Next.js 16.1.1** (App Router, Turbopack) |
| UI | **React 19** + **TypeScript 5** (strict) |
| Estilos | **Tailwind CSS v4** (tokens en `@theme`, sin archivo de config) |
| Gráficos | **ApexCharts** (`react-apexcharts`, carga diferida) + SVG propio |
| Iconos | **Tabler Icons** (`@tabler/icons-react`) vía `components/ui/icons.ts` |
| Animación de iconos | **motion** (framer-motion) en iconos animados de Servicios |
| Email | **nodemailer** (en `app/api/contact/route.ts`) |
| Fuentes | Google Fonts: **Space Grotesk** (display), **Inter** (cuerpo), **JetBrains Mono** (datos) |

## 3. Estructura de carpetas

```
swc/
├── app/
│   ├── layout.tsx          # raíz: fuentes, metadata/SEO, JSON-LD, skip-link
│   ├── page.tsx            # composición de la página (Navbar + secciones + Footer)
│   ├── globals.css         # Tailwind v4 @theme (tokens), keyframes y utilidades
│   ├── robots.ts           # /robots.txt
│   ├── sitemap.ts          # /sitemap.xml
│   ├── favicon.ico
│   └── api/contact/route.ts# endpoint del formulario (nodemailer)
├── components/
│   ├── Hero.tsx            # hero full-bleed
│   ├── Navbar.tsx          # navbar blanco flotante
│   ├── Typewriter.tsx      # efecto de escritura del hero
│   ├── hooks.ts            # useReducedMotion, useInterval, useInViewport
│   ├── ui/                 # primitivas + iconos
│   ├── charts/             # gráficos (SVG propio + ApexCharts)
│   └── sections/           # las 7 secciones de contenido
├── public/                 # imágenes (hero/final.png, logo-swc.png) y svg
├── design-system/MASTER.md # sistema de diseño (paleta, tipografía, tokens)
└── docs/                   # esta documentación
```

> El proyecto Next vive en el subdirectorio `swc/`. La raíz del repositorio es `SWC-WEB/`.

## 4. Cómo correr

```bash
cd swc
npm install
npm run dev      # http://localhost:3000
npm run build    # build de producción (valida TypeScript)
npm run start    # sirve el build
npm run lint     # eslint
```

## 5. Secciones de la página (orden)

1. **Hero** — imagen de faena full-bleed + titular con efecto de escritura.
2. **Quiénes Somos** — texto + gráfico (ApexCharts).
3. **Servicios** — los 10 módulos como panel interactivo (acordeón en móvil) con mini-gráficos.
4. **Franja "¿Sabías que…?"** — banda blanca tipográfica de alto impacto.
5. **Dashboard interactivo** — "centro de control" con KPIs, filtros, charts en vivo (SVG) y feed de alertas.
6. **Contacto** — full-bleed: imagen + formulario (→ `/api/contact`).
7. **FAQ** — cronograma en 2 columnas con acordeón ("Leer más").
8. **Footer** — azul oscuro simple con nombre + enlaces.

## 6. SEO

- `app/layout.tsx`: `metadata` completa (title con template, description, keywords, **OpenGraph**, **Twitter Card**, `icons`, `robots`, `canonical`) + `viewport.themeColor`.
- **JSON-LD** (`<script application/ld+json>`): `Organization` + `SoftwareApplication` + `FAQPage` (las 6 preguntas).
- `app/robots.ts` → `/robots.txt`; `app/sitemap.ts` → `/sitemap.xml`.
- **Skip-link** accesible ("Saltar al contenido") + `id="contenido"` en `<main>`.

## 7. Formulario de contacto

`components/sections/Contacto.tsx` → `POST /api/contact`. El handler (`app/api/contact/route.ts`) valida campos, exige teléfono chileno opcional en formato `+569XXXXXXXX`, aplica límite por IP, descarta bots por honeypot, y **si hay SMTP configurado envía el correo**; si no, registra y responde ok (degradación elegante).

El correo llega con asunto `Nuevo mensaje de contacto - ...`, versión texto plano y versión HTML con ficha de datos + mensaje destacado. El `replyTo` queda con el email ingresado por el visitante para responder directo desde Gmail.

Defensas anti-spam actuales:

- **Rate limit por IP:** máximo 5 mensajes cada 10 minutos. Si se supera, responde `429`.
- **Honeypot invisible:** campo `website`; si viene lleno, el mensaje se descarta sin enviar correo.
- **Límites de contenido:** nombre 80 caracteres, empresa 100, email 254, mensaje 1500.
- **Teléfono chileno:** el cliente normaliza a `+569XXXXXXXX`; el API vuelve a validar el mismo formato.

Variables de entorno para envío real (en desarrollo van en `swc/.env`; en hosting/Vercel van en el panel de variables del proyecto):

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=tu-correo@gmail.com
SMTP_PASS=tu_contrasena_de_aplicacion_sin_espacios
SMTP_FROM="Formulario web SWC <tu-correo@gmail.com>"
CONTACT_TO=contacto@sworkc.cl
```

Notas para Gmail:

- `SMTP_USER` es el Gmail que autentica y envía. Debe tener contraseña de aplicación.
- `SMTP_PASS` es la contraseña de aplicación de Gmail, sin espacios.
- `SMTP_FROM` es el remitente visible. Recomendado: `"Formulario web SWC <correo@dominio>"`.
- Si `SMTP_USER` y `CONTACT_TO` son la misma cuenta, Gmail puede mostrar el remitente como "yo" en la bandeja. Para evitarlo, usa una cuenta/alias emisor distinto, por ejemplo `web@sworkc.cl`, y deja `CONTACT_TO=contacto@sworkc.cl`.
- `CONTACT_TO` es donde llegan los mensajes del formulario. Si será un solo correo de contacto, puede ser el mismo de `SMTP_USER`.
- `.env.example` es solo plantilla/documentación; los valores reales van en `.env` y no se suben al repositorio.
- A futuro, si el formulario recibe tráfico alto o ataques reales, conviene sumar CAPTCHA/Cloudflare Turnstile y/o rate limit persistente con Redis/Upstash. El `Map` actual es suficiente como primera barrera para una landing simple, pero en serverless puede reiniciarse o variar por instancia.

## 8. Pendientes / placeholders por confirmar

- **Dominio:** `SITE_URL` en `layout.tsx`, `robots.ts`, `sitemap.ts` = `https://www.sworkc.cl` (placeholder).
- **Datos de contacto:** correo `contacto@sworkc.cl`, teléfono `+56 9 0000 0000`, LinkedIn (placeholder).
- **SMTP:** configurar `swc/.env` con las variables anteriores para que el formulario envíe correos reales.
- Mejoras técnicas y de diseño pendientes: ver [MEJORAS-AUDITORIA.md](MEJORAS-AUDITORIA.md) y [AUDITORIA.md](AUDITORIA.md).
