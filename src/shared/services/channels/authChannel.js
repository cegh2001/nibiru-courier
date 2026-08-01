"use client";

import { signIn, signOut } from "next-auth/react";

// Crear una instancia singleton del BroadcastChannel
const authChannel = new BroadcastChannel("auth_channel");

/**
 * Genera un ID único para identificar esta tab/ventana
 */
const getTabId = () => {
  // Verificar que estamos en el navegador
  if (typeof window === 'undefined') return null;
  
  // Intentar obtener el ID existente de sessionStorage (persiste durante la sesión de la tab)
  let tabId = sessionStorage.getItem("tabId");
  
  if (!tabId) {
    // Generar nuevo ID único para esta tab
    tabId = `tab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem("tabId", tabId);
  }
  
  return tabId;
};

/**
 * Función para manejar la transmisión de inicio de sesión
 * @param {Object} credentials - Credenciales de usuario
 * @returns {Object} Resultado del intento de inicio de sesión
 */
export const broadcastLogin = async (credentials, action = "restore") => {
  const result = await signIn("credentials", {
    redirect: false,
    ...credentials,
  });

  if (!result.error && authChannel) {
    const logoutReason = sessionStorage.getItem("logoutReason");
    authChannel.postMessage({ type: "login", reason: logoutReason, action });
  }

  return result;
};

/**
 * Función para manejar la transmisión de cierre de sesión
 * @param {string} reason - Razón del cierre de sesión (por defecto "manual")
 */
export const broadcastLogout = (reason = "manual") => {
  if (authChannel) {
    sessionStorage.setItem("logoutReason", reason);
    
    const lastRoute = sessionStorage.getItem("lastRoute");
    const tabId = getTabId();
    
    if (lastRoute && tabId) {
      localStorage.setItem(`lastRoute_${tabId}`, lastRoute);
    }
    
    authChannel.postMessage({ type: "logout", reason });
  }
  signOut({ callbackUrl: "/" });
};

export default authChannel;
export { getTabId };
