import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { compressImage, compressVideo } from "@/services/mediaCompressor";

export const useFileUpload = ({
  maxFileSize = 5, // MB
  maxTotalSize = 20, // MB
  maxFiles = null,
  allowedTypes = ["image/png", "image/jpg", "image/jpeg"],
  setError,
  clearErrors
}) => {
  const [files, setFiles] = useState([]);
  const [imagesBase64, setImagesBase64] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [totalSize, setTotalSize] = useState(0);
  const [exceedsLimit, setExceedsLimit] = useState(false);

  // Función para validar archivos
  const validateFiles = (filesList) => {
    // Validación de tipos de archivo
    const invalidFiles = filesList.some(
      (file) => !allowedTypes.includes(file.type)
    );

    if (invalidFiles) {
      setError?.("files", {
        type: "manual",
        message: `Solo se permiten archivos: ${allowedTypes.join(", ")}`,
      });
      return false;
    }

    // Validación de tamaño máximo individual
    const maxSizeBytes = maxFileSize * 1024 * 1024;
    const oversizedFiles = filesList.some((file) => file.size > maxSizeBytes);

    if (oversizedFiles) {
      setError?.("files", {
        type: "manual",
        message: `Los archivos no deben superar los ${maxFileSize}MB individualmente`,
      });
      return false;
    }

    return true;
  };

  // Función para calcular tamaño total
  const calculateTotalSize = (allFiles) => {
    return allFiles.reduce(
      (sum, file) => sum + file.size / (1024 * 1024),
      0
    );
  };

  // Función para convertir archivos a base64
  const convertFilesToBase64 = async (newFilesList, existingBase64 = []) => {
    try {
      const newBase64Files = await Promise.all(
        newFilesList.map(async (file) => {
          let base64Data, sizeInMB;
          
          if (file.type.startsWith('video/')) {
            const result = await compressVideo(file, { maxSizeMB: 50 });
            base64Data = result.data;
            sizeInMB = result.size;
          } else {
            const result = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.7 });
            base64Data = result.data;
            sizeInMB = result.size;
          }

          return {
            size: parseFloat(sizeInMB),
            img: base64Data, // Mantener para compatibilidad interna
            data: base64Data, // Nuevo formato para el backend
            name: file.name,
            type: file.type,
          };
        })
      );
      
      setImagesBase64([...existingBase64, ...newBase64Files]);
    } catch (error) {
      console.error("Error al convertir archivos:", error);
      toast.error("Error al procesar algunos archivos multimedia");
    }
  };

  // Función para crear URLs de preview
  const createPreviewUrls = (filesList) => {
    return (filesList ?? []).map(file => URL.createObjectURL(file));
  };

  // Función principal para manejar archivos
  const handleFiles = (newFiles) => {
    const selectedFiles = Array.from(newFiles || []);

    if (selectedFiles.length === 0) {
      return false;
    }

    const isSingleFileMode = maxFiles === 1;
    const filesToProcess = isSingleFileMode
      ? selectedFiles.slice(0, 1)
      : selectedFiles;

    // Validar archivos
    if (!validateFiles(filesToProcess)) {
      return false;
    }

    if (isSingleFileMode) {
      const allFiles = filesToProcess;
      const calculatedTotalSize = calculateTotalSize(allFiles);

      if (calculatedTotalSize > maxTotalSize) {
        setExceedsLimit(true);
        toast.error(
          `Se superó el límite de ${maxTotalSize}MB para subir archivos`
        );
        setError?.("files", {
          type: "manual",
          message: `El tamaño total de los archivos no debe superar los ${maxTotalSize}MB`,
        });
        return false;
      }

      (previewUrls || []).forEach((url) => {
        URL.revokeObjectURL(url);
      });

      setTotalSize(calculatedTotalSize);
      setExceedsLimit(false);
      clearErrors?.("files");
      setFiles(allFiles);

      const newPreviews = createPreviewUrls(allFiles);
      setPreviewUrls(newPreviews);

      setImagesBase64([]);
      convertFilesToBase64(allFiles, []);

      return true;
    }

    // Combinar archivos existentes con los nuevos, evitando duplicados por nombre y tamaño
    const existingFiles = files || [];
    const uniqueNewFiles = filesToProcess.filter(
      (newFile) =>
        !existingFiles.some(
          (file) => file.name === newFile.name && file.size === newFile.size
        )
    );
    if (uniqueNewFiles.length === 0) {
      toast("Los archivos seleccionados ya fueron agregados.", { icon: "⚠️" });
      return false;
    }
    let allFiles = [...existingFiles, ...uniqueNewFiles];

    // Verificar límite de archivos
    if (maxFiles && allFiles.length > maxFiles) {
      allFiles = allFiles.slice(0, maxFiles);
      toast(`Solo se permiten hasta ${maxFiles} archivos.`, { icon: "⚠️" });
    }

    // Calcular tamaño total
    const calculatedTotalSize = calculateTotalSize(allFiles);

    // Verificar si excede el límite total
    if (calculatedTotalSize > maxTotalSize) {
      setExceedsLimit(true);
      toast.error(
        `Se superó el límite de ${maxTotalSize}MB para subir archivos`
      );
      setError?.("files", {
        type: "manual",
        message: `El tamaño total de los archivos no debe superar los ${maxTotalSize}MB`,
      });
      return false;
    }

    // Si todo está bien, actualizar estados
    setTotalSize(calculatedTotalSize);
    setExceedsLimit(false);
    clearErrors?.("files");
    setFiles(allFiles);

    // Crear nuevas URLs de preview y combinar con existentes
    const existingPreviews = previewUrls || [];
    const newPreviews = createPreviewUrls(uniqueNewFiles);
    const allPreviews = [...existingPreviews, ...newPreviews];
    setPreviewUrls(allPreviews);

    // Convertir archivos a base64
    const existingBase64 = imagesBase64 || [];
    convertFilesToBase64(uniqueNewFiles, existingBase64);

    return true;
  };

  // Función para remover un archivo
  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    const newBase64 = imagesBase64.filter((_, i) => i !== index);

    // Limpiar URL del archivo removido
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }

    setFiles(newFiles);
    setPreviewUrls(newPreviews);
    setImagesBase64(newBase64);
    setTotalSize(calculateTotalSize(newFiles));
    
    if (newFiles.length === 0) {
      setExceedsLimit(false);
      clearErrors?.("files");
    }
  };

  // Función para limpiar todos los archivos
  const clearFiles = useCallback(() => {
    // Limpiar todas las URLs de preview
    previewUrls.forEach(url => {
      URL.revokeObjectURL(url);
    });

    setFiles([]);
    setImagesBase64([]);
    setPreviewUrls([]);
    setTotalSize(0);
    setExceedsLimit(false);
    clearErrors?.("files");
  }, [previewUrls, clearErrors]);

  return {
    files,
    imagesBase64,
    previewUrls,
    totalSize,
    exceedsLimit,
    handleFiles,
    removeFile,
    clearFiles
  };
};
