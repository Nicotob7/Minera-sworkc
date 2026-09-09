import type { Metadata, Viewport } from "next";
import { Geologica, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar";
import { AnchorSuave } from "../components/ui/AnchorSuave";
import { Footer } from "../components/sections/Footer";

const SITE_URL = "https://sworkc.cl";

// Identidad tipográfica: UNA familia (Geologica — precisa, de trazo calibrado,
// nombre literalmente geológico) usada con contraste de peso fuerte (300 ↔ 800),
// + JetBrains Mono para lecturas de dato (rótulos, unidades, metadatos).
const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_DESCRIPTION =
  "sworkc: plataforma digital para empresas mineras y contratistas. Órdenes de trabajo digitales, mantenciones, alertas, control de equipos e indicadores operacionales.";

const SITE_TITLE =
  "Sworkc Technologies — Continuidad operacional minera";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Sworkc Technologies",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "software minero",
    "órdenes de trabajo digitales",
    "OT digitales",
    "mantenimiento minero",
    "mantención minera",
    "continuidad operacional",
    "dashboard minero",
    "control de equipos",
    "gestión de turnos minería",
    "contratistas mineros",
    "indicadores operacionales",
    "Sworkc Technologies",
    "sworkc",
  ],
  openGraph: {
    type: "website",
    locale: "es_CL",
    url: SITE_URL,
    siteName: "Sworkc Technologies",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/hero/final.png",
        width: 1672,
        height: 941,
        alt: "sworkc en faena minera",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/hero/final.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0c77",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "Sworkc Technologies",
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      logo: `${SITE_URL}/logo-swc.png`,
    },
    {
      "@type": "SoftwareApplication",
      name: "sworkc",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "¿El sistema sirve para contratistas mineros?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Está pensado para empresas que registran trabajos, controlan equipos y reportan información operacional a sus clientes.",
          },
        },
        {
          "@type": "Question",
          name: "¿Se pueden configurar alertas de mantención?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Según uso, fechas, horas de funcionamiento, criticidad o reglas definidas por la operación.",
          },
        },
        {
          "@type": "Question",
          name: "¿Permite revisar información de turnos anteriores?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Centraliza eventos, pendientes, fallas y trabajos realizados para dar continuidad al turno siguiente.",
          },
        },
        {
          "@type": "Question",
          name: "¿Se pueden generar reportes?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Cada OT se descarga en PDF y el reporte de cierre de turno se envía por correo en Excel y PDF, con el estado de la flota, las OTs de la jornada y las fotos de evidencia.",
          },
        },
        {
          "@type": "Question",
          name: "¿El sistema puede adaptarse a distintos procesos?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Sí. Configurable según equipos, roles, flujos de trabajo e indicadores de cada empresa.",
          },
        },
        {
          "@type": "Question",
          name: "¿Cómo es la implementación?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "En etapas: levantamiento de la operación, configuración, capacitación del equipo y puesta en marcha.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geologica.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <a
          href="#contenido"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[#0a0c77] focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar al contenido
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <AnchorSuave />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
