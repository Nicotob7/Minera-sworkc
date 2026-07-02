type TechGridProps = {
  className?: string;
  variant?: "light" | "dark";
  animated?: boolean;
};

/** Capa decorativa de cuadrícula técnica (líneas tipo coordenadas/monitoreo). */
export function TechGrid({ className = "", variant = "light", animated = false }: TechGridProps) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${variant === "dark" ? "tech-grid-dark" : "tech-grid"} ${
        animated ? "tech-grid-animated" : ""
      } ${className}`}
    />
  );
}
