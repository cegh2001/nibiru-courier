/**
 * Parser especializado para comprobantes de pago venezolanos
 * Extrae: referencia, monto, fecha, banco, tipo de operación
 */

/**
 * Parsea el texto OCR de un comprobante y extrae los datos relevantes
 * 
 * @param {string} ocrText - Texto extraído por OCR
 * @returns {Object} - Datos parseados: { reference, amount, date, bank, operationType }
 */
export const parsePaymentReceipt = (ocrText) => {
  if (!ocrText || typeof ocrText !== 'string') {
    return null;
  }

  const normalizedText = ocrText.toUpperCase();
  const lines = ocrText.split(/[\r\n]+/).map(line => line.trim()).filter(Boolean);

  return {
    reference: extractReference(normalizedText, lines),
    amount: extractAmount(normalizedText, lines),
    date: extractDate(normalizedText, lines),
    bank: extractBank(normalizedText, lines),
    operationType: extractOperationType(normalizedText),
  };
};

/**
 * Extrae el número de referencia/operación
 * Patrones: "Referencia:", "Operación:", "Ref:", números de 8-20 dígitos
 * 
 * IMPORTANTE: Evita confundir teléfonos (04XX) con referencias
 */
const extractReference = (text, lines) => {
  // Patrones comunes en comprobantes venezolanos
  const patterns = [
    /(?:REFERENCIA|REFERENCE|REF|OPERACI[OÓ]N|OPERATION)[:\s]*([0-9]{8,20})/i,
    /(?:N[UÚ]MERO|NUMBER|NRO)[:\s]*([0-9]{8,20})/i,
    /(?:C[OÓ]DIGO|CODE)[:\s]*([0-9]{8,20})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const ref = match[1].replace(/\D/g, ''); // Limpiar no-dígitos
      // Filtrar números de teléfono (04XX XXXXXXX)
      if (!ref.startsWith('04')) {
        return ref;
      }
    }
  }

  // CASO ESPECIAL PAGO MÓVIL: Buscar referencia en líneas después de "Referencia:"
  // Ejemplo Fondo Común: "Referencia: 0151" en una línea, "47944047" en la siguiente
  const refIndex = lines.findIndex(line => /REFERENCIA/i.test(line));
  if (refIndex !== -1 && refIndex + 1 < lines.length) {
    // Revisar las siguientes 2-3 líneas buscando un número de 8-13 dígitos
    for (let i = refIndex + 1; i <= Math.min(refIndex + 3, lines.length - 1); i++) {
      const lineNumber = lines[i].match(/\b(\d{8,13})\b/);
      if (lineNumber && !lineNumber[1].startsWith('04')) {
        return lineNumber[1];
      }
    }
  }

  // Buscar secuencias largas de números (probable referencia)
  // FILTRAR: teléfonos (04XX), cédulas muy cortas
  const numberSequences = text.match(/\b\d{8,20}\b/g);
  if (numberSequences && numberSequences.length > 0) {
    // Filtrar teléfonos y cédulas
    const validRefs = numberSequences.filter(num => {
      // Excluir teléfonos venezolanos (04XX XXXXXXX)
      if (num.startsWith('04') && num.length === 11) return false;
      // Excluir cédulas (7-8 dígitos comenzando con 1-3)
      if (num.length <= 8 && /^[123]/.test(num)) return false;
      return true;
    });

    if (validRefs.length > 0) {
      // Retornar la más larga (suele ser la referencia)
      return validRefs.sort((a, b) => b.length - a.length)[0];
    }
  }

  return null;
};

/**
 * Extrae el monto de la transacción
 * Patrones: "Bs 1.234,56", "1234.56", "Bs. 1.234,56"
 */
const extractAmount = (text, lines) => {
  // Patrones para montos en bolívares
  const patterns = [
    /BS[\s.]*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2}))/i,
    /MONTO[\s:]*BS[\s.]*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2}))/i,
    /TOTAL[\s:]*BS[\s.]*([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2}))/i,
    /([0-9]{1,3}(?:[.,][0-9]{3})*(?:[.,][0-9]{2}))\s*BS/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      // Normalizar formato: remover puntos de miles, cambiar coma por punto
      let amount = match[1]
        .replace(/\./g, '') // Quitar separadores de miles
        .replace(/,/g, '.'); // Cambiar coma decimal por punto
      
      const parsed = parseFloat(amount);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed.toFixed(2);
      }
    }
  }

  // Buscar cualquier número con formato de moneda
  const amountMatch = text.match(/\b(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2}))\b/);
  if (amountMatch) {
    let amount = amountMatch[1]
      .replace(/\./g, '')
      .replace(/,/g, '.');
    
    const parsed = parseFloat(amount);
    if (!isNaN(parsed) && parsed > 0 && parsed < 999999999) {
      return parsed.toFixed(2);
    }
  }

  return null;
};

/**
 * Extrae la fecha de la transacción
 * Patrones: "08/11/2025", "08-11-2025", "08.11.2025"
 */
const extractDate = (text, lines) => {
  // Patrones de fecha DD/MM/YYYY o DD-MM-YYYY
  const datePatterns = [
    /FECHA[\s:]*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
    /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})/,
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Extrae el nombre del banco EMISOR (origen de los fondos)
 * Detecta bancos comunes de Venezuela
 * 
 * Estrategia:
 * 1. Para Pago Móvil: el banco emisor está en el encabezado (primeras líneas)
 * 2. Para Transferencias: buscar código de banco en "Origen:"
 * 3. Ignorar banco que aparece después de "Destino:" o "Banco:" (es el receptor)
 */
const extractBank = (text, lines) => {
  const banks = [
    { pattern: /BANCO\s+DE\s+VENEZUELA/i, name: 'Banco de Venezuela', code: '0102' },
    { pattern: /BDV/i, name: 'Banco de Venezuela', code: '0102' },
    { pattern: /FONDO\s+COM[UÚ]N/i, name: 'Banco Fondo Común', code: '0151' },
    { pattern: /BANCOFONDOMÚN/i, name: 'Banco Fondo Común', code: '0151' },
    { pattern: /BANCOFONDOCOM[UÚ]N/i, name: 'Banco Fondo Común', code: '0151' },
    { pattern: /BFC/i, name: 'Banco Fondo Común', code: '0151' },
    { pattern: /BANESCO/i, name: 'Banesco', code: '0134' },
    { pattern: /MERCANTIL/i, name: 'Banco Mercantil', code: '0105' },
    { pattern: /PROVINCIAL/i, name: 'BBVA Provincial', code: '0108' },
    { pattern: /VENEZOLANO\s+DE\s+CR[EÉ]DITO/i, name: 'Banco Venezolano de Crédito', code: '0104' },
    { pattern: /BNC/i, name: 'Banco Nacional de Crédito', code: '0191' },
    { pattern: /EXTERIOR/i, name: 'Banco Exterior', code: '0115' },
    { pattern: /BANPLUS/i, name: 'Banplus', code: '0174' },
    { pattern: /BANCAMIGA/i, name: 'Bancamiga', code: '0172' },
    { pattern: /MI\s+BANCO/i, name: 'Mi Banco', code: '0169' },
    { pattern: /ACTIVO/i, name: 'Banco Activo', code: '0171' },
    { pattern: /BANCARIBE/i, name: 'Bancaribe', code: '0114' },
    { pattern: /BOD/i, name: 'BOD', code: '0116' },
    { pattern: /SOFITASA/i, name: 'Banco Sofitasa', code: '0137' },
    { pattern: /PLAZA/i, name: 'Banco Plaza', code: '0138' },
    { pattern: /BICENTENARIO/i, name: 'Banco Bicentenario', code: '0175' },
  ];

  // Estrategia 1: Buscar código de banco en el origen (0102, 0151, etc.)
  // Ejemplo: "Origen: 0102****4401" o "Origen: 0151************6220"
  const origenMatch = text.match(/ORIGEN[:\s]*([0-9]{4})/i);
  if (origenMatch) {
    const code = origenMatch[1];
    const bankByCode = banks.find(b => b.code === code);
    if (bankByCode) {
      return bankByCode.name;
    }
  }

  // Estrategia 2: Para PAGO MÓVIL, buscar en las primeras 5 líneas
  // El banco emisor aparece al inicio del comprobante
  const isPagoMovil = /PAGO\s+M[OÓ]VIL/i.test(text);
  
  if (isPagoMovil && lines.length >= 3) {
    // Buscar en las primeras 5 líneas (antes de "Fecha:" o "Referencia:")
    const firstLines = lines.slice(0, 5).join(' ').toUpperCase();
    
    for (const bank of banks) {
      if (bank.pattern.test(firstLines)) {
        return bank.name;
      }
    }
  }

  // Estrategia 3: Buscar nombre del banco al INICIO del texto (primeros 300 caracteres)
  // Pero NO si está después de "Destino:" o campo "Banco:"
  const header = text.substring(0, 300);
  
  for (const bank of banks) {
    if (bank.pattern.test(header)) {
      // Verificar el contexto completo donde aparece
      const bankNameMatch = text.match(bank.pattern);
      if (bankNameMatch) {
        const matchIndex = text.indexOf(bankNameMatch[0]);
        const beforeMatch = text.substring(Math.max(0, matchIndex - 50), matchIndex);
        
        // Si está precedido por "Banco:" o "Destino:", es el banco receptor, no el emisor
        if (/(?:BANCO|DESTINO)[:\s]*$/i.test(beforeMatch)) {
          continue; // Saltar este banco
        }
        
        return bank.name;
      }
    }
  }

  // Estrategia 4: Buscar palabra "BANCO" seguida de nombre (genérico)
  const genericBankMatch = header.match(/BANCO\s+([A-Z\s]{3,30})/i);
  if (genericBankMatch) {
    const matchIndex = text.indexOf(genericBankMatch[0]);
    const beforeMatch = text.substring(Math.max(0, matchIndex - 50), matchIndex);
    
    // Validar que NO esté después de "Destino:"
    if (!/DESTINO[:\s]*$/i.test(beforeMatch)) {
      return `Banco ${genericBankMatch[1].trim()}`;
    }
  }

  return null;
};

/**
 * Extrae el tipo de operación (Pago Móvil, Transferencia, etc.)
 */
const extractOperationType = (text) => {
  const operations = [
    { pattern: /PAGO\s+M[OÓ]VIL/i, type: 'Pago Móvil', typeId: 2 },
    { pattern: /P2P/i, type: 'Pago Móvil', typeId: 2 },
    { pattern: /TRANSFERENCIA/i, type: 'Transferencia', typeId: 1 },
    { pattern: /TRANSFER/i, type: 'Transferencia', typeId: 1 },
  ];

  for (const op of operations) {
    if (op.pattern.test(text)) {
      return {
        name: op.type,
        id: op.typeId,
      };
    }
  }

  return null;
};

/**
 * Valida que los datos extraídos sean suficientes para crear un pago
 * 
 * @param {Object} parsedData - Datos parseados
 * @returns {Object} - { valid: boolean, missing: string[] }
 */
export const validateParsedData = (parsedData) => {
  const missing = [];

  if (!parsedData.reference) {
    missing.push('referencia');
  }

  if (!parsedData.amount) {
    missing.push('monto');
  }

  return {
    valid: missing.length === 0,
    missing,
  };
};

/**
 * Formatea los datos parseados para debugging
 * 
 * @param {Object} parsedData - Datos parseados
 * @returns {string} - Representación legible
 */
export const formatParsedData = (parsedData) => {
  return `
📄 Datos extraídos del comprobante:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${parsedData.bank ? `🏦 Banco: ${parsedData.bank}` : ''}
${parsedData.operationType ? `💳 Tipo: ${parsedData.operationType.name}` : ''}
${parsedData.reference ? `🔢 Referencia: ${parsedData.reference}` : '❌ Referencia: No detectada'}
${parsedData.amount ? `💰 Monto: Bs ${parsedData.amount}` : '❌ Monto: No detectado'}
${parsedData.date ? `📅 Fecha: ${parsedData.date}` : ''}
  `.trim();
};
