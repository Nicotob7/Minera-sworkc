import { Reveal } from "../ui/Reveal";

/* Enlaces de navegación básicos */
const NAV_LINKS: { label: string; href: string }[] = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Contacto", href: "#contacto" },
  { label: "FAQ", href: "#faq" },
];

/* FOOTER — simple: solo el azul oscuro, nombre, enlaces y copyright. Sin efectos. */
export function Footer() {
  return (
    <footer className="text-white" style={{ background: "#0a0e20" }}>
      <div className="mx-auto flex max-w-3xl flex-col items-center px-5 pb-10 pt-14 text-center sm:px-8 sm:pt-16">
        <Reveal variant="up" as="div" className="flex flex-col items-center">
          {/* Nombre de la empresa en blanco */}
          <a
            href="#inicio"
            aria-label="Sworkc Technologies — volver al inicio"
            className="inline-flex rounded transition-opacity duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <span className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Sworkc <span className="font-medium text-white/80">Technologies</span>
            </span>
          </a>

          {/* Enlaces básicos */}
          <nav className="mt-8" aria-label="Enlaces del pie de página">
            <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-flex min-h-[44px] items-center text-sm font-medium tracking-tight text-white/75 transition-colors duration-200 hover:text-white focus-visible:text-white focus-visible:underline focus-visible:underline-offset-4 focus-visible:outline-none"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Separador tenue */}
          <span aria-hidden className="mt-10 block h-px w-full max-w-xs bg-white/10" />

          {/* Copyright */}
          <p className="mt-7 font-mono text-xs tracking-tight text-white/60">
            &copy; 2026 Sworkc Technologies. Todos los derechos reservados.
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
