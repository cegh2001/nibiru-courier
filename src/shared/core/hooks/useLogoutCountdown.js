import { useEffect, useState } from "react";
import { useInactivity, INACTIVITY_CONSTANTS } from "@/core/stores/inactivityStore";

const WARNING_THRESHOLD_S = INACTIVITY_CONSTANTS.WARNING_THRESHOLD_MS / 1000;

export const useLogoutCountDown = (onLogout) => {
  const { expiresAt, isActive, stopCountdown, recordActivity } =
    useInactivity();

  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000))
  );
  const open =
    isActive &&
    remainingSeconds <= WARNING_THRESHOLD_S &&
    remainingSeconds > 0;

  // Tick de UI cada segundo: calcula el tiempo restante a partir de expiresAt
  // Inmune a throttling del tab porque usa timestamp absoluto
  useEffect(() => {
    if (!isActive) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.ceil((useInactivity.getState().expiresAt - Date.now()) / 1000)
      );
      setRemainingSeconds(remaining);
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Lógica de modal y logout basada en remainingSeconds
  useEffect(() => {
    if (remainingSeconds === 0 && isActive) {
      onLogout("inactivity");
      stopCountdown();
    }
  }, [remainingSeconds, isActive, onLogout, stopCountdown]);

  // Tiempo formateado para la UI (mm:ss)
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const keepSessionActive = () => {
    recordActivity();
  };

  return {
    countdown: remainingSeconds,
    formattedTime,
    open,
    setOpen: () => {},
    keepSessionActive,
    resetCountdown: recordActivity,
  };
};