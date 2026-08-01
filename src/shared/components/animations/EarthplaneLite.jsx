'use client';

import { FaPlane } from "react-icons/fa";

/**
 * EarthplaneLite - Spinner con avión orbitando
 * 
 * Spinner puro Tailwind con avión orbitando — ligero en PCs de bajo rendimiento.
 * Usa CSS animations nativo (animate-spin) + un keyframe custom para la órbita.
 * 
 * Zero dependencia de imágenes PNG.
 * Zero framer-motion.
 * ~0 nodos DOM extra.
 */
export const EarthplaneLite = () => (
  <div className="grid place-content-center">
    <div className="relative w-28 h-28 translate-y-8">
      {/* Anillo exterior - gira lento */}
      <div className="absolute inset-0 rounded-full border-4 border-navy/20 border-t-crimson animate-spin" 
           style={{ animationDuration: '2s' }} />
      {/* Anillo interior - gira opuesto, más rápido */}
      <div className="absolute inset-2 rounded-full border-4 border-navy/10 border-b-navy animate-spin"
           style={{ animationDuration: '1.5s', animationDirection: 'reverse' }} />
      {/* Centro - globo estilizado */}
      <div className="absolute inset-4 rounded-full bg-linear-to-br from-navy via-navy-dark to-navy-light shadow-lg flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-linear-to-tr from-transparent via-white/10 to-white/20" />
      </div>
      {/* Avión orbitando */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
        <FaPlane className="size-6 absolute -top-2.5 left-1/2 -translate-x-1/2 text-navy text-lg drop-shadow-md z-30" />
      </div>
    </div>
  </div>
);
