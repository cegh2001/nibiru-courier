/**
 * API Endpoints para Brokers y Clientes
 * Este archivo contiene todas las rutas relacionadas con agentes de aduana (custom brokers)
 * y clientes del sistema.
 */

// ===== CLIENTS (Clientes) =====
export const CLIENTS_ENDPOINTS = {
  base: '/clients',
  // GET /clients - Obtener todos los clientes
  // POST /clients - Crear nuevo cliente
  // GET /clients/:id - Obtener cliente por ID
  // PATCH /clients/:id - Actualizar cliente
  // DELETE /clients/:id - Eliminar cliente
  
  // Impuestos del cliente
  // GET /clients/:id/taxes - Obtener impuestos del cliente
  // POST /clients/:id/taxes - Crear nuevo impuesto al cliente
  // PATCH /clients/:id/taxes/:taxId - Actualizar impuesto del cliente
  // DELETE /clients/:id/taxes/:taxId - Eliminar impuesto del cliente
  taxes: (clientId) => `/clients/${clientId}/taxes`,
  clientTax: (clientId, taxId) => `/clients/${clientId}/taxes/${taxId}`,
  payRetention: (clientId) => `/clients/${clientId}/pay_retention`,
};

// ===== CUSTOM BROKERS (Agentes de Aduana) =====
export const CUSTOM_BROKERS_ENDPOINTS = {
  base: '/custom_broker',
  // GET /custom_broker - Obtener todos los agentes de aduana
  // POST /custom_broker - Crear nuevo agente de aduana
  // PUT /custom_broker/:id - Actualizar agente de aduana
  // DELETE /custom_broker/:id - Eliminar agente de aduana
};

// Exportar todas las rutas como un objeto consolidado
export const BROKERS_ROUTES = {
  CLIENTS: CLIENTS_ENDPOINTS.base,
  CLIENTS_TAXES: CLIENTS_ENDPOINTS.taxes,
  CLIENT_TAX: CLIENTS_ENDPOINTS.clientTax,
  CLIENT_PAY_RETENTION: CLIENTS_ENDPOINTS.payRetention,
  CUSTOM_BROKERS: CUSTOM_BROKERS_ENDPOINTS.base,
};

// Exportar como default para facilitar importación
export default BROKERS_ROUTES;
