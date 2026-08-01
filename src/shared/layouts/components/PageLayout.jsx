'use client';
/* Core */
import { LoadingOverlay } from "@/layouts/components/LoadingOverlay";
/* Components */
import { Breadcrumbs } from "@/layouts/components/Breadcrumbs";
import { CrumbBackButton } from "@/layouts/components/CrumbBackButton";
import React from "react";

export const PageLayout = ({
  children,
  hasHeader = true,
  icon,
  loading,
  LoadingComponent,
  topLeftMenu,
  topRightMenu,
  title,
  separator = true,
  showBreadcrumbs = true,
  showBackButton = false,
  backHref,
  onBack,
}) => {
  const hasTopLeftMenu = !!topLeftMenu;
  const hasTopRightMenu = !!topRightMenu;

  return (
    <>
      <LoadingOverlay loading={loading} LoadingComponent={LoadingComponent} />

      {/* Contenido principal */}
      <div className="w-full h-full px-4 sm:px-8 lg:px-16">
        {hasHeader ? (
          /* Header completo con título y menús */
          <div className="flex flex-col">
            {/* Título y breadcrumbs */}
            <div className="w-full flex flex-col sm:flex-row items-center sm:items-center justify-center sm:justify-between my-4 gap-2 sm:gap-0">
              <span className="flex items-center justify-center gap-2 font-bold text-xl sm:text-2xl text-navy text-center">
                {icon} {title}
              </span>
              {showBreadcrumbs && (
                <div className="flex justify-center w-full sm:w-auto">
                  <Breadcrumbs />
                </div>
              )}
            </div>

            {/* Menús superiores y botón de retroceso */}
            {(hasTopLeftMenu || hasTopRightMenu) && (
              <div className={`flex flex-col sm:flex-row sm:items-center ${separator ? "pb-1.5 border-b border-navy-lighter/30" : ""}`}>
                <div className="flex items-center gap-2">
                  <CrumbBackButton href={backHref} onBack={onBack} />
                </div>
                {hasTopLeftMenu && (
                  <div className="flex gap-2 w-[50%]">{topLeftMenu}</div>
                )}
                {hasTopRightMenu && (
                  <div className="flex justify-end w-full gap-2 mt-2 sm:mt-0">{topRightMenu}</div>
                )}
              </div>
            )}

            {/* Solo back button si no hay menús y showBackButton */}
            {!hasTopLeftMenu && !hasTopRightMenu && showBackButton && (
              <div className={`flex ${separator ? "pb-1.5 border-b border-navy-lighter/30" : ""}`}>
                <CrumbBackButton href={backHref} onBack={onBack} />
              </div>
            )}

            {/* Menú principal (legacy) */}
            {/* Si tienes lógica para un menú principal, puedes adaptarla aquí */}
          </div>
        ) : (
          /* Solo Breadcrumbs */
          <>
            {showBreadcrumbs && <Breadcrumbs margin="my-2" />}
            <div className="w-full flex flex-col sm:flex-row sm:items-center sm:justify-between my-4">
              <span className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-navy">
                {icon} {title}
              </span>
              <CrumbBackButton href={backHref} onBack={onBack} />
            </div>
          </>
        )}

        {/* Contenido de la página */}
        {children}
      </div>
    </>
  );
};