// Configuración centralizada para la gestión de sesiones

export const SESSION_CONFIG = {
  // Intervalo de extensión de sesión (10 minutos)
  EXTENSION_INTERVAL: 10 * 60 * 1000,

  // Tiempo mínimo de inactividad antes de no extender (5 minutos en segundos)
  MIN_ACTIVITY_THRESHOLD: 5 * 60,

  // Nombre del canal de comunicación entre ventanas para extensión
  CHANNEL_NAME: "session_extension",

  // Claves de localStorage
  STORAGE_KEYS: {
    NEXT_EXTENSION_TIME: "nextExtensionTime",
    BACKEND_TOKEN_EXPIRES: "backendTokenExpiresAt",
  },
};
