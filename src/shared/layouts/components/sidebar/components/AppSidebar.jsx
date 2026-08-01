"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { PiSignOutBold } from "react-icons/pi";
import { broadcastLogout } from "@/services/channels/authChannel";
import { sidebarItems2 } from "@/services/navigationConfig";
import { sidebarItems } from "@/services/navigationConfig";
import { useRoleNavigation } from "@/hooks/useRoleNavigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Paleta de colores por item (igual al sidebar viejo)
const ITEM_COLORS = [
  "#0EA5E9", // sky-500 — Inicio
  "#374151", // gray-700 — Datos Operativos
  "#F97316", // orange-500 — Operaciones
  "#3B82F6", // blue-500 — Rutas
  "#10B981", // emerald-500 — Conductores
  "#8B5CF6", // violet-500 — Finanzas
  "#EC4899", // pink-500
  "#EF4444", // red-500 — Admin
];

// ==========================================
// Lógica de active state
// ==========================================
const isItemActive = (itemPath, currentPath) => {
  if (!itemPath) return false;
  if (itemPath === currentPath) return true;
  if (currentPath.startsWith(itemPath + "/")) return true;
  return false;
};

const isSubItemActive = (subItems, currentPath) => {
  if (!subItems || subItems.length === 0) return false;
  return subItems.some((subItem) => {
    if (subItem.path === currentPath) return true;
    if (currentPath.startsWith(subItem.path + "/")) return true;
    return false;
  });
};

// ==========================================
// Componente principal del AppSidebar
// ==========================================
export function AppSidebar() {
  const pathname = usePathname();
  const { setOpenMobile, isMobile, toggleSidebar } = useSidebar();
  const { filteredSidebarItems } = useRoleNavigation();

  const handleNavClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    } else {
      toggleSidebar();
    }
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-r-0 bg-linear-to-bl from-sky-50 to-white z-50">
      {/* Header branding */}
      <SidebarHeader className="pl-16 pr-5 pt-6 pb-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-medium text-navy-light tracking-wide">
            Nibiru
          </span>
          <span className="text-lg font-bold text-navy">
            Courier
          </span>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-4 bg-sky-100" />

      {/* Navegación principal */}
      <SidebarContent className="overflow-hidden! px-0 py-0">
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 px-3 py-2">
            <p className="px-2 pt-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navegación
            </p>
            <nav className="flex flex-col gap-1">
              {filteredSidebarItems.map((item, i) => {
                if (item.hasSubItems) {
                  const active = isSubItemActive(item.subItems, pathname);
                  return (
                    <CollapsibleNavItem
                      key={i}
                      item={item}
                      colorIndex={i}
                      active={active}
                      pathname={pathname}
                      onNavClick={handleNavClick}
                    />
                  );
                }

                const active = isItemActive(item.path, pathname);
                return (
                  <NavItem
                    key={i}
                    item={item}
                    colorIndex={i}
                    active={active}
                    onNavClick={handleNavClick}
                  />
                );
              })}
            </nav>

            <SidebarSeparator className="mx-2 my-3 bg-sky-100" />

            <p className="px-2 pt-1 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Extras
            </p>
            <nav className="flex flex-col gap-1">
              {sidebarItems2.map((item, i) => {
                const active = isItemActive(item.path, pathname);
                return (
                  <NavItem
                    key={`g2-${i}`}
                    item={item}
                    colorIndex={sidebarItems.length + i}
                    active={active}
                    onNavClick={handleNavClick}
                  />
                );
              })}
            </nav>
          </div>
        </ScrollArea>
      </SidebarContent>

      {/* Footer — Salir */}
      <SidebarFooter className="px-3 pb-4">
        <SidebarSeparator className="mx-2 mb-2 bg-sky-100" />
        <button
          onClick={() => broadcastLogout("manual")}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-red-400 hover:text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-red-50 border border-red-100">
            <PiSignOutBold className="w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Salir</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

// ==========================================
// NavItem — Item de navegación individual
// ==========================================
function NavItem({ item, colorIndex, active, onNavClick }) {
  const color = ITEM_COLORS[colorIndex % ITEM_COLORS.length];

  const iconStyles = useMemo(() => ({
    background: active
      ? `linear-gradient(135deg, ${color}20, ${color}30)`
      : `linear-gradient(135deg, ${color}08, ${color}12)`,
    border: `1px solid ${active ? color + "40" : color + "18"}`,
    color: color,
  }), [color, active]);

  return (
    <Link
      href={item.path}
      prefetch={false}
      onClick={onNavClick}
      className={`group/navitem flex items-center gap-3 px-2 py-2 rounded-xl transition-all duration-300 ${
        active
          ? "bg-linear-to-r from-sky-100/80 to-sky-50/50 border-l-[3px] border-sky-400 shadow-sm"
          : "hover:bg-gray-50 hover:shadow-sm border-l-[3px] border-transparent"
      }`}
    >
      {/* Icono con color */}
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all duration-200 ${
          active
            ? "shadow-md scale-105"
            : "shadow-sm group-hover/navitem:shadow-md group-hover/navitem:scale-105"
        }`}
        style={iconStyles}
      >
        {item.icon}
      </div>
      {/* Texto */}
      <span className={`text-sm font-medium transition-colors duration-200 truncate ${
        active ? "text-sky-700" : "text-slate-700"
      }`}>
        {item.text}
      </span>
      {/* Alert badge */}
      {item.alert && (
        <span className="relative flex w-2.5 h-2.5 ml-auto shrink-0">
          <span className="absolute inline-flex w-full h-full bg-sky-400 rounded-full opacity-75 animate-ping" />
          <span className="relative inline-flex w-2.5 h-2.5 bg-sky-500 rounded-full" />
        </span>
      )}
    </Link>
  );
}

// ==========================================
// CollapsibleNavItem — Item con subitems (Operaciones, Intermediarios)
// ==========================================
function CollapsibleNavItem({ item, colorIndex, active, pathname, onNavClick }) {
  const color = ITEM_COLORS[colorIndex % ITEM_COLORS.length];

  const iconStyles = useMemo(() => ({
    background: active
      ? `linear-gradient(135deg, ${color}20, ${color}30)`
      : `linear-gradient(135deg, ${color}08, ${color}12)`,
    border: `1px solid ${active ? color + "40" : color + "18"}`,
    color: color,
  }), [color, active]);

  return (
    <Collapsible defaultOpen={active} className="group/collapsible">
      <CollapsibleTrigger asChild>
        <button
          className={`group/navitem flex items-center gap-3 w-full px-2 py-2 rounded-xl transition-all duration-300 cursor-pointer ${
            active
              ? "bg-linear-to-r from-sky-100/80 to-sky-50/50 border-l-[3px] border-sky-400 shadow-sm"
              : "hover:bg-gray-50 hover:shadow-sm border-l-[3px] border-transparent"
          }`}
        >
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-all duration-200 ${
              active
                ? "shadow-md scale-105"
                : "shadow-sm group-hover/navitem:shadow-md group-hover/navitem:scale-105"
            }`}
            style={iconStyles}
          >
            {item.icon}
          </div>
          <span className={`text-sm font-medium transition-colors duration-200 flex-1 text-left truncate ${
            active ? "text-sky-700" : "text-slate-700"
          }`}>
            {item.text}
          </span>
          {item.alert && (
            <span className="relative flex w-2.5 h-2.5 shrink-0">
              <span className="absolute inline-flex w-full h-full bg-sky-400 rounded-full opacity-75 animate-ping" />
              <span className="relative inline-flex w-2.5 h-2.5 bg-sky-500 rounded-full" />
            </span>
          )}
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
        </button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-0.5 ml-5.5 pl-3 mt-1.5 mb-1 border-l-2 border-sky-200/70">
          {item.subItems.map((subItem, idx) => {
            const subActive = isItemActive(subItem.path, pathname);
            return (
              <Link
                key={idx}
                href={subItem.path}
                prefetch={false}
                onClick={onNavClick}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-200 ${
                  subActive
                    ? "text-sky-700 bg-sky-50/80 font-medium"
                    : "text-slate-600 hover:text-sky-600 hover:bg-sky-50/50 hover:translate-x-0.5"
                }`}
              >
                <span className="w-4 h-4 flex items-center justify-center shrink-0">
                  {subItem.icon}
                </span>
                <span>{subItem.text}</span>
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
