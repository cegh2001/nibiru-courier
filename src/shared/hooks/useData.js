import { useState, useEffect, useRef, useMemo } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { useSearchParams } from "next/navigation";
/* Services */
import { fetcher } from "@/services/fetcher";
import { fetcher as fullFetcher } from "@/services/fullFetcher";
/* Sincronización entre pestañas */
import {
  syncDataAcrossTabs,
  listenForSync,
  SYNC_TYPES,
} from "@/services/channels/syncChannel";

/* Manejo de los Datos de un Ruta */
export const useData = (
  endpoint,
  {
    id = null,
    params = {},
    dependent = null,
    fullResponse = false,
    paginationKey = "page",
    fallbackData = undefined,
    swrOptions = {},
  } = {},
  shouldFetch = true,
  maxRetries = 2
) => {
  const [page, setPage] = useState(1);
  const searchParams = useSearchParams();

  // Manejo de paginación - usar fullResponse en lugar de paginated
  useEffect(() => {
    if (!fullResponse) {
      return;
    }

    const pageParam = searchParams.get(paginationKey);
    const nextPage = pageParam ? parseInt(pageParam, 10) : 1;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(Number.isNaN(nextPage) ? 1 : nextPage);
  }, [fullResponse, paginationKey, searchParams]);

  const url = endpoint ? (id ? `${endpoint}/${id}` : endpoint) : null;

  // Memoizar el objeto params utilizando JSON.stringify para evitar cambios de referencia innecesarios
  const serializedParams = JSON.stringify(params);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedParams = useMemo(() => params, [serializedParams]);

  // Combinar parámetros incluyendo página si fullResponse está habilitado
  const combinedParams = useMemo(() => {
    return {
      ...(fullResponse ? {} : { remove_pagination: true }),
      ...memoizedParams,
      ...(fullResponse ? { page } : {}),
    };
  }, [fullResponse, memoizedParams, page]);

  // Memoizar la clave SWR final según la lógica condicional de dependencias
  const swrKey = useMemo(() => {
    if (dependent !== null && dependent !== undefined) {
      if (!dependent) {
        return null;
      }
    }
    return shouldFetch && url ? [url, JSON.stringify(combinedParams)] : null;
  }, [dependent, shouldFetch, url, combinedParams]);

  // Seleccionar el fetcher apropiado basado en fullResponse
  const selectedFetcher = fullResponse ? fullFetcher : fetcher;
  const resolvedSwrOptions = swrOptions || {};

  /* Desestructuración del Hook de SWR (GET) */
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    swrKey,
    ([url, params]) => selectedFetcher(url, JSON.parse(params)),
    {
      keepPreviousData: true, // Mantener datos anteriores durante la recarga
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {  
        /* Comprobación del Status del Error Igual a 404 */
        if (error.status === 404) return;

        /* Comprobación de los Reintentos Mayor o Igual que el Límite Máximo */
        if (retryCount >= maxRetries) return;

        setTimeout(() => revalidate({ retryCount }), 5000);
      },
      ...resolvedSwrOptions,
    }
  );

  const hasResolvedData = data !== undefined && data !== null;
  const resolvedIsLoading = isLoading && !hasResolvedData;

  const [mutationError, setMutationError] =
    useState(null); /* Error de una Mutación */
  const pendingMutationsRef = useRef(new Map());

  /* SWR Mutations configured with closure fetchers to resolve dynamic urls/options at trigger time */
  const { trigger: triggerCreate, isMutating: isMutatingCreate } = useSWRMutation(
    url ? `POST:${url}` : "POST:fallback",
    async (_, { arg }) => {
      const { newData, options } = arg || {};
      const postUrl = options?.customUrl || url;
      const response = await selectedFetcher.post(postUrl, newData, options);
      mutate();
      syncDataAcrossTabs(SYNC_TYPES.CREATE, endpoint, { id: response?.id });
      return response;
    },
    {
      onError: (err) => setMutationError(err),
      onSuccess: () => setMutationError(null),
    }
  );

  const { trigger: triggerUpdate, isMutating: isMutatingUpdate } = useSWRMutation(
    url ? `PATCH:${url}` : "PATCH:fallback",
    async (_, { arg }) => {
      const { updatedData, overrideId } = arg || {};
      const patchUrl = overrideId ? `${endpoint}/${overrideId}` : url;

      let response;
      if (updatedData instanceof FormData) {
        if (!updatedData.has("_method")) {
          updatedData.append("_method", "PATCH");
        }
        response = await selectedFetcher.post(patchUrl, updatedData);
      } else {
        response = await selectedFetcher.patch(patchUrl, updatedData);
      }

      mutate();
      syncDataAcrossTabs(SYNC_TYPES.UPDATE, endpoint, { id: overrideId || id });
      return response;
    },
    {
      onError: (err) => setMutationError(err),
      onSuccess: () => setMutationError(null),
    }
  );

  const { trigger: triggerDelete, isMutating: isMutatingDelete } = useSWRMutation(
    url ? `DELETE:${url}` : "DELETE:fallback",
    async (_, { arg }) => {
      const { overrideId } = arg || {};
      const deleteUrl = overrideId ? `${endpoint}/${overrideId}` : url;
      const itemId = overrideId || id;

      const response = await selectedFetcher.delete(deleteUrl);
      mutate();
      syncDataAcrossTabs(SYNC_TYPES.DELETE, endpoint, { id: itemId });
      return response;
    },
    {
      onError: (err) => setMutationError(err),
      onSuccess: () => setMutationError(null),
    }
  );

  /* Aggregate isMutating states from SWR mutation hooks */
  const isMutating = isMutatingCreate || isMutatingUpdate || isMutatingDelete;

  // Escuchar eventos de sincronización de otras pestañas
  useEffect(() => {
    if (!endpoint || typeof window === "undefined") return;

    // Función que manejará los eventos de sincronización
    const handleSync = (syncEvent) => {
      // Solo revalidar si el evento afecta a este endpoint
      if (syncEvent.endpoint === endpoint) {
        console.log(
          `Sincronizando datos para ${endpoint} desde otra pestaña`,
          syncEvent
        );
        mutate();
      }
    };

    // Configurar el listener y guardar la función para limpieza
    const unsubscribe = listenForSync(handleSync);

    // Limpiar listener cuando el componente se desmonta o cambia el endpoint
    return () => {
      unsubscribe();
    };
  }, [endpoint, mutate]);

  // Función para cambio de página - usar fullResponse en lugar de paginated
  const onPageChange = (newPage) => {
    if (!fullResponse) return;

    setPage(newPage);
    if (typeof window !== "undefined") {
      const urlSearchParams = new URLSearchParams(window.location.search);
      urlSearchParams.set(paginationKey, newPage.toString());

      // Mantener otros parámetros existentes excepto el paginationKey actual
      Object.entries(params).forEach(([key, value]) => {
        if (key !== "page" && value !== undefined && value !== null) {
          urlSearchParams.set(key, value.toString());
        }
      });

      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}?${urlSearchParams.toString()}`
      );
    }
  };

  // FUNCIONES
  /* Funcionalidad para la Creación (POST) con deduplicación y encolado single-flight */
  const createData = (newData, options = {}) => {
    const postUrl = options.customUrl || url;
    const mutationKey = `POST:${postUrl}`;

    const pendingMutation = pendingMutationsRef.current.get(mutationKey);
    if (pendingMutation) {
      return pendingMutation;
    }

    setMutationError(null);
    const mutationPromise = triggerCreate({ newData, options }).finally(() => {
      pendingMutationsRef.current.delete(mutationKey);
    });
    pendingMutationsRef.current.set(mutationKey, mutationPromise);

    return mutationPromise;
  };

  /* Funcionalidad para la Actualización (PATCH) con deduplicación y encolado single-flight */
  const updateData = (updatedData, overrideId = null) => {
    const patchUrl = overrideId ? `${endpoint}/${overrideId}` : url;
    const mutationKey = `PATCH:${patchUrl}`;

    const pendingMutation = pendingMutationsRef.current.get(mutationKey);
    if (pendingMutation) {
      return pendingMutation;
    }

    setMutationError(null);
    const mutationPromise = triggerUpdate({ updatedData, overrideId }).finally(() => {
      pendingMutationsRef.current.delete(mutationKey);
    });
    pendingMutationsRef.current.set(mutationKey, mutationPromise);

    return mutationPromise;
  };

  /* Funcionalidad para la Eliminación (DELETE) con deduplicación y encolado single-flight */
  const deleteData = (overrideId = null) => {
    const deleteUrl = overrideId ? `${endpoint}/${overrideId}` : url;
    const itemId = overrideId || id;
    const mutationKey = `DELETE:${deleteUrl}`;

    const pendingMutation = pendingMutationsRef.current.get(mutationKey);
    if (pendingMutation) {
      return pendingMutation;
    }

    setMutationError(null);
    const mutationPromise = triggerDelete({ overrideId }).finally(() => {
      pendingMutationsRef.current.delete(mutationKey);
    });
    pendingMutationsRef.current.set(mutationKey, mutationPromise);

    return mutationPromise;
  };

  // incluir onPageChange cuando fullResponse está habilitado
  return {
    data: data ?? fallbackData,
    error,
    isLoading: resolvedIsLoading,
    isValidating, // Nuevo: indica si está revalidando/cargando sin vaciar datos
    mutate,
    isMutating,
    mutationError,
    createData,
    updateData,
    deleteData,
    ...(fullResponse ? { onPageChange } : {}),
  };
};
