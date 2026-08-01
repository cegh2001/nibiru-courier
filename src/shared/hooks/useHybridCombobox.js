import { useCallback, useMemo } from "react";
import { useData } from "@/hooks/useData";
import { apiClient } from "@/services/apiClient";

/**
 * useHybridCombobox - Hook para combobox híbrido que muestra los últimos N registros
 * y permite búsqueda con debounce vía API.
 *
 * @param {string} endpoint - Ruta del API (ej: '/clients', '/airlines')
 * @param {Object} options
 * @param {number} options.initialPageSize - Cantidad de registros iniciales a mostrar (default: 10)
 * @param {Object} options.extraParams - Parámetros adicionales para las peticiones (ej: { airline: id })
 * @param {boolean} options.enabled - Si el hook debe hacer fetch (default: true)
 * @param {Object} options.swrOptions - Configuración adicional de SWR para el fetch inicial
 * @param {Function} options.getItemKey - Función para obtener la key de un item (default: item => item.id)
 * @param {Function} options.getItemLabel - Función para obtener el label de un item (default: item => item.name)
 *
 * @returns {{ initialItems: Array, isLoadingInitial: boolean, performSearch: Function }}
 */
export const useHybridCombobox = (endpoint, {
  initialPageSize = 10,
  extraParams = {},
  enabled = true,
  swrOptions = {},
  getItemKey = (item) => item.id,
  getItemLabel = (item) => item.name,
} = {}) => {
  // Serializar extraParams para estabilizar dependencias
  const extraParamsKey = JSON.stringify(extraParams);

  const stableExtraParams = useMemo(() => {
    try {
      return JSON.parse(extraParamsKey || "{}");
    } catch {
      return {};
    }
  }, [extraParamsKey]);

  // Memoizar los parámetros para evitar recrear la key de SWR
  const stableParams = useMemo(() => ({
    per_page: initialPageSize,
    ...stableExtraParams,
  }), [initialPageSize, stableExtraParams]);

  // Fetch de los últimos N registros (paginado, página 1)
  const { data: initialData, isLoading: isLoadingInitial, mutate } = useData(
    endpoint,
    {
      fullResponse: true,
      params: stableParams,
      swrOptions,
    },
    enabled
  );

  // Extraer el array de items de la respuesta paginada
  const initialItems = useMemo(() => {
    return initialData?.data || [];
  }, [initialData]);

  // Función de búsqueda para usar con apiSearchFunction de MyCombobox
  const performSearch = useCallback(async (query) => {
    if (!query || !endpoint) return [];

    try {
      const response = await apiClient.get(endpoint, {
        params: {
          search: query,
          remove_pagination: true,
          ...stableExtraParams,
        },
      });
      return response.data?.data || [];
    } catch (error) {
      console.error("Error en búsqueda híbrida:", error);
      return [];
    }
  }, [endpoint, stableExtraParams]);

  return {
    initialItems,
    isLoadingInitial,
    performSearch,
    mutate,
  };
};
