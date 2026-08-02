import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Landing estática (export) servida en S3 + CloudFront (apex sworkc.cl).
  // No hay SSR: la única ruta server (form de contacto) se movió a deferred-ssr/.
  output: "export",
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    optimizePackageImports: ["@tabler/icons-react"],
  },
};

export default nextConfig;
