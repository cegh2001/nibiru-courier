/* Icons */
import { FaExclamation } from "react-icons/fa";
import { cloneElement, forwardRef } from "react";
import React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

/**
 * MyInput - Componente de input reutilizable
 * 
 * Arquitectura limpia similar a MySelect:
 * - Auto-detecta modo FormControl mediante props de React Hook Form
 * - Renderiza solo el Input (FormItem wrapper es externo)
 * - Compatible con formularios de shadcn/ui
 * 
 * @prop {ReactNode} icon - Ícono a mostrar (opcional)
 * @prop {string} iconClassName - Clases CSS para el ícono
 * @prop {string} placeholder - Texto placeholder
 * @prop {string} type - Tipo de input (text, number, email, etc.)
 * @prop {number} maxLength - Longitud máxima del input
 * @prop {Function} autoTransform - Función para transformar el valor automáticamente
 * @prop {string} suggestion - Texto de sugerencia/ayuda
 * @prop {boolean} showSuggestion - Mostrar tooltip de sugerencia
 * @prop {boolean} useShadcnStyles - Usar estilos estándar de shadcn/ui (default: true)
 * @prop {string} className - Clases adicionales para el input
 * 
 * // Props de React Hook Form (cuando se usa {...field})
 * @prop {*} value - Valor controlado del input (field.value)
 * @prop {Function} onChange - Manejador de cambios (field.onChange)
 * @prop {Function} onBlur - Manejador de blur (field.onBlur)
 * @prop {string} name - Nombre del campo (field.name)
 */
const MyInputComponent = forwardRef(function MyInput({
  icon,
  iconClassName = "",
  placeholder = "Input...",
  type = "text",
  maxLength,
  autoTransform,
  suggestion = "",
  showSuggestion = false,
  onFocus,
  onBlur,
  onKeyDown,
  useShadcnStyles = true,
  className,
  shadowColor = "shadow-xs shadow-slate-200/30",
  backgroundColor = "bg-white/70",
  // Props de React Hook Form (cuando se usa {...field})
  value: fieldValue,
  onChange,
  name,
  // Props legacy para compatibilidad con register
  register,
  registerOptions,
  id,
  hasLabel = false,
  labelName,
  statusError,
  messageError = "Este campo es requerido",
  margin = "",
}, ref) {
  // Detectar si estamos en modo legacy (con register)
  const isLegacyMode = register && name;
  
  // Detectar si estamos en modo FormControl (con {...field})
  const isFormControlMode = !isLegacyMode && (fieldValue !== undefined && onChange !== undefined);

  // Normalizar el valor
  const normalizedValue = fieldValue
    ? typeof fieldValue === 'object'
      ? String(fieldValue?.value || fieldValue?.id || '')
      : String(fieldValue)
    : '';

  // Handler para cambios
  const handleChange = (e) => {
    let value = e.target.value;
    
    // Aplicar transformación automática si está definida
    if (autoTransform) {
      value = autoTransform(value);
    }
    
    if (onChange) {
      onChange(value);
    }
  };

  const handleFocusEvent = (e) => {
    if (onFocus) onFocus(e);
  };

  const handleBlurEvent = (e) => {
    if (onBlur) onBlur(e);
  };

  // Modo legacy con register
  if (isLegacyMode) {
    const labelText = labelName || placeholder;
    
    return (
      <div className={cn(margin, "w-full")}>
        {hasLabel && (
          <label 
            htmlFor={id} 
            className={cn(
              useShadcnStyles 
                ? "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block"
                : "block text-xs text-navy font-medium mb-1"
            )}
          >
            {labelText}
          </label>
        )}
        
        <div className="relative">
          {icon && !useShadcnStyles && cloneElement(icon, {
            className: cn(
              iconClassName || "w-5 h-5 absolute left-2.5 top-1/2 -translate-y-1/2 text-navy"
            )
          })}
          
          <Input
            ref={ref}
            id={id}
            className={cn(
              useShadcnStyles 
                ? "bg-white" 
                : [
                    icon ? "pl-10 pr-4" : "px-4",
                    "py-1.5 text-sm shadow-xs",
                    shadowColor,
                    backgroundColor,
                    statusError
                      ? "border-2 border-ruby/65 focus-visible:ring-ruby/50"
                      : "border border-input hover:border-navy-light/50 focus-visible:ring-navy/20 focus-visible:border-navy-light transition-all duration-200",
                    "placeholder:text-navy/70"
                  ],
              className
            )}
            placeholder={placeholder}
            type={type}
            maxLength={maxLength}
            {...register(name, registerOptions || { required: statusError ? true : false })}
          />
          
          {!useShadcnStyles && statusError && (
            <>
              <div className="p-[0.185rem] absolute -right-1.5 top-1 bg-ruby rounded-full peer group cursor-help">
                <FaExclamation className="w-3 h-3 text-white" />
              </div>
              <div className="absolute z-50 top-0 left-full ml-3 px-3 py-2 w-max max-w-xs bg-white border border-ruby/20 rounded-lg shadow-lg opacity-0 text-ruby text-xs font-medium duration-300 peer-hover:opacity-100 pointer-events-none transform -translate-y-1 peer-hover:translate-y-0 transition-all">
                <div className="absolute -left-1 top-3 w-2 h-2 bg-white border-l border-t border-ruby/20 rotate-45"></div>
                {messageError}
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // Modo moderno con React Hook Form
  return (
    <div className="relative">
      {/* Ícono - solo mostrar si no usa estilos shadcn y hay ícono */}
      {icon && !useShadcnStyles && cloneElement(icon, {
        className: cn(
          iconClassName || "w-5 h-5 absolute left-2.5 top-1/2 -translate-y-1/2 text-navy"
        )
      })}
      
      <Input
        ref={ref}
        className={cn(
          useShadcnStyles 
            ? "bg-white" 
            : [
                icon ? "pl-10 pr-4" : "px-4",
                "py-1.5 text-sm shadow-xs",
                shadowColor,
                backgroundColor,
                "border border-input hover:border-navy-light/50 focus-visible:ring-navy/20 focus-visible:border-navy-light transition-all duration-200",
                "placeholder:text-navy/70"
              ],
          className
        )}
        placeholder={placeholder}
        type={type}
        value={isFormControlMode ? normalizedValue : undefined}
        onChange={handleChange}
        onFocus={handleFocusEvent}
        onBlur={handleBlurEvent}
        onKeyDown={onKeyDown}
        maxLength={maxLength}
        name={name}
        step={type === 'number' ? "0.01" : undefined}
        min={type === 'number' ? "0" : undefined}
      />
      
      {/* Tooltip de sugerencia - solo si no usa estilos shadcn */}
      {!useShadcnStyles && showSuggestion && suggestion && (
        <div className="absolute z-10 top-full left-0 mt-1 p-2 bg-navy text-white text-xs rounded shadow-lg max-w-xs">
          <div className="flex items-start gap-2">
            <FaExclamation className="w-3 h-3 mt-0.5 shrink-0" />
            <span>{suggestion}</span>
          </div>
          <div className="absolute -top-1 left-3 w-2 h-2 bg-navy transform rotate-45"></div>
        </div>
      )}
    </div>
  );
});

MyInputComponent.displayName = "MyInput";

export const MyInput = MyInputComponent;