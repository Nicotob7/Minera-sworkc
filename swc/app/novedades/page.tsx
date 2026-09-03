import type { Metadata } from "next";
import { PageHero } from "../../components/site/PageHero";
import { ComingSoonCard } from "../../components/site/ComingSoonCard";
import { RelatedLinks } from "../../components/site/RelatedLinks";
import { CTAFinal } from "../../components/site/CTAFinal";
import { Reveal } from "../../components/ui/Reveal";

export const metadata: Metadata = {
  title: "Novedades",
  description:
    "Anuncios, notas de versión y novedades de sworkc. Sección en preparación: pronto publicaremos actualizaciones del producto.",
  alternates: { canonical: "https://sworkc.cl/novedades" },
};

/* Tipos de publicación previstos (aún sin artículos publicados). */
const NOVEDADES = [
  {
    category: "Producto",
    title: "Nuevas capacidades",
    note: "Anunciaremos aquí las funcionalidades que se sumen a la plataforma.",
  },
  {
    category: "Notas de versión",
    title: "Mejoras y ajustes",
    note: "Resumen de cambios y mejoras incorporadas en cada actualización.",
  },
  {
    category: "Operación",
    title: "Notas de uso en terreno",
    note: "Recomendaciones para aprovechar sworkc en la operación diaria.",
  },
];

export default function NovedadesPage() {
  return (
    <main id="contenido" className="flex-1">
      <PageHero
        eyebrow="Novedades"
        title="Novedades del producto"
        intro="Estamos preparando este espacio para compartir anuncios, notas de versión y novedades de sworkc. Aún no hay publicaciones."
      />

      <section className="bg-surface-2 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold tracking-tight text-ink">Contenido en preparación</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              Cuando publiquemos, las novedades aparecerán aquí organizadas por tipo. Mientras tanto,
              puedes escribirnos para recibir información del producto.
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {NOVEDADES.map((n, i) => (
              <Reveal key={n.title} variant="up" delay={(i % 3) * 70} as="div" className="h-full">
                <ComingSoonCard category={n.category} title={n.title} note={n.note} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <RelatedLinks
        items={[
          { title: "Producto", desc: "Qué hace sworkc hoy: módulos, EDE y uso en terreno.", href: "/producto" },
          { title: "Recursos", desc: "Guías y documentación (en preparación).", href: "/recursos" },
          { title: "Contacto", desc: "Escríbenos para recibir novedades del producto.", href: "/#contacto" },
        ]}
      />

      <CTAFinal
        title="¿Quieres enterarte de las novedades?"
        text="Escríbenos y te mantenemos al tanto de las actualizaciones de sworkc."
        cta="Escríbenos"
      />
    </main>
  );
}
