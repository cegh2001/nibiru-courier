import { TbChevronRight, TbChevronLeft } from "react-icons/tb";

export const PaginationButtons = ({ goToUrl, pagination }) => {
  // Extraemos links del objeto pagination
  const { links } = pagination;

  // Función para obtener páginas visibles según el viewport
  const getVisiblePages = (allLinks) => {
    if (!allLinks) return [];
    
    // Filtrar solo los números de página (excluir Anterior/Siguiente)
    const pageLinks = allLinks.filter(link => 
      !link.label.includes("Anterior") && 
      !link.label.includes("Siguiente")
    );
    
    // En mobile, mostrar máximo 3 páginas (actual y adyacentes)
    const currentIndex = pageLinks.findIndex(link => link.active);
    if (currentIndex === -1) return pageLinks.slice(0, 5);
    
    // Calcular rango visible
    const start = Math.max(0, currentIndex - 1);
    const end = Math.min(pageLinks.length, currentIndex + 2);
    
    return pageLinks.slice(start, end);
  };

  return (
    <>
      {(pagination.last_page) > 1 && (links && links.length > 0) ? (
        <div className="flex items-center justify-center gap-1 sm:gap-1.5 mt-1 mx-2 py-1.5 bg-navy-rgba rounded-lg">
          {/* Botón Anterior */}
          {links.map((link, index) => {
            if (link.label.includes("Anterior")) {
              return (
                <button
                  key={index}
                  onClick={() => goToUrl(link.url)}
                  disabled={!link.url}
                  className={`text-sky-500 p-1 ${
                    !link.url ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <TbChevronLeft className="w-5 h-5" />
                </button>
              );
            }
            return null;
          })}

          {/* Páginas en mobile - versión compacta */}
          <div className="flex sm:hidden items-center gap-1">
            {getVisiblePages(links).map((link, index) => {
              if (link.label === "...") {
                return (
                  <span key={`mobile-ellipsis-${index}`} className="text-gray-500 px-1 text-sm">
                    ...
                  </span>
                );
              }
              const pageNumber = parseInt(link.label);
              if (isNaN(pageNumber)) return null;
              return (
                <button
                  key={`mobile-${index}`}
                  onClick={() => goToUrl(link.url)}
                  className={`w-7 h-7 text-sm rounded-lg duration-300 ${
                    link.active
                      ? "font-bold text-white bg-sky-500 shadow-center shadow-sky-500/50"
                      : "font-normal text-navy bg-white hover:bg-sky-500 hover:text-white"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Páginas en desktop - versión completa */}
          <div className="hidden sm:flex items-center gap-1.5">
            {links.map((link, index) => {
              if (link.label.includes("Anterior") || link.label.includes("Siguiente")) {
                return null;
              }
              if (link.label === "...") {
                return (
                  <span key={index} className="text-gray-500 px-2">
                    ...
                  </span>
                );
              }
              const pageNumber = parseInt(link.label);
              if (isNaN(pageNumber)) return null;
              return (
                <button
                  key={index}
                  onClick={() => goToUrl(link.url)}
                  className={`w-8 py-0.5 rounded-lg duration-300 ${
                    link.active
                      ? "font-bold text-white bg-sky-500 shadow-center shadow-sky-500/50"
                      : "font-normal text-sm text-navy bg-white hover:bg-sky-500 hover:text-white"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
          </div>

          {/* Botón Siguiente */}
          {links.map((link, index) => {
            if (link.label.includes("Siguiente")) {
              return (
                <button
                  key={index}
                  onClick={() => goToUrl(link.url)}
                  disabled={!link.url}
                  className={`text-sky-500 p-1 ${
                    !link.url ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <TbChevronRight className="w-5 h-5" />
                </button>
              );
            }
            return null;
          })}
        </div>
      ) : null}
    </>
  );
};
