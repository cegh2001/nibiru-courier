/**
 * Estrategias de parsing para referencias y montos de pagos
 * Patrón Strategy: Cada estrategia es independiente y retorna { reference, amount } o null
 */

/**
 * Normaliza un string de monto que puede estar en formato europeo o americano
 * Formatos soportados:
 * - 4.909,12 (europeo: punto miles, coma decimal) → 4909.12
 * - 4909,12 (europeo: coma decimal) → 4909.12
 * - 4,909.12 (americano: coma miles, punto decimal) → 4909.12
 * - 4909.12 (americano: punto decimal) → 4909.12
 */
const normalizeAmount = (rawAmount) => {
  // Si tiene punto Y coma, determinar cuál es el separador decimal
  if (rawAmount.includes('.') && rawAmount.includes(',')) {
    const lastDot = rawAmount.lastIndexOf('.');
    const lastComma = rawAmount.lastIndexOf(',');
    
    // El último separador es el decimal
    if (lastComma > lastDot) {
      // Formato europeo: 4.909,12
      return rawAmount.replace(/\./g, '').replace(/,/g, '.');
    } else {
      // Formato americano: 4,909.12
      return rawAmount.replace(/,/g, '');
    }
  } else if (rawAmount.includes(',') && !rawAmount.includes('.')) {
    // Solo coma: es decimal europeo (4909,12)
    return rawAmount.replace(/,/g, '.');
  } else if (rawAmount.includes('.') && !rawAmount.includes(',')) {
    // Solo punto: podría ser miles o decimal
    // Si tiene más de un punto, son miles: 1.000.000
    const dotCount = (rawAmount.match(/\./g) || []).length;
    if (dotCount > 1) {
      return rawAmount.replace(/\./g, '');
    }
    // Un solo punto: asumir decimal americano
    return rawAmount;
  }
  
  // Sin separadores, ya está normalizado
  return rawAmount;
};

/**
 * Estrategia 0: Línea simple sin saltos
 * Detecta: "115052142", "165118", "59065932", "00000036"
 * Acepta referencias de 4 a 20 dígitos (los usuarios pueden pegar refs cortas)
 */
const parseSingleLine = (text) => {
  const normalized = text.trim();
  
  if (normalized.includes('\n') || normalized.includes('\r')) {
    return null;
  }

  // Limpiar todo lo que no sea dígito
  const digits = normalized.replace(/\D/g, '');
  
  // Aceptar desde 4 dígitos (refs cortas) hasta 20
  // Si la línea original es puro número (o con espacios), es una referencia
  if (digits.length >= 4 && digits.length <= 20 && /^\s*\d+\s*$/.test(normalized)) {
    return { reference: digits, amount: null };
  }

  return null;
};

/**
 * Estrategia 1: Con etiquetas explícitas
 * Detecta: "Referencia: 115052142", "Monto: Bs.0,26" o "Monto: 4.909,12"
 * Maneja formato europeo: punto como separador de miles, coma como decimal
 * PRIORIDAD: Cuando hay etiquetas, acepta referencias de cualquier longitud (legacy)
 */
const parseWithLabels = (text) => {
  const normalized = text.trim();
  let reference = null;
  let amount = null;

  // Buscar referencia con etiqueta - acepta cualquier longitud cuando está etiquetada
  const refMatch = normalized.match(/(?:Referencia|Ref\.?|Reference)[\s:]+(\d+)/i);
  if (refMatch) {
    reference = refMatch[1];
  }

  // Buscar monto con etiqueta
  const amountMatch = normalized.match(/(?:Monto|Amount|Total)[\s:]*(?:Bs\.?|USD|\$)?\s*([\d.,]+)/i);
  if (amountMatch) {
    const rawAmount = amountMatch[1];
    const normalizedAmount = normalizeAmount(rawAmount);
    const parsedAmount = parseFloat(normalizedAmount);
    
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      amount = parsedAmount.toFixed(2);
    }
  }

  // Solo retornar si encontró al menos la referencia
  // Señal interna: referencias etiquetadas pueden ser legacy y más cortas.
  return reference ? { reference, amount, allowShortReference: true } : null;
};

/**
 * Estrategia 2: Formato libre multi-línea
 * Detecta referencias y montos sin etiquetas en líneas separadas
 */
const parseMultiLine = (text) => {
  const normalized = text.trim();
  const lines = normalized.split(/[\n\r]+/).map(line => line.trim()).filter(Boolean);

  if (lines.length < 2) {
    return null;
  }

  let reference = null;
  let amount = null;

  // Buscar referencia: línea con 8-20 dígitos sin símbolos de moneda
  for (const line of lines) {
    const digits = line.replace(/\D/g, '');
    
    if (digits.length >= 8 && digits.length <= 20 && !line.match(/Bs\.?|USD|\$|€|£/i)) {
      if (!reference) {
        reference = digits;
      }
    }
  }

  // Buscar monto: línea con números decimales y posible símbolo de moneda
  for (const line of lines) {
    const amountMatch = line.match(/(?:Bs\.?|USD|\$)?\s*([\d.,]+)/i);
    
    if (amountMatch && !amount) {
      const rawAmount = amountMatch[1];
      const normalizedAmount = normalizeAmount(rawAmount);
      const parsedAmount = parseFloat(normalizedAmount);
      
      if (!isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount < 999999999) {
        const hasDecimal = normalizedAmount.includes('.');
        const digitCount = normalizedAmount.replace(/\D/g, '').length;
        
        // Es monto si: tiene decimales O tiene menos de 8 dígitos
        if (hasDecimal || digitCount < 8) {
          amount = parsedAmount.toFixed(2);
        }
      }
    }
  }

  return reference ? { reference, amount } : null;
};

/**
 * Estrategia 3: Dos líneas simples (heurística)
 * Línea más larga = referencia, línea más corta = monto
 */
const parseTwoLines = (text) => {
  const normalized = text.trim();
  const lines = normalized.split(/[\n\r]+/).map(line => line.trim()).filter(Boolean);

  if (lines.length !== 2) {
    return null;
  }

  const [line1, line2] = lines;
  const digits1 = line1.replace(/\D/g, '');
  const digits2 = line2.replace(/\D/g, '');

  let reference = null;
  let amount = null;

  if (digits1.length >= 8 && digits2.length < 8) {
    reference = digits1;
    
    const normalizedAmount = normalizeAmount(line2);
    const parsedAmount = parseFloat(normalizedAmount);
    
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      amount = parsedAmount.toFixed(2);
    }
  } else if (digits2.length >= 8 && digits1.length < 8) {
    reference = digits2;
    
    const normalizedAmount = normalizeAmount(line1);
    const parsedAmount = parseFloat(normalizedAmount);
    
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      amount = parsedAmount.toFixed(2);
    }
  }

  return reference ? { reference, amount } : null;
};

/**
 * Validador de resultado final
 */
const validatePaymentData = (data) => {
  if (!data || !data.reference) {
    return null;
  }

  const { reference, amount, allowShortReference = false } = data;
  const minReferenceLength = allowShortReference ? 1 : 4;

  // Validar referencia: mínimo 4 dígitos para refs pegadas sin label
  // Las refs con label (parseWithLabels) ya aceptan cualquier longitud
  if (reference.length < minReferenceLength || reference.length > 20) {
    return null;
  }

  // Validar monto (opcional)
  if (amount && parseFloat(amount) <= 0) {
    return null;
  }

  return {
    reference,
    amount: amount || null,
  };
};

/**
 * Parser principal que ejecuta estrategias en orden
 * Retorna el primer resultado válido
 */
export const parsePaymentData = (text) => {
  if (!text || typeof text !== 'string') {
    return null;
  }

  // Estrategias ordenadas por prioridad
  // parseWithLabels va PRIMERO porque es el más confiable y acepta referencias cortas
  const strategies = [
    parseWithLabels,      // MÁS CONFIABLE - Con etiquetas (acepta referencias cortas legacy)
    parseSingleLine,      // Más simple - Solo para referencias >= 8 dígitos
    parseMultiLine,       // Formato libre
    parseTwoLines,        // Heurística
  ];

  // Ejecutar estrategias hasta encontrar resultado válido
  for (const strategy of strategies) {
    const result = strategy(text);
    if (result) {
      return validatePaymentData(result);
    }
  }

  return null;
};
