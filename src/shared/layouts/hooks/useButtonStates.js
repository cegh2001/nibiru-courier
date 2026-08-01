"use client";

import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useMemo } from "react";
import { useButtonStore } from "@/layouts/stores/buttonStore";

export const useButtonStates = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const storeSetButtonStates = useButtonStore((state) => state.setButtonStates);
  const direction = useButtonStore((state) => state.direction);
  const setDirection = useButtonStore((state) => state.setDirection);
  const noReset = useButtonStore((state) => state.noReset);
  const setNoReset = useButtonStore((state) => state.setNoReset);
  const handlePathChange = useButtonStore((state) => state.handlePathChange);

  // Derivar síncronamente el estado de los botones desde useSearchParams de Next.js
  const urlView = searchParams ? (searchParams.get("view") || "list") : "list";

  const buttonStates = useMemo(() => ({
    list: urlView === "list",
    create: urlView === "create",
    asign: urlView === "asign",
    multiple: urlView === "multiple",
  }), [urlView]);

  // Sincronizar cambios de ruta
  useEffect(() => {
    handlePathChange(pathname);
  }, [pathname, handlePathChange]);

  // Sincronizar el estado de los botones derivado al store Zustand
  useEffect(() => {
    storeSetButtonStates(buttonStates);
  }, [buttonStates, storeSetButtonStates]);

  // Controlar dirección de animación ante cambios de vista (URL)
  const prevViewRef = useRef(urlView);
  useEffect(() => {
    if (prevViewRef.current !== urlView) {
      if (urlView === "list" && prevViewRef.current !== "list") {
        setDirection(-1);
      } else if (urlView !== "list" && prevViewRef.current === "list") {
        setDirection(1);
      }
      prevViewRef.current = urlView;
    }
  }, [urlView, setDirection]);

  // Modificar setButtonStates para desencadenar la navegación usando useRouter
  const setButtonStates = useCallback(
    (states) => {
      let targetView = "list";
      if (states.create) targetView = "create";
      else if (states.asign) targetView = "asign";
      else if (states.multiple) targetView = "multiple";

      const currentParams = searchParams ? new URLSearchParams(searchParams.toString()) : new URLSearchParams();
      const currentView = currentParams.get("view") || "list";

      if (targetView !== currentView) {
        // Actualizar dirección de animación inmediatamente
        const newDir = targetView === "list" ? -1 : 1;
        setDirection(newDir);

        if (targetView === "list") {
          currentParams.delete("view");
        } else {
          currentParams.set("view", targetView);
        }

        const queryString = currentParams.toString();
        const newUrl = `${pathname}${queryString ? `?${queryString}` : ""}`;

        // Al ir de lista a formulario, usar router.push
        // Al volver a la lista o cambiar entre subvistas, usar router.replace
        if (currentView === "list" && targetView !== "list") {
          router.push(newUrl);
        } else {
          router.replace(newUrl);
        }
      }
    },
    [searchParams, pathname, router, setDirection]
  );

  return {
    buttonStates,
    setButtonStates,
    direction,
    setDirection,
    noReset,
    setNoReset,
  };
};
