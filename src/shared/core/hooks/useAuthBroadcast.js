"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useCallback, useRef } from "react";
import authChannel, { getTabId } from "@/services/channels/authChannel";

export const useAuthBroadcast = () => {
  const router = useRouter();
  const tabIdRef = useRef(null);

  // Obtener el Tab ID de esta ventana (se genera una vez y se mantiene)
  if (tabIdRef.current == null) {
    tabIdRef.current = getTabId();
  }

  // Función para restaurar la pestaña a la última ruta
  const restoreTabs = useCallback(async () => {
    const tabId = tabIdRef.current;
    
    let lastRoute = localStorage.getItem(`lastRoute_${tabId}`);
    
    if (lastRoute) {
      sessionStorage.setItem("lastRoute", lastRoute);
      localStorage.removeItem(`lastRoute_${tabId}`);
    } else {
      lastRoute = sessionStorage.getItem("lastRoute") || "/inicio";
    }
    
    setTimeout(() => {
      router.replace(lastRoute);
    }, 2000);
  }, [router]);

  // Función para redirigir a la página de inicio
  const redirectToHome = useCallback(() => {
    const tabId = tabIdRef.current;
    setTimeout(() => {
      router.replace("/inicio");
      localStorage.removeItem(`lastRoute_${tabId}`);
    }, 2000);
  }, [router]);

  useEffect(() => {
    const tabId = tabIdRef.current;
    
    // Manejador para eventos de inicio de sesión
    const handleLogin = async ({ reason, action }) => {
      // Solo redirigir automáticamente si es un logout manual
      if (reason === "manual") {
        // Agregar un delay para mostrar el loading
        setTimeout(() => {
          router.replace("/inicio");
        }, 1500);
      }
      // Para otros casos, no hacer nada automáticamente
      // Las acciones se ejecutarán cuando el usuario haga clic en los botones del modal
    };

    // Manejador para decisiones del usuario
    const handleUserDecision = async ({ action }) => {
      if (action === "home") {
        redirectToHome();
      } else if (action === "restore") {
        await restoreTabs();
      }
    };

    // Manejador para eventos de cierre de sesión
    const handleLogout = () => {
      signOut({ callbackUrl: "/" });
    };

    authChannel.onmessage = (event) => {
      const { type } = event.data;
      if (type === "login") {
        handleLogin(event.data);
      } else if (type === "user_decision") {
        handleUserDecision(event.data);
      } else if (type === "logout") {
        handleLogout();
      }
    };

    // Limpieza: Borrar backup de esta tab al cerrar la ventana
    const cleanup = () => {
      const backupKey = `lastRoute_${tabId}`;
      if (localStorage.getItem(backupKey)) {
        localStorage.removeItem(backupKey);
      }
    };

    window.addEventListener("beforeunload", cleanup);

    return () => {
      window.removeEventListener("beforeunload", cleanup);
    };
  }, [router, redirectToHome, restoreTabs]);

  return {
    redirectToHome,
    restoreTabs,
    authChannel,
  };
};
