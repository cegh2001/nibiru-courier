"use client";

import { findValidParentRoute } from "@/services/navigationConfig";
import { useButtonStates } from "@/layouts/hooks/useButtonStates";
import { TbList } from "react-icons/tb";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

export const CrumbBackButton = ({ href, onBack }) => {
  const pathname = usePathname();
  const { setButtonStates, setNoReset } = useButtonStates();

  // Usar la nueva función para encontrar la ruta padre válida
  const parentRoute = href || findValidParentRoute(pathname);

  const handleBackClick = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (parentRoute === "/finanzas/facturas") {
      setNoReset(false);
      setButtonStates({ list: true, create: false, asign: false, multiple: false });
    }
  };

  // Si estamos en inicio o no hay ruta padre válida, no mostrar el botón
  if (pathname === "/inicio" || parentRoute === pathname) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={150}>
        <TooltipTrigger asChild>
          <Link href={parentRoute} passHref onClick={handleBackClick}>
            <Button className="px-1.5 h-9 bg-white shadow-md shadow-navy-lighter text-navy hover:text-white hover:bg-navy hover:shadow-md hover:shadow-navy-light duration-300">
              <TbList />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Volver a la lista anterior</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
