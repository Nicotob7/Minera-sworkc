/**
 * Cursor de las pantallas de ejemplo (lo mueve motorCursor.ts). Va dentro de un contenedor
 * posicionado; marca `data-cursor` para que el componente de cliente lo encuentre.
 */
export function CursorDemo({ className = "" }: { className?: string }) {
  return (
    <div data-cursor aria-hidden className={`pointer-events-none absolute left-0 top-0 z-20 opacity-0 ${className}`}>
      <span data-clic className="absolute -left-3 -top-3 h-6 w-6 rounded-full border-2 border-[#0a0c77]/60 opacity-0" />
      <svg width="22" height="22" viewBox="0 0 24 24" className="relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]">
        <path d="M4 2 L4 19.5 L8.6 15.2 L11.7 21.8 L14.6 20.5 L11.5 14 L17.8 14 Z" fill="#0b1020" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}
