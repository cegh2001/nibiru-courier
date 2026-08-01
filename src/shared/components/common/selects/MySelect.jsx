"use client";
import React, { forwardRef, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/**
 * MySelect - Componente de selección simple (select/dropdown)
 * 
 * Arquitectura limpia similar a MyCombobox:
 * - Auto-detecta modo FormControl mediante props de React Hook Form
 * - Renderiza solo el Select (FormItem wrapper es externo)
 * - Maneja valores como strings (IDs) para compatibilidad con Zod schemas
 * 
 * @prop {Array} items - Lista de items a mostrar
 * @prop {Object} selectedItem - Item actualmente seleccionado (modo standalone)
 * @prop {Function} onChange - Callback que recibe el item completo seleccionado (modo standalone)
 * @prop {Function} getItemKey - Función para obtener la key única de un item (default: item.id)
 * @prop {Function} getItemLabel - Función para obtener el label de un item (default: item.label)
 * @prop {string} placeholder - Texto placeholder del trigger
 * @prop {Object} triggerProps - Props adicionales para SelectTrigger
 * @prop {Object} contentProps - Props adicionales para SelectContent
 * @prop {ReactNode} shortcut - Contenido extra al final de la lista
 * @prop {boolean} disabled - Si el select está deshabilitado
 * @prop {string} shadowColor - Color de la sombra (default: shadow-navy-light)
 * @prop {string} bgColor - Color de fondo adicional
 * @prop {string} className - Clases adicionales para el trigger
 * @prop {boolean} useShadcnStyles - Usar estilos estándar de shadcn/ui (default: true)
 * 
 * // Props de React Hook Form (cuando se usa {...field})
 * @prop {*} value - Valor controlado del select (field.value)
 * @prop {Function} onChange - Manejador de cambios (field.onChange)
 * @prop {Function} onBlur - Manejador de blur (field.onBlur)
 * @prop {string} name - Nombre del campo (field.name)
 */
const MySelectComponent = forwardRef(function MySelect({
  items = [],
  selectedItem,
  onChange,
  getItemKey = (item) => item.id,
  getItemLabel = (item) => item.label,
  placeholder = "Selecciona una opción...",
  triggerProps = {},
  contentProps = {},
  shortcut,
  disabled,
  shadowColor = "shadow-xs shadow-slate-200/30",
  bgColor = "bg-white",
  className,
  useShadcnStyles = true,
  // Props de React Hook Form (cuando se usa {...field})
  value: fieldValue,
  // Props legacy para standalone mode
  hasLabel = false,
  labelName,
  margin = "",
}, ref) {
  // Detectar si estamos en modo FormControl (con {...field})
  const isFormControlMode = fieldValue !== undefined && onChange !== undefined;
  
  // Detectar modo standalone (sin React Hook Form, solo onChange y selectedItem)
  const isStandaloneMode = !isFormControlMode && onChange !== undefined;
  
  // Derivar selectedItem del value cuando estamos en modo FormControl
  const derivedSelectedItem = useMemo(() => {
    if (isFormControlMode && fieldValue) {
      // Normalizar el valor: siempre trabajar con strings
      const normalizedValue = typeof fieldValue === 'object' 
        ? String(fieldValue?.id || fieldValue?.value || '')
        : String(fieldValue);
      
      // Buscar el item que corresponde al valor actual
      const found = items.find(item => String(getItemKey(item)) === normalizedValue);
      return found || null;
    }
    return selectedItem;
  }, [isFormControlMode, fieldValue, items, getItemKey, selectedItem]);

  // Handler para selección de item
  const handleSelect = (value) => {
    if (isFormControlMode) {
      // En modo FormControl, enviar solo el valor (string) a React Hook Form
      onChange?.(value);
    } else {
      // Modo standalone, enviar el item completo
      const foundItem = items.find(item => String(getItemKey(item)) === value);
      onChange?.(foundItem);
    }
  };

  // Determinar el valor actual como string
  const currentValue = isFormControlMode 
    ? (fieldValue 
        ? typeof fieldValue === 'object'
          ? String(fieldValue?.id || fieldValue?.value || '')
          : String(fieldValue)
        : '')
    : (derivedSelectedItem && getItemKey(derivedSelectedItem) ? String(getItemKey(derivedSelectedItem)) : '');

  // Determinar si hay selección válida
  const hasValidSelection = derivedSelectedItem && getItemKey(derivedSelectedItem);

  // Texto del label (si hasLabel está activo)
  const labelText = labelName || placeholder;

  // Renderizado con wrapper y label si está en modo standalone con hasLabel
  if (isStandaloneMode && hasLabel) {
    return (
      <div className={cn(margin, "w-full")}>
        <label 
          className={cn(
            useShadcnStyles 
              ? "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
              : "block text-xs text-navy font-medium mb-1"
          )}
        >
          {labelText}
        </label>
        
        <Select 
          value={currentValue} 
          onValueChange={handleSelect}
          disabled={disabled}
        >
          <SelectTrigger
            ref={ref}
            {...triggerProps}
            className={cn(
              useShadcnStyles 
                ? "bg-white" 
                : [
                    "w-full justify-between font-medium text-navy hover:text-navy hover:bg-navy-rgba border border-input hover:border-navy-light/50 focus:border-navy-light focus:ring-navy/20 data-[state=open]:border-navy-light shadow-xs transition-all duration-200",
                    shadowColor,
                    bgColor,
                    !hasValidSelection && "text-navy/70",
                  ],
              className
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent {...contentProps}>
            {items.length > 0 ? (
              items.map((item) => {
                const key = getItemKey(item);
                const label = getItemLabel(item);
                
                return (
                  <SelectItem
                    key={key}
                    value={String(key)}
                    className={useShadcnStyles ? undefined : "focus:outline-hidden"}
                  >
                    {label}
                  </SelectItem>
                );
              })
            ) : (
              <SelectItem value="[]" disabled>
                No hay resultados
              </SelectItem>
            )}
            {shortcut && <div className="border-t">{shortcut}</div>}
          </SelectContent>
        </Select>
      </div>
    );
  }

  // Renderizado sin wrapper (modo FormControl o standalone sin label)
  return (
    <Select 
      value={currentValue} 
      onValueChange={handleSelect}
      disabled={disabled}
    >
      <SelectTrigger
        ref={ref}
        {...triggerProps}
        className={cn(
          useShadcnStyles 
            ? cn("bg-white", triggerProps.className)
            : [
                "w-full justify-between font-medium text-navy hover:text-navy hover:bg-navy-rgba border border-input hover:border-navy-light/50 focus:border-navy-light focus:ring-navy/20 data-[state=open]:border-navy-light shadow-xs transition-all duration-200",
                shadowColor,
                bgColor,
                !hasValidSelection && "text-navy/70",
              ],
          className
        )}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent {...contentProps}>
        {items.length > 0 ? (
          items.map((item) => {
            const key = getItemKey(item);
            const label = getItemLabel(item);
            
            return (
              <SelectItem
                key={key}
                value={String(key)}
                className={useShadcnStyles ? undefined : "focus:outline-hidden"}
              >
                {label}
              </SelectItem>
            );
          })
        ) : (
          <SelectItem value="[]" disabled>
            No hay resultados
          </SelectItem>
        )}
        {shortcut && <div className="border-t">{shortcut}</div>}
      </SelectContent>
    </Select>
  );
});

MySelectComponent.displayName = "MySelect";

export const MySelect = MySelectComponent;