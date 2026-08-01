"use client";
import { HeavenLite as Heaven } from "@/components/animations/HeavenLite";
import { motion, AnimatePresence } from "framer-motion";
import { SessionModal } from "@/core/components/SessionModal";
import { useActivityListener } from "@/core/hooks/useActivityListener";
import { useExtendSession } from "@/core/hooks/useExtendSession";
import { useSessionStatus } from "@/core/hooks/useSessionStatus";
import { Spinner } from "@/components/animations/Spinner";
import { useState, useEffect } from "react";

function LoginLoading({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Spinner />
        <span className="text-sm text-navy font-medium">Iniciando sesión...</span>
      </div>
    </div>
  );
}

export const SessionStatus = ({ children }) => {
  // Lógica de sesión (redirecciones, toasts, etc.) extraída en un hook separado
  const { status, showModal, showAuthLoading } = useSessionStatus();
  
  // Estado para controlar el delay mínimo de la animación
  const [minDelayCompleted, setMinDelayCompleted] = useState(false);

  // Listener de actividad del usuario (throttled) para resetear inactividad
  useActivityListener();

  // Hook que extiende la sesión de forma automática
  useExtendSession();

  // Efecto para el delay mínimo de 0.5 segundos
  useEffect(() => {
    // Iniciar el timer siempre, independientemente del status
    const minDelayTimer = setTimeout(() => {
      setMinDelayCompleted(true);
    }, 500);

    return () => clearTimeout(minDelayTimer);
  }, []); // Solo ejecutar una vez al montar el componente

  const showHeaven = status === "loading" || !minDelayCompleted;

  // Variantes de animación para framer-motion
  const fadeVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      {showHeaven ? (
        <motion.div
          key="heaven"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Heaven />
        </motion.div>
      ) : (
        <motion.div
          key="session"
          variants={fadeVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="min-h-screen" // Asegurar altura completa
        >
          <LoginLoading show={showAuthLoading} />
          <SessionModal isOpen={showModal} />
          {!showAuthLoading && children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};