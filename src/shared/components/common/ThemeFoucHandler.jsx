"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Componente cliente para manejar dinámicamente el fondo del HTML/Body
 * durante transiciones de rutas del lado del cliente (SPA) y evitar
 * colisiones entre los gradientes claros de (app) y oscuros de (auth).
 */
export function ThemeFoucHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const isDark = pathname === '/' || pathname.startsWith('/privacy');
    if (isDark) {
      document.documentElement.style.backgroundColor = '#020617';
      document.documentElement.classList.add('dark-theme-fouc');
    } else {
      document.documentElement.style.backgroundColor = '';
      document.documentElement.classList.remove('dark-theme-fouc');
    }
  }, [pathname]);

  return null;
}
