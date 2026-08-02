import type { MetadataRoute } from "next";

// Landing estática (output: export): las rutas de metadata deben ser estáticas.
export const dynamic = "force-static";

const SITE_URL = "https://sworkc.cl";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
