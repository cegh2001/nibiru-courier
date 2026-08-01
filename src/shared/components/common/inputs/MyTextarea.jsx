import React, { cloneElement, forwardRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { cn } from "@/lib/utils";
import { FaExclamation } from "react-icons/fa";

const MyTextareaComponent = forwardRef(function MyTextarea({
  icon,
  iconClassName = "",
  placeholder = "Escribe aquí...",
  maxLength,
  rows = 2,
  useShadcnStyles = true,
  className,
  shadowColor = "shadow-xs shadow-slate-200/30",
  backgroundColor = "bg-white",
  value: fieldValue,
  onChange,
  onBlur,
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

  const normalizedValue = fieldValue
    ? typeof fieldValue === 'object'
      ? String(fieldValue?.value || fieldValue?.id || '')
      : String(fieldValue)
    : '';

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
              iconClassName || "w-5 h-5 absolute left-2.5 top-3 text-navy"
            )
          })}
          
          <TextareaAutosize
            ref={ref}
            id={id}
            className={cn(
              useShadcnStyles 
                ? "flex min-h-[60px] w-full rounded-md border border-input bg-white px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                : [
                    icon ? "pl-10 pr-4" : "px-4",
                    "flex w-full py-2 text-sm min-h-[60px] rounded-md border shadow-sm",
                    shadowColor,
                    backgroundColor,
                    statusError
                      ? "border-2 border-ruby/65 focus-visible:ring-ruby/50"
                      : "border-input hover:border-navy-light/50 focus-visible:ring-navy/20 focus-visible:border-navy-light transition-all duration-200",
                    "placeholder:text-navy/60 focus-visible:outline-hidden focus-visible:ring-1"
                  ],
              className
            )}
            placeholder={placeholder}
            minRows={rows}
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
      {icon && !useShadcnStyles && cloneElement(icon, {
        className: cn(
          iconClassName || "w-5 h-5 absolute left-2.5 top-3 text-navy"
        )
      })}
      
      <TextareaAutosize
        ref={ref}
        className={cn(
          useShadcnStyles 
            ? "flex min-h-[60px] w-full rounded-md border border-input bg-white px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            : [
                icon ? "pl-10 pr-4" : "px-4",
                "flex w-full py-2 text-sm min-h-[60px] rounded-md border shadow-sm",
                shadowColor,
                backgroundColor,
                "border-input hover:border-navy-light/50 focus-visible:ring-navy/20 focus-visible:border-navy-light transition-all duration-200",
                "placeholder:text-navy/60 focus-visible:outline-hidden focus-visible:ring-1"
              ],
          className
        )}
        placeholder={placeholder}
        minRows={rows}
        maxLength={maxLength}
        value={isFormControlMode ? normalizedValue : undefined}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
      />
    </div>
  );
});

MyTextareaComponent.displayName = "MyTextarea";

export const MyTextarea = MyTextareaComponent;
