'use client';

import './styles/HeavenLite.css';

/**
 * HeavenLite - Versión optimizada de Heaven
 * 
 * Reemplaza 8 nubes animadas con un gradiente CSS simple.
 * Usa solo transform y opacity (GPU-accelerated).
 * Respeta prefers-reduced-motion automáticamente.
 * 
 * Comparación de rendimiento:
 * - Heaven original: 8 elementos con background-position animado + preload de imágenes
 * - HeavenLite: 4 divs con transform/opacity (GPU-accelerated, sin imágenes)
 */
export const HeavenLite = ({ children }) => {
  return (
    <div className="relative flex justify-center items-center text-center min-h-screen overflow-hidden bg-linear-to-b from-sky-300 via-sky-200 to-blue-100">
      {/* Capa de nubes estilizadas con CSS puro */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Nube 1 - Grande, izquierda */}
        <div
          className="absolute bottom-20 left-[10%] w-32 h-16 bg-white/80 rounded-full blur-sm cloud-drift"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute bottom-24 left-[15%] w-24 h-12 bg-white/70 rounded-full blur-sm cloud-drift"
          style={{ animationDelay: '0.5s' }}
        />

        {/* Nube 2 - Mediana, centro-derecha */}
        <div
          className="absolute bottom-16 right-[20%] w-28 h-14 bg-white/75 rounded-full blur-sm cloud-drift-reverse"
          style={{ animationDelay: '1s' }}
        />

        {/* Nube 3 - Pequeña, derecha */}
        <div
          className="absolute bottom-32 right-[10%] w-20 h-10 bg-white/60 rounded-full blur-sm cloud-drift"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      {/* Contenido */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
