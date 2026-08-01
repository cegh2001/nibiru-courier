"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSubSidebar } from "@/layouts/components/subsidebar/stores/subSidebarStore";
import { SubModuleNavigator } from "./SubModuleNavigator";
import { TbChevronRight, TbMenu2 } from "react-icons/tb";
import { useSession } from "next-auth/react";
import { broadcastLogout } from "@/services/channels/authChannel";
import { PiSignOutBold } from "react-icons/pi";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function buildNavigationSections(navigation = []) {
  const hasGroups = navigation.some((item) => item.group);

  if (!hasGroups) {
    return [{ key: "default", label: null, items: navigation }];
  }

  const sections = [];
  const sectionMap = new Map();

  navigation.forEach((item) => {
    const label = item.group || "Otros";

    if (!sectionMap.has(label)) {
      const section = { key: label.toLowerCase(), label, items: [] };
      sectionMap.set(label, section);
      sections.push(section);
    }

    sectionMap.get(label).items.push(item);
  });

  return sections;
}

export const SubSidebar = ({
  children = null,
  moduleKey = "default",
  navigation = [],
  title = null,
  iconTitle = null,
}) => {
  const pathname = usePathname();
  const setSubSidebarActive = useSubSidebar((state) => state.setSubSidebarActive);
  const sectionOpenState = useSubSidebar((state) => state.sectionOpenState);
  const setSectionOpenState = useSubSidebar((state) => state.setSectionOpenState);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;

  const onLogout = (reason = "manual") => {
    broadcastLogout(reason);
    setMobileMenuOpen(false);
  };

  // Cerrar el menú móvil cuando cambia la ruta
  useEffect(() => {
    queueMicrotask(() => setMobileMenuOpen(false));
  }, [pathname]);

  // Notificar que el SubSidebar está activo
  useEffect(() => {
    setSubSidebarActive(true);
    return () => setSubSidebarActive(false);
  }, [setSubSidebarActive]);

  // Extraer el nombre del módulo de la primera ruta
  const moduleName =
    navigation.length > 0 ? navigation[0].path.split("/")[1] : "";

  // Capitalizar la primera letra
  const formattedModuleName = moduleName
    ? moduleName.charAt(0).toUpperCase() + moduleName.slice(1)
    : "";

  // Si no se envía título, se utiliza el formattedModuleName
  const displayTitle = title || formattedModuleName;

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const handleItemClick = () => {
    setMobileMenuOpen(false);
  };

  const navigationSections = React.useMemo(
    () => buildNavigationSections(navigation),
    [navigation]
  );

  const getSectionStateKey = React.useCallback(
    (section) => `${moduleKey}:${section.key}`,
    [moduleKey]
  );

  const isSectionOpen = React.useCallback(
    (section) => {
      if (!section.label) {
        return true;
      }

      const storedValue = sectionOpenState[getSectionStateKey(section)];

      if (typeof storedValue === "boolean") {
        return storedValue;
      }

      return section.key === "principal";
    },
    [getSectionStateKey, sectionOpenState]
  );

  const handleSectionOpenChange = React.useCallback(
    (section, isOpen) => {
      setSectionOpenState(getSectionStateKey(section), isOpen);
    },
    [getSectionStateKey, setSectionOpenState]
  );

  // Obtener el item activo para mostrar en el botón móvil
  const activeItem = navigation.find(item => isActive(item.path));

  // Contenido de navegación compartido entre desktop y mobile
  const renderNavigationContent = (isMobile = false) => (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-4">
        {navigationSections.map((section) => (
          <li key={section.key}>
            {section.label ? (
              <Collapsible
                open={isSectionOpen(section)}
                onOpenChange={(open) => handleSectionOpenChange(section, open)}
                className="space-y-1"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 hover:bg-navy/10 hover:text-navy transition-colors duration-200">
                  <span>{section.label}</span>
                  <TbChevronRight
                    className={classNames(
                      "size-4 shrink-0 transition-transform duration-200",
                      isSectionOpen(section) ? "rotate-90 text-navy" : "text-gray-400"
                    )}
                  />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <ul role="list" className={isMobile ? "space-y-1" : "-mx-2 space-y-1"}>
                    {section.items.map((item) => (
                      <li key={item.path}>
                        <Link
                          href={item.path}
                          prefetch={false}
                          onClick={handleItemClick}
                          className={classNames(
                            isActive(item.path)
                              ? "border-l-4 border-navy text-navy bg-navy/10 shadow-sm"
                              : "text-gray-700 hover:bg-navy/10 hover:text-navy",
                            "group flex gap-x-3 p-2 text-sm/6 font-semibold cursor-pointer rounded-sm duration-300"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(
                              isActive(item.path)
                                ? "text-navy"
                                : "text-gray-400 group-hover:text-navy",
                              "size-6 shrink-0 mx-1"
                            )}
                          />
                          {item.title}
                        </Link>
                        {isActive(item.path) && (
                          <SubModuleNavigator
                            currentModulePath={item.path}
                            variant="nested"
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <ul role="list" className={isMobile ? "space-y-1" : "-mx-2 space-y-1"}>
                {section.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      href={item.path}
                      prefetch={false}
                      onClick={handleItemClick}
                      className={classNames(
                        isActive(item.path)
                          ? "border-l-4 border-navy text-navy bg-navy/10 shadow-sm"
                          : "text-gray-700 hover:bg-navy/10 hover:text-navy",
                        "group flex gap-x-3 p-2 text-sm/6 font-semibold cursor-pointer rounded-sm duration-300"
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className={classNames(
                          isActive(item.path)
                            ? "text-navy"
                            : "text-gray-400 group-hover:text-navy",
                          "size-6 shrink-0 mx-1"
                        )}
                      />
                      {item.title}
                    </Link>
                    {isActive(item.path) && (
                      <SubModuleNavigator
                        currentModulePath={item.path}
                        variant="nested"
                      />
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );

  return (
    <>
      <div className="flex flex-1 w-full relative min-w-0">
        {/* Nav inferior flotante para mobile */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-4 pointer-events-none flex justify-center">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="pointer-events-auto flex items-center justify-center gap-3 w-full max-w-sm px-6 py-3.5 bg-navy text-white rounded-2xl shadow-lg active:scale-95 active:bg-navy-light transition-all duration-200"
            aria-label="Abrir menú de navegación"
          >
            <TbMenu2 className="size-6" />
            <span className="text-base font-semibold tracking-wide border-l border-white/20 pl-3">
              {activeItem?.title || displayTitle}
            </span>
          </button>
        </div>

        {/* Sheet para mobile */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0 bg-white/95 backdrop-blur-sm flex flex-col">
            <SheetHeader className="p-4 border-b border-gray-200 shrink-0">
              <SheetTitle className="flex items-center gap-2 text-xl text-navy font-bold">
                {displayTitle} {iconTitle}
              </SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto p-4">
              {renderNavigationContent(true)}
            </div>
            {/* Nav inferior del Perfil de Usuario solo en Mobile */}
            {user && (
              <div className="p-4 border-t border-gray-200 shrink-0 bg-slate-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-navy text-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-sm font-bold text-navy truncate">{user.name}</span>
                    <span className="text-xs text-gray-500 font-medium truncate">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => onLogout()}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-gray-200 text-crimson-light font-bold hover:bg-red-50 hover:border-red-100 transition-colors shadow-sm active:scale-95 duration-200"
                >
                  <PiSignOutBold className="size-5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            )}
          </SheetContent>
        </Sheet>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:flex lg:w-64 lg:flex-col lg:shrink-0 lg:border-r lg:border-gray-200/60">
          <div className="flex grow flex-col pt-2 pb-4 gap-y-2 overflow-y-auto px-6">
            <div className="flex h-12 shrink-0 items-center border-b border-gray-200">
              <p className="flex items-center gap-2 text-2xl text-navy font-bold duration-300">
                {displayTitle} {iconTitle}
              </p>
            </div>
            {renderNavigationContent()}
          </div>
        </div>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </>
  );
};
