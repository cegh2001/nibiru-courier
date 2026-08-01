"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { TbChevronRight, TbSmartHome, TbDots } from "react-icons/tb";
import { validRoutes, aestheticSegments } from "@/services/navigationConfig";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Etiquetas personalizadas para rutas específicas
const breadcrumbLabels = {
  "datos-op": "Datos Operativos",
  "detalles": "Detalles",
  "reporte": "Reporte",
  "editar": "Editar",
  "crear": "Crear",
  "recepciones": "Recepciones",
  "operaciones": "Operaciones",
  "envios": "Envíos",
  "repartos": "Repartos",
  "rutas": "Rutas",
  "asignaciones": "Asignaciones",
  "conductores": "Conductores",
  "registro": "Registro",
  "vehiculos": "Vehículos",
  "destinos": "Destinos",
  "zonas": "Zonas",
  "finanzas": "Finanzas",
  "facturas": "Facturas",
  "cobros": "Cobros",
  "admin": "Admin",
};

// Formatear segmentos
const formatSegment = (segment) => {
  return segment
    .replace(/-/g, " de ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace(/cion(?=\s|$)/gi, "ción");
};

export const generateBreadcrumbs = (pathname) => {
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const breadcrumbs = [
    { label: <TbSmartHome className="h-5 w-5" />, href: "/inicio", isHome: true },
  ];

  const accumulatedSegments = [];

  for (let index = 0; index < pathSegments.length; index++) {
    const segment = pathSegments[index];
    const isNumeric = /^\d+$/.test(segment);
    const isAesthetic = aestheticSegments.includes(segment);

    accumulatedSegments.push(segment);

    let href = null;
    const currentPath = "/" + accumulatedSegments.join("/");

    // Determinar href basado en si la ruta es válida
    if (validRoutes.has(currentPath)) {
      href = currentPath;
    } else if (!isNumeric && !isAesthetic) {
      // Para segmentos que no son numéricos ni estéticos, buscar la ruta padre válida
      const segments = accumulatedSegments.slice();
      while (segments.length > 0) {
        const testPath = "/" + segments.join("/");
        if (validRoutes.has(testPath)) {
          href = testPath;
          break;
        }
        segments.pop();
      }
    }

    const label = breadcrumbLabels[segment] || formatSegment(decodeURIComponent(segment));
    breadcrumbs.push({ label, href });
  }

  return breadcrumbs;
};

export const Breadcrumbs = ({ margin = "mb-2" }) => {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Para mobile: mostrar Home, dropdown con intermedios, y último
  const shouldCollapse = breadcrumbs.length > 3;
  const firstCrumb = breadcrumbs[0]; // Home
  const middleCrumbs = shouldCollapse ? breadcrumbs.slice(1, -1) : [];
  const lastCrumb = breadcrumbs[breadcrumbs.length - 1];
  const visibleCrumbs = shouldCollapse ? [] : breadcrumbs.slice(1, -1);

  const CrumbLink = ({ crumb, isLast = false }) => {
    if (crumb.href && !isLast) {
      return (
        <Link href={crumb.href}>
          <span className="text-sm text-navy font-medium hover:scale-105 duration-150 whitespace-nowrap">
            {crumb.label}
          </span>
        </Link>
      );
    }
    return (
      <span className={`text-sm text-navy whitespace-nowrap ${isLast ? "font-bold" : "font-medium"}`}>
        {crumb.label}
      </span>
    );
  };

  return (
    <nav aria-label="breadcrumb">
      {/* Desktop: mostrar todos los breadcrumbs */}
      <ol className={`hidden sm:flex items-center ${margin} mt-2`}>
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            {crumb.href ? (
              <Link href={crumb.href}>
                <div className="text-sm text-navy font-medium hover:scale-105 duration-150">
                  {crumb.label}
                </div>
              </Link>
            ) : (
              <span className="text-sm text-navy font-bold">{crumb.label}</span>
            )}
            {index < breadcrumbs.length - 1 && (
              <TbChevronRight className="mx-2 text-navy h-5 w-5 shrink-0" />
            )}
          </li>
        ))}
      </ol>

      {/* Mobile: versión colapsada */}
      <ol className={`flex sm:hidden items-center justify-center flex-wrap ${margin} mt-2`}>
        {/* Home */}
        <li className="flex items-center">
          <Link href={firstCrumb.href}>
            <div className="text-sm text-navy font-medium hover:scale-105 duration-150">
              {firstCrumb.label}
            </div>
          </Link>
          {breadcrumbs.length > 1 && (
            <TbChevronRight className="mx-1 text-navy h-4 w-4 shrink-0" />
          )}
        </li>

        {/* Dropdown con elementos intermedios (si hay más de 3) */}
        {shouldCollapse && middleCrumbs.length > 0 && (
          <li className="flex items-center">
            <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center justify-center w-7 h-7 rounded-md bg-navy/10 hover:bg-navy/20 text-navy transition-colors"
                  aria-label="Ver ruta completa"
                >
                  <TbDots className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="min-w-40">
                {middleCrumbs.map((crumb, index) => (
                  <DropdownMenuItem key={index} asChild>
                    {crumb.href ? (
                      <Link
                        href={crumb.href}
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <TbChevronRight className="h-3 w-3 text-gray-400" />
                        <span>{crumb.label}</span>
                      </Link>
                    ) : (
                      <span className="flex items-center gap-2">
                        <TbChevronRight className="h-3 w-3 text-gray-400" />
                        {crumb.label}
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <TbChevronRight className="mx-1 text-navy h-4 w-4 shrink-0" />
          </li>
        )}

        {/* Elementos visibles en mobile (cuando no hay collapse) */}
        {!shouldCollapse && visibleCrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center">
            <CrumbLink crumb={crumb} />
            <TbChevronRight className="mx-1 text-navy h-4 w-4 shrink-0" />
          </li>
        ))}

        {/* Último elemento */}
        {breadcrumbs.length > 1 && (
          <li className="flex items-center min-w-0">
            <span className="text-sm text-navy font-bold truncate max-w-[120px]">
              {lastCrumb.label}
            </span>
          </li>
        )}
      </ol>
    </nav>
  );
};