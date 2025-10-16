'use client';

import { useState } from "react";
import Link from "next/link";

export default function SupportOverlay() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed left-4 bottom-4 z-50 md:left-6 md:bottom-6 pointer-events-none">
      {/* Panneau */}
      <div
        className={`pointer-events-auto transition-all duration-300 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="mb-3 md:mb-4 bg-black/80 backdrop-blur-md border border-gray-800/60 rounded-xl shadow-2xl p-3 md:p-4 w-[280px] md:w-[320px]">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-white font-dogelica text-base md:text-lg">Soutenir le projet</span>
          </div>
          <div className="flex items-center gap-3">
            <img
              src="/qr-code.png"
              alt="QR code Buy me a coffee"
              className="w-24 h-24 md:w-28 md:h-28 rounded-md border border-gray-800/60"
            />
            <div className="text-gray-300 text-sm">
              <div className="opacity-90">Scanne le QR</div>
              <div className="opacity-60">ou clique ci-dessous</div>
              <Link
                href="https://buymeacoffee.com/rhaaamen"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-yellow-400/40 bg-yellow-400/10 text-yellow-300 hover:bg-yellow-400/20 hover:text-yellow-200 transition-colors font-dogelica"
              >
                ☕ Buy me a coffee
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-400/40 bg-black/70 text-yellow-300 hover:bg-yellow-400/10 hover:text-yellow-200 transition-colors shadow-lg font-dogelica"
        aria-expanded={open}
        aria-label="Soutenir le projet"
        style={{ paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))' }}
      >
        ☕ Soutenir
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 24 24" fill="none" aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}
