"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePreview } from "@/components/common/ImagePreview";
import { Upload, X } from "lucide-react";
import { useId, useState } from "react";

export const DragDropFileUpload = ({
  onFilesChange,
  previewUrls = [],
  imagesBase64 = [],
  errors,
  accept = "image/png,image/jpg,image/jpeg",
  disabled = false,
  // showRemoveButton eliminado, ya no se usa
  onRemoveFile,
  uploadText = "Arrastra una imagen aquí o haz clic para seleccionar",
  buttonText = "Elegir imagen",
  className = ""
}) => {
  const [dragActive, setDragActive] = useState(false);
  const uniqueId = useId();
  const latestPreviewIndex = previewUrls.length - 1;
  const latestPreviewUrl = latestPreviewIndex >= 0 ? previewUrls[latestPreviewIndex] : null;
  const latestImageBase64 = latestPreviewIndex >= 0 ? imagesBase64[latestPreviewIndex] : null;

  const createSingleFileEvent = (file) => {
    if (typeof DataTransfer !== "undefined") {
      const dataTransfer = new DataTransfer();
      if (file) dataTransfer.items.add(file);
      return { target: { files: dataTransfer.files } };
    }

    return { target: { files: file ? [file] : [] } };
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      // Solo desactivar si realmente salimos del contenedor
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

    const firstFile = e.dataTransfer?.files?.[0];
    const syntheticEvent = createSingleFileEvent(firstFile);
    
    onFilesChange?.(syntheticEvent);
  };

  const handleFileInput = (e) => {
    if (disabled) return;

    const firstFile = e.target.files?.[0];
    const syntheticEvent = createSingleFileEvent(firstFile);
    onFilesChange?.(syntheticEvent);
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300
          ${disabled
            ? "border-gray-300 bg-gray-50 opacity-50 cursor-not-allowed"
            : dragActive
              ? "border-sky-500 bg-sky-50 scale-105 shadow-xl"
              : "border-navy-light bg-navy-lighter/10 scale-100 shadow-none"}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className={`w-8 h-8 mx-auto mb-2 pointer-events-none ${
          disabled ? "text-gray-400" : "text-navy"
        }`} />
        <p className={`text-sm mb-2 pointer-events-none ${
          disabled ? "text-gray-400" : "text-navy"
        }`}>
          {uploadText}
        </p>
        <Input
          type="file"
          name="file"
          multiple={false}
          accept={accept}
          onChange={handleFileInput}
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
              : "border-navy text-navy hover:bg-navy hover:text-white pointer-events-auto"
          }
        >
          <label htmlFor={uniqueId} className={disabled ? "cursor-not-allowed" : "cursor-pointer"}>
            {buttonText}
          </label>
        </Button>
      </div>

      {errors && (
        <p className="text-red-500 text-sm mt-2">
          {errors.message}
        </p>
      )}

      {latestPreviewUrl && (
        <div className="mt-4 flex flex-wrap gap-4">
          <div key={latestPreviewUrl} className="flex flex-col relative group">
            {/* Contenedor del preview sin botón en la esquina */}
            <div className="relative">
              <ImagePreview
                src={latestPreviewUrl}
                alt="Previsualización imagen 1"
                width={150}
                height={150}
                number={1}
              />
            </div>

            {/* Información del archivo con botón de eliminar integrado */}
            {latestImageBase64 && (
              <div className="relative mt-2">
                <span className="text-xs text-navy text-center font-medium bg-navy-lighter/20 px-2 py-1 rounded w-full block">
                  {latestImageBase64.size} MB
                </span>
                {/* Botón de eliminar posicionado sobre el contenedor de MB */}
                <button
                  onClick={() => onRemoveFile?.(latestPreviewIndex)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 hover:scale-110 transition-all duration-200 z-20 shadow-lg border border-white opacity-90 hover:opacity-100"
                  type="button"
                  title="Eliminar imagen 1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
