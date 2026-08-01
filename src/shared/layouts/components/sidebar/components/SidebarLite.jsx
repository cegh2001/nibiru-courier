"use client";
import { AppSidebar } from "./AppSidebar";
import {
  SidebarTrigger,
} from "@/components/ui/sidebar";

/**
 * SidebarLite — Wrapper que reemplaza al Sidebar original con motion.
 * 
 * Usa el SidebarProvider de shadcn para manejar el estado
 * open/close del sidebar, compatible con mobile (Sheet) y desktop.
 *
 * Mantiene el trigger y el sidebar principal desacoplados del shell.
 */
export const SidebarLite = () => {
  return (
    <>
      <AppSidebar />
      <SidebarTrigger className="absolute top-5 left-3 z-50 h-10 w-10 rounded-full bg-white/80 shadow-md backdrop-blur-sm hover:bg-white hover:shadow-lg transition-all duration-200 [&>svg]:w-5 [&>svg]:h-5 text-navy hover:text-navy!" />
    </>
  );
};
