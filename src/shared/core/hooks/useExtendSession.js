import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { broadcastLogout } from "@/services/channels/authChannel";
import { apiClient } from "@/services/apiClient";
import { useInactivity } from "@/core/stores/inactivityStore";
import { SESSION_CONFIG } from "@/core/config/sessionConfig";

const LOCK_NAME = "session_extension";
const CHECK_INTERVAL = 30 * 1000; // Verificar cada 30s si toca extender

export const useExtendSession = () => {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") {
      localStorage.removeItem(SESSION_CONFIG.STORAGE_KEYS.NEXT_EXTENSION_TIME);
      localStorage.removeItem(SESSION_CONFIG.STORAGE_KEYS.BACKEND_TOKEN_EXPIRES);
      return;
    }

    // Canal para notificar a otras pestañas cuando se extiende la sesión
    const channel = new BroadcastChannel(SESSION_CONFIG.CHANNEL_NAME);
    channel.onmessage = (event) => {
      if (event.data?.type === "session_extended") {
        const { nextExtensionTime, expiresAt } = event.data;
        localStorage.setItem(
          SESSION_CONFIG.STORAGE_KEYS.NEXT_EXTENSION_TIME,
          nextExtensionTime.toString()
        );
        localStorage.setItem(
          SESSION_CONFIG.STORAGE_KEYS.BACKEND_TOKEN_EXPIRES,
          expiresAt
        );
      }
    };

    // Llamada real al backend para extender la sesión
    const doExtend = async () => {
      try {
        const response = await apiClient.get("/extend_session");
        const { date_expires } = response.data.data;
        const dateExpires = new Date(date_expires);

        if (isNaN(dateExpires.getTime())) {
          throw new Error("Formato de fecha inválido para date_expires.");
        }

        const nextTime = Date.now() + SESSION_CONFIG.EXTENSION_INTERVAL;
        localStorage.setItem(
          SESSION_CONFIG.STORAGE_KEYS.NEXT_EXTENSION_TIME,
          nextTime.toString()
        );
        localStorage.setItem(
          SESSION_CONFIG.STORAGE_KEYS.BACKEND_TOKEN_EXPIRES,
          dateExpires.toISOString()
        );

        channel.postMessage({
          type: "session_extended",
          nextExtensionTime: nextTime,
          expiresAt: dateExpires.toISOString(),
        });
      } catch (error) {
        if (error.response?.status === 401) {
          broadcastLogout("backendTokenExpired");
        }
      }
    };

    // Cada CHECK_INTERVAL verifica si ya toca extender, y usa Web Locks
    // para garantizar que solo una pestaña haga la llamada
    const extendIfNeeded = async () => {
      const { isActive, expiresAt } = useInactivity.getState();
      const remainingS = (expiresAt - Date.now()) / 1000;

      // No extender si el usuario está inactivo o cerca del timeout
      if (!isActive || remainingS < SESSION_CONFIG.MIN_ACTIVITY_THRESHOLD) {
        return;
      }

      // Verificar si ya pasó el tiempo programado para la próxima extensión
      const nextExtensionTime = parseInt(
        localStorage.getItem(SESSION_CONFIG.STORAGE_KEYS.NEXT_EXTENSION_TIME) ||
          "0",
        10
      );
      if (Date.now() < nextExtensionTime) return;

      // Usar Web Locks para que solo una pestaña haga la llamada
      if (navigator?.locks) {
        try {
          await navigator.locks.request(
            LOCK_NAME,
            { ifAvailable: true },
            async (lock) => {
              if (!lock) return; // Otra pestaña ya tiene el lock

              // Double-check después de adquirir el lock
              const freshNext = parseInt(
                localStorage.getItem(
                  SESSION_CONFIG.STORAGE_KEYS.NEXT_EXTENSION_TIME
                ) || "0",
                10
              );
              if (Date.now() < freshNext) return;

              await doExtend();
            }
          );
        } catch (e) {
          console.error("Error adquiriendo lock de extensión de sesión:", e);
        }
      } else {
        // Fallback sin Web Locks (navegadores muy antiguos)
        await doExtend();
      }
    };

    // Primera verificación inmediata + intervalo periódico
    extendIfNeeded();
    const interval = setInterval(extendIfNeeded, CHECK_INTERVAL);

    return () => {
      clearInterval(interval);
      channel.close();
    };
  }, [status]);

  return null;
};
