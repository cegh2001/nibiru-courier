"use client";

import { create } from "zustand";
import { fetcher } from "@/services/fetcher";
import { FINANCE_ROUTES } from "@/services/apis/finance";

/**
 * Store centralizado para valores históricos de monedas (USD y EUR).
 * Se carga una sola vez al iniciar sesión y es consumido por todos los módulos
 * que necesitan seleccionar tasas de cambio históricas.
 * 
 * Reemplaza las llamadas individuales que cada módulo hacía a:
 *   GET /currencies_values?currency_id=1&remove_pagination=true (USD)
 *   GET /currencies_values?currency_id=2&remove_pagination=true (EUR)
 */
export const useCurrencyValuesStore = create((set, get) => ({
  // Datos crudos del API
  usdValues: [],
  eurValues: [],

  // Estado
  isLoaded: false,
  isLoading: false,
  error: null,

  /**
   * Cargar valores históricos de ambas monedas en paralelo.
   * Solo ejecuta si no se han cargado previamente (a menos que se fuerce).
   */
  fetchCurrencyValues: async (force = false) => {
    const { isLoaded, isLoading } = get();

    if (isLoading) return;
    if (isLoaded && !force) return;

    set({ isLoading: true, error: null });

    try {
      const [usdData, eurData] = await Promise.all([
        fetcher(FINANCE_ROUTES.CURRENCIES_VALUES, {
          params: { currency_id: 1, remove_pagination: true },
        }),
        fetcher(FINANCE_ROUTES.CURRENCIES_VALUES, {
          params: { currency_id: 2, remove_pagination: true },
        }),
      ]);

      set({
        usdValues: usdData || [],
        eurValues: eurData || [],
        isLoaded: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("[CurrencyValuesStore] Error fetching currency values:", error);
      set({
        isLoading: false,
        error: error.message || "Error al cargar valores de moneda",
      });
    }
  },

  /**
   * Limpiar datos (para logout).
   */
  clearCurrencyValues: () =>
    set({
      usdValues: [],
      eurValues: [],
      isLoaded: false,
      isLoading: false,
      error: null,
    }),
}));
