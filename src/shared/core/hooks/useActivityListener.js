import { useEffect, useRef } from "react";
import { useInactivity } from "@/core/stores/inactivityStore";

const THROTTLE_MS = 1000;

export const useActivityListener = () => {
  const recordActivity = useInactivity((s) => s.recordActivity);
  const lastRef = useRef(0);

  useEffect(() => {
    const handleActivity = () => {
      const now = Date.now();
      if (now - lastRef.current > THROTTLE_MS) {
        lastRef.current = now;
        recordActivity();
      }
    };

    const events = ["mousemove", "keydown", "scroll", "click", "touchstart"];

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, {
        passive: true,
        capture: true,
      });
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity, { capture: true });
      });
    };
  }, [recordActivity]);
};
