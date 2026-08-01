import {
  TbSmartHome, TbTruck, TbRoute, TbUser, TbCurrencyDollar,
  TbShield, TbSettings, TbHelp, TbHexagons, TbPackages,
  TbMapPin, TbClipboardList, TbFileInvoice,
} from "react-icons/tb";

export const sidebarItems2 = [];

export const sidebarItems = [
  { text: "Inicio", icon: <TbSmartHome className="w-5 h-5" />, alert: false, path: "/inicio" },
  { text: "Operaciones", icon: <TbPackages className="w-5 h-5 text-orange-500" />, alert: false, path: "/operaciones" },
  { text: "Rutas", icon: <TbRoute className="w-5 h-5 text-blue-500" />, alert: false, path: "/rutas" },
  { text: "Conductores", icon: <TbUser className="w-5 h-5 text-green-500" />, alert: false, path: "/conductores" },
  { text: "Datos Operativos", icon: <TbHexagons className="w-5 h-5 text-black/70" />, alert: false, path: "/datos-op" },
  { text: "Finanzas", icon: <TbCurrencyDollar className="w-5 h-5 text-green-500" />, alert: false, path: "/finanzas" },
  { text: "Admin", icon: <TbShield className="w-5 h-5 text-red-500" />, alert: false, path: "/admin/roles" },
];

export const validRoutes = new Set([
  "/inicio",
  "/operaciones",
  "/operaciones/envios",
  "/operaciones/recepciones",
  "/operaciones/repartos",
  "/rutas",
  "/rutas/asignaciones",
  "/conductores",
  "/conductores/registro",
  "/datos-op",
  "/datos-op/vehiculos",
  "/datos-op/destinos",
  "/datos-op/zonas",
  "/finanzas",
  "/finanzas/facturas",
  "/finanzas/cobros",
  "/finanzas/reportes",
  "/admin/roles",
  "/admin/usuarios",
  "/admin/permisos",
  "/perfil",
  "/configuracion",
  "/ayuda",
]);

export const aestheticSegments = ["detalles", "reporte", "operaciones", "documentos", "envios", "recepciones", "repartos", "datos-op", "finanzas", "admin"];

export const findValidParentRoute = (currentPath) => {
  const segments = currentPath.split("/").filter(Boolean);

  for (let i = segments.length; i > 0; i--) {
    const testPath = "/" + segments.slice(0, i).join("/");

    if (validRoutes.has(testPath)) {
      return testPath;
    }

    const lastSegment = segments[i - 1];
    if (aestheticSegments.includes(lastSegment) || /^\d+$/.test(lastSegment)) {
      const pathWithoutLast = "/" + segments.slice(0, i - 1).join("/");
      if (validRoutes.has(pathWithoutLast)) {
        return pathWithoutLast;
      }
    }
  }

  return "/inicio";
};

export const iconMap = {
  TbSmartHome, TbTruck, TbRoute, TbUser, TbCurrencyDollar,
  TbShield, TbSettings, TbHelp, TbHexagons, TbPackages,
  TbMapPin, TbClipboardList, TbFileInvoice,
};

export const routeConfig = {
  '/inicio': { iconName: 'TbSmartHome', label: 'Inicio' },
  '/operaciones': { iconName: 'TbPackages', label: 'Operaciones' },
  '/operaciones/envios': { iconName: 'TbTruck', label: 'Envíos' },
  '/operaciones/recepciones': { iconName: 'TbClipboardList', label: 'Recepciones' },
  '/operaciones/repartos': { iconName: 'TbMapPin', label: 'Repartos' },
  '/rutas': { iconName: 'TbRoute', label: 'Rutas' },
  '/rutas/asignaciones': { iconName: 'TbRoute', label: 'Asignaciones' },
  '/conductores': { iconName: 'TbUser', label: 'Conductores' },
  '/conductores/registro': { iconName: 'TbUser', label: 'Registro' },
  '/datos-op': { iconName: 'TbHexagons', label: 'Datos Operativos' },
  '/datos-op/vehiculos': { iconName: 'TbTruck', label: 'Vehículos' },
  '/datos-op/destinos': { iconName: 'TbMapPin', label: 'Destinos' },
  '/datos-op/zonas': { iconName: 'TbMapPin', label: 'Zonas' },
  '/finanzas': { iconName: 'TbCurrencyDollar', label: 'Finanzas' },
  '/finanzas/facturas': { iconName: 'TbFileInvoice', label: 'Facturas' },
  '/finanzas/cobros': { iconName: 'TbCurrencyDollar', label: 'Cobros' },
  '/finanzas/reportes': { iconName: 'TbClipboardList', label: 'Reportes' },
  '/admin/usuarios': { iconName: 'TbUser', label: 'Usuarios' },
  '/admin/roles': { iconName: 'TbShield', label: 'Roles' },
  '/admin/permisos': { iconName: 'TbSettings', label: 'Permisos' },
  '/perfil': { iconName: 'TbUser', label: 'Perfil' },
  '/configuracion': { iconName: 'TbSettings', label: 'Configuración' },
  '/ayuda': { iconName: 'TbHelp', label: 'Ayuda' },
};

export const moduleSubRoutes = {
  '/operaciones/envios': {
    children: ['detalles']
  },
  '/operaciones/recepciones': {
    children: ['detalles']
  },
  '/rutas/asignaciones': {
    children: ['detalles']
  },
  '/finanzas/facturas': {
    children: ['detalles']
  },
};

export const getSubModules = (modulePath) => {
  return moduleSubRoutes[modulePath]?.children || [];
};

export const formatSubModuleName = (subModule) => {
  const customNames = {
    'detalles': 'Detalles',
    'crear': 'Crear',
    'editar': 'Editar',
    'documentos': 'Documentos',
    'reporte': 'Reporte',
    'valores': 'Valores',
  };

  return customNames[subModule] || subModule
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
