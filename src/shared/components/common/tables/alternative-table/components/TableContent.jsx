import React from "react";
import { TbFileSad } from "react-icons/tb";
import { Spinner } from "@/components/animations/Spinner";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function TableContent({ 
  data, 
  columns, 
  loading, 
  customHeader, 
  customBody, 
  children 
}) {
  // Determinar qué tipo de contenido usar
  const hasCustomProps = customHeader || customBody;
  const hasCustomContent = !!children;
  
  if (loading && (!hasCustomContent && !hasCustomProps && data.length === 0)) {
    return (
      <div className="mt-8">
        <Spinner />
      </div>
    );
  }

  // Si no hay contenido personalizado y no hay datos, mostrar mensaje por defecto
  if (!hasCustomContent && !hasCustomProps && data.length === 0) {
    return (
      <div className="mt-4 flex justify-center lg:min-h-[430px] lg:max-h-[430px] xl:min-h-[373px] xl:max-h-[373px]">
        <div className="font-semibold text-indigo-600 text-xs flex items-center">
          No hay registros para mostrar
          <TbFileSad className="w-4 h-4 ml-2" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 flow-root">
      <ScrollArea className="lg:h-[430px] xl:h-[373px] w-full">
          <div className="inline-block min-w-full py-1 align-middle sm:px-4 lg:px-6">
            <table className="w-full text-left text-xs/5">
              {children ? (
                // Usar contenido personalizado legacy (children)
                children
              ) : hasCustomProps ? (
                // Usar props específicas (NUEVO)
                <>
                  {customHeader && (
                    <thead className="border-b border-gray-200 text-gray-900">
                      {customHeader}
                    </thead>
                  )}
                  {customBody}
                </>
              ) : (
                // Usar contenido por defecto
                <>
                  <thead className="border-b border-gray-200 text-gray-900">
                    <tr>
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className={column.headerClassName}
                        >
                          {column.header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-b border-gray-100">
                        {columns.map((column) => (
                          <td key={column.key} className={column.cellClassName}>
                            {row[column.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </>
              )}
            </table>
          </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
