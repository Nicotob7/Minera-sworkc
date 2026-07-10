# Documentación — SWC / Sworkc Technologies

Landing page de **Sworkc Technologies** para su producto **sworkc control** (plataforma de continuidad operacional y mantenimiento minero).

## Índice de documentos

| Documento | Contenido |
|---|---|
| [PROYECTO.md](PROYECTO.md) | Con qué se hizo: stack, estructura, cómo correr, secciones, SEO, formulario, pendientes |
| [LIBRERIAS.md](LIBRERIAS.md) | Qué librerías usa el proyecto y para qué |
| [COMPONENTES.md](COMPONENTES.md) | Qué componentes tiene y qué hace cada uno |
| [MEJORAS-AUDITORIA.md](MEJORAS-AUDITORIA.md) | Mejoras aplicadas (SEO, accesibilidad, performance, limpieza) y pendientes |
| [AUDITORIA.md](AUDITORIA.md) | Auditoría completa de código y diseño (hallazgos por severidad) |

> El sistema de diseño (paleta, tipografía, tokens) vive en [`../design-system/MASTER.md`](../design-system/MASTER.md).

## Resumen rápido

- **Stack:** Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript · ApexCharts · Tabler Icons · motion · nodemailer.
- **Tipo:** landing de una sola página (one-page) con 8 secciones, formulario de contacto con backend (`/api/contact`) y SEO completo.
- **Idioma:** español (Chile), público B2B minero.
- **Contacto:** el envío real usa Gmail SMTP. Los secretos van en `swc/.env`; `.env.example` solo documenta los nombres. El correo se envía como mensaje de contacto en texto/HTML, el teléfono se normaliza a `+569XXXXXXXX`, y el API tiene honeypot + rate limit por IP.

```bash
npm install
npm run dev      # desarrollo en http://localhost:3000
npm run build    # build de producción
npm run start    # servir el build
```
