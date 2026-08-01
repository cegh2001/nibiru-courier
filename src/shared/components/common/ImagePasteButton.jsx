"use client";

import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { TbPhoto } from "react-icons/tb";
import toast from "react-hot-toast";

/**
 * Componente para pegar/subir imágenes con OCR
 * 
 * Prioridad al hacer clic:
 * 1. Ejecuta onButtonClick (intenta clipboard del hook)
 * 2. Si no hay imagen en clipboard, el hook abre file picker
 * 
 * Al arrastrar o seleccionar archivo:
 * - Ejecuta onImageProcess con el base64 de la imagen
 * 
 * @param {Object} props
 * @param {Function} props.onImageProcess - Callback con la imagen en base64 (drag/file picker)
 * @param {Function} props.onButtonClick - Callback al hacer click (intenta clipboard primero)
 * @param {boolean} props.isProcessing - Estado de procesamiento
 * @param {boolean} props.disabled - Deshabilitar botón
 * @param {boolean} props.isDraggingOver - Estado externo de drag sobre wrapper (opcional)
 * @param {string} props.className - Clases adicionales
 */
export const ImagePasteButton = ({
  onImageProcess,
  onButtonClick,
  isProcessing = false,
  disabled = false,
  isDraggingOver = false, // Estado externo del wrapper
  className = "",
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Si hay estado externo, usarlo; si no, usar el interno
  const isCurrentlyDragging = isDraggingOver || isDragging;

  /**
   * Convierte un File/Blob a base64
   */
  const fileToBase64 = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  /**
   * Valida que el archivo sea una imagen válida
   */
  const validateImageFile = useCallback((file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (!validTypes.includes(file.type)) {
      toast.error('Formato no soportado. Use JPG, PNG, GIF o BMP');
      return false;
    }

    if (file.size > maxSize) {
      toast.error('Imagen muy grande. Máximo 1MB');
      return false;
    }

    return true;
  }, []);

  /**
   * Procesa una imagen (File o Blob)
   */
  const processImage = useCallback(async (file) => {
    try {
      if (!validateImageFile(file)) return;

      const base64 = await fileToBase64(file);
      
      if (onImageProcess && typeof onImageProcess === 'function') {
        await onImageProcess(base64);
      }
    } catch (error) {
      console.error('[ImagePasteButton] Error processing image:', error);
      toast.error('Error procesando la imagen');
    }
  }, [validateImageFile, fileToBase64, onImageProcess]);

  /**
   * Intenta leer imagen del portapapeles
   * Retorna true si encontró imagen, false si no
   */
  const tryClipboardFirst = useCallback(async () => {
    try {
      const clipboardItems = await navigator.clipboard.read();
      
      for (const item of clipboardItems) {
        const imageType = item.types.find(type => type.startsWith('image/'));
        
        if (imageType) {
          const blob = await item.getType(imageType);
          await processImage(blob);
          return true; // Éxito
        }
      }
      
      return false; // No hay imagen en clipboard
    } catch (error) {
      // Clipboard API puede fallar por permisos o no estar disponible
      console.warn('[ImagePasteButton] Clipboard read failed:', error);
      return false;
    }
  }, [processImage]);

  /**
   * Abre el selector de archivos
   */
  const openFilePicker = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  /**
   * Handler principal del botón
   * Si se provee onButtonClick, delegar al hook pasando openFilePicker como fallback
   * Si no, usar lógica interna: Clipboard → File Picker
   */
  const handleButtonClick = useCallback(async () => {
    if (isProcessing || disabled) return;

    // Si hay un callback externo, usarlo con fallback a file picker
    if (onButtonClick && typeof onButtonClick === 'function') {
      await onButtonClick(openFilePicker); // Pasar openFilePicker como callback
      return;
    }

    // Fallback: lógica interna
    // 1. Intentar portapapeles primero
    const hasClipboardImage = await tryClipboardFirst();

    // 2. Si no hay imagen en clipboard, abrir file picker
    if (!hasClipboardImage) {
      openFilePicker();
    }
  }, [isProcessing, disabled, onButtonClick, tryClipboardFirst, openFilePicker]);

  /**
   * Handler del input file
   */
  const handleFileChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
    // Limpiar input para permitir seleccionar el mismo archivo otra vez
    e.target.value = '';
  }, [processImage]);

  /**
   * Drag & Drop handlers
   */
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isProcessing || disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      // Solo desactivar si realmente salimos del elemento
      if (!e.currentTarget.contains(e.relatedTarget)) {
        setIsDragging(false);
      }
    }
  }, [isProcessing, disabled]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isProcessing || disabled) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      processImage(file);
    }
  }, [isProcessing, disabled, processImage]);

  return (
    <>
      {/* Input oculto para file picker */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/bmp"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Botón con feedback visual de drag & drop */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleButtonClick}
          disabled={isProcessing || disabled}
          className={`
            flex items-center gap-2 
            border-emerald-600/20 text-emerald-600 
            hover:bg-emerald-600/50
            transition-all duration-200 ease-in-out
            ${isCurrentlyDragging ? 'bg-emerald-100 border-emerald-500 shadow-md' : ''}
            ${className}
          `}
          style={{
            transform: isCurrentlyDragging ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.2s ease-in-out'
          }}
        >
          <TbPhoto className={`w-4 h-4 transition-transform duration-200 ${isCurrentlyDragging ? 'scale-110' : ''}`} />
          {isProcessing ? 'Procesando...' : isCurrentlyDragging ? 'Suelta la imagen' : 'Pegar Imagen'}
        </Button>
      </div>
    </>
  );
};
