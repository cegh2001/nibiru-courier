import React from "react";
import { useGuard } from "@/core/hooks/useGuard";

export const AuthGuard = ({
  permissions = [],
  roles = [],
  altComponent = null,
  children,
}) => {
  const hasAccess = useGuard(permissions, roles);

  if (!hasAccess) {
    // Renderiza la vista alternativa si existe
    if (altComponent) {
      return typeof altComponent === "function" ? altComponent() : altComponent;
    }
    return null;
  }

  return <>{children}</>;
};
