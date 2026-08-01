"use client";

import Link from "next/link";
import { useMemo } from "react";
import { TbChevronRight, TbHistory } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRoleNavigation } from "@/hooks/useRoleNavigation";
import { useRecentVisits } from "@/layouts/stores/recentVisitsStore";
import { iconMap } from "@/services/navigationConfig";
import { canAccessPath } from "@/services/roleAccess";

export function RecentVisitsButton() {
  const recentVisits = useRecentVisits((state) => state.items);
  const { sections } = useRoleNavigation();

  const visibleVisits = useMemo(
    () =>
      recentVisits
        .filter((visit) => canAccessPath(visit.path, sections))
        .map((visit) => ({
          ...visit,
          Icon: iconMap[visit.iconName] || TbHistory,
        })),
    [recentVisits, sections]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full px-2 sm:px-3 py-1 h-7 sm:h-8 text-navy hover:bg-blue-50 hover:text-blue-600 transition-colors ring-1 ring-blue-200 bg-blue-50/40"
        >
          <span className="flex items-center gap-2">
            <TbHistory className="w-4 h-4" />
            <span className="text-xs sm:text-sm whitespace-nowrap">
              Visitados recientemente
            </span>
            {visibleVisits.length > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-white text-[11px] font-semibold text-navy px-1.5">
                {visibleVisits.length}
              </span>
            )}
          </span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-72">
        <DropdownMenuLabel>Visitados recientemente</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {visibleVisits.length === 0 ? (
          <DropdownMenuItem disabled>
            Aún no hay rutas recientes para mostrar.
          </DropdownMenuItem>
        ) : (
          visibleVisits.map((visit) => {
            const VisitIcon = visit.Icon;

            return (
              <DropdownMenuItem key={visit.path} asChild>
                <Link
                  href={visit.path}
                  className="flex items-center gap-3 cursor-pointer"
                  prefetch={false}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 shrink-0">
                    <VisitIcon className="w-4 h-4" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium">{visit.label}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {visit.path}
                    </span>
                  </span>
                  <TbChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                </Link>
              </DropdownMenuItem>
            );
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}