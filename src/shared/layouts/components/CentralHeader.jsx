"use client";

import { Navbar } from "@/layouts/components/Navbar";
import { ExchangeRate } from "@/layouts/components/ExchangeRate";

export const CentralHeader = () => {
  return (
    <div className="absolute top-4 left-0 right-0 z-30 w-full px-4 flex items-center justify-center">
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Navbar centrado */}
        <div className="hidden lg:block shrink-0">
          <Navbar />
        </div>

        {/* Cotizaciones al lado del navbar - solo visible en pantallas grandes */}
        <div className="hidden lg:flex shrink-0">
          <ExchangeRate />
        </div>
      </div>
    </div>
  );
};

