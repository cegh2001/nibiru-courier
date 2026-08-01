/**
 * API Endpoints para Administración
 * Rutas para usuarios, roles, permisos y asignaciones.
 */

// ===== USERS =====
export const USERS_ENDPOINTS = {
  base: '/users',
  withRoles: '/users/withRoles',
};

// ===== ROLES =====
export const ROLES_ENDPOINTS = {
  base: '/roles',
  manageRolToUsers: '/roles/manageRolToUsers',
  managePermissionsToRole: '/roles/managePermissionsToRole',
};

// ===== PERMISSIONS =====
export const PERMISSIONS_ENDPOINTS = {
  base: '/permissions',
  managePermissionsToUsers: '/permissions/managePermissionsToUsers',
  getPermissionsByUser: '/permissions/getPermissionsByUser',
};

// ===== ROLE USERS =====
export const ROLE_USERS_ENDPOINTS = {
  base: '/role-users',
};

// ===== APP VERSIONS =====
export const APP_VERSIONS_ENDPOINTS = {
  base: '/app_versions',
};

// Rutas consolidadas
export const ADMIN_ROUTES = {
  USERS: USERS_ENDPOINTS.base,
  USERS_WITH_ROLES: USERS_ENDPOINTS.withRoles,
  ROLES: ROLES_ENDPOINTS.base,
  MANAGE_ROL_TO_USERS: ROLES_ENDPOINTS.manageRolToUsers,
  MANAGE_PERMISSIONS_TO_ROLE: ROLES_ENDPOINTS.managePermissionsToRole,
  PERMISSIONS: PERMISSIONS_ENDPOINTS.base,
  MANAGE_PERMISSIONS_TO_USERS: PERMISSIONS_ENDPOINTS.managePermissionsToUsers,
  GET_PERMISSIONS_BY_USER: PERMISSIONS_ENDPOINTS.getPermissionsByUser,
  ROLE_USERS: ROLE_USERS_ENDPOINTS.base,
  APP_VERSIONS: APP_VERSIONS_ENDPOINTS.base,
};

export default ADMIN_ROUTES;
