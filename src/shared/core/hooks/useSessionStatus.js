"use client";
// Hooks
import { useSessionDecision } from "@/core/hooks/useSessionDecision";
// Next
import { useSession, getSession } from "next-auth/react";
import { usePathname } from "next/navigation";
// React
import { useEffect } from "react";
// Store
import { useSessionStore } from "@/core/stores/sessionStore";
import { broadcastLogout } from "@/services/channels/authChannel";

export function useSessionStatus() {
  const pathname = usePathname();
  const { status } = useSession();
  const { handleHome } = useSessionDecision();
  const { isLogging, setIsLogging, showModal, setShowModal, isRestoring, setIsRestoring } = useSessionStore();

  const handleLogout = (async () => {
    const session = await getSession();
    if (!session?.user) {
      broadcastLogout("sessionExpired");
    } else {
      window.location.reload();
    }
  });

  useEffect(() => {
    const isPublicRoute = pathname === "/" || pathname.startsWith("/privacy");

    // Si la sesión está cargando, no hacemos nada
    if (status === "loading") return;

    // Motivo de logout guardado en el sessionStorage
    const logoutReason = sessionStorage.getItem("logoutReason");

    // 1) Si estamos autenticados en "/" y no hay proceso de logout ni modal NI restauración, redirigir a /inicio
    if (status === "authenticated" && pathname === "/" && !isLogging && !showModal && !isRestoring) {
      handleHome();
      return;
    }

    // 2) Si estamos autenticados, en "/", en proceso de login Y el logout fue MANUAL
    if (status === "authenticated" && pathname === "/" && isLogging && logoutReason === "manual") {
      // Dar tiempo para mostrar el loading y luego redirigir automáticamente a inicio
      setTimeout(() => {
        handleHome();
        setIsLogging(false);
        sessionStorage.removeItem("logoutReason"); // Limpiar después de procesar
      }, 1500);
      return;
    }

    // 3) Si estamos autenticados, en proceso de login Y el logout NO fue manual (inactividad, expiración, etc.)
    if (status === "authenticated" && pathname === "/" && isLogging && logoutReason && logoutReason !== "manual") {
      // Mostrar el modal de decisión para que el usuario elija
      setShowModal(true);
      setIsLogging(false);
      sessionStorage.removeItem("logoutReason"); // Limpiar después de procesar
      return;
    }

    // 4) Si estamos autenticados, en "/", en proceso de login pero NO hay logoutReason
    // (caso de login inicial o refresh)
    if (status === "authenticated" && pathname === "/" && isLogging && !logoutReason) {
      setTimeout(() => {
        handleHome();
        setIsLogging(false);
      }, 1500);
      return;
    }

    // 5) Si no estamos en la raíz pero el modal sigue abierto, cerrar modal y forzar Home
    if (pathname !== "/" && showModal) {
      setShowModal(false);
      handleHome();
    }

    // 6.5) Si no estamos en "/" y estábamos restaurando, limpiar el flag
    if (pathname !== "/" && isRestoring) {
      setIsRestoring(false);
    }

    // 6) Si no está autenticado y no está en login, hacer logout
    if (status === "unauthenticated" && !isPublicRoute) {
      handleLogout();
    }

  }, [status, isLogging, showModal, pathname, handleHome, setIsLogging, setShowModal, isRestoring, setIsRestoring]);

  // Mostrar loading cuando:
  // 1. El usuario está en proceso de login (isLogging) y está autenticado en "/"
  // 2. O cuando está autenticado en "/" y está siendo redirigido
  const showAuthLoading = 
    (status === "authenticated" && pathname === "/" && isLogging) ||
    (status === "authenticated" && pathname === "/" && !showModal);

  return {
    status,
    showModal,
    showAuthLoading,
  };
}