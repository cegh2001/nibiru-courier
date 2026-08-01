"use client";

import React from "react";
import { useData } from "@/hooks/useData";
import { FINANCE_ROUTES } from "@/services/apis/finance";
import { useSession } from "next-auth/react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { TbReceiptTax, TbCurrencyDollar } from "react-icons/tb";
import { Skeleton } from "@/components/ui/skeleton";

export const MobileExchangeRate = () => {
    const { status } = useSession();
    const isAuthenticated = status === "authenticated";

    const { data: currenciesData, isLoading: loading, error } = useData(
        FINANCE_ROUTES.CURRENCIES,
        {
            params: { remove_pagination: true },
            swrOptions: { revalidateOnFocus: false },
        },
        isAuthenticated
    );

    const processedRates = React.useMemo(() => {
        if (!currenciesData) return { usdRate: null, eurRate: null };

        const currencies = currenciesData;
        let usdRate = null;
        let eurRate = null;

        currencies.forEach(currency => {
            if (currency.abbrev === "USD" && currency.last_value) {
                usdRate = {
                    currency: "USD",
                    price: parseFloat(currency.last_value.value)
                };
            } else if (currency.abbrev === "EUR" && currency.last_value) {
                eurRate = {
                    currency: "EUR",
                    price: parseFloat(currency.last_value.value)
                };
            }
        });

        return { usdRate, eurRate };
    }, [currenciesData]);

    const { usdRate, eurRate } = processedRates;

    if (!isAuthenticated) return null;

    const formatPrice = (price) => {
        if (price === null || price === undefined || isNaN(price)) {
            return "0,00";
        }
        return new Intl.NumberFormat('es-VE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="flex items-center justify-center bg-navy text-white rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 w-10 h-10 hover:bg-navy-light active:scale-95">
                    <TbCurrencyDollar className="size-6" />
                </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-3 rounded-xl border border-gray-100 shadow-xl z-50 mt-2 bg-white/95 backdrop-blur-md">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                        <TbReceiptTax className="text-navy size-5" />
                        <span className="font-semibold text-navy text-sm">Tasas BCV</span>
                    </div>

                    {loading && !usdRate && !eurRate ? (
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-10 w-full rounded-lg bg-gray-100" />
                            <Skeleton className="h-10 w-full rounded-lg bg-gray-100" />
                        </div>
                    ) : error && !usdRate && !eurRate ? (
                        <span className="text-xs text-red-500 font-medium text-center">Error al cargar tasas</span>
                    ) : (!usdRate && !eurRate) ? (
                        <span className="text-xs text-gray-500 font-medium text-center">Tasas no disponibles</span>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {usdRate && (
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-100 shadow-sm">
                                    <span className="text-sm font-bold text-emerald-700">USD</span>
                                    <span className="text-sm font-extrabold text-emerald-800">Bs. {formatPrice(usdRate.price)}</span>
                                </div>
                            )}
                            {eurRate && (
                                <div className="flex items-center justify-between p-2.5 rounded-lg bg-blue-50/80 border border-blue-100 shadow-sm">
                                    <span className="text-sm font-bold text-blue-700">EUR</span>
                                    <span className="text-sm font-extrabold text-blue-800">Bs. {formatPrice(eurRate.price)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
