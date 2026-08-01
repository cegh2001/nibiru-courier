import clsx from "clsx";

/* Animations */
import { Spinner } from "@/components/animations/Spinner"

/* Components */
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

/* Hooks */
import { useState, useEffect, useCallback, useRef } from "react"

/* Services */
import { apiClient } from "@/services/apiClient";

/* Toast */
import toast from "react-hot-toast";

export function SearchCombobox({ url, setResults, selected, options }) {
  const [query, setQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const debounceTimeoutRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const [temporarySuggestion, setTemporarySuggestion] = useState("");

  // Mover getSuggestions fuera del componente y envolverlo con useCallback
  const getSuggestions = useCallback(async () => {
    setIsLoading(true);
    try {
      let filteredResults = [];

      if (url) {
        const response = await apiClient.get(
          `${url}`, {
            params: { remove_pagination: true, search: query },
          }
        );
        const data = response?.data?.data;

        // Filtrar los resultados que ya han sido seleccionados
        filteredResults = (data ?? []).filter(
          (item) =>
            !(selected ?? []).some((selectedItem) => selectedItem.id === item.id)
        );
      } else if (!options) {
        // Filtrar los elementos seleccionados basados en el query
        filteredResults = (selected ?? []).filter((item) =>
          (item?.name ?? '').toLowerCase().includes((query ?? '').toLowerCase())
        );
      } else {
        // Filtrar los elementos basados en el query
        const data = (options ?? []).filter((item) =>
          (item?.name ?? '').toLowerCase().includes((query ?? '').toLowerCase())
        );

        // Filtrar los resultados que ya han sido seleccionados
        filteredResults = data.filter(
          (item) =>
            !(selected ?? []).some((selectedItem) => selectedItem.id === item.id)
        );
      }

      // Si no hay resultados o todos ya están seleccionados, mostrar mensaje
      if (filteredResults.length === 0) {
        setShowNoResults(true);
        setSuggestions([]);
      } else {
        const filteredNames = filteredResults.map((item) => item.name);
        setSuggestions([temporarySuggestion, ...filteredNames]);
        setShowNoResults(false);
      }

      setResults(filteredResults);
    } catch {
      setSuggestions([]);
      setShowNoResults(true);
    } finally {
      setIsLoading(false);
    }
  }, [query, url, selected, temporarySuggestion, setResults, options]);

  // Manejo de debounce para la búsqueda
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    setIsDebouncing(true);
    debounceTimeoutRef.current = setTimeout(() => {
      if (query.length >= 3) {
        getSuggestions();
      } else if (query.length > 0) {
        toast.error("Debes escribir al menos 3 caracteres para buscar");
        setSuggestions([]);
        setShowNoResults(false);
      }
      setIsDebouncing(false);
    }, 800);

    return () => clearTimeout(debounceTimeoutRef.current);
  }, [query, getSuggestions]);

  // Manejar la selección de un valor
  const handleChange = (value) => {
    setSelectedValue(value);
    setQuery("");
    setTemporarySuggestion("");
  };

  // Manejar los cambios en el input
  const handleInputChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    setSelectedValue(value);
    setTemporarySuggestion(value);
    setSuggestions([]);
    setShowNoResults(false);

    if (value === "") {
      setResults([]);
    }
  };

  const filteredSuggestions = query === "" ? [] : suggestions;

  return (
    <Combobox value={selectedValue} onChange={handleChange}>
      <div className="relative">
        <ComboboxInput
          className={clsx(
            "h-[26px] lg:w-5/6 xl:w-full bg-white border border-neutral-200 rounded-full shadow-xs shadow-navy-rgba px-2 text-sm/6 text-navy",
            "focus:outline-hidden data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25",
            "placeholder:text-navy"
          )}
          onChange={handleInputChange}
          placeholder="Buscar..."
          displayValue={() => selectedValue}
        />
        {isLoading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <Spinner />
          </div>
        )}
        {query !== "" && !isLoading && !isDebouncing && (
          <ComboboxOptions className="absolute w-full bg-white border rounded mt-1 z-10 transition duration-300 ease-in-out transform">
            {filteredSuggestions.length > 0
              ? filteredSuggestions.map((suggestion) => (
                  <ComboboxOption
                    key={suggestion}
                    value={suggestion}
                    className={clsx(
                      "cursor-pointer p-2 transition duration-300 ease-in-out transform",
                      "bg-white data-focus:bg-blue-100 data-selected:font-bold"
                    )}
                  >
                    {suggestion}
                  </ComboboxOption>
                ))
              : showNoResults && (
                  <div className="cursor-default p-2 text-gray-500 transition duration-300 ease-in-out transform">
                    No hay elementos a seleccionar
                  </div>
                )}
          </ComboboxOptions>
        )}
      </div>
    </Combobox>
  );
}