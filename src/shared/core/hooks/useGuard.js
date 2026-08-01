/* Hooks */
import { useMemo } from "react";

/* Next Auth */
import { useSession } from "next-auth/react";

export const useGuard = (permissions = [], roles = []) => {
  const { data: session } = useSession();

  // Memoriza el resultado para evitar recalcular si los permisos o roles no cambian
  const hasPermissionOrRole = useMemo(() => {
    const hasPermission = permissions.some(permission =>
      session?.user?.permissions?.some(p => (typeof p === "string" ? p : p.name) === permission)
    );
    const hasRole = roles.some(role =>
      session?.user?.roles?.some(r => (typeof r === "string" ? r : r.name) === role)
    );
    
    return hasPermission || hasRole;
  }, [session?.user?.permissions, session?.user?.roles, permissions, roles]);

  return hasPermissionOrRole;
};