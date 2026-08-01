"use client";
import React, { useState, useRef, useEffect, useCallback, useMemo, forwardRef } from "react";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * MyCombobox - Componente de selección con búsqueda (combobox)
 * 
 * @prop {Array} items - Lista de items a mostrar
 * @prop {Object} selectedItem - Item actualmente seleccionado
 * @prop {Function} onChange - Callback que recibe el item completo seleccionado
 * @prop {Function} getItemKey - Función para obtener la key única de un item (default: item.id)
 * @prop {Function} getItemLabel - Función para obtener el label de un item (default: item.label)
 * @prop {boolean} hasLabel - Si debe mostrar un label encima del combobox
 * @prop {string} labelName - Texto del label
 * @prop {string} placeholder - Texto placeholder del trigger
 * @prop {string} searchPlaceholder - Texto placeholder del input de búsqueda
 * @prop {string} emptyMessage - Mensaje cuando no hay resultados
 * @prop {string} className - Clases adicionales para el trigger
 * @prop {ReactNode} shortcut - Contenido extra al final de la lista (ej: botón "Agregar")
 * @prop {boolean} disabled - Si el combobox está deshabilitado
 * @prop {string} margin - Clases de margen del contenedor
 * @prop {string} shadowColor - Color de la sombra (default: shadow-navy-light)
 * @prop {boolean} enableApiSearch - Habilitar búsqueda por API con debounce
 * @prop {Function} apiSearchFunction - Función async que recibe query y retorna array de items
 * @prop {number} minSearchLength - Caracteres mínimos para iniciar búsqueda API (default: 3)
 * @prop {string} searchLoadingMessage - Mensaje mientras busca
 * @prop {string} noSearchMessage - Mensaje cuando query es menor a minSearchLength
 * @prop {string} inputValue - Valor controlado del input de búsqueda (opcional)
 * @prop {Function} onInputChange - Callback para cambios en el input de búsqueda (opcional)
 * @prop {boolean} open - Estado abierto/cerrado controlado (opcional)
 * @prop {Function} onOpenChange - Callback para cambios en estado abierto/cerrado (opcional)
 * @prop {boolean} useShadcnStyles - Usar estilos estándar de shadcn/ui en lugar de estilos personalizados (default: false)
 * @prop {Array} initialItems - Items iniciales a mostrar cuando el popover se abre sin búsqueda (modo híbrido)
 * @prop {boolean} initialItemsLoading - Si los items iniciales están cargando
 * @prop {string} initialItemsLabel - Etiqueta para la sección de items iniciales (default: "Últimos registros")
 * @prop {Function} renderItemContent - Render opcional para items del listado
 * @prop {Function} renderSelectedItem - Render opcional para item seleccionado en el trigger
  */
 
const MyComboboxComponent = forwardRef(function MyCombobox({
  items = [],
  selectedItem,
  onChange,
  getItemKey = (item) => item.id,
  getItemLabel = (item) => item.label,
  hasLabel = false,
  labelName = "Lista de registros",
  placeholder = "Select an item...",
  searchPlaceholder = "Search...",
  emptyMessage = "No results found",
  className,
  shortcut,
  disabled,
  margin = "mt-0",
  shadowColor = "shadow-navy-light",
  // Props para búsqueda API
  enableApiSearch = false,
  apiSearchFunction,
  minSearchLength = 3,
  searchLoadingMessage = "Buscando...",
  noSearchMessage,
  // Props para controlar el input y estado externamente (para casos avanzados)
  inputValue,
  onInputChange,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  // Props de React Hook Form (cuando se usa {...field})
  value: fieldValue,
  // Prop para estilos
  useShadcnStyles = false,
  // Props para modo híbrido (items iniciales + búsqueda API)
  initialItems = null,
  initialItemsLoading = null,
  initialItemsLabel = "Últimos registros",
  renderItemContent,
  renderSelectedItem,
  onKeyDown,
}, ref) {
    const resolvedNoSearchMessage = noSearchMessage || `Escriba mínimo ${minSearchLength} ${minSearchLength === 1 ? "carácter" : "caracteres"} para buscar`;
  const resolvedInitialItems = useMemo(() => (Array.isArray(initialItems) ? initialItems : []), [initialItems]);

  // Detectar si estamos en modo FormControl (con {...field})
  const isFormControlMode = fieldValue !== undefined && onChange !== undefined;
  
  // Si estamos en modo FormControl, derivar selectedItem del value
  const derivedSelectedItem = useMemo(() => {
    if (isFormControlMode && fieldValue) {
      // Buscar el item que corresponde al valor actual
      const found = items.find(item => String(getItemKey(item)) === String(fieldValue));
      return found || null;
    }
    return selectedItem;
  }, [isFormControlMode, fieldValue, items, getItemKey, selectedItem]);
  // Estado interno
  const [internalOpen, setInternalOpen] = useState(false);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchError, setSearchError] = useState(null);
  const [buttonWidth, setButtonWidth] = useState(0);
  
  // Refs
  const buttonRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const listRef = useRef(null);
  const currentSearchRef = useRef(null);

  // Determinar si el estado open/searchQuery están controlados externamente
  const isOpenControlled = controlledOpen !== undefined;
  const open = isOpenControlled ? controlledOpen : internalOpen;
  const setOpen = useCallback((nextOpen) => {
    if (!isOpenControlled) {
      setInternalOpen(nextOpen);
    }

    controlledOnOpenChange?.(nextOpen);
  }, [isOpenControlled, controlledOnOpenChange]);

  const searchQuery = inputValue !== undefined ? inputValue : internalSearchQuery;
  const setSearchQuery = inputValue !== undefined ? onInputChange : setInternalSearchQuery;

  useEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, [open]);

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (currentSearchRef.current) {
        currentSearchRef.current.cancelled = true;
      }
    };
  }, []);

  // Limpiar búsqueda cuando se cierre el popover o cambie la selección
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      
      if (currentSearchRef.current) {
        currentSearchRef.current.cancelled = true;
        currentSearchRef.current = null;
      }
      
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    }
  }, [selectedItem, open, setSearchQuery]);

  // Función de búsqueda API con debounce
  const performApiSearch = useCallback(async (query) => {
    if (!enableApiSearch || !apiSearchFunction || !query || query.length < minSearchLength) {
      return;
    }

    // Cancelar búsqueda anterior si existe
    if (currentSearchRef.current) {
      currentSearchRef.current.cancelled = true;
    }

    // Crear nueva referencia de búsqueda
    const searchId = Date.now();
    currentSearchRef.current = { id: searchId, cancelled: false };
    const currentSearch = currentSearchRef.current;

    setIsSearching(true);
    setSearchError(null);

    try {
      const results = await apiSearchFunction(query);
      
      // Verificar si esta búsqueda sigue siendo válida
      if (currentSearch.cancelled || currentSearchRef.current?.id !== searchId) {
        return; // Búsqueda cancelada o reemplazada por una más nueva
      }
      
      // Asegurar que results es un array y filtrar duplicados inmediatamente
      const cleanResults = Array.isArray(results) ? results : [];
      const uniqueResults = cleanResults.filter((item, index, self) => 
        index === self.findIndex(t => getItemKey(t) === getItemKey(item))
      );
      
      setSearchResults(uniqueResults);
    } catch (error) {
      // Solo mostrar error si la búsqueda sigue siendo válida
      if (!currentSearch.cancelled && currentSearchRef.current?.id === searchId) {
        console.error("Error en búsqueda API:", error);
        setSearchError("Error al buscar");
        setSearchResults([]);
      }
    } finally {
      // Solo actualizar isSearching si la búsqueda sigue siendo válida
      if (!currentSearch.cancelled && currentSearchRef.current?.id === searchId) {
        setIsSearching(false);
        currentSearchRef.current = null;
      }
    }
  }, [enableApiSearch, apiSearchFunction, minSearchLength, getItemKey]);

  // Handler para cambios en el input de búsqueda
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);

    if (!enableApiSearch) return;

    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Cancelar búsqueda en progreso
    if (currentSearchRef.current) {
      currentSearchRef.current.cancelled = true;
      currentSearchRef.current = null;
    }

    // Si la query es muy corta, limpiar resultados inmediatamente
    if (value.length < minSearchLength) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    // Debounce de 300ms
    searchTimeoutRef.current = setTimeout(() => {
      performApiSearch(value);
    }, 300);
  }, [enableApiSearch, minSearchLength, performApiSearch, setSearchQuery]);

  // Verificar si estamos en modo híbrido (initialItems + API search)
  // Se activa si el caller pasó initialItems o initialItemsLoading explícitamente,
  // incluso cuando la respuesta inicial llega vacía.
  const isHybridMode = enableApiSearch && (Array.isArray(initialItems) || initialItemsLoading !== null);

  // Rastrear si alguna vez fue híbrido (para cuando initialItems se vacía después de cargar)
  const wasEverHybridRef = useRef(false);
  if (isHybridMode) wasEverHybridRef.current = true;
  const effectiveHybridMode = isHybridMode || wasEverHybridRef.current;

  // Determinar qué items mostrar
  const displayItems = useMemo(() => {
    if (enableApiSearch) {
      if (searchQuery.length < minSearchLength) {
        if (effectiveHybridMode) {
          // Modo híbrido: mostrar items iniciales (últimos N registros)
          const selectedKey = derivedSelectedItem && getItemKey(derivedSelectedItem)
            ? getItemKey(derivedSelectedItem).toString()
            : null;
          // Filtrar el item seleccionado de los iniciales para evitar duplicados
          return resolvedInitialItems.filter((item) => {
            const itemKey = getItemKey(item).toString();
            return !selectedKey || itemKey !== selectedKey;
          });
        }
        // Modo API search puro: el item seleccionado se muestra en el grupo "Seleccionado" aparte
        return [];
      }
      
      // Cuando hay búsqueda activa, filtrar duplicados y EXCLUIR el item seleccionado
      const selectedKey = derivedSelectedItem && getItemKey(derivedSelectedItem) 
        ? getItemKey(derivedSelectedItem).toString() 
        : null;
      
      const uniqueResults = searchResults.filter((item, index, self) => {
        const itemKey = getItemKey(item).toString();
        // Excluir si es el item seleccionado
        if (selectedKey && itemKey === selectedKey) return false;
        // Excluir duplicados
        return index === self.findIndex(t => getItemKey(t).toString() === itemKey);
      });
      
      return uniqueResults;
    }
    return items;
  }, [enableApiSearch, searchQuery, minSearchLength, searchResults, items, getItemKey, derivedSelectedItem, effectiveHybridMode, resolvedInitialItems]);

  // Handler para selección de item
  const handleSelect = useCallback((item) => {
    if (isFormControlMode) {
      // En modo FormControl, enviar solo el ID (string)
      const itemId = String(getItemKey(item));
      onChange?.(itemId);
    } else {
      // Modo normal, enviar el item completo
      onChange?.(item);
    }
    
    setOpen(false);
    
    // Limpiar estado de búsqueda
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
    
    if (currentSearchRef.current) {
      currentSearchRef.current.cancelled = true;
      currentSearchRef.current = null;
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  }, [onChange, setOpen, setSearchQuery, isFormControlMode, getItemKey]);

  // Prevenir propagación de scroll cuando el popover está abierto
  const stopWheelPropagation = useCallback((e) => {
    const el = listRef.current;
    if (!el) return;
    
    const atTop = el.scrollTop === 0;
    const atBottom = Math.ceil(el.scrollTop + el.clientHeight) >= el.scrollHeight;
    const scrollingUp = e.deltaY < 0;
    const scrollingDown = e.deltaY > 0;
    
    // Permitir propagación solo en los límites
    if ((atTop && scrollingUp) || (atBottom && scrollingDown)) return;
    
    e.stopPropagation();
  }, []);

  // Manejar apertura/cierre del popover
  const handleOpenChange = useCallback((newOpen) => {
    setOpen(newOpen);
    
    // Al abrir o cerrar, limpiar completamente el estado de búsqueda
    setSearchQuery("");
    setSearchResults([]);
    setSearchError(null);
    setIsSearching(false);
    
    if (currentSearchRef.current) {
      currentSearchRef.current.cancelled = true;
      currentSearchRef.current = null;
    }
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  }, [setOpen, setSearchQuery]);

  // Determinar si hay selección válida
  const hasValidSelection = derivedSelectedItem && getItemKey(derivedSelectedItem);

  const renderComboboxItem = useCallback((item, isSelected = false, isTrigger = false) => {
    if (isTrigger && renderSelectedItem) {
      return renderSelectedItem(item);
    }

    if (renderItemContent) {
      return renderItemContent(item, { isSelected, isTrigger });
    }

    return getItemLabel(item);
  }, [getItemLabel, renderItemContent, renderSelectedItem]);

  // Renderizado
  return (
    <div className={cn("flex flex-col w-full", margin)} ref={ref}>
      {hasLabel && (
        <label className={cn(
          useShadcnStyles 
            ? "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1"
            : "text-xs font-medium text-navy mb-1 block",
          disabled && "opacity-50"
        )}>
          {labelName}
        </label>
      )}
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              useShadcnStyles
                ? "w-full justify-between"
                : [
                    "w-full justify-between text-navy hover:text-navy hover:bg-navy-rgba border-0 shadow-xs",
                    shadowColor,
                    !hasValidSelection && "text-navy/70",
                  ],
              className
            )}
            disabled={disabled}
          >
            <div className="min-w-0 flex-1 mr-2 text-left">
              {hasValidSelection ? (
                renderSelectedItem || renderItemContent ? (
                  renderComboboxItem(derivedSelectedItem, true, true)
                ) : (
                  <span className="block truncate">{getItemLabel(derivedSelectedItem)}</span>
                )
              ) : (
                <span className="block truncate">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="opacity-50 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          style={{ width: `${buttonWidth}px` }}
          className="p-0 bg-white"
        >
          <Command shouldFilter={!enableApiSearch}>
            <CommandInput 
              placeholder={searchPlaceholder} 
              className="h-9"
              value={searchQuery}
              onValueChange={handleSearchChange}
              onKeyDown={onKeyDown}
            />
            <CommandList
              ref={listRef}
              onWheel={stopWheelPropagation}
              className="max-h-[300px] overflow-y-auto scroll-py-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-muted/40 hover:[&::-webkit-scrollbar-thumb]:bg-muted/60"
            >
              {enableApiSearch ? (
                // Modo búsqueda API
                <>
                  {searchQuery.length < minSearchLength ? (
                    initialItemsLoading ? (
                      <CommandEmpty className="py-2 text-center text-sm flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando...
                      </CommandEmpty>
                    ) : (effectiveHybridMode || hasValidSelection) ? (
                      <>
                        {/* Item seleccionado */}
                        {hasValidSelection && (
                          <CommandGroup heading="Seleccionado">
                            <CommandItem
                              key={`selected-${getItemKey(derivedSelectedItem)}`}
                              value={getItemLabel(derivedSelectedItem)}
                              onSelect={() => handleSelect(derivedSelectedItem)}
                              className={cn(
                                useShadcnStyles ? undefined : "text-navy",
                                "bg-navy-lighter data-[selected=true]:bg-navy/50"
                              )}
                            >
                                <div className="min-w-0 flex-1">
                                  {renderComboboxItem(derivedSelectedItem, true)}
                                </div>
                              <Check className="ml-auto transition-opacity text-navy opacity-100" />
                            </CommandItem>
                          </CommandGroup>
                        )}
                        {/* Items iniciales o seleccionado solo */}
                        {displayItems.length > 0 ? (
                          <CommandGroup heading={effectiveHybridMode ? initialItemsLabel : undefined}>
                            {displayItems.map((item) => {
                              const key = getItemKey(item);
                              const label = getItemLabel(item);
                              const isSelected = hasValidSelection && getItemKey(derivedSelectedItem) === key;
                              
                              return (
                                <CommandItem
                                  key={key}
                                  value={label}
                                  onSelect={() => handleSelect(item)}
                                className={cn(
                                  useShadcnStyles ? undefined : "text-navy",
                                  isSelected && "bg-navy-lighter data-[selected=true]:bg-navy/50"
                                )}
                                >
                                  <div className="min-w-0 flex-1">
                                    {renderComboboxItem(item, isSelected)}
                                  </div>
                                  <Check
                                    className={cn(
                                      "ml-auto transition-opacity text-navy",
                                      isSelected ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        ) : !hasValidSelection ? (
                          <CommandEmpty className="py-2 text-center text-sm">
                            {emptyMessage}
                          </CommandEmpty>
                        ) : null}
                      </>
                    ) : (
                      <CommandEmpty className="py-2 text-center text-sm">
                        {resolvedNoSearchMessage}
                      </CommandEmpty>
                    )
                  ) : isSearching ? (
                    <CommandEmpty className="py-2 text-center text-sm flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {searchLoadingMessage}
                    </CommandEmpty>
                  ) : searchError ? (
                    <CommandEmpty className="py-2 text-center text-sm text-red-600">
                      {searchError}
                    </CommandEmpty>
                  ) : displayItems.length === 0 ? (
                    <CommandEmpty className="py-2 text-center text-sm">
                      {emptyMessage}
                    </CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {displayItems.map((item) => {
                        const key = getItemKey(item);
                        const label = getItemLabel(item);
                        const isSelected = hasValidSelection && getItemKey(derivedSelectedItem)?.toString() === key?.toString();
                        
                        return (
                          <CommandItem
                            key={key}
                            value={label}
                            onSelect={() => handleSelect(item)}
                            className={cn(
                              useShadcnStyles ? undefined : "text-navy",
                              isSelected && "bg-navy-lighter data-[selected=true]:bg-navy/50"
                            )}
                          >
                            <div className="min-w-0 flex-1">
                              {renderComboboxItem(item, isSelected)}
                            </div>
                            <Check
                              className={cn(
                                "ml-auto transition-opacity text-navy",
                                isSelected ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  )}
                </>
              ) : (
                // Modo estático
                <>
                  <CommandEmpty className="py-2 text-center text-sm">
                    {emptyMessage}
                  </CommandEmpty>
                  <CommandGroup>
                    {displayItems.map((item) => {
                      const key = getItemKey(item);
                      const label = getItemLabel(item);
                      const isSelected = hasValidSelection && getItemKey(derivedSelectedItem)?.toString() === key?.toString();
                      
                      return (
                        <CommandItem
                          key={key}
                          value={label}
                          onSelect={() => handleSelect(item)}
                          className={cn(
                            "text-navy",
                            isSelected && "bg-navy-lighter data-[selected=true]:bg-navy/50"
                          )}
                        >
                          <div className="min-w-0 flex-1">
                            {renderComboboxItem(item, isSelected)}
                          </div>
                          <Check
                            className={cn(
                              "ml-auto transition-opacity text-navy",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </>
              )}
            </CommandList>
            {shortcut && <div className="border-t bg-white">{shortcut}</div>}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
});

MyComboboxComponent.displayName = "MyCombobox";

export const MyCombobox = MyComboboxComponent;
