"use client";

import { InactivityModal } from "@/components/common/modals/InactivityModal";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { FloatingUserMenu } from "@/layouts/components/menus/components/FloatingUserMenu";
import { CentralHeader } from "@/layouts/components/CentralHeader";
import { Footer } from "@/layouts/components/Footer";
import { SidebarLite } from "@/layouts/components/sidebar/components/SidebarLite";
import { useUserMenuStore } from "@/layouts/components/menus/stores/userMenuStore";
import { AuthenticatedShellEffects } from "@/layouts/components/shell/AuthenticatedShellEffects";
import { broadcastLogout } from "@/services/channels/authChannel";

export function AuthenticatedAppShell({ children }) {
  const setUserMenuOpen = useUserMenuStore((state) => state.setOpen);

  const onLogout = (reason = "manual") => {
    broadcastLogout(reason);
  };

  return (
    <SidebarProvider defaultOpen={false}>
      <AuthenticatedShellEffects />
      <SidebarLite />

      <SidebarInset className="bg-transparent overflow-x-hidden min-w-0">
        <div className="relative flex flex-col min-h-screen w-full min-w-0">
          <CentralHeader />

          <div
            className="pt-4 lg:pt-20 pb-20 lg:pb-0 flex-1 flex flex-col w-full px-4 sm:px-0 min-w-0"
            onClick={() => setUserMenuOpen(false)}
          >
            <div className="flex-1 relative w-full min-w-0">
              <ErrorBoundary>{children}</ErrorBoundary>
            </div>
          </div>

          <Footer />
        </div>
      </SidebarInset>

      <FloatingUserMenu />
      <InactivityModal onLogout={onLogout} />
    </SidebarProvider>
  );
}