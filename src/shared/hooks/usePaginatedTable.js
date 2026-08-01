/* Hooks */
import { useCallback } from "react"; // Eliminado useState ya que no se usa
import { useIsClient } from "@uidotdev/usehooks";
import { useData } from "@/hooks/useData";
import toast from "react-hot-toast";

/* Manejo de una Tabla con Paginación usando SWR */
export const usePaginatedTable = (initialUrl, params = {}, name = "El item") => { // Agregado params como segundo parámetro
  const isClient = useIsClient();
  
  // Usar useData para obtener datos con SWR - IMPORTANTE: fullResponse: true para paginación
  const { 
    data: response, 
    isLoading: loading,
    isValidating,
    mutate: refreshData,
    updateData,
    deleteData,
    onPageChange
    // Eliminado createData ya que no se utiliza en este hook
  } = useData(initialUrl, { fullResponse: true, params }); // Pasar params a useData

  // Extraer datos y paginación de la respuesta
  const data = response?.data || [];
  const pagination = response ? {
    current_page: response.current_page,
    last_page: response.last_page,
    per_page: response.per_page,
    total: response.total,
    next_page_url: response.next_page_url,
    prev_page_url: response.prev_page_url,
    from: response.from,
    to: response.to,
    links: response.links,
  } : {};

  // Determinar si está refetching (tiene datos pero está validando)
  const isRefetching = isValidating && data.length > 0;
  const pageLoading = loading && data.length === 0;

  /* Función simplificada para obtener datos */
  const getData = useCallback(() => {
    refreshData();
  }, [refreshData]);

  /* Eliminación de un Registro */
  const handleDestroy = useCallback(
    async (item) => {
      try {
        await deleteData(item.id);
        toast.success(`${name} ${item.id} se eliminó exitosamente!`);
        // SWR automáticamente revalida los datos
        // La sincronización entre pestañas está manejada por useData
      } catch (err) {
        toast.error("Oops, no se pudo eliminar.");
      }
    },
    [deleteData, name]
  );

  /* Actualización de un Registro */
  const handleUpdate = useCallback(
    async (item, updatedValues) => {
      try {
        // Usar updateData para todos los casos - ya maneja FormData internamente
        await updateData(updatedValues, item.id);
        // SWR automáticamente revalida los datos
        // La sincronización entre pestañas está manejada por useData
      } catch (err) {
        console.error("Error en handleUpdate:", err);
        toast.error("Oops, no se pudo actualizar.");
      }
    },
    [updateData]
  );

  /* Función para ir a una URL específica */
  const goToUrl = useCallback((linkUrl) => {
    if (linkUrl && onPageChange) {
      // Extraer el número de página de la URL
      const urlParams = new URLSearchParams(linkUrl.split('?')[1] || '');
      const pageParam = urlParams.get('page');
      
      if (pageParam) {
        onPageChange(parseInt(pageParam));
      }
    }
  }, [onPageChange]);

  return {
    isClient,
    loading,
    pageLoading,
    isRefetching,
    setLoading: () => {}, // Mantenemos compatibilidad pero SWR maneja el loading
    data,
    pagination,
    getData,
    goToUrl,
    handleDestroy,
    handleUpdate,
  };
};

