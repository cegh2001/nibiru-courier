/**
 * Configuración de acceso por rol a las secciones de navegación.
 *
 * Secciones:
 *   inicio              – Dashboard principal
 *   operaciones         – Operaciones (reparto, envíos, recepciones)
 *   rutas               – Gestión de Rutas
 *   conductores         – Gestión de Conductores
 *   finanzas            – Módulo Financiero (facturación, cobros)
 *   admin               – Panel de Administración
 *   datos-op            – Datos Operativos (configuración)
 */

/** Roles con acceso total */
const FULL_ACCESS_ROLES = ['super-admin', 'admin'];

/** Secciones que componen el acceso total */
const ALL_SECTIONS = [
  'inicio', 'operaciones', 'rutas', 'conductores',
  'finanzas', 'admin', 'datos-op',
];

function normalizeRoleName(role) {
  return String(role ?? '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function hasFullAccessRole(userRoles = []) {
  const roleNames = userRoles.map(r => normalizeRoleName(r.name ?? r));

  return roleNames.some(name => FULL_ACCESS_ROLES.includes(name));
}

/** Mapeo de roles limitados a las secciones que pueden ver */
const ROLE_SECTIONS = {
  'despachador':           ['inicio', 'operaciones'],
  'conductor':             ['inicio', 'operaciones', 'rutas'],
  'supervisor-rutas':      ['inicio', 'operaciones', 'rutas', 'conductores'],
  'gerente-operaciones':   ['inicio', 'operaciones', 'rutas', 'conductores', 'datos-op'],
  'facturacion':           ['inicio', 'finanzas'],
  'cliente':               ['inicio'],
};

/**
 * Dado un array de roles del usuario, devuelve el Set de secciones permitidas.
 * Si tiene al menos un rol de acceso total, se devuelven todas las secciones.
 */
export function getAllowedSections(userRoles = []) {
  const roleNames = userRoles.map(r => normalizeRoleName(r.name ?? r));

  if (hasFullAccessRole(userRoles)) {
    return new Set(ALL_SECTIONS);
  }

  const sections = new Set();
  for (const name of roleNames) {
    const allowed = ROLE_SECTIONS[name];
    if (allowed) {
      allowed.forEach(s => sections.add(s));
    }
  }

  if (sections.size === 0) {
    sections.add('inicio');
  }

  return sections;
}

export function canAccessPath(pathname = '', sections = new Set()) {
  if (!pathname) {
    return false;
  }

  if (pathname === '/inicio' || pathname.startsWith('/inicio/')) {
    return sections.has('inicio');
  }

  if (pathname.startsWith('/datos-op')) {
    return sections.has('datos-op');
  }

  if (pathname.startsWith('/operaciones')) {
    return sections.has('operaciones');
  }

  if (pathname.startsWith('/rutas')) {
    return sections.has('rutas');
  }

  if (pathname.startsWith('/conductores')) {
    return sections.has('conductores');
  }

  if (pathname.startsWith('/finanzas')) {
    return sections.has('finanzas');
  }

  if (pathname.startsWith('/admin')) {
    return sections.has('admin');
  }

  return true;
}
