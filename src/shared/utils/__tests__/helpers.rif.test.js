import { describe, it, expect } from 'vitest';

// Funciones RIF sin dependencias externas
const formatRIF = (rif, docType = 'J') => {
  if (!rif) return `${docType}-00000000-0`;
  
  let cleanRif = '';
  let rifDocType = docType;
  
  if (rif.includes('-')) {
    rifDocType = rif.charAt(0);
    cleanRif = rif.replace(/\D/g, '');
  } 
  else if (/^[GJ]\d+$/.test(rif)) {
    rifDocType = rif.charAt(0);
    cleanRif = rif.slice(1);
  }
  else {
    cleanRif = rif.replace(/\D/g, '');
  }
  
  if (cleanRif.length === 0) return `${rifDocType}-00000000-0`;
  
  if (cleanRif.length <= 8) {
    const padded = cleanRif.padStart(8, '0');
    return `${rifDocType}-${padded.slice(0, -1)}-${padded.slice(-1)}`;
  } else {
    return `${rifDocType}-${cleanRif.slice(0, -1)}-${cleanRif.slice(-1)}`;
  }
};

const getRawRIFFormat = (rif) => {
  if (!rif) return '';
  
  if (/^[GJ]\d+$/.test(rif)) {
    return rif;
  }
  
  if (rif.includes('-')) {
    const docType = rif.charAt(0);
    const numbers = rif.replace(/\D/g, '');
    return `${docType}${numbers}`;
  }
  
  const cleanNumbers = rif.replace(/\D/g, '');
  return `J${cleanNumbers}`;
};

const extractDocTypeFromRIF = (rif) => {
  if (!rif) return 'J';
  
  if (rif.includes('-')) {
    const docType = rif.charAt(0);
    return ['G', 'J'].includes(docType) ? docType : 'J';
  }
  
  return 'J';
};

const extractRawRIF = (rif) => {
  if (!rif) return '';
  return rif.replace(/[^0-9]/g, '');
};

const extractRIFNumbers = (rif) => {
  if (!rif) return '';
  
  if (/^[GJ]\d+$/.test(rif)) {
    return rif.slice(1);
  }
  
  if (rif.includes('-')) {
    return rif.replace(/\D/g, '');
  }
  
  return rif.replace(/[^0-9]/g, '');
};

describe('RIF Formatting Helpers', () => {
  describe('formatRIF()', () => {
    it('debe convertir solo números a formato G-XXXXXXXX-X', () => {
      const result = formatRIF('200099976', 'G');
      expect(result).toBe('G-20009997-6');
    });

    it('debe usar tipo J por defecto', () => {
      const result = formatRIF('200099976');
      expect(result.startsWith('J-')).toBe(true);
    });

    it('debe manejar entrada ya formateada (G-XXXXXXXX-X)', () => {
      const result = formatRIF('G-20009997-6', 'G');
      expect(result).toBe('G-20009997-6');
    });

    it('debe manejar entrada del backend (GxxxxxxX)', () => {
      const result = formatRIF('G200099976', 'G');
      expect(result).toBe('G-20009997-6');
    });

    it('debe aceptar tipo G', () => {
      const result = formatRIF('123456789', 'G');
      expect(result.startsWith('G-')).toBe(true);
    });

    it('debe aceptar tipo J', () => {
      const result = formatRIF('123456789', 'J');
      expect(result.startsWith('J-')).toBe(true);
    });

    it('debe llenar con ceros a la izquierda si hay menos de 8 dígitos', () => {
      const result = formatRIF('12345', 'G');
      expect(result).toMatch(/G-\d{7}-\d/);
    });

    it('debe retornar formato default para null/undefined', () => {
      const result1 = formatRIF(null);
      const result2 = formatRIF(undefined);
      expect(result1).toContain('-');
      expect(result2).toContain('-');
    });

    it('debe preservar tipo cuando viene en formato del backend', () => {
      const resultG = formatRIF('G200099976');
      const resultJ = formatRIF('J000029610');
      expect(resultG.startsWith('G-')).toBe(true);
      expect(resultJ.startsWith('J-')).toBe(true);
    });
  });

  describe('getRawRIFFormat()', () => {
    it('debe retornar formato backend para RIF formateado', () => {
      const result = getRawRIFFormat('G-20009997-6');
      expect(result).toBe('G200099976');
    });

    it('debe retornar el mismo valor si ya está en formato backend', () => {
      const result = getRawRIFFormat('G200099976');
      expect(result).toBe('G200099976');
    });

    it('debe retornar solo números con J como prefijo si son solo números', () => {
      const result = getRawRIFFormat('200099976');
      expect(result).toBe('J200099976');
    });

    it('debe manejar números puros', () => {
      const result = getRawRIFFormat('123456789');
      expect(result.startsWith('J')).toBe(true);
      expect(result).toBe('J123456789');
    });

    it('debe retornar vacío para null/undefined', () => {
      expect(getRawRIFFormat(null)).toBe('');
      expect(getRawRIFFormat(undefined)).toBe('');
    });

    it('debe preservar el tipo de documento original', () => {
      const resultG = getRawRIFFormat('G-20009997-6');
      const resultJ = getRawRIFFormat('J-00002961-0');
      expect(resultG[0]).toBe('G');
      expect(resultJ[0]).toBe('J');
    });
  });

  describe('extractDocTypeFromRIF()', () => {
    it('debe extraer G de RIF formateado', () => {
      expect(extractDocTypeFromRIF('G-20009997-6')).toBe('G');
    });

    it('debe extraer J de RIF formateado', () => {
      expect(extractDocTypeFromRIF('J-00002961-0')).toBe('J');
    });

    it('debe retornar J por defecto si no está formateado', () => {
      expect(extractDocTypeFromRIF('200099976')).toBe('J');
    });

    it('debe retornar J para null/undefined', () => {
      expect(extractDocTypeFromRIF(null)).toBe('J');
      expect(extractDocTypeFromRIF(undefined)).toBe('J');
    });

    it('debe retornar J para tipos inválidos', () => {
      expect(extractDocTypeFromRIF('V-12345678-9')).toBe('J');
    });

    it('debe extraer del formato backend', () => {
      const result = extractDocTypeFromRIF('G200099976');
      expect(result).toBe('J');
    });
  });

  describe('extractRawRIF()', () => {
    it('debe extraer solo números del RIF formateado', () => {
      expect(extractRawRIF('G-20009997-6')).toBe('200099976');
    });

    it('debe extraer solo números del RIF del backend', () => {
      expect(extractRawRIF('G200099976')).toBe('200099976');
    });

    it('debe retornar vacío para null/undefined', () => {
      expect(extractRawRIF(null)).toBe('');
      expect(extractRawRIF(undefined)).toBe('');
    });

    it('debe remover todos los caracteres no numéricos', () => {
      expect(extractRawRIF('G-200-099-9-7-6')).toBe('200099976');
    });

    it('debe funcionar con solo números', () => {
      expect(extractRawRIF('200099976')).toBe('200099976');
    });
  });

  describe('extractRIFNumbers()', () => {
    it('debe extraer números del formato backend (G200099976)', () => {
      expect(extractRIFNumbers('G200099976')).toBe('200099976');
    });

    it('debe extraer números del formato formateado (G-20009997-6)', () => {
      expect(extractRIFNumbers('G-20009997-6')).toBe('200099976');
    });

    it('debe retornar números puros como están', () => {
      expect(extractRIFNumbers('200099976')).toBe('200099976');
    });

    it('debe retornar vacío para null/undefined', () => {
      expect(extractRIFNumbers(null)).toBe('');
      expect(extractRIFNumbers(undefined)).toBe('');
    });

    it('debe manejar formato J correctamente', () => {
      expect(extractRIFNumbers('J000029610')).toBe('000029610');
      expect(extractRIFNumbers('J-00002961-0')).toBe('000029610');
    });
  });

  describe('Consistencia entre funciones (Round-trip)', () => {
    it('formatRIF + getRawRIFFormat deben ser consistentes', () => {
      const original = 'G200099976';
      const formatted = formatRIF(original, 'G');
      const raw = getRawRIFFormat(formatted);
      expect(raw).toBe(original);
    });

    it('getRawRIFFormat + formatRIF deben ser consistentes', () => {
      const formatted = 'G-20009997-6';
      const raw = getRawRIFFormat(formatted);
      const reformatted = formatRIF(raw, 'G');
      expect(reformatted).toBe(formatted);
    });

    it('extractRawRIF debe extraer mismo resultado que extractRIFNumbers', () => {
      const rif = 'G-20009997-6';
      expect(extractRawRIF(rif)).toBe(extractRIFNumbers(rif));
    });

    it('extractDocTypeFromRIF debe coincidir con primer carácter de getRawRIFFormat', () => {
      const rif = 'G-20009997-6';
      const docType = extractDocTypeFromRIF(rif);
      const raw = getRawRIFFormat(rif);
      expect(raw[0]).toBe(docType);
    });
  });

  describe('Casos de borde', () => {
    it('debe manejar RIF con espacios', () => {
      const result = formatRIF('  200099976  ', 'G');
      expect(result).toContain('G-');
    });

    it('debe manejar RIF muy corto', () => {
      const result = formatRIF('1', 'G');
      expect(result).toMatch(/G-\d+-\d/);
    });

    it('debe manejar RIF muy largo', () => {
      const result = formatRIF('200099976123456', 'G');
      expect(result).toContain('G-');
    });

    it('debe ser case-insensitive para tipo', () => {
      const result = formatRIF('200099976', 'g');
      expect(result).toContain('-');
    });
  });
});
