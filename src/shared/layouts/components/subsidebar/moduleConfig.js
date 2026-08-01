import {
  TbCurrencyDollar,
  TbHexagons,
  TbPackages,
  TbRoute,
  TbShield,
  TbUser,
} from "react-icons/tb";
import { canAccessPath } from "@/services/roleAccess";

export const MODULE_CONFIG = {
  admin: {
    Icon: TbShield,
    basePath: "/admin",
    section: "admin",
    title: "Admin",
  },
  "datos-op": {
    Icon: TbHexagons,
    basePath: "/datos-op",
    section: "datos-op",
    title: "Datos Op.",
  },
  operaciones: {
    Icon: TbPackages,
    basePath: "/operaciones",
    section: "operaciones",
    title: "Operaciones",
  },
  rutas: {
    Icon: TbRoute,
    basePath: "/rutas",
    section: "rutas",
    title: "Rutas",
  },
  conductores: {
    Icon: TbUser,
    basePath: "/conductores",
    section: "conductores",
    title: "Conductores",
  },
  finanzas: {
    Icon: TbCurrencyDollar,
    basePath: "/finanzas",
    section: "finanzas",
    title: "Finanzas",
  },
};

export function getModuleConfig(moduleKey) {
  return MODULE_CONFIG[moduleKey] ?? null;
}

export function getModuleNavigation(moduleKey, sections = new Set()) {
  const config = getModuleConfig(moduleKey);

  if (!config?.navigation) {
    return null;
  }

  if (config.visibility) {
    return config.navigation.filter((item) => canAccessPath(item.path, sections));
  }

  return config.navigation;
}

export function canAccessModule(moduleKey, sections = new Set()) {
  const config = getModuleConfig(moduleKey);

  if (!config) {
    return true;
  }

  if (config.section) {
    return sections.has(config.section);
  }

  return true;
}

export function getModuleEntryPath(moduleKey, sections = new Set()) {
  if (!canAccessModule(moduleKey, sections)) {
    return null;
  }

  const navigation = getModuleNavigation(moduleKey, sections);

  return navigation?.[0]?.path ?? getModuleConfig(moduleKey)?.basePath ?? null;
}
