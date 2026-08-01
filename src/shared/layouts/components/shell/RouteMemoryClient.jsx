"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRecentVisits } from "@/layouts/stores/recentVisitsStore";

export function RouteMemoryClient() {
  const pathname = usePathname();
  const recordVisit = useRecentVisits((state) => state.recordVisit);

  useEffect(() => {
    if (!pathname || pathname === "/") {
      return;
    }

    sessionStorage.setItem("lastRoute", pathname);
    recordVisit(pathname);
  }, [pathname, recordVisit]);

  return null;
}