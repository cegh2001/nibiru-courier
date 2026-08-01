/**
 * Utilidad para sincronizar datos entre múltiples pestañas/ventanas usando BroadcastChannel
 * Se complementa con SWR para mantener los datos actualizados en tiempo real
 */

// Tipos de mensajes para sincronización
export const SYNC_TYPES = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  CUSTOM: 'custom'
}; // [MEJORA] Tipado claro para los mensajes

// Singleton para el canal de sincronización
let channelInstance = null; // [MEJORA] Patrón singleton evita múltiples instancias

// Crear un BroadcastChannel si está disponible en el navegador
const createChannel = (name = 'nibiru-courier-sync') => {
  if (typeof window === 'undefined' || !window.BroadcastChannel) {
    return null;
  }
  
  if (!channelInstance) {
    try {
      channelInstance = new BroadcastChannel(name);
      console.log(`Canal de sincronización '${name}' creado`);
    } catch (error) {
      console.warn('BroadcastChannel no está soportado en este navegador:', error);
      return null;
    }
  }
  
  return channelInstance;
}; // [MEJORA] Manejo de errores y verificación de disponibilidad

/**
 * Envía un mensaje de sincronización a otras pestañas/ventanas
 * @param {string} type - Tipo de operación (create, update, delete, custom)
 * @param {string} endpoint - URL del recurso afectado
 * @param {any} data - Datos relacionados con la operación (opcional)
 */
export const syncDataAcrossTabs = (type, endpoint, data = null) => {
  const channel = createChannel();
  if (!channel) return;
  
  try {
    const message = {
      type,
      endpoint,
      data,
      timestamp: Date.now()
    };
    
    channel.postMessage(message);
    console.log(`Sincronización enviada: ${type} para ${endpoint}`);
  } catch (error) {
    console.warn('Error al enviar mensaje a través de BroadcastChannel:', error);
  }
};

// Almacenar los callbacks activos
const activeListeners = new Map(); // [MEJORA] Registro de listeners para limpieza adecuada

/**
 * Configura un listener para recibir actualizaciones de otras pestañas
 * @param {Function} callback - Función a llamar cuando se recibe un mensaje
 * @returns {Function} - Función para eliminar el listener
 */
export const listenForSync = (callback) => {
  const channel = createChannel();
  if (!channel) return () => {};
  
  // Generar un ID único para este listener
  const listenerId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
  
  const handler = (event) => {
    if (event.data && event.data.type && event.data.endpoint) {
      try {
        callback(event.data);
      } catch (error) {
        console.error('Error en el callback de sincronización:', error);
      }
    }
  };
  
  // Almacenar el handler con su ID
  activeListeners.set(listenerId, handler);
  
  // Añadir el listener al canal
  channel.addEventListener('message', handler);
  
  // Devolver función para eliminar el listener
  return () => {
    if (channel && activeListeners.has(listenerId)) {
      channel.removeEventListener('message', activeListeners.get(listenerId));
      activeListeners.delete(listenerId);
    }
  }; // [MEJORA] Función de limpieza que evita memory leaks
};

/**
 * Cierra el canal de sincronización y limpia todos los listeners
 */
export const closeSyncChannel = () => {
  if (channelInstance) {
    try {
      // Limpiar todos los listeners activos
      activeListeners.forEach((handler) => {
        channelInstance.removeEventListener('message', handler);
      });
      activeListeners.clear(); // [MEJORA] Limpieza completa de listeners
      
      // Cerrar el canal
      channelInstance.close();
      channelInstance = null;
      console.log('Canal de sincronización cerrado');
    } catch (error) {
      console.error('Error al cerrar canal de sincronización:', error);
    }
  }
};
