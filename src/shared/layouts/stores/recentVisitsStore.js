import { create } from "zustand";
import { persist } from "zustand/middleware";
import { findValidParentRoute, routeConfig } from "@/services/navigationConfig";

const MAX_RECENT_VISITS = 2;
const IGNORED_PATHS = new Set(["/", "/inicio"]);

function normalizeRecentVisit(pathname) {
  if (!pathname || IGNORED_PATHS.has(pathname)) {
    return null;
  }

  const normalizedPath = findValidParentRoute(pathname);

  if (!normalizedPath || IGNORED_PATHS.has(normalizedPath)) {
    return null;
  }

  const config = routeConfig[normalizedPath];

  if (!config) {
    return null;
  }

  return {
    iconName: config.iconName,
    label: config.label,
    path: normalizedPath,
    visitedAt: Date.now(),
  };
}

export const useRecentVisits = create(
  persist(
    (set) => ({
      items: [],
      clearRecentVisits: () => set({ items: [] }),
      recordVisit: (pathname) => {
        const recentVisit = normalizeRecentVisit(pathname);

        if (!recentVisit) {
          return;
        }

        set((state) => {
          const dedupedVisits = state.items.filter(
            (item) => item.path !== recentVisit.path
          );

          return {
            items: [recentVisit, ...dedupedVisits].slice(0, MAX_RECENT_VISITS),
          };
        });
      },
    }),
    {
      name: "recent-visits-storage",
      partialize: (state) => ({ items: state.items }),
    }
  )
);