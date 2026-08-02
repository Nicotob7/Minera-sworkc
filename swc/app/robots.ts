import type { MetadataRoute } from "next";

// Landing estática (output: export): las rutas de metadata deben ser estáticas.
export const dynamic = "force-static";

const SITE_URL = "https://sworkc.cl";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
