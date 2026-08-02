"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "./ui/icons";

const LINKS = [
  { label: "Inicio", href: "#inicio" },
  { label: "Nosotros", href: "#nosotros" },
  { label: "Servicios", href: "#servicios" },
  { label: "Dashboard", href: "#dashboard" },
  { label: "Contacto", href: "#contacto" },
];

/**
 * Navbar blanco flotante tipo pill. Usa colores LITERALES (no tokens) a propósito:
 * debe permanecer blanco con texto oscuro también en modo oscuro.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onScroll = () => setOpen(false);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("scroll", onScroll);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-5">
      <nav
        className={`animate-fade-down mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[var(--radius-pill)] border border-black/[0.06] bg-white py-2.5 pl-6 pr-3 transition-shadow duration-300 ${
          scrolled ? "shadow-[var(--shadow-lg)]" : "shadow-[var(--shadow-sm)]"
        }`}
      >
        <a href="#inicio" className="flex shrink-0 items-center" aria-label="SWORKC — inicio">
          <Image
            src="/logo-swc.png"
            alt="SWORKC Technologies"
            width={166}
            height={50}
            priority
          />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative rounded-[var(--radius-sm)] px-3.5 py-2 text-sm font-medium text-[#3a4256] transition-colors duration-200 hover:text-[#0b1020] focus-visible:text-[#0b1020] focus-visible:outline-none after:absolute after:inset-x-3.5 after:bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-[#0a0c77] after:transition-transform after:duration-300 after:content-[''] hover:after:scale-x-100 focus-visible:after:scale-x-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="#contacto"
            className="hidden items-center rounded-[var(--radius-pill)] bg-[#0a0c77] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-colors duration-200 hover:bg-[#080a5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77] focus-visible:ring-offset-2 sm:inline-flex"
          >
            Solicitar demo
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-[#0b1020] transition-colors hover:bg-black/[0.05] lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="animate-fade-down mx-auto mt-2 max-w-7xl rounded-[var(--radius-lg)] border border-black/[0.06] bg-white p-3 shadow-[var(--shadow-lg)] lg:hidden">
          <ul className="flex flex-col">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-[var(--radius-sm)] px-4 py-3 text-sm font-medium text-[#3a4256] hover:bg-black/[0.05] focus-visible:bg-black/[0.05] focus-visible:text-[#0b1020] focus-visible:outline-none"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="mt-1 px-1">
              <a
                href="#contacto"
                onClick={() => setOpen(false)}
                className="block rounded-[var(--radius-pill)] bg-[#0a0c77] px-5 py-3 text-center text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77] focus-visible:ring-offset-2"
              >
                Solicitar demo
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
