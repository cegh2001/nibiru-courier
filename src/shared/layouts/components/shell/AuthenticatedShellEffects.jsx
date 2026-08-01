"use client";

import { useEffect } from "react";
import { useCurrencyValuesStore } from "@/core/stores/currencyValuesStore";
import { RouteMemoryClient } from "@/layouts/components/shell/RouteMemoryClient";

export function AuthenticatedShellEffects() {
  const fetchCurrencyValues = useCurrencyValuesStore(
    (state) => state.fetchCurrencyValues
  );

  useEffect(() => {
    fetchCurrencyValues();
  }, [fetchCurrencyValues]);

  return <RouteMemoryClient />;
}