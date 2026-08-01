"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { TbChevronRight, TbLayoutList } from "react-icons/tb";
import { getSubModules, formatSubModuleName } from "@/services/navigationConfig";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const SubModuleNavigator = ({ currentModulePath, variant = "default" }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(true);
  const isNested = variant === "nested";
  
  // Obtener los submódulos del módulo actual
  const subModules = getSubModules(currentModulePath);
  
  // Si no hay submódulos, no mostrar nada
  if (!subModules || subModules.length === 0) {
    return null;
  }

  // Extraer todos los segmentos de la ruta
  const pathSegments = pathname.split("/").filter(Boolean);
  
  // Determinar qué submódulo está activo buscando de derecha a izquierda
  // para encontrar el último segmento que coincida con un submódulo válido
  let activeSubModule = null;
  let activeSubModuleIndex = -1;
  
  // Buscar de derecha a izquierda (desde el final hacia el inicio)
  for (let i = pathSegments.length - 1; i >= 0; i--) {
    const segment = pathSegments[i];
    // Si encontramos un segmento que es un submódulo válido
    if (subModules.includes(segment)) {
      activeSubModule = segment;
      activeSubModuleIndex = i;
      break;
    }
  }
  
  // Verificar si hay un ID numérico después del submódulo activo
  const hasNumericId = activeSubModuleIndex >= 0 && 
    activeSubModuleIndex < pathSegments.length - 1 && 
    /^\d+$/.test(pathSegments[activeSubModuleIndex + 1]);
  
  const currentNumericId = hasNumericId ? pathSegments[activeSubModuleIndex + 1] : null;

  const renderSubModuleList = (listClassName) => (
    <ul role="list" className={listClassName}>
      {subModules.map((subModule, index) => {
        const isActive = activeSubModule === subModule;
        const formattedName = formatSubModuleName(subModule);

        return (
          <li key={`${subModule}-${index}`}>
            <div
              className={classNames(
                isActive
                  ? "border-l-4 border-navy/70 text-navy bg-navy/5 shadow-sm"
                  : "text-gray-600 hover:bg-navy/10 hover:text-navy border-l-4 border-transparent",
                isNested
                  ? "group flex items-center gap-x-2 rounded-sm px-2 py-1.5 pl-3 text-xs font-semibold duration-300"
                  : "group flex items-center gap-x-2 p-2 pl-4 text-xs font-semibold rounded-sm duration-300"
              )}
            >
              <div
                className={classNames(
                  isActive ? "bg-navy" : "bg-gray-300 group-hover:bg-navy/60",
                  "w-1.5 h-1.5 rounded-full shrink-0"
                )}
              />
              <span className="flex-1">{formattedName}</span>
              {isActive && hasNumericId && (
                <Badge
                  variant="outline"
                  className="text-xs px-1.5 py-0 h-5 bg-navy/10 text-navy border-navy/30"
                >
                  ID: {currentNumericId}
                </Badge>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );

  if (isNested) {
    return (
      <div className="mt-1 ml-7 border-l border-navy-lighter/30 pl-2">
        {renderSubModuleList("space-y-1")}
      </div>
    );
  }

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full space-y-1 mt-2 mb-2"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full -mx-2 px-2 py-2 text-xs font-medium text-gray-600 hover:bg-navy/10 hover:text-navy rounded-sm transition-all duration-300">
        <div className="flex items-center gap-2">
          <TbLayoutList className="w-4 h-4" />
          <span>Submódulos</span>
        </div>
        <TbChevronRight
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-1 mt-1">
        {renderSubModuleList("-mx-2 space-y-1")}
      </CollapsibleContent>
    </Collapsible>
  );
};
