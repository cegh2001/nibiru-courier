"use client";

import { create } from "zustand";
import { fetcher } from "@/services/fetcher";
import { FINANCE_ROUTES } from "@/services/apis/finance";

export const useExchangeRateStore = create((set, get) => ({
  // Estado
  usdRate: null,
  eurRate: null,
  lastUpdate: null,
  loading: false,
  error: null,

  // Acciones
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  setRates: (usdRate, eurRate) => set({
    usdRate,
    eurRate,
    lastUpdate: new Date(),
    error: null
  }),

  // Función para procesar datos de la nueva API de currencies
  processCurrenciesData: (currenciesData) => {
    if (!currenciesData) return { usdRate: null, eurRate: null };

    let usdRate = null;
    let eurRate = null;

    currenciesData.forEach(currency => {
      if (currency.abbrev === "USD" && currency.last_value) {
        usdRate = {
          currency: "USD",
          price: parseFloat(currency.last_value.value),
          change: 0, // Sin datos de cambio en la nueva API
          percent: 0, // Sin datos de porcentaje en la nueva API
          color: "green", // Color neutro por defecto
          lastUpdate: currency.last_value.date_update,
          source: "API Backend"
        };
      } else if (currency.abbrev === "EUR" && currency.last_value) {
        eurRate = {
          currency: "EUR", 
          price: parseFloat(currency.last_value.value),
          change: 0, // Sin datos de cambio en la nueva API
          percent: 0, // Sin datos de porcentaje en la nueva API
          color: "green", // Color neutro por defecto
          lastUpdate: currency.last_value.date_update,
          source: "API Backend"
        };
      }
    });

    return { usdRate, eurRate };
  },

  // Fetch de las cotizaciones desde la nueva ruta de currencies
  fetchExchangeRates: async () => {
    const { loading, processCurrenciesData } = get();
    
    // Evitar múltiples llamadas simultáneas
    if (loading) return;
    
    set({ loading: true, error: null });

    try {
      const currenciesData = await fetcher(FINANCE_ROUTES.CURRENCIES, { remove_pagination: true });
      
      // Procesar los datos de currencies
      const { usdRate, eurRate } = processCurrenciesData(currenciesData);

      set({
        usdRate,
        eurRate,
        lastUpdate: new Date(),
        loading: false,
        error: null
      });

    } catch (error) {
      console.error('[ExchangeRateStore] Error fetching rates:', error);
      set({
        loading: false,
        error: error.message || 'Error al cargar cotizaciones'
      });
    }
  },

  // Actualizar rates externamente (para sincronización desde otros componentes)
  updateRatesFromData: (currenciesData) => {
    const { processCurrenciesData } = get();
    const { usdRate, eurRate } = processCurrenciesData(currenciesData);
    
    set({
      usdRate,
      eurRate,
      lastUpdate: new Date(),
      error: null
    });
  },

  // Limpiar datos
  clearRates: () => set({
    usdRate: null,
    eurRate: null,
    lastUpdate: null,
    error: null
  })
}));
