/**
 * API Endpoints para el módulo de Finanzas
 * Este archivo contiene todas las rutas relacionadas con la gestión financiera
 * del sistema, incluyendo bancos, cuentas, pagos, impuestos, etc.
 */

// ===== BANKS (Bancos) =====
export const BANKS_ENDPOINTS = {
  base: '/banks',
  // GET /banks - Obtener todos los bancos
  // POST /banks - Crear nuevo banco
  // PUT /banks/:id - Actualizar banco
  // DELETE /banks/:id - Eliminar banco
};

// ===== ACCOUNTS (Cuentas Bancarias) =====
export const ACCOUNTS_ENDPOINTS = {
  base: '/accounts',
  // GET /accounts - Obtener todas las cuentas bancarias
  // POST /accounts - Crear nueva cuenta bancaria
  // PUT /accounts/:id - Actualizar cuenta bancaria
  // DELETE /accounts/:id - Eliminar cuenta bancaria
};

// ===== CURRENCIES (Monedas) =====
export const CURRENCIES_ENDPOINTS = {
  base: '/currencies',
  values: '/currencies_values', // Histórico de valores de monedas
  // GET /currencies - Obtener todas las monedas con sus valores actuales
  // GET /currencies_values - Obtener histórico de valores de monedas
  // POST /currencies - Crear nueva moneda
  // PUT /currencies/:id - Actualizar moneda
  // DELETE /currencies/:id - Eliminar moneda
};

// ===== CONCEPTS (Conceptos) =====
export const CONCEPTS_ENDPOINTS = {
  base: '/concepts', // Ruta para conceptos (CRUD simple: solo nombre e id)
  values: '/concept_values', // Ruta para valores de conceptos (historial de valores asignados)
  typeCalc: '/type_calc', // Ruta para tipos de cálculo (fórmulas de conceptos)
  // GET /concepts - Obtener listado de conceptos
  // POST /concepts - Crear nuevo concepto
  // PUT /concepts/:id - Actualizar concepto
  // DELETE /concepts/:id - Eliminar concepto
  // GET /concept_values - Obtener todos los valores de conceptos
  // POST /concept_values - Crear nuevo valor de concepto
  // DELETE /concept_values/:id - Eliminar valor de concepto
  // GET /type_calc - Obtener tipos de cálculo disponibles
};

// ===== DISCOUNTS (Descuentos) =====
export const DISCOUNTS_ENDPOINTS = {
  base: '/discounts',
  // GET /discounts - Obtener todos los descuentos
  // POST /discounts - Crear nuevo descuento
  // PUT /discounts/:id - Actualizar descuento
  // DELETE /discounts/:id - Eliminar descuento
};

// ===== PAYMENT TYPES (Métodos de Pago) =====
export const PAYMENT_TYPES_ENDPOINTS = {
  base: '/payment_types', // Backend usa tipo_pagos
  // GET /payment_types - Obtener todos los métodos de pago
  // POST /payment_types - Crear nuevo método de pago
  // PUT /payment_types/:id - Actualizar método de pago
  // DELETE /payment_types/:id - Eliminar método de pago
};

// ===== PAYMENTS (Pagos) =====
export const PAYMENTS_ENDPOINTS = {
  base: '/payments',
  convertExcel: '/payments/converte_excel',  // POST - Convertir Excel a array de pagos
  massive: '/payments/massive',              // POST - Crear pagos masivos
  // GET /payments - Obtener todos los pagos
  // POST /payments - Crear nuevo pago
  // PUT /payments/:id - Actualizar pago
  // DELETE /payments/:id - Eliminar pago
};

// ===== TAXES (Impuestos) =====
export const TAXES_ENDPOINTS = {
  base: '/taxes',
  types: '/taxes_type',
  // GET /taxes - Obtener todos los impuestos
  // POST /taxes - Crear nuevo impuesto
  // PUT /taxes/:id - Actualizar impuesto
  // DELETE /taxes/:id - Eliminar impuesto
  // GET /taxes_type - Obtener todos los tipos de impuestos
};

// ===== ADVANCES (Anticipos) =====
export const ADVANCES_ENDPOINTS = {
  base: '/advances',
  // GET /advances - Obtener todos los anticipos
  // POST /advances - Crear nuevo anticipo
  // PUT /advances/:id - Actualizar anticipo
  // DELETE /advances/:id - Eliminar anticipo
};

// ===== CREDIT NOTES (Notas de Crédito) =====
export const CREDIT_NOTES_ENDPOINTS = {
  base: '/credit_advice',
  byId: (id) => `/credit_advice/${id}`, // GET /credit_advice/:id - Obtener nota o aviso por ID
  // GET /credit_advice?is_note=1 - Obtener notas de crédito
  // GET /credit_advice?is_note=0 - Obtener avisos de crédito
};

// ===== CREDIT ADVISORIES (Avisos de Crédito) =====
export const CREDIT_ADVISORIES_ENDPOINTS = {
  base: '/credit_advice',
  // GET /credit_advice - Obtener todos los avisos de crédito (con filtros: ?client_id=, ?used=true/false)
  // ❌ POST/PUT/DELETE - No disponibles públicamente
  // Los avisos de crédito se crean automáticamente cuando hay excedente en pagos de facturas
  byId: (id) => `/credit_advice/${id}`, // GET /credit_advice/:id - Obtener aviso por ID
  byClient: (clientId) => `/credit_advice?client_id=${clientId}`, // Filtrar por cliente
  unused: '/credit_advice?used=false', // Solo avisos no usados
  used: '/credit_advice?used=true', // Solo avisos usados
};

// ===== INVOICES (Facturas) =====
export const INVOICES_ENDPOINTS = {
  base: '/invoices',
  getCost: '/invoices/get_cost', // POST /invoices/get_cost - Obtener costos calculados con impuestos
  getCostExpense: '/invoices/get_cost_expense', // POST /invoices/get_cost_expense - Obtener costos de gastos adicionales
  expense: '/invoices/expense', // POST /invoices/expense - Crear factura de gastos adicionales
  byId: (id) => `/invoices/${id}`, // GET /invoices/:id - Obtener factura por ID
  addPayment: (id) => `/invoices/${id}/add_payment`, // POST /invoices/:id/add_payment - Agregar pago a factura a crédito
  anulate: (id) => `/invoices/${id}/anulate`, // POST /invoices/:id/anulate - Anular factura y generar nota de crédito
  report: (id) => `/invoices/${id}/report`, // GET /invoices/:id/report - Descargar PDF de factura
  visualizer: (id) => `/invoices/${id}/visualizer`, // GET /invoices/:id/visualizer - Obtener imagen base64 de factura
  // GET /invoices - Obtener todas las facturas
  // POST /invoices - Crear nueva factura
  // PUT /invoices/:id - Actualizar factura
  // DELETE /invoices/:id - Eliminar factura
};

// ===== PRELIQUIDATIONS (Preliquidaciones) =====
export const PRELIQUIDATIONS_ENDPOINTS = {
  base: '/pre_settlements',
  getCosts: '/pre_settlements/get_costs',
  byId: (id) => `/pre_settlements/${id}`, // GET /pre_settlements/:id - Obtener preliquidación por ID
  report: (id) => `/pre_settlements/${id}/report`, // POST /pre_settlements/:id/report - Descargar PDF de preliquidación (body: { visible_discount: boolean })
  // GET /pre_settlements - Obtener todas las preliquidaciones
  // POST /pre_settlements/get_costs - Obtener previsualización de costos
  // POST /pre_settlements - Crear nueva preliquidación
  // PUT /pre_settlements/:id - Actualizar preliquidación
  // DELETE /pre_settlements/:id - Eliminar preliquidación
};

// ===== SERVICE ORDERS (Órdenes de Servicio) =====
export const SERVICE_ORDERS_ENDPOINTS = {
  base: '/order_services',
  byId: (id) => `/order_services/${id}`,
  reportById: (id) => `/order_services/${id}/report`,
  // GET /order_services - Obtener todas las órdenes de servicio
  // GET /order_services/:id - Obtener orden de servicio por ID (con concepts)
  // POST /order_services - Crear nueva orden de servicio
  // PUT /order_services/:id - Actualizar orden de servicio
  // DELETE /order_services/:id - Eliminar orden de servicio
};

// ===== EXIT PASS (Pases de Salida del Almacén) =====
export const EXIT_PASS_ENDPOINTS = {
  base: '/exit_pass',
  // GET /exit_pass - Obtener todos los pases de salida del almacén
  // POST /exit_pass - Crear nuevo pase de salida del almacén
  // PUT /exit_pass/:id - Actualizar pase de salida
  // DELETE /exit_pass/:id - Eliminar pase de salida
  byId: (id) => `/exit_pass/${id}`, // GET /exit_pass/:id - Obtener pase por ID
};

// ===== EXIT PASS SIDUNEA (Pases de Salida Sidunea) =====
export const EXIT_PASS_SIDUNEA_ENDPOINTS = {
  base: '/exit_pass_sidunea',
  // GET /exit_pass_sidunea - Obtener todos los pases de salida
  // POST /exit_pass_sidunea - Crear nuevo pase de salida
  byId: (id) => `/exit_pass_sidunea/${id}`, // GET /exit_pass_sidunea/:id - Obtener pase por ID
};

// Exportar todas las rutas como un objeto consolidado
export const FINANCE_ROUTES = {
  BANKS: BANKS_ENDPOINTS.base,
  ACCOUNTS: ACCOUNTS_ENDPOINTS.base,
  CURRENCIES: CURRENCIES_ENDPOINTS.base,
  CURRENCIES_VALUES: CURRENCIES_ENDPOINTS.values,
  CONCEPTS: CONCEPTS_ENDPOINTS.base,
  CONCEPT_VALUES: CONCEPTS_ENDPOINTS.values,
  TYPE_CALC: CONCEPTS_ENDPOINTS.typeCalc,
  // Alias para compatibilidad
  CONCEPTS_LIST: CONCEPTS_ENDPOINTS.base,
  DISCOUNTS: DISCOUNTS_ENDPOINTS.base,
  PAYMENT_TYPES: PAYMENT_TYPES_ENDPOINTS.base,
  PAYMENTS: PAYMENTS_ENDPOINTS.base,
  PAYMENTS_CONVERT_EXCEL: PAYMENTS_ENDPOINTS.convertExcel,
  PAYMENTS_MASSIVE: PAYMENTS_ENDPOINTS.massive,
  TAXES: TAXES_ENDPOINTS.base,
  TAXES_TYPE: TAXES_ENDPOINTS.types,
  ADVANCES: ADVANCES_ENDPOINTS.base,
  CREDIT_NOTES: CREDIT_NOTES_ENDPOINTS.base,
  CREDIT_ADVISORIES: CREDIT_ADVISORIES_ENDPOINTS.base,
  CREDIT_ADVISORIES_BY_ID: CREDIT_ADVISORIES_ENDPOINTS.byId,
  CREDIT_ADVISORIES_BY_CLIENT: CREDIT_ADVISORIES_ENDPOINTS.byClient,
  CREDIT_ADVISORIES_UNUSED: CREDIT_ADVISORIES_ENDPOINTS.unused,
  CREDIT_ADVISORIES_USED: CREDIT_ADVISORIES_ENDPOINTS.used,
  INVOICES: INVOICES_ENDPOINTS.base,
  INVOICES_GET_COST: INVOICES_ENDPOINTS.getCost,
  INVOICES_GET_COST_EXPENSE: INVOICES_ENDPOINTS.getCostExpense,
  INVOICES_EXPENSE: INVOICES_ENDPOINTS.expense,
  INVOICES_BY_ID: INVOICES_ENDPOINTS.byId,
  INVOICES_ADD_PAYMENT: INVOICES_ENDPOINTS.addPayment,
  INVOICES_ANULATE: INVOICES_ENDPOINTS.anulate,
  INVOICES_REPORT: INVOICES_ENDPOINTS.report,
  INVOICES_VISUALIZER: INVOICES_ENDPOINTS.visualizer,
  PRELIQUIDATIONS: PRELIQUIDATIONS_ENDPOINTS.base,
  PRELIQUIDATIONS_BY_ID: PRELIQUIDATIONS_ENDPOINTS.byId,
  PRELIQUIDATIONS_GET_COSTS: PRELIQUIDATIONS_ENDPOINTS.getCosts,
  PRELIQUIDATIONS_REPORT: PRELIQUIDATIONS_ENDPOINTS.report,
  SERVICE_ORDERS: SERVICE_ORDERS_ENDPOINTS.base,
  SERVICE_ORDERS_BY_ID: SERVICE_ORDERS_ENDPOINTS.byId,
  SERVICE_ORDERS_REPORT_BY_ID: SERVICE_ORDERS_ENDPOINTS.reportById,
  EXIT_PASS: EXIT_PASS_ENDPOINTS.base,
  EXIT_PASS_BY_ID: EXIT_PASS_ENDPOINTS.byId,
  EXIT_PASS_SIDUNEA: EXIT_PASS_SIDUNEA_ENDPOINTS.base,
  EXIT_PASS_SIDUNEA_BY_ID: EXIT_PASS_SIDUNEA_ENDPOINTS.byId,
};

// Exportar como default para facilitar importación
export default FINANCE_ROUTES;
