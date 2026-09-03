import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../../components/site/PageHero";
import { RelatedLinks } from "../../components/site/RelatedLinks";
import { CTAFinal } from "../../components/site/CTAFinal";
import { Reveal } from "../../components/ui/Reveal";

export const metadata: Metadata = {
  title: "Novedades",
  description:
    "Anuncios, notas de versión y novedades de sworkc. Aún no hay publicaciones: este espacio está en preparación.",
  alternates: { canonical: "https://sworkc.cl/novedades" },
};

/* Tipos de publicación previstos. Sin artículos inventados. */
const TIPOS = [
  { code: "CAP", title: "Nuevas capacidades", desc: "Anuncios de las funcionalidades que se sumen a la plataforma." },
  { code: "VER", title: "Notas de versión", desc: "Resumen de cambios y mejoras incorporadas en cada actualización." },
  { code: "OPS", title: "Notas de uso en terreno", desc: "Recomendaciones para aprovechar sworkc en la operación diaria." },
];

export default function NovedadesPage() {
  return (
    <main id="contenido" className="flex-1">
      <PageHero
        path="novedades"
        title="Novedades del producto"
        intro="Estamos preparando este espacio para compartir anuncios, notas de versión y novedades de sworkc. Aún no hay publicaciones."
        readouts={[
          { label: "Publicaciones", value: "0" },
          { label: "Estado", value: "en preparación" },
        ]}
      />

      {/* ── Bitácora vacía honesta: qué habrá aquí, sin fingir publicaciones ── */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <Reveal variant="up" as="div" className="flex flex-wrap items-end justify-between gap-4 border-b-2 border-[#0a0c77] pb-5">
            <h2 className="font-display text-3xl font-bold tracking-[-0.01em] text-ink sm:text-4xl">
              Lo que vas a encontrar aquí
            </h2>
            <p className="font-mono text-xs text-muted-foreground">PUBLICACIONES · 0</p>
          </Reveal>

          <div className="mt-10">
            {TIPOS.map((t, i) => (
              <Reveal
                key={t.code}
                variant="up"
                delay={i * 60}
                as="div"
                className="grid gap-x-8 gap-y-1 border-b border-border py-5 sm:grid-cols-[64px_minmax(0,1fr)_auto] sm:items-center"
              >
                <span className="font-mono text-sm text-muted-foreground">{t.code}</span>
                <div>
                  <h3 className="font-display text-lg font-semibold tracking-tight text-ink">{t.title}</h3>
                  <p className="mt-0.5 max-w-[62ch] text-sm leading-relaxed text-ink-soft">{t.desc}</p>
                </div>
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                  Próximamente
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal variant="up" as="p" className="mt-8 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
            ¿Quieres enterarte cuando publiquemos?{" "}
            <Link href="/#contacto" className="font-semibold text-[#0a0c77] underline-offset-4 hover:underline">
              Escríbenos
            </Link>{" "}
            y te mantenemos al tanto de las actualizaciones.
          </Reveal>
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
