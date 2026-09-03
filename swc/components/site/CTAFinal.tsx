import { CTAButton } from "../ui/CTAButton";
import { TechGrid } from "../ui/TechGrid";
import { Reveal } from "../ui/Reveal";

/**
 * Cierre de página: banda con CTA hacia el formulario de contacto del home.
 * Reutiliza el gradiente de marca y el CTAButton del sitio.
 */
export function CTAFinal({
  title = "¿Conversamos sobre tu operación?",
  text = "Te mostramos sworkc con foco en tus equipos, turnos y mantenciones. Sin compromiso.",
  cta = "Solicitar una demostración",
}: {
  title?: string;
  text?: string;
  cta?: string;
}) {
  return (
    <section
      className="relative isolate overflow-hidden text-white"
      style={{ background: "var(--gradient-cta)" }}
    >
      <TechGrid variant="dark" className="opacity-15" />
      <div className="relative mx-auto max-w-4xl px-6 py-16 text-center sm:py-20 lg:px-10">
        <Reveal variant="up" as="div">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-white/80">{text}</p>
          <div className="mt-8 flex justify-center">
            <CTAButton href="/#contacto" variant="cyan">
              {cta}
            </CTAButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
