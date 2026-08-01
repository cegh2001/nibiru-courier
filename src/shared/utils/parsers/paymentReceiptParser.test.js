import { describe, it, expect } from 'vitest';
import { parsePaymentReceipt, validateParsedData, formatParsedData } from './paymentReceiptParser';

describe('paymentReceiptParser', () => {
  describe('Pago Móvil - Banco Fondo Común', () => {
    const ocrText = `14:46 M
.,lll Q,
Comprobante de transacción
BancoFondoComún
Banco Universal
Realizaste una transacción de Bs. 9.000,00
Fecha:
Referencia:
Origen:
Destino:
Cédula de Identidad / RIF:
Banco:
Concepto:
08/11/2025 08:13 PM
0151
47944047
04141469152
v-30527206
Banco de Venezuela
pago
Tu Pago Móvil fue Exitoso
Compartir
salir
`;

    it('debe extraer correctamente la referencia (NO el teléfono)', () => {
      const result = parsePaymentReceipt(ocrText);
      
      expect(result.reference).toBe('47944047');
      expect(result.reference).not.toBe('04141469152'); // NO debe tomar el teléfono
    });

    it('debe extraer el monto correctamente', () => {
      const result = parsePaymentReceipt(ocrText);
      
      expect(result.amount).toBe('9000.00');
    });

    it('debe detectar el banco emisor (Fondo Común)', () => {
      const result = parsePaymentReceipt(ocrText);
      
      expect(result.bank).toContain('Fondo Común');
    });

    it('debe detectar tipo de operación como Pago Móvil', () => {
      const result = parsePaymentReceipt(ocrText);
      
      expect(result.operationType).toBeDefined();
      expect(result.operationType.name).toBe('Pago Móvil');
      expect(result.operationType.id).toBe(2);
    });

    it('debe extraer la fecha', () => {
      const result = parsePaymentReceipt(ocrText);
      
      expect(result.date).toContain('08/11/2025');
    });

    it('debe validar que los datos sean completos', () => {
      const result = parsePaymentReceipt(ocrText);
      const validation = validateParsedData(result);
      
      expect(validation.valid).toBe(true);
      expect(validation.missing).toHaveLength(0);
    });
  });

  describe('Transferencia - Banco de Venezuela', () => {
    const ocrText = `Transferencias a otros bancos
6.000,00 Bs
Fecha:
Operación:
Nombre:
Identificación:
Origen:
Destino:
Banco:
Concepto:
Estatus:
08/11/2025
3701170449131
Carlos tirolina
28305519
0151
6220
0151 - FONDO COMUN BANCO
UNIVERSAL
Carlos tirolina
En proceso
`;

    it('debe extraer correctamente la referencia', () => {
      const result = parsePaymentReceipt(ocrText);
      
      expect(result.reference).toBe('3701170449131');
    });

    it('debe extraer el monto correctamente', () => {
      const result = parsePaymentReceipt(ocrText);
      
      expect(result.amount).toBe('6000.00');
    });

    it('debe detectar tipo de operación como Transferencia', () => {
      const result = parsePaymentReceipt(ocrText);
      
      expect(result.operationType).toBeDefined();
      expect(result.operationType.name).toBe('Transferencia');
      expect(result.operationType.id).toBe(1);
    });

    it('debe extraer la fecha', () => {
      const result = parsePaymentReceipt(ocrText);
      
      expect(result.date).toContain('08/11/2025');
    });

    it('debe validar que los datos sean completos', () => {
      const result = parsePaymentReceipt(ocrText);
      const validation = validateParsedData(result);
      
      expect(validation.valid).toBe(true);
      expect(validation.missing).toHaveLength(0);
    });
  });

  describe('Casos edge - Filtrado de teléfonos', () => {
    it('debe filtrar teléfonos venezolanos (04XX) al buscar referencia', () => {
      const textWithPhone = `
        Pago Móvil
        Referencia: 04121234567
        Monto: 100.00
        Número: 87654321
      `;
      
      const result = parsePaymentReceipt(textWithPhone);
      
      // Debe tomar 87654321, NO el teléfono 04121234567
      expect(result.reference).toBe('87654321');
      expect(result.reference).not.toContain('0412');
    });

    it('debe filtrar cédulas cortas al buscar referencia', () => {
      const textWithCI = `
        Transferencia
        Cédula: 12345678
        Referencia: 9876543210
        Monto: 200.00
      `;
      
      const result = parsePaymentReceipt(textWithCI);
      
      // Debe tomar la referencia más larga
      expect(result.reference).toBe('9876543210');
    });
  });

  describe('validateParsedData', () => {
    it('debe validar datos completos', () => {
      const data = {
        reference: '123456789',
        amount: '100.00',
        date: '08/11/2025',
        bank: 'Banco Test',
        operationType: { name: 'Test', id: 1 }
      };
      
      const validation = validateParsedData(data);
      
      expect(validation.valid).toBe(true);
      expect(validation.missing).toHaveLength(0);
    });

    it('debe detectar falta de referencia', () => {
      const data = {
        reference: null,
        amount: '100.00',
      };
      
      const validation = validateParsedData(data);
      
      expect(validation.valid).toBe(false);
      expect(validation.missing).toContain('referencia');
    });

    it('debe detectar falta de monto', () => {
      const data = {
        reference: '123456789',
        amount: null,
      };
      
      const validation = validateParsedData(data);
      
      expect(validation.valid).toBe(false);
      expect(validation.missing).toContain('monto');
    });

    it('debe detectar múltiples campos faltantes', () => {
      const data = {
        reference: null,
        amount: null,
      };
      
      const validation = validateParsedData(data);
      
      expect(validation.valid).toBe(false);
      expect(validation.missing).toContain('referencia');
      expect(validation.missing).toContain('monto');
    });
  });

  describe('formatParsedData', () => {
    it('debe formatear datos completos correctamente', () => {
      const data = {
        reference: '123456789',
        amount: '100.00',
        date: '08/11/2025',
        bank: 'Banco Test',
        operationType: { name: 'Transferencia', id: 1 }
      };
      
      const formatted = formatParsedData(data);
      
      expect(formatted).toContain('Banco Test');
      expect(formatted).toContain('Transferencia');
      expect(formatted).toContain('123456789');
      expect(formatted).toContain('100.00');
      expect(formatted).toContain('08/11/2025');
    });

    it('debe indicar campos faltantes', () => {
      const data = {
        reference: null,
        amount: null,
        date: null,
        bank: null,
        operationType: null
      };
      
      const formatted = formatParsedData(data);
      
      expect(formatted).toContain('No detectada');
      expect(formatted).toContain('No detectado');
    });
  });
});
