import type { MetadataRoute } from "next";

// Landing estática (output: export): las rutas de metadata deben ser estáticas.
export const dynamic = "force-static";

const SITE_URL = "https://sworkc.cl";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/producto", priority: 0.9 },
    { path: "/nosotros", priority: 0.7 },
    { path: "/recursos", priority: 0.5 },
  ];

  return routes.map(({ path, priority }) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
