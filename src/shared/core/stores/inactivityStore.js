import { create } from "zustand";

// Timeout total de inactividad (25 minutos)
// INDEPENDIENTE de NextAuth y termina ANTES que la sesión de NextAuth (30 min)
const INACTIVITY_TIMEOUT_MS = 25 * 60 * 1000;
// Modal de advertencia aparece 30s antes del logout
const WARNING_THRESHOLD_MS = 30 * 1000;

export const INACTIVITY_CONSTANTS = {
  INACTIVITY_TIMEOUT_MS,
  WARNING_THRESHOLD_MS,
};

// --- BroadcastChannel integrado para sincronización entre pestañas ---
let channel = null;

const getChannel = () => {
  if (typeof window === "undefined") return null;
  if (!channel) {
    try {
      channel = new BroadcastChannel("inactivity_sync");
      channel.onmessage = (event) => {
        if (event.data?.type === "ACTIVITY") {
          useInactivity.getState().syncExpiresAt(event.data.expiresAt);
        }
      };
    } catch {
      /* BroadcastChannel no disponible */
    }
  }
  return channel;
};

export const useInactivity = create((set, get) => ({
  // Timestamp absoluto en el que la sesión expira por inactividad
  expiresAt: Date.now() + INACTIVITY_TIMEOUT_MS,
  isActive: true,

  // Registrar actividad del usuario: reinicia el temporizador
  recordActivity: () => {
    const newExpiresAt = Date.now() + INACTIVITY_TIMEOUT_MS;
    set({ expiresAt: newExpiresAt, isActive: true });
    const ch = getChannel();
    if (ch) {
      ch.postMessage({ type: "ACTIVITY", expiresAt: newExpiresAt });
    }
  },

  // Pausar el temporizador (usado al hacer logout)
  stopCountdown: () => set({ isActive: false }),

  // Sincronizar expiresAt recibido de otra pestaña
  syncExpiresAt: (expiresAt) => {
    // Solo adoptar si la otra pestaña tiene un valor más reciente (actividad ocurrió allí)
    if (expiresAt > get().expiresAt) {
      set({ expiresAt, isActive: true });
    }
  },
}));

// Inicializar listener del canal al cargar el módulo (solo en browser)
if (typeof window !== "undefined") {
  getChannel();
}