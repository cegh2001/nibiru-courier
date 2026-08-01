// DataTable.jsx
"use client";
import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { defaultColumns } from "./DataTableCols";

// Componente principal de la tabla
export function DataTable({ 
  data = [], 
  columns = defaultColumns, 
  emptyMessage = "No hay resultados.",
  showPagination = true,  // Paginación interna de tanstack
  externalPagination = null, // Paginación externa con currentPage, lastPage, links, onPageChange
  className = "",
  enableExpanding = false,
  getSubRows = (row) => row.subRows,
}) {
  // Estado local para manejo de ordenamiento (sorting)
  const [sorting, setSorting] = React.useState([]);
  // Estado local para manejar la visibilidad de columnas (si se necesitara)
  const [columnVisibility, setColumnVisibility] = React.useState({});
  // Estado para filas expandidas
  const [expanded, setExpanded] = React.useState({});

  // Validar que data sea un array
  const safeData = React.useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  // Función para manejar clics en paginación externa
  const handleExternalPageClick = (url) => {
    if (!url || !externalPagination?.onPageChange) return;
    try {
      const urlObj = new URL(url);
      const pageParam = urlObj.searchParams.get("page");
      if (pageParam) {
        externalPagination.onPageChange(parseInt(pageParam));
      }
    } catch (error) {
      console.error("Error parseando la URL:", error);
    }
  };

  // Componente de paginación externa integrada
  const ExternalPagination = () => {
    if (!externalPagination || !externalPagination.links) return null;
    
    const { currentPage, lastPage, links } = externalPagination;
    
    // Validar que tenemos los datos necesarios
    if (!currentPage || !lastPage || !Array.isArray(links)) return null;
    
    return (
      <div className="flex items-center justify-between py-3 px-1">
        <div className="text-sm text-gray-600">
          Página <span className="font-medium text-navy">{currentPage}</span> de{" "}
          <span className="font-medium text-navy">{lastPage}</span>
        </div>

        <nav className="flex items-center space-x-1" role="navigation" aria-label="Paginación">
          {links?.map((link, index) => {
            let label = link.label.trim();
            let icon = null;

            // Manejar etiquetas especiales
            if (label.includes("&laquo;") || label.toLowerCase().includes("anterior")) {
              label = "Anterior";
              icon = <ChevronLeft className="h-4 w-4" />;
            } else if (label.includes("&raquo;") || label.toLowerCase().includes("siguiente")) {
              label = "Siguiente";
              icon = <ChevronRight className="h-4 w-4" />;
            } else if (label.includes("&#8230;")) {
              label = "...";
              icon = <MoreHorizontal className="h-4 w-4" />;
            }

            const isNavigationButton = label === "Anterior" || label === "Siguiente";
            const isEllipsis = label === "...";
            
            return (
              <Button
                key={index}
                variant={link.active ? "default" : "outline"}
                size="sm"
                disabled={!link.url || link.active || isEllipsis}
                onClick={() => handleExternalPageClick(link.url)}
                className={`
                  min-w-10 h-8 text-sm
                  ${isNavigationButton ? "px-3" : "px-2"}
                  ${isEllipsis ? "cursor-default hover:bg-transparent hover:border-transparent" : ""}
                `}
                aria-label={isNavigationButton ? label : `Ir a la página ${label}`}
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

  const table = useReactTable({
    data: safeData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    ...(enableExpanding && {
      getExpandedRowModel: getExpandedRowModel(),
      getSubRows,
      onExpandedChange: setExpanded,
    }),
    state: {
      sorting,
      columnVisibility,
      ...(enableExpanding && { expanded }),
    },
  });

  return (
    <div className={`w-full ${className}`}>
      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className={`py-3 px-4 ${header.column.columnDef.meta?.headerClassName || ''}`}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isSubRow = enableExpanding && row.depth > 0;
                const hasSubRows = enableExpanding && row.original.subRows?.length > 0;
                return (
                  <TableRow key={row.id} className={cn(
                    "hover:bg-gray-50/50 border-b border-gray-100",
                    isSubRow && "bg-slate-100"
                  )}>
                    {row.getVisibleCells().map((cell, cIndex) => {
                      const isFirstCol = cIndex === 0;
                      return (
                        <TableCell key={cell.id} className={cn(
                          "py-3 px-4",
                          isSubRow && isFirstCol && "pl-10"
                        )}>
                          {enableExpanding && isFirstCol && !isSubRow ? (
                            <div className="flex items-center gap-2">
                              {hasSubRows ? (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => row.toggleExpanded()}
                                  className="h-6 w-6 p-0 hover:bg-navy/10 shrink-0"
                                >
                                  <ChevronDown className={cn(
                                    "h-4 w-4 text-navy transition-transform duration-200",
                                    row.getIsExpanded() && "rotate-180"
                                  )} />
                                </Button>
                              ) : (
                                <span className="w-6 shrink-0" />
                              )}
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </div>
                          ) : (
                            flexRender(cell.column.columnDef.cell, cell.getContext())
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-20 text-center text-gray-500 py-8"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación Externa */}
      {externalPagination && <ExternalPagination />}

      {/* Paginación Interna */}
      {showPagination && !externalPagination && (
        <div className="flex items-center justify-between py-3 px-1">
          <div className="text-sm text-gray-600">
            Mostrando {table.getRowModel().rows.length} de {safeData.length} resultados
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3"
            >
              Siguiente
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
