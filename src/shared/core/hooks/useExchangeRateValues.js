"use client";

import { useExchangeRateStore } from "@/core/stores/exchangeRateStore";

/**
 * Hook para obtener las cotizaciones actuales desde el store
 * Útil para formularios que necesitan los valores sin cargar automáticamente
 */
export function useExchangeRateValues() {
  const { usdRate, eurRate, lastUpdate } = useExchangeRateStore();

  // Función para obtener solo los valores numéricos
  const getExchangeValues = () => {
    return {
      usd: usdRate?.price || null,
      eur: eurRate?.price || null,
      dollar: usdRate?.price || null, // Mantener compatibilidad
      euro: eurRate?.price || null,   // Mantener compatibilidad
      lastUpdate: lastUpdate,
      hasRates: !!(usdRate && eurRate)
    };
  };

  return {
    usdRate,
    eurRate,
    lastUpdate,
    getExchangeValues,
    hasRates: !!(usdRate && eurRate)
  };
}
