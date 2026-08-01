"use client";

import { useId, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TbFileSpreadsheet, TbUpload, TbX } from "react-icons/tb";

export const ExcelDragDropUpload = ({
  onFilesChange,
  file = null,
  disabled = false,
  onRemoveFile,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const uniqueId = useId();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setDragActive(false);
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (disabled) return;

    const syntheticEvent = {
      target: {
        files: e.dataTransfer.files
      }
    };
    
    onFilesChange?.(syntheticEvent);
  };

  const handleFileSelect = (e) => {
    onFilesChange?.(e);
    // Resetear el input para permitir seleccionar el mismo archivo nuevamente
    e.target.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Drag and Drop Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300
          ${disabled
            ? "border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed"
            : dragActive
              ? "border-green-500 bg-green-50 scale-105 shadow-xl"
              : "border-green-400 bg-green-50/30 scale-100 shadow-none hover:border-green-500 hover:bg-green-50/50"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <TbFileSpreadsheet className={`w-12 h-12 mx-auto mb-3 pointer-events-none ${
          disabled ? "text-gray-400" : "text-green-600"
        }`} />
        <p className={`text-sm mb-3 pointer-events-none font-medium ${
          disabled ? "text-gray-400" : "text-green-700"
        }`}>
          Arrastra tu archivo Excel aquí o haz clic para seleccionar
        </p>
        <Input
          type="file"
          name="file"
          multiple={false}
          accept=".xlsx,.xls,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv"
          onChange={handleFileSelect}
          className="hidden"
          id={uniqueId}
          disabled={disabled}
        />
        <Button 
          variant="outline" 
          size="sm" 
          asChild
          disabled={disabled}
          className={
            disabled 
              ? "border-gray-300 text-gray-400 cursor-not-allowed"
              : "border-green-600 text-green-600 hover:bg-green-600 hover:text-white pointer-events-auto"
          }
        >
          <label htmlFor={uniqueId} className={disabled ? "cursor-not-allowed" : "cursor-pointer"}>
            <TbUpload className="w-4 h-4 mr-2" />
            Seleccionar Excel
          </label>
        </Button>
      </div>

      {/* File Preview */}
      {file && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TbFileSpreadsheet className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  {file.name}
                </p>
                <p className="text-xs text-green-700">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile?.()}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={disabled}
            >
              <TbX className="w-5 h-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
