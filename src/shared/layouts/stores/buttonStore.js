import { create } from "zustand";

// Detectar si es ventana hija
const isChildWindow = () => {
  if (typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get("parentWindow") === "true";
};

export const useButtonStore = create((set, get) => ({
  // Estados iniciales
  buttonStates: { list: true, create: false, asign: false, multiple: false },
  direction: -1,
  noReset: false,
  currentPathname: "",
  pathChangeCount: 0,

  // Métodos para actualizar los estados
  setButtonStates: (states) => set({ buttonStates: states }),
  setDirection: (dir) => set({ direction: dir }),
  setNoReset: (value) => set({ noReset: value }),

  handlePathChange: (newPath) => {
    const { currentPathname, noReset, pathChangeCount } = get();

    // Solo actualizamos si la ruta ha cambiado
    if (currentPathname !== newPath) {
      // Incrementar el contador de cambios de ruta
      const newPathChangeCount = pathChangeCount + 1;
      
      // Si es ventana hija, no resetear los botones y no afectar el estado padre
      if (isChildWindow()) {
        set({ 
          currentPathname: newPath,
          pathChangeCount: newPathChangeCount
        });
        return;
      }
      
      // Solo resetear los botones en ventana padre si no hay noReset activo
      if (!noReset) {
        set({
          buttonStates: { list: true, create: false, asign: false, multiple: false },
        });
      }
      
      // Siempre desactivar noReset después del primer cambio
      if (newPathChangeCount > 1) {
        set({ noReset: false });
        // Eliminar el objeto del localStorage si ya no es necesario
        if (typeof window !== "undefined") {
          localStorage.removeItem("selectedObject");
        }
      }

      set({ 
        currentPathname: newPath,
        pathChangeCount: newPathChangeCount
      });
    }
  },
}));
