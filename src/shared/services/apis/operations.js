/**
 * API Endpoints para Operaciones
 * Este archivo contiene rutas relacionadas con manifiestos y actas de recepción.
 */

// ===== MANIFESTS (Manifiestos) =====
export const MANIFESTS_ENDPOINTS = {
  base: '/manifests',
  // GET /manifests - Obtener todos los manifiestos
  // GET /manifests/:id - Obtener un manifiesto por ID
  // POST /manifests - Crear nuevo manifiesto
  // PUT /manifests/:id - Actualizar manifiesto
  // DELETE /manifests/:id - Eliminar manifiesto
  reportReceptionPdfById: (id) => `/manifests/${id}/report_reception_pdf`,
  loadReportById: (id) => `/manifests/${id}/load_report`,
};

// ===== RECEPTION REPORTS (Actas de Recepción) =====
export const RECEPTION_REPORTS_ENDPOINTS = {
  base: '/reception_reports',
  // GET /reception_reports - Obtener todas las actas de recepción
  // GET /reception_reports/:id - Obtener una acta por ID
  // POST /reception_reports - Crear nueva acta de recepción
  // PUT /reception_reports/:id - Actualizar acta de recepción
  // DELETE /reception_reports/:id - Eliminar acta de recepción
  byId: (id) => `/reception_reports/${id}`, // GET /reception_reports/:id - Obtener acta por ID
  report: '/reception_reports/report', // GET /reception_reports/report - Reporte Excel de actas
  reportById: (id) => `/reception_reports/${id}/report`, // GET /reception_reports/:id/report - Reporte PDF de acta específica
};

// ===== MASTER GUIDES (Guías Master) =====
export const MASTER_GUIDES_ENDPOINTS = {
  base: '/master_guide',
  // POST /master_guide - Crear nueva Guía Master
};

// ===== HOUSE GUIDES (Guías House) =====
export const HOUSE_GUIDES_ENDPOINTS = {
  base: '/house_guide',
  // GET /house_guide?master_guide_id=:id - Obtener Guías House asociadas a un Master Guide
};

// ===== CONTROL ULDS =====
export const CONTROL_ULDS_ENDPOINTS = {
  base: '/control_ulds',
  // GET /control_ulds - Obtener todos los controles ULD
  // POST /control_ulds - Crear nuevo control ULD
  // PUT /control_ulds/:id - Actualizar control ULD
  // DELETE /control_ulds/:id - Eliminar control ULD
  byId: (id) => `/control_ulds/${id}`, // GET /control_ulds/:id - Obtener control ULD por ID
  printInventoryById: (id) => `/control_ulds/${id}/print_inventory`,
};

// ===== AVSEC INSPECTIONS - IMPORT (Inspecciones AVSEC Importación) =====
export const AVSEC_INSPECTIONS_IMPORT_ENDPOINTS = {
  base: '/avsec_inspections/import',
  // GET /avsec_inspections/import - Obtener todas las inspecciones AVSEC de importación
  // POST /avsec_inspections/import - Crear nueva inspección AVSEC de importación
  // PUT /avsec_inspections/import/:id - Actualizar inspección AVSEC de importación
  // DELETE /avsec_inspections/import/:id - Eliminar inspección AVSEC de importación
  byId: (id) => `/avsec_inspections/import/${id}`, // GET /avsec_inspections/import/:id - Obtener inspección AVSEC por ID
  generateById: (id) => `/avsec_inspections/import/${id}/generate`, // GET /avsec_inspections/import/:id/generate - Iniciar generación del reporte fotográfico
  downloadById: (id) => `/avsec_inspections/import/${id}/download`, // GET /avsec_inspections/import/:id/download - Descargar reporte fotográfico por inspección
};

// ===== AVSEC INSPECTIONS - EXPORT (Inspecciones AVSEC Exportación) =====
export const AVSEC_INSPECTIONS_EXPORT_ENDPOINTS = {
  base: '/avsec_inspections/export',
  // GET /avsec_inspections/export - Obtener todas las inspecciones AVSEC de exportación
  // POST /avsec_inspections/export - Crear nueva inspección AVSEC de exportación
  // PUT /avsec_inspections/export/:id - Actualizar inspección AVSEC de exportación
  // DELETE /avsec_inspections/export/:id - Eliminar inspección AVSEC de exportación
  byId: (id) => `/avsec_inspections/export/${id}`, // GET /avsec_inspections/export/:id - Obtener inspección AVSEC por ID
  addAuthority: (id) => `/avsec_inspections/export/${id}/add_authority`, // POST - Añadir autoridades a inspección
  deleteAuthority: (id) => `/avsec_inspections/export/${id}/delete_authority`, // POST - Eliminar autoridades de inspección
};

// ===== AVSEC RECEPTION (Archivos multimedia por recepción) =====
export const AVSEC_RECEPTION_ENDPOINTS = {
  base: '/avsec_reception',
  // POST /avsec_reception - Añadir archivo a una recepción (reception_id, file: {observation, size, data})
  byId: (id) => `/avsec_reception/${id}`, // GET/PUT/DELETE /avsec_reception/:id - Obtener/Actualizar/Eliminar archivo de recepción
};

// ===== AVSEC FILES (Archivos multimedia AVSEC) =====
export const AVSEC_FILES_ENDPOINTS = {
  base: '/avsec_files',
  // GET /avsec_files/:id - Obtener archivos AVSEC por inspección
  // POST /avsec_files - Añadir archivo AVSEC
  byId: (id) => `/avsec_files/${id}`, // GET /avsec_files/:id (por inspección) | PUT/DELETE /avsec_files/:id (por archivo)
};

// ===== CONTROL DISPATCH AVSEC =====
export const CONTROL_DISPATCH_AVSEC_ENDPOINTS = {
  base: '/control_dispatch_avsec',
  byId: (id) => `/control_dispatch_avsec/${id}`,
};

// ===== DECLARATION SECURITY =====
export const DECLARATION_SECURITY_ENDPOINTS = {
  base: '/declaration_security',
  byId: (id) => `/declaration_security/${id}`,
  printById: (id) => `/declaration_security/${id}/print`,
};

// ===== RECEPTIONS (Recepciones) =====
export const RECEPTIONS_ENDPOINTS = {
  base: '/receptions',
  import: '/receptions/import',
  // GET /receptions/import - Obtener todas las recepciones de importación
  // POST /receptions/import - Crear nueva recepción de importación
  // PUT /receptions/import/:id - Actualizar recepción de importación
  // DELETE /receptions/import/:id - Eliminar recepción de importación
  importById: (id) => `/receptions/import/${id}`, // GET /receptions/import/:id - Obtener recepción de importación por ID
  export: '/receptions/export',
  // GET /receptions/export - Obtener todas las recepciones de exportación
  // POST /receptions/export - Crear nueva recepción de exportación
  // PUT /receptions/export/:id - Actualizar recepción de exportación
  // DELETE /receptions/export/:id - Eliminar recepción de exportación
  exportById: (id) => `/receptions/export/${id}`, // GET /receptions/export/:id - Obtener recepción de exportación por ID
  exportAddFlight: (id) => `/receptions/export/${id}/add_flight`, // POST /receptions/export/:id/add_flight - Asignar vuelo a recepción de exportación
  masterGuide: '/receptions/master_guide',
  // POST /receptions/master_guide - Crear guía master para recepción
  importDesconsolidate: '/receptions/import/desconsolidate',
  // POST /receptions/import/desconsolidate - Desconsolidar carga (crear recepciones hijas por house guide)
};

// ===== WEIGHTS (Pesos) =====
export const WEIGHTS_ENDPOINTS = {
  base: '/weights',
  // GET /weights - Obtener todos los pesos
  // POST /weights - Crear nuevo peso
  // PUT /weights/:id - Actualizar peso
  // DELETE /weights/:id - Eliminar peso
};

// ===== PACKAGES (Paquetes) =====
export const PACKAGES_ENDPOINTS = {
  base: '/packages',
  reception: '/packages_reception',
  // GET /packages - Obtener todos los paquetes
  // POST /packages - Crear nuevo paquete
  // PUT /packages/:id - Actualizar paquete
  // DELETE /packages/:id - Eliminar paquete
  byId: (id) => `/packages/${id}`, // PUT/DELETE /packages/:id - Actualizar/Eliminar paquete
  receptionById: (id) => `/packages_reception/${id}`, // PUT/DELETE /packages_reception/:id - Actualizar/Eliminar paquete de recepción
};

// ===== PACKAGING (Tipos de Embalaje) =====
export const PACKAGING_ENDPOINTS = {
  base: '/packaging',
  byId: (id) => `/packaging/${id}`,
};

// ===== INVENTORY (Inventario) =====
export const INVENTORY_ENDPOINTS = {
  base: '/inventory',
  // GET /inventory - Obtener todos los inventarios
  // PUT /inventory/:id - Actualizar inventario
  // DELETE /inventory/:id - Eliminar inventario
  byId: (id) => `/inventory/${id}`, // GET /inventory/:id - Obtener inventario por ID
  moveToAnotherWarehouse: (id) => `/inventory/${id}/moveToAnotherWarehouse`, // POST /inventory/:id/moveToAnotherWarehouse - Mover inventario de almacén
};

// ===== WAREHOUSES (Almacenes) =====
export const WAREHOUSES_ENDPOINTS = {
  base: '/warehouses',
  // GET /warehouses - Obtener almacenes y su estado de precintos
};

// ===== SEALING (Precintaje) =====
export const SEALING_ENDPOINTS = {
  base: '/sealings',
  // GET /sealing - Histórico de precintos
  // POST /sealing - Asignar o retirar precinto
  byId: (id) => `/sealings/${id}`,
};

// ===== ORDER SERVICES (Órdenes de Servicio) =====
export const ORDER_SERVICES_ENDPOINTS = {
  base: '/order_services',
  // GET /order_services - Obtener todas las órdenes de servicio
  // POST /order_services - Crear nueva orden de servicio
  // PUT /order_services/:id - Actualizar orden de servicio
  // DELETE /order_services/:id - Eliminar orden de servicio
  byId: (id) => `/order_services/${id}`, // GET /order_services/:id - Obtener orden de servicio por ID
  reportById: (id) => `/order_services/${id}/report`, // GET /order_services/:id/report - Descargar PDF de orden de servicio
  setConceptQuantity: (id) => `/order_services/${id}/set_concept_quantity`, // POST /order_services/:id/set_concept_quantity - Setear cantidad de concepto
};

// ===== CONCEPTS (Conceptos de Servicio) =====
export const CONCEPTS_ENDPOINTS = {
  base: '/concepts',
  // POST /concepts - Crear nuevo concepto de servicio
  // PUT /concepts/:id - Actualizar concepto de servicio
  // DELETE /concepts/:id - Eliminar concepto de servicio
};

// ===== EXPORT INSPECTIONS (Inspecciones de Exportación) =====
export const EXPORT_INSPECTIONS_ENDPOINTS = {
  base: '/inspection_export',
  // GET /inspection_export - Obtener todas las inspecciones de exportación
  // POST /inspection_export - Crear nueva inspección de exportación
  // PUT /inspection_export/:id - Actualizar inspección de exportación
  // DELETE /inspection_export/:id - Eliminar inspección de exportación
  byId: (id) => `/inspection_export/${id}`, // GET /inspection_export/:id - Obtener inspección de exportación por ID
};

// ===== STACK ULD (Pilas ULD) =====
export const STACK_ULD_ENDPOINTS = {
  base: '/stack_uld',
  // GET /stack_uld - Obtener todas las pilas ULD
  // POST /stack_uld - Crear nueva pila ULD
  // PUT /stack_uld/:id - Actualizar pila ULD
  // DELETE /stack_uld/:id - Eliminar pila ULD
  byId: (id) => `/stack_uld/${id}`, // GET /stack_uld/:id - Obtener pila ULD por ID
};

// ===== DOCUMENTS (Documentos) =====
export const DOCUMENTS_ENDPOINTS = {
  base: '/documents',
  // GET /documents - Obtener todos los documentos
  // GET /documents?load_type=:id - Obtener documentos por tipo de carga
  // POST /documents - Crear nuevo documento
  // PUT /documents/:id - Actualizar documento
  // DELETE /documents/:id - Eliminar documento
};

// ===== INVENTORY ULD (Inventario ULD) =====
export const INVENTORY_ULD_ENDPOINTS = {
  base: '/inventory_uld',
  // GET /inventory_uld - Obtener todos los inventarios ULD
  // POST /inventory_uld - Crear nuevo inventario ULD
  // PUT /inventory_uld/:id - Actualizar inventario ULD
  // DELETE /inventory_uld/:id - Eliminar inventario ULD
  byId: (id) => `/inventory_uld/${id}`, // GET /inventory_uld/:id - Obtener inventario ULD por ID
};

// Exportar rutas consolidadas para uso en la aplicación
export const OPERATIONS_ROUTES = {
  MANIFESTS: MANIFESTS_ENDPOINTS.base,
  MANIFESTS_REPORT_RECEPTION_PDF_BY_ID: MANIFESTS_ENDPOINTS.reportReceptionPdfById,
  MANIFESTS_LOAD_REPORT_BY_ID: MANIFESTS_ENDPOINTS.loadReportById,
  MASTER_GUIDES: MASTER_GUIDES_ENDPOINTS.base,
  HOUSE_GUIDES: HOUSE_GUIDES_ENDPOINTS.base,
  RECEPTION_REPORTS: RECEPTION_REPORTS_ENDPOINTS.base,
  RECEPTION_REPORTS_BY_ID: RECEPTION_REPORTS_ENDPOINTS.byId,
  RECEPTION_REPORTS_REPORT: RECEPTION_REPORTS_ENDPOINTS.report,
  RECEPTION_REPORTS_REPORT_BY_ID: RECEPTION_REPORTS_ENDPOINTS.reportById,
  CONTROL_ULDS: CONTROL_ULDS_ENDPOINTS.base,
  CONTROL_ULDS_BY_ID: CONTROL_ULDS_ENDPOINTS.byId,
  CONTROL_ULDS_PRINT_INVENTORY: CONTROL_ULDS_ENDPOINTS.printInventoryById,
  AVSEC_INSPECTIONS_IMPORT: AVSEC_INSPECTIONS_IMPORT_ENDPOINTS.base,
  AVSEC_INSPECTIONS_IMPORT_BY_ID: AVSEC_INSPECTIONS_IMPORT_ENDPOINTS.byId,
  AVSEC_INSPECTIONS_IMPORT_GENERATE_BY_ID: AVSEC_INSPECTIONS_IMPORT_ENDPOINTS.generateById,
  AVSEC_INSPECTIONS_IMPORT_DOWNLOAD_BY_ID: AVSEC_INSPECTIONS_IMPORT_ENDPOINTS.downloadById,
  AVSEC_INSPECTIONS_IMPORT_REPORT_BY_ID: AVSEC_INSPECTIONS_IMPORT_ENDPOINTS.downloadById,
  AVSEC_INSPECTIONS_EXPORT: AVSEC_INSPECTIONS_EXPORT_ENDPOINTS.base,
  AVSEC_INSPECTIONS_EXPORT_BY_ID: AVSEC_INSPECTIONS_EXPORT_ENDPOINTS.byId,
  AVSEC_INSPECTIONS_EXPORT_ADD_AUTHORITY: AVSEC_INSPECTIONS_EXPORT_ENDPOINTS.addAuthority,
  AVSEC_INSPECTIONS_EXPORT_DELETE_AUTHORITY: AVSEC_INSPECTIONS_EXPORT_ENDPOINTS.deleteAuthority,
  AVSEC_RECEPTION: AVSEC_RECEPTION_ENDPOINTS.base,
  AVSEC_RECEPTION_BY_ID: AVSEC_RECEPTION_ENDPOINTS.byId,
  AVSEC_FILES: AVSEC_FILES_ENDPOINTS.base,
  AVSEC_FILES_BY_ID: AVSEC_FILES_ENDPOINTS.byId,
  CONTROL_DISPATCH_AVSEC: CONTROL_DISPATCH_AVSEC_ENDPOINTS.base,
  CONTROL_DISPATCH_AVSEC_BY_ID: CONTROL_DISPATCH_AVSEC_ENDPOINTS.byId,
  DECLARATION_SECURITY: DECLARATION_SECURITY_ENDPOINTS.base,
  DECLARATION_SECURITY_BY_ID: DECLARATION_SECURITY_ENDPOINTS.byId,
  DECLARATION_SECURITY_PRINT_BY_ID: DECLARATION_SECURITY_ENDPOINTS.printById,
  RECEPTIONS: RECEPTIONS_ENDPOINTS.base,
  RECEPTIONS_IMPORT: RECEPTIONS_ENDPOINTS.import,
  RECEPTIONS_IMPORT_BY_ID: RECEPTIONS_ENDPOINTS.importById,
  RECEPTIONS_EXPORT: RECEPTIONS_ENDPOINTS.export,
  RECEPTIONS_EXPORT_BY_ID: RECEPTIONS_ENDPOINTS.exportById,
  RECEPTIONS_EXPORT_ADD_FLIGHT: RECEPTIONS_ENDPOINTS.exportAddFlight,
  RECEPTIONS_MASTER_GUIDE: RECEPTIONS_ENDPOINTS.masterGuide,
  RECEPTIONS_IMPORT_DESCONSOLIDATE: RECEPTIONS_ENDPOINTS.importDesconsolidate,
  WEIGHTS: WEIGHTS_ENDPOINTS.base,
  PACKAGES: PACKAGES_ENDPOINTS.base,
  PACKAGES_BY_ID: PACKAGES_ENDPOINTS.byId,
  PACKAGES_RECEPTION: PACKAGES_ENDPOINTS.reception,
  PACKAGES_RECEPTION_BY_ID: PACKAGES_ENDPOINTS.receptionById,
  PACKAGING: PACKAGING_ENDPOINTS.base,
  PACKAGING_BY_ID: PACKAGING_ENDPOINTS.byId,
  INVENTORY: INVENTORY_ENDPOINTS.base,
  INVENTORY_BY_ID: INVENTORY_ENDPOINTS.byId,
  INVENTORY_MOVE_TO_ANOTHER_WAREHOUSE: INVENTORY_ENDPOINTS.moveToAnotherWarehouse,
  WAREHOUSES: WAREHOUSES_ENDPOINTS.base,
  SEALING: SEALING_ENDPOINTS.base,
  SEALING_BY_ID: SEALING_ENDPOINTS.byId,
  ORDER_SERVICES: ORDER_SERVICES_ENDPOINTS.base,
  ORDER_SERVICES_BY_ID: ORDER_SERVICES_ENDPOINTS.byId,
  ORDER_SERVICES_REPORT_BY_ID: ORDER_SERVICES_ENDPOINTS.reportById,
  ORDER_SERVICES_SET_CONCEPT_QUANTITY: ORDER_SERVICES_ENDPOINTS.setConceptQuantity,
  EXPORT_INSPECTIONS: EXPORT_INSPECTIONS_ENDPOINTS.base,
  EXPORT_INSPECTIONS_BY_ID: EXPORT_INSPECTIONS_ENDPOINTS.byId,
  STACK_ULD: STACK_ULD_ENDPOINTS.base,
  STACK_ULD_BY_ID: STACK_ULD_ENDPOINTS.byId,
  DOCUMENTS: DOCUMENTS_ENDPOINTS.base,
  INVENTORY_ULD: INVENTORY_ULD_ENDPOINTS.base,
  INVENTORY_ULD_BY_ID: INVENTORY_ULD_ENDPOINTS.byId,
};

export default OPERATIONS_ROUTES;