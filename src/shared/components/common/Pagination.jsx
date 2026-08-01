import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export const Pagination = ({ currentPage, lastPage, links, onPageChange, margin }) => {
  // Función para extraer el número de página desde la URL
  const handlePageClick = (url) => {
    if (!url) return;
    try {
      const urlObj = new URL(url);
      const pageParam = urlObj.searchParams.get("page");
      if (pageParam) {
        onPageChange(parseInt(pageParam));
      }
    } catch (error) {
      console.error("Error parseando la URL:", error);
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${margin}`}>
      <div className="text-sm text-muted-foreground">
        Página <span className="font-medium">{currentPage}</span> de{" "}
        <span className="font-medium">{lastPage}</span>
      </div>

      <nav
        className="flex flex-wrap items-center justify-center gap-1"
        role="navigation"
        aria-label="Paginación"
      >
        {links?.map((link, index) => {
          let label = link.label.trim();
          let icon = null;

          // Si el label incluye la entidad o la palabra "anterior", mostramos solo "Anterior"
          if (
            label.includes("&laquo;") ||
            label.toLowerCase().includes("anterior")
          ) {
            label = "Anterior";
            icon = <ChevronLeft className="h-4 w-4" />;
          }
          // Si el label incluye la entidad o la palabra "siguiente", mostramos solo "Siguiente"
          else if (
            label.includes("&raquo;") ||
            label.toLowerCase().includes("siguiente")
          ) {
            label = "Siguiente";
            icon = <ChevronRight className="h-4 w-4" />;
          }
          // Si el label incluye puntos suspensivos
          else if (label.includes("&#8230;")) {
            label = "...";
            icon = <MoreHorizontal className="h-4 w-4" />;
          }

          const isNavigationButton =
            label === "Anterior" || label === "Siguiente";
          const isEllipsis = label === "...";
          return (
            <Button
              key={index}            
              disabled={!link.url || link.active || isEllipsis}
              onClick={() => handlePageClick(link.url)}
              className={`
                min-w-[2.5rem] h-9 mb-1
                ${
                  link.active
                    ? "bg-navy text-primary-foreground shadow-md shadow-navy hover:bg-navy/90"
                    : "hover:bg-accent hover:text-accent-foreground bg-navy text-white hover:text-navy"
                }
                ${isNavigationButton ? "px-3" : ""}
                ${isEllipsis ? "cursor-default" : ""}
              `}
              aria-label={
                isNavigationButton
                  ? label
                  : `Ir a la página ${label}`
              }
              aria-current={link.active ? "page" : undefined}
            >
              {icon ? (
                <span className="flex items-center gap-1">
                  {label === "Anterior" && icon}
                  {!isEllipsis && <span className="hidden sm:inline">{label}</span>}
                  {label === "Siguiente" && icon}
                  {isEllipsis && icon}
                </span>
              ) : (
                label
              )}
            </Button>
          );
        })}
      </nav>
    </div>
  );
};
