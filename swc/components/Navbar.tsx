"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu, X } from "./ui/icons";
import { NAV_CONTACTO, NAV_GROUPS, NAV_INICIO } from "./site/nav";

/* Ítem plano del menú de escritorio, con el mismo estilo que los disparadores. */
const plainDesktopLink =
  "inline-flex items-center rounded-[var(--radius-sm)] px-3.5 py-2 text-sm font-medium text-[#3a4256] transition-colors duration-200 hover:text-[#0b1020] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77]/30";

/**
 * Navbar blanco flotante tipo pill con mega-menú agrupado.
 * Usa colores LITERALES (no tokens) a propósito: la píldora es blanca con texto
 * oscuro. Accesible: los disparadores tienen aria-expanded/aria-haspopup, Escape
 * cierra y en móvil el menú es un acordeón (no depende de hover).
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape cierra todo; click fuera del header cierra los desplegables.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveGroup(null);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveGroup(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  // Al hacer scroll cerramos desplegables abiertos para no dejarlos flotando.
  useEffect(() => {
    if (!activeGroup && !mobileOpen) return;
    const onScroll = () => {
      setActiveGroup(null);
      setMobileOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [activeGroup, mobileOpen]);

  const closeAll = () => {
    setActiveGroup(null);
    setMobileOpen(false);
    setMobileGroup(null);
  };

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:pt-5">
      <nav
        className={`animate-fade-down mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-[var(--radius-pill)] border border-black/[0.06] bg-white py-2.5 pl-6 pr-3 transition-shadow duration-300 ${
          scrolled ? "shadow-[var(--shadow-lg)]" : "shadow-[var(--shadow-sm)]"
        }`}
      >
        <Link href="/" className="flex shrink-0 items-center" aria-label="SWORKC — inicio" onClick={closeAll}>
          <Image src="/logo-swc.png" alt="SWORKC Technologies" width={166} height={50} priority />
        </Link>

        {/* Menú de escritorio */}
        <ul className="hidden items-center gap-1 lg:flex">
          <li>
            <Link href={NAV_INICIO.href} onClick={closeAll} className={plainDesktopLink}>
              {NAV_INICIO.label}
            </Link>
          </li>
          {NAV_GROUPS.map((group) => {
            const open = activeGroup === group.id;
            const panelId = `menu-${group.id}`;
            return (
              <li
                key={group.id}
                className="relative"
                onMouseEnter={() => setActiveGroup(group.id)}
                onMouseLeave={() => setActiveGroup((cur) => (cur === group.id ? null : cur))}
              >
                <button
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setActiveGroup((cur) => (cur === group.id ? null : group.id))}
                  onFocus={() => setActiveGroup(group.id)}
                  className={`inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-3.5 py-2 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77]/30 ${
                    open ? "text-[#0b1020]" : "text-[#3a4256] hover:text-[#0b1020]"
                  }`}
                >
                  {group.label}
                  <ChevronDown
                    size={15}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                  />
                </button>

                {open && (
                  <div
                    id={panelId}
                    className="animate-fade-down absolute left-0 top-full z-10 pt-3"
                  >
                    <div
                      className={`rounded-[var(--radius-lg)] border border-black/[0.06] bg-white p-2 shadow-[var(--shadow-lg)] ${
                        group.wide ? "grid w-[34rem] grid-cols-2 gap-1" : "w-72"
                      }`}
                    >
                      {group.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeAll}
                          className="group/link block rounded-[var(--radius)] px-3.5 py-2.5 transition-colors duration-150 hover:bg-[#f3f5f8] focus-visible:bg-[#f3f5f8] focus-visible:outline-none"
                        >
                          <span className="block text-sm font-semibold text-[#0b1020]">{link.label}</span>
                          {link.desc && (
                            <span className="mt-0.5 block text-xs leading-relaxed text-[#5b6680]">
                              {link.desc}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
          <li>
            <Link href={NAV_CONTACTO.href} onClick={closeAll} className={plainDesktopLink}>
              {NAV_CONTACTO.label}
            </Link>
          </li>
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/#contacto"
            onClick={closeAll}
            className="hidden items-center rounded-[var(--radius-pill)] bg-[#0a0c77] px-5 py-2.5 text-sm font-semibold text-white shadow-[var(--shadow-sm)] transition-colors duration-200 hover:bg-[#080a5c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77] focus-visible:ring-offset-2 sm:inline-flex"
          >
            Solicitar demo
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-sm)] text-[#0b1020] transition-colors hover:bg-black/[0.05] lg:hidden"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Menú móvil (acordeón, sin depender de hover) */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="animate-fade-down mx-auto mt-2 max-h-[76vh] max-w-7xl overflow-y-auto rounded-[var(--radius-lg)] border border-black/[0.06] bg-white p-3 shadow-[var(--shadow-lg)] lg:hidden"
        >
          <ul className="flex flex-col">
            <li className="border-b border-black/[0.05]">
              <Link
                href={NAV_INICIO.href}
                onClick={closeAll}
                className="flex min-h-[48px] w-full items-center rounded-[var(--radius-sm)] px-4 py-3 text-sm font-semibold text-[#0b1020] hover:bg-black/[0.03] focus-visible:bg-black/[0.03] focus-visible:outline-none"
              >
                {NAV_INICIO.label}
              </Link>
            </li>
            {NAV_GROUPS.map((group) => {
              const open = mobileGroup === group.id;
              const panelId = `mobile-menu-${group.id}`;
              return (
                <li key={group.id} className="border-b border-black/[0.05] last:border-0">
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setMobileGroup((cur) => (cur === group.id ? null : group.id))}
                    className="flex min-h-[48px] w-full items-center justify-between rounded-[var(--radius-sm)] px-4 py-3 text-sm font-semibold text-[#0b1020] hover:bg-black/[0.03] focus-visible:bg-black/[0.03] focus-visible:outline-none"
                  >
                    {group.label}
                    <ChevronDown
                      size={17}
                      className={`text-[#5b6680] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                  </button>
                  {open && (
                    <ul id={panelId} className="pb-2">
                      {group.links.map((link) => (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={closeAll}
                            className="block rounded-[var(--radius-sm)] px-4 py-2.5 pl-6 text-sm font-medium text-[#3a4256] hover:bg-black/[0.05] focus-visible:bg-black/[0.05] focus-visible:text-[#0b1020] focus-visible:outline-none"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
            <li className="border-b border-black/[0.05]">
              <Link
                href={NAV_CONTACTO.href}
                onClick={closeAll}
                className="flex min-h-[48px] w-full items-center rounded-[var(--radius-sm)] px-4 py-3 text-sm font-semibold text-[#0b1020] hover:bg-black/[0.03] focus-visible:bg-black/[0.03] focus-visible:outline-none"
              >
                {NAV_CONTACTO.label}
              </Link>
            </li>
            <li className="mt-2 px-1">
              <Link
                href="/#contacto"
                onClick={closeAll}
                className="block rounded-[var(--radius-pill)] bg-[#0a0c77] px-5 py-3 text-center text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a0c77] focus-visible:ring-offset-2"
              >
                Solicitar demo
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
