"use client";

import React from "react";
import { useData } from "@/hooks/useData";
import { FINANCE_ROUTES } from "@/services/apis/finance";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { useExchangeRateStore } from "@/core/stores/exchangeRateStore";

export const ExchangeRate = () => {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  
  // Store para mantener sincronización
  const { updateRatesFromData } = useExchangeRateStore();

  // Usar useData para obtener las monedas desde la nueva ruta
  const { data: currenciesData, isLoading: loading, error } = useData(
    FINANCE_ROUTES.CURRENCIES, 
    {
      params: { remove_pagination: true },
      swrOptions: { revalidateOnFocus: false },
    }, 
    isAuthenticated // Solo hacer fetch si está autenticado
  );

  // Procesar los datos para extraer USD y EUR
  const processedRates = React.useMemo(() => {
    if (!currenciesData) return { usdRate: null, eurRate: null };

    const currencies = currenciesData;
    let usdRate = null;
    let eurRate = null;

    currencies.forEach(currency => {
      if (currency.abbrev === "USD" && currency.last_value) {
        usdRate = {
          currency: "USD",
          price: parseFloat(currency.last_value.value),
          change: 0, // Sin datos de cambio en la nueva API
          percent: 0, // Sin datos de porcentaje en la nueva API
          color: "green", // Color neutro por defecto
          lastUpdate: currency.last_value.date_update
        };
      } else if (currency.abbrev === "EUR" && currency.last_value) {
        eurRate = {
          currency: "EUR", 
          price: parseFloat(currency.last_value.value),
          change: 0, // Sin datos de cambio en la nueva API
          percent: 0, // Sin datos de porcentaje en la nueva API
          color: "green", // Color neutro por defecto
          lastUpdate: currency.last_value.date_update
        };
      }
    });

    return { usdRate, eurRate };
  }, [currenciesData]);

  // Sincronizar con el store cuando los datos cambien
  React.useEffect(() => {
    if (currenciesData && isAuthenticated) {
      updateRatesFromData(currenciesData);
    }
  }, [currenciesData, isAuthenticated, updateRatesFromData]);

  const { usdRate, eurRate } = processedRates;

  // No mostrar nada si no está autenticado
  if (!isAuthenticated) {
    return null;
  }

  // Renderizar skeleton mientras carga
  if (loading && !usdRate && !eurRate) {
    return (
      <div className="bg-white/95 backdrop-blur-sm shadow-sm shadow-navy-lighter border border-gray-200/50 rounded-full px-4 py-2 h-[60px] flex items-center gap-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <div className="w-px h-4 bg-gray-300" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    );
  }

  // Renderizar error si existe
  if (error && !usdRate && !eurRate) {
    return (
      <div className="bg-white/95 backdrop-blur-sm shadow-sm shadow-navy-lighter border border-gray-200/50 rounded-full px-4 py-2 h-[60px] flex items-center gap-3">
        <span className="text-xs text-red-500">Error cargando cotizaciones</span>
      </div>
    );
  }

  // No mostrar si no hay datos
  if (!usdRate && !eurRate) {
    return null;
  }

  // Función para formatear precio
  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return "0,00";
    }
    return new Intl.NumberFormat('es-VE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Función para renderizar el ícono de tendencia
  const renderTrendIcon = (change) => {
    if (change > 0) return <TrendingUp className="h-3 w-3" />;
    if (change < 0) return <TrendingDown className="h-3 w-3" />;
    return null;
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="bg-white/95 backdrop-blur-sm shadow-sm shadow-navy-lighter border border-gray-200/50 rounded-full px-4 py-2 h-[60px] flex items-center gap-3"
      >
        {/* Dólar USD */}
        {usdRate && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5"
          >
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-green-700">USD</span>
              <span className="text-xs font-bold text-green-800">
                Bs. {formatPrice(usdRate.price)}
              </span>
            </div>
            
            {usdRate.change !== 0 && (
              <div className={`flex items-center gap-0.5 ${usdRate.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                {renderTrendIcon(usdRate.change) && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {renderTrendIcon(usdRate.change)}
                  </motion.div>
                )}
                <span className="text-xs font-medium">
                  {(usdRate.percent || 0).toFixed(1)}%
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Separador */}
        {usdRate && eurRate && (
          <div className="w-px h-4 bg-gray-300" />
        )}

        {/* Euro EUR */}
        {eurRate && (
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-1.5"
          >
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-blue-700">EUR</span>
              <span className="text-xs font-bold text-blue-800">
                Bs. {formatPrice(eurRate.price)}
              </span>
            </div>
            
            {eurRate.change !== 0 && (
              <div className={`flex items-center gap-0.5 ${eurRate.color === 'green' ? 'text-green-600' : 'text-red-600'}`}>
                {renderTrendIcon(eurRate.change) && (
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    {renderTrendIcon(eurRate.change)}
                  </motion.div>
                )}
                <span className="text-xs font-medium">
                  {(eurRate.percent || 0).toFixed(1)}%
                </span>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
