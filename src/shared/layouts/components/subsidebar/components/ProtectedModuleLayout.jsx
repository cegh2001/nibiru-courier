"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { AccessDenied } from "@/shared/components/common/AccessDenied";
import { useRoleNavigation } from "@/hooks/useRoleNavigation";
import { SubSidebar } from "@/layouts/components/subsidebar/components/SubSidebar";
import {
  canAccessModule,
  getModuleConfig,
  getModuleNavigation,
} from "@/layouts/components/subsidebar/moduleConfig";

export function ProtectedModuleLayout({ children, moduleKey }) {
  const pathname = usePathname();
  const { sections } = useRoleNavigation();
  const config = getModuleConfig(moduleKey);

  const navigation = useMemo(() => {
    return getModuleNavigation(moduleKey, sections);
  }, [moduleKey, sections]);

  const hasAccess = useMemo(() => {
    return canAccessModule(moduleKey, sections, pathname);
  }, [moduleKey, pathname, sections]);

  if (!hasAccess) {
    return <AccessDenied />;
  }

  if (!navigation) {
    return children;
  }

  const TitleIcon = config.Icon;

  return (
    <SubSidebar
      moduleKey={moduleKey}
      navigation={navigation}
      title={config.title}
      iconTitle={
        <span className="text-2xl text-navy">
          <TitleIcon className="w-6 h-6" />
        </span>
      }
    >
      {children}
    </SubSidebar>
  );
}