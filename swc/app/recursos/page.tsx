import type { Metadata } from "next";
import { PageHero } from "../../components/site/PageHero";
import { RelatedLinks } from "../../components/site/RelatedLinks";
import { CTAFinal } from "../../components/site/CTAFinal";
import { FAQ } from "../../components/sections/FAQ";

export const metadata: Metadata = {
  title: "Recursos",
  description:
    "Video «Así funciona sworkc» (1:55) con la plataforma en uso y respuestas a las preguntas frecuentes sobre alcance, alertas, turnos y reportes.",
  alternates: { canonical: "https://sworkc.cl/recursos" },
};

const VIDEO = {
  src: "/media/2026-09/sworkc-como-funciona.mp4",
  poster: "/media/2026-09/sworkc-como-funciona-poster.jpg",
  duracion: "1:55",
};

export default function RecursosPage() {
  return (
    <main id="contenido" className="flex-1">
      <PageHero
        path="recursos"
        title="Mira sworkc funcionando"
        intro="Un video corto con la plataforma en uso y las respuestas a las dudas más comunes. Si necesitas un material específico, escríbenos y lo coordinamos."
        readouts={[
          { label: "Video", value: VIDEO.duracion },
          { label: "Preguntas frecuentes", value: "6" },
        ]}
        img={{
          src: "/img/faena/pala-electrica.jpg",
          alt: "Pala eléctrica de cable P&H 4100 cargando material en una faena minera",
        }}
      />

      {/* ── Recurso principal: el video (sin reproducción automática; no se descarga hasta pulsar) ── */}
      <section id="video" className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="border-b-2 border-[#0a0c77] pb-5">
            <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              Así funciona sworkc
            </h2>
          </div>
          <p className="mt-5 max-w-[60ch] text-base leading-relaxed text-ink-soft">
            De la máquina en terreno a la orden de trabajo, el cierre de turno y los indicadores,
            en {VIDEO.duracion} minutos.
          </p>
          {/* El video sube y se aclara al llegar a la vista (.prof-entrar). */}
          <div className="prof-entrar mt-10 overflow-hidden rounded-xl border border-border bg-[#060733] shadow-[var(--shadow-lg)]">
            <video
              controls
              playsInline
              preload="none"
              poster={VIDEO.poster}
              className="block aspect-video h-auto w-full"
              aria-label={`Video: así funciona sworkc, ${VIDEO.duracion} minutos`}
            >
              <source src={VIDEO.src} type="video/mp4" />
              <a href={VIDEO.src}>Descargar el video (MP4)</a>
            </video>
          </div>
        </div>
      </section>

      <div className="border-t border-border">
        <FAQ />
      </div>

      <RelatedLinks
        items={[
          { title: "Producto", desc: "Los módulos y capacidades de sworkc en detalle.", href: "/producto" },
          { title: "Nosotros", desc: "Cómo trabajamos e implementamos la plataforma.", href: "/nosotros" },
          { title: "Contacto", desc: "Agenda una demostración enfocada en tu operación.", href: "/#contacto" },
        ]}
      />

      <CTAFinal
        title="¿Necesitas un recurso específico?"
        text="Cuéntanos qué material te ayudaría y lo preparamos según tu operación."
        cta="Escríbenos"
      />
    </main>
  );
}
