/**
 * Utilidades para compresión de archivos multimedia en el navegador
 */

// Factor para la conversión a MB
export const FACTOR_MB = 1024 * 1024;

/**
 * Calcula el tamaño en MB de una cantidad de bytes
 * @param {number} bytes 
 * @returns {number}
 */
export const calculateSizeInMB = (bytes) => {
  return parseFloat((bytes / FACTOR_MB).toFixed(2));
};

/**
 * Comprime una imagen usando HTML Canvas y la convierte a formato WebP.
 * @param {File|Blob} file - El archivo de imagen original
 * @param {Object} options - Opciones de compresión
 * @param {number} [options.maxWidth=1920] - Ancho máximo
 * @param {number} [options.maxHeight=1080] - Alto máximo
 * @param {number} [options.quality=0.8] - Calidad de compresión (0 a 1)
 * @param {boolean} [options.returnBlob=false] - Si es true, retorna un Blob y una URL local, si no, base64
 * @returns {Promise<{data: string|Blob, size: number, type: string, uri?: string}>}
 */
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    returnBlob = false,
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('El archivo proporcionado no es una imagen.'));
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calcular nuevas dimensiones manteniendo la proporción
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir el canvas al formato final
        if (returnBlob) {
          canvas.toBlob((blob) => {
            if (!blob) return reject(new Error('Falló la creación del Blob.'));
            resolve({
              data: blob,
              size: calculateSizeInMB(blob.size),
              type: blob.type,
              uri: window.URL.createObjectURL(blob),
            });
          }, 'image/webp', quality);
        } else {
          const dataUrl = canvas.toDataURL('image/webp', quality);
          // Estimación del tamaño del base64 (3/4 de la longitud aprox)
          const estimatedBytes = Math.round((dataUrl.length * 3) / 4);
          resolve({
            data: dataUrl,
            size: calculateSizeInMB(estimatedBytes),
            type: 'image/webp'
          });
        }
      };
      
      img.onerror = reject;
    };
    
    reader.onerror = reject;
  });
};

/**
 * Valida un video en el navegador (Opción A).
 * @param {File|Blob} file - El archivo de video original
 * @param {Object} options - Opciones de compresión/validación
 * @param {number} [options.maxSizeMB=50] - Tamaño máximo permitido en MB
 * @param {boolean} [options.returnBlob=false] - Para consistencia con imagenes
 * @returns {Promise<{data: string|Blob, size: number, type: string, uri?: string}>}
 */
export const compressVideo = async (file, options = {}) => {
  const { maxSizeMB = 50, returnBlob = false } = options;

  if (!file.type.startsWith('video/')) {
    throw new Error('El archivo proporcionado no es un video.');
  }

  const sizeMB = calculateSizeInMB(file.size);
  
  if (sizeMB > maxSizeMB) {
     console.warn(`El video excede el tamaño recomendado de ${maxSizeMB}MB (Actual: ${sizeMB}MB)`);
  }

  if (returnBlob) {
    return {
      data: file, // Retorna el blob/file intacto
      size: sizeMB,
      type: file.type,
      uri: window.URL.createObjectURL(file),
    };
  }

  // Devolver base64
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        data: reader.result,
        size: sizeMB,
        type: file.type
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};
