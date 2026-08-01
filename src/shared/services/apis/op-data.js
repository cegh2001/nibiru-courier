/**
 * API Endpoints para Operational Data (Datos Operacionales)
 * Este archivo contiene todas las rutas relacionadas con datos operacionales
 * como aerolíneas, aviones, ciudades, países, vuelos, aeropuertos y ULD.
 */

// ===== AIRLINES (Aerolíneas) =====
export const AIRLINES_ENDPOINTS = {
  base: '/airlines',
  // GET /airlines - Obtener todas las aerolíneas
  // POST /airlines - Crear nueva aerolínea
  // PUT /airlines/:id - Actualizar aerolínea
  // DELETE /airlines/:id - Eliminar aerolínea
};

// ===== AIRPLANES (Aviones) =====
export const AIRPLANES_ENDPOINTS = {
  base: '/airplanes',
  // GET /airplanes - Obtener todos los aviones
  // POST /airplanes - Crear nuevo avión
  // PUT /airplanes/:id - Actualizar avión
  // DELETE /airplanes/:id - Eliminar avión
};

// ===== CITIES (Ciudades) =====
export const CITIES_ENDPOINTS = {
  base: '/cities',
  // GET /cities - Obtener todas las ciudades
  // POST /cities - Crear nueva ciudad
  // PUT /cities/:id - Actualizar ciudad
  // DELETE /cities/:id - Eliminar ciudad
};

// ===== COUNTRIES (Países) =====
export const COUNTRIES_ENDPOINTS = {
  base: '/countries',
  // GET /countries - Obtener todos los países
  // POST /countries - Crear nuevo país
  // PUT /countries/:id - Actualizar país
  // DELETE /countries/:id - Eliminar país
};

// ===== FLIGHTS (Vuelos) =====
export const FLIGHTS_ENDPOINTS = {
  base: '/flights',
  sync: '/flights/sync',
  syncStore: '/flights/sync-store',
  // GET /flights - Obtener todos los vuelos
  // GET /flights?airline=:id&isArrival=0 - Vuelos filtrados por aerolínea
  // POST /flights - Crear nuevo vuelo
  // POST /flights/sync - Consultar vuelo desde Flightradar24
  // POST /flights/sync-store - Registrar vuelo sincronizado en el sistema
  // PUT /flights/:id - Actualizar vuelo
  // DELETE /flights/:id - Eliminar vuelo
};

// ===== AIRPORTS (Aeropuertos) =====
export const AIRPORTS_ENDPOINTS = {
  base: '/airports',
  // GET /airports - Obtener todos los aeropuertos
  // POST /airports - Crear nuevo aeropuerto
  // PUT /airports/:id - Actualizar aeropuerto
  // DELETE /airports/:id - Eliminar aeropuerto
};

// ===== AIRPORT TYPES (Tipos de Aeropuertos) =====
export const AIRPORT_TYPES_ENDPOINTS = {
  base: "/airports_types",
  // GET /types_airports - Obtener todos los tipos de aeropuertos
  // POST /types_airports - Crear nuevo tipo de aeropuerto
  // PUT /types_airports/:id - Actualizar tipo de aeropuerto
  // DELETE /types_airports/:id - Eliminar tipo de aeropuerto
};

// ===== ULD (Unit Load Device) =====
export const ULD_ENDPOINTS = {
  base: '/ulds',
  types: '/uld_types',
  // GET /ulds - Obtener todos los ULD
  // GET /ulds?airline=:id - ULD filtrados por aerolínea
  // GET /uld_types - Obtener tipos de ULD
  // POST /ulds - Crear nuevo ULD
  // PUT /ulds/:id - Actualizar ULD
  // DELETE /ulds/:id - Eliminar ULD
};

// ===== LOAD TYPES (Tipos de Carga) =====
export const LOAD_TYPES_ENDPOINTS = {
  base: '/load_types',
  // GET /load_types - Obtener todos los tipos de carga
  // POST /load_types - Crear nuevo tipo de carga
  // PUT /load_types/:id - Actualizar tipo de carga
  // DELETE /load_types/:id - Eliminar tipo de carga
};

// ===== TRUCK COMPANIES (Compañías de Transporte) =====
export const TRUCK_COMPANIES_ENDPOINTS = {
  base: '/truck_companies',
  // GET /truck_companies - Obtener todas las compañías de transporte
  // POST /truck_companies - Crear nueva compañía de transporte
  // PUT /truck_companies/:id - Actualizar compañía de transporte
  // DELETE /truck_companies/:id - Eliminar compañía de transporte
};

// ===== TRUCKS (Camiones) =====
export const TRUCKS_ENDPOINTS = {
  base: '/trucks',
  // GET /trucks - Obtener todos los camiones
  // POST /trucks - Crear nuevo camión
  // PUT /trucks/:id - Actualizar camión
  // DELETE /trucks/:id - Eliminar camión
};

// ===== TRUCK DRIVERS (Conductores) =====
export const TRUCK_DRIVERS_ENDPOINTS = {
  base: '/truck_drivers',
  // GET /truck_drivers - Obtener todos los conductores
  // POST /truck_drivers - Crear nuevo conductor
  // PUT /truck_drivers/:id - Actualizar conductor
  // DELETE /truck_drivers/:id - Eliminar conductor
};

// ===== AUTHORITIES (Autoridades) =====
export const AUTHORITIES_ENDPOINTS = {
  base: '/authorities',
  // GET /authorities - Obtener todas las autoridades
  // POST /authorities - Crear nueva autoridad
  // PUT /authorities/:id - Actualizar autoridad
  // DELETE /authorities/:id - Eliminar autoridad
};

// ===== AUTHORITIES TYPES (Tipos de Autoridades) =====
export const AUTHORITIES_TYPES_ENDPOINTS = {
  base: '/authorities_types',
  // GET /authorities_types - Obtener todos los tipos de autoridades
  // POST /authorities_types - Crear nuevo tipo de autoridad
  // PUT /authorities_types/:id - Actualizar tipo de autoridad
  // DELETE /authorities_types/:id - Eliminar tipo de autoridad
};

// ===== UNITS (Unidades) =====
export const UNITS_ENDPOINTS = {
  base: '/units',
  // GET /units - Obtener todas las unidades
};

// ===== MATERIALS (Materiales de Embalaje) =====
export const MATERIALS_ENDPOINTS = {
  base: '/packaging',
  // GET /packaging - Obtener todos los materiales de embalaje
  // POST /packaging - Crear nuevo material de embalaje
  // PUT /packaging/:id - Actualizar material de embalaje
  // DELETE /packaging/:id - Eliminar material de embalaje
};

// Exportar todas las rutas como un objeto consolidado
export const OP_DATA_ROUTES = {
  AIRLINES: AIRLINES_ENDPOINTS.base,
  AIRPLANES: AIRPLANES_ENDPOINTS.base,
  CITIES: CITIES_ENDPOINTS.base,
  COUNTRIES: COUNTRIES_ENDPOINTS.base,
  FLIGHTS: FLIGHTS_ENDPOINTS.base,
  FLIGHTS_SYNC: FLIGHTS_ENDPOINTS.sync,
  FLIGHTS_SYNC_STORE: FLIGHTS_ENDPOINTS.syncStore,
  AIRPORTS: AIRPORTS_ENDPOINTS.base,
  AIRPORT_TYPES: AIRPORT_TYPES_ENDPOINTS.base,
  ULDS: ULD_ENDPOINTS.base,
  ULD_TYPES: ULD_ENDPOINTS.types,
  LOAD_TYPES: LOAD_TYPES_ENDPOINTS.base,
  TRUCK_COMPANIES: TRUCK_COMPANIES_ENDPOINTS.base,
  TRUCKS: TRUCKS_ENDPOINTS.base,
  TRUCK_DRIVERS: TRUCK_DRIVERS_ENDPOINTS.base,
  AUTHORITIES: AUTHORITIES_ENDPOINTS.base,
  AUTHORITIES_TYPES: AUTHORITIES_TYPES_ENDPOINTS.base,
  UNITS: UNITS_ENDPOINTS.base,
  MATERIALS: MATERIALS_ENDPOINTS.base,
};

// Exportar como default para facilitar importación
export default OP_DATA_ROUTES;
