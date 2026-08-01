// Hooks
import { useAuthBroadcast } from "@/core/hooks/useAuthBroadcast";
// React
import { useCallback } from "react";
// Stores
import { useSessionStore } from "@/core/stores/sessionStore";

export const useSessionDecision = () => {
  const { setShowModal, setIsRestoring } = useSessionStore();
  const { restoreTabs, redirectToHome, authChannel } = useAuthBroadcast();

  const handleRestore = useCallback(() => {
    authChannel.postMessage({ type: "user_decision", action: "restore" });
    setIsRestoring(true);
    setShowModal(false);
    restoreTabs();
  }, [authChannel, setShowModal, setIsRestoring, restoreTabs]);

  const handleHome = useCallback(() => {
    authChannel.postMessage({ type: "user_decision", action: "home" });
    setShowModal(false);
    redirectToHome();
  }, [authChannel, setShowModal, redirectToHome]);

  return {
    handleRestore,
    handleHome,
  };
};
