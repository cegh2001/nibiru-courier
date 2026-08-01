"use client";

import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { processClipboardImage } from "@/services/ocrService";
import { parsePaymentReceipt, validateParsedData, formatParsedData } from "@/shared/utils/parsers/paymentReceiptParser";
import { parsePaymentData } from "@/shared/utils/parsers/paymentParsers";

/**
 * Hook para pegar datos de pagos desde portapapeles o imágenes
 * 
 * Soporta múltiples formatos:
 * - Referencia simple: "115052142"
 * - Con etiquetas: "Referencia: 115052142"
 * - Con monto: "115052142\n12.50"
 * - Formato completo: "Referencia: ...\nMonto: ..."
 * 
 * @param {Object} params
 * @param {Function} params.onPaste - Callback con datos parseados
 * @param {Array} params.currencies - Array de monedas disponibles
 */
export const usePaymentPaste = ({ 
  onPaste, 
  currencies = [],
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Busca el ID de la moneda VES (Bolívares)
   * Usado como valor por defecto
   */
  const getVESCurrencyId = useCallback(() => {
    if (!currencies || currencies.length === 0) return null;

    const vesCurrency = currencies.find(
      curr => 
        curr.code === 'VES' || 
        curr.abbrev === 'Bs' || 
        curr.abbrev === 'Bs.' ||
        curr.name?.toLowerCase().includes('bolívar') ||
        curr.id === 4
    );

    return vesCurrency?.id || 4;
  }, [currencies]);

  /**
   * Extrae el currency_value_id de la moneda VES
   */
  const getVESCurrencyValueId = useCallback(() => {
    if (!currencies || currencies.length === 0) return null;

    const vesCurrency = currencies.find(
      curr => 
        curr.code === 'VES' || 
        curr.abbrev === 'Bs' || 
        curr.abbrev === 'Bs.' ||
        curr.id === 4
    );

    return vesCurrency?.last_value?.id?.toString() || null;
  }, [currencies]);

  /**
   * Función principal - Lee portapapeles y ejecuta callback
   */
  const handlePasteClick = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      
      if (!text) {
        toast.error("El portapapeles está vacío");
        return;
      }

      const paymentData = parsePaymentData(text);
      
      if (!paymentData) {
        toast.error("No se detectó una referencia válida. Use formato: 'Referencia: XXX' o pegue una referencia de 8-20 dígitos");
        return;
      }

      const currencyId = getVESCurrencyId();
      const currencyValueId = getVESCurrencyValueId();

      const fullPaymentData = {
        reference: paymentData.reference,
        amount: paymentData.amount || null,
        currency_id: currencyId,
        currency_value_id: currencyValueId,
      };

      if (onPaste && typeof onPaste === 'function') {
        onPaste(fullPaymentData);
        
        if (paymentData.amount) {
          toast.success(`Referencia y monto cargados: ${paymentData.reference} - ${paymentData.amount}`);
        } else {
          toast.success(`Referencia cargada: ${paymentData.reference} (ingrese el monto manualmente)`);
        }
      }

    } catch (error) {
      console.error('[usePaymentPaste] Error:', error);
      toast.error("No se pudo leer del portapapeles");
    }
  }, [getVESCurrencyId, getVESCurrencyValueId, onPaste]);

  /**
   * Procesa OCR y actualiza datos (usado por imagen de clipboard y base64)
   */
  const processOCRData = useCallback(async (ocrText) => {
    const parsedData = parsePaymentReceipt(ocrText);
    const validation = validateParsedData(parsedData);
    
    if (!validation.valid) {
      throw new Error(
        `No se pudieron extraer todos los datos.\nFaltantes: ${validation.missing.join(', ')}`
      );
    }

    const paymentData = {
      reference: parsedData.reference,
      amount: parsedData.amount,
      currency_id: getVESCurrencyId(),
      currency_value_id: getVESCurrencyValueId(),
      ...(parsedData.operationType && {
        payment_type_id: parsedData.operationType.id
      }),
    };

    if (onPaste && typeof onPaste === 'function') {
      onPaste(paymentData);
    }

    return parsedData;
  }, [getVESCurrencyId, getVESCurrencyValueId, onPaste]);

  /**
   * Procesa imagen OCR desde portapapeles
   */
  const handleImagePaste = useCallback(async (onOpenFilePicker) => {
    setIsProcessing(true);
    
    try {
      const processingToast = toast.loading('Procesando imagen...');

      let ocrText;
      try {
        ocrText = await processClipboardImage();
      } catch (clipboardError) {
        toast.dismiss(processingToast);
        
        if (onOpenFilePicker && typeof onOpenFilePicker === 'function') {
          onOpenFilePicker();
        }
        return false;
      }
      
      toast.dismiss(processingToast);
      toast.loading('Analizando comprobante...', { id: processingToast });

      const parsedData = await processOCRData(ocrText);

      toast.dismiss(processingToast);
      toast.success(formatParsedData(parsedData), { duration: 5000 });

      return true;

    } catch (error) {
      console.error('[OCR] Error:', error);
      toast.error(error.message || 'Error procesando la imagen');
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [processOCRData]);

  /**
   * Procesa imagen OCR desde base64 (drag & drop, file picker)
   */
  const handleImageFromBase64 = useCallback(async (base64Image) => {
    if (!base64Image) {
      toast.error('No se recibió imagen');
      return;
    }

    setIsProcessing(true);
    
    try {
      const processingToast = toast.loading('Procesando imagen...');

      const { processImageOCR } = await import('@/services/ocrService');
      const ocrText = await processImageOCR(base64Image);
      
      toast.dismiss(processingToast);
      toast.loading('Analizando comprobante...', { id: processingToast });

      const parsedData = await processOCRData(ocrText);

      toast.dismiss(processingToast);
      toast.success(formatParsedData(parsedData), { duration: 5000 });

    } catch (error) {
      console.error('[OCR] Error:', error);
      toast.error(error.message || 'Error procesando la imagen');
    } finally {
      setIsProcessing(false);
    }
  }, [processOCRData]);

  return {
    handlePasteClick,
    handleImagePaste,
    handleImageFromBase64,
    isProcessing,
  };
};

