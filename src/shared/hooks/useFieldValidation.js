import { useState, useCallback, useMemo } from 'react';

/**
 * Hook para validaciones en tiempo real con sugerencias
 * @param {Object} field - Campo del formulario
 * @param {Function} validator - Función de validación personalizada
 * @param {string} suggestion - Sugerencia para el usuario
 * @returns {Object} - Estado de validación y sugerencia
 */
export const useFieldValidation = (field, validator, suggestion = '') => {
  const [isFocused, setIsFocused] = useState(false);

  // Memoizar el valor del campo para evitar re-renderizados innecesarios
  const fieldValue = useMemo(() => field?.value || '', [field?.value]);

  const validationState = useMemo(() => {
    if (!fieldValue) {
      return {
        error: '',
        isValid: true,
        showSuggestion: isFocused && Boolean(suggestion),
      };
    }

    try {
      if (validator) {
        validator(fieldValue);
      }

      return {
        error: '',
        isValid: true,
        showSuggestion: false,
      };
    } catch (validationError) {
      return {
        error: validationError?.message || 'Valor inválido',
        isValid: false,
        showSuggestion: true,
      };
    }
  }, [fieldValue, validator, isFocused, suggestion]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  return {
    error: validationState.error,
    isValid: validationState.isValid,
    showSuggestion: validationState.showSuggestion,
    suggestion,
    handleFocus,
    handleBlur
  };
};
