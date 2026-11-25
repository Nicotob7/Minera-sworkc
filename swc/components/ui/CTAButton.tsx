import type { ReactNode } from "react";
import { ArrowRight } from "./icons";

type Variant = "primary" | "cyan" | "ghost" | "ghost-dark";

type CTAButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  icon?: boolean;
  className?: string;
};

/** CTA premium (no genérico): degradado, brillo que cruza al hover, icono que se desliza. */
export function CTAButton({ href, children, variant = "primary", icon = true, className = "" }: CTAButtonProps) {
  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[var(--radius)] px-6 py-3.5 text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2";

  const styleByVariant: Record<Variant, string> = {
    primary: "text-white shadow-[var(--shadow-glow)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-cyan)]",
    cyan: "text-brand-950 shadow-[var(--shadow-cyan)] hover:-translate-y-0.5",
    ghost: "border border-brand-200 bg-white/70 text-brand-900 backdrop-blur hover:border-cyan-400 hover:text-brand-700",
    "ghost-dark": "border border-white/25 bg-white/5 text-white backdrop-blur hover:border-cyan-400 hover:bg-white/10",
  };

  const bg =
    variant === "primary" ? "var(--gradient-cta)" : variant === "cyan" ? "var(--gradient-cyan)" : undefined;

  return (
    <a href={href} className={`${base} ${styleByVariant[variant]} ${className}`} style={bg ? { background: bg } : undefined}>
      <span className="relative">{children}</span>
      {icon && <ArrowRight size={16} className="relative transition-transform duration-300 group-hover:translate-x-1" />}
    </a>
  );
}
