import Link from "next/link";
import { FOOTER_COLUMNS } from "../site/nav";
import { CREDITOS_FOTOS } from "../../lib/creditos";

/* FOOTER — azul oscuro con marca, navegación por columnas y copyright. */
export function Footer() {
  return (
    <footer className="text-white" style={{ background: "#0a0e20" }}>
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8 sm:pt-16">
        <div>
          <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr]">
            {/* Marca + descripción breve */}
            <div className="max-w-sm">
              <Link
                href="/"
                aria-label="Sworkc Technologies — volver al inicio"
                className="inline-flex rounded transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <span className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Sworkc <span className="font-medium text-white/80">Technologies</span>
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
                Software para la continuidad operacional minera: órdenes de trabajo, mantenciones,
                equipos e indicadores en un solo lugar.
              </p>
            </div>

            {/* Columnas de navegación */}
            <nav aria-label="Navegación del pie de página" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {FOOTER_COLUMNS.map((col) => (
                <div key={col.title}>
                  <h2 className="text-xs font-semibold text-white/50">
                    {col.title}
                  </h2>
                  <ul className="mt-4 space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="inline-flex min-h-[32px] items-center text-sm font-medium tracking-tight text-white/75 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          {/* Separador tenue */}
          <span aria-hidden className="mt-12 block h-px w-full bg-white/10" />

          {/* Copyright + créditos de fotos (una línea; la lista se despliega con <details>, sin JS) */}
          <div className="mt-7 flex flex-col gap-3 text-xs text-white/60 sm:flex-row sm:items-start sm:justify-between">
            <p>&copy; 2026 Sworkc Technologies. Todos los derechos reservados.</p>
            <details className="group sm:max-w-md sm:text-right">
              <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center underline decoration-white/30 underline-offset-4 hover:text-white focus-visible:text-white focus-visible:outline-none [&::-webkit-details-marker]:hidden">
                Fotografías vía Wikimedia Commons
              </summary>
              <ul className="mt-2 space-y-2 text-left leading-relaxed">
                {CREDITOS_FOTOS.map((c) => (
                  <li key={c.obraUrl}>
                    <a href={c.obraUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white">
                      {c.titulo}
                    </a>
                    , {c.autor},{" "}
                    <a href={c.licenciaUrl} target="_blank" rel="noopener noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-white">
                      {c.licencia}
                    </a>
                  </li>
                ))}
                <li className="text-white/45">Imágenes recortadas y redimensionadas para este sitio.</li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </footer>
  );
}
