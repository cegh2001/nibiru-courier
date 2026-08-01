import { describe, it, expect } from 'vitest';
import { parsePaymentData } from './paymentParsers';

describe('paymentParsers', () => {
  describe('parsePaymentData - Referencias Legacy (cortas)', () => {
    it('debe parsear referencia corta con etiqueta', () => {
      const text = `Referencia: 2
Monto: $200.00 USD (Bs. 47292.00)
Método: Pago Móvil
Banco: Banesco Banco Universal
Cuenta: 01340468264681061879`;

      const result = parsePaymentData(text);
      
      expect(result).toBeTruthy();
      expect(result.reference).toBe('2');
      expect(result.amount).toBe('200.00');
    });

    it('debe parsear referencia de 1 dígito con etiqueta', () => {
      const text = 'Referencia: 5\nMonto: 150.00';
      
      const result = parsePaymentData(text);
      
      expect(result).toBeTruthy();
      expect(result.reference).toBe('5');
      expect(result.amount).toBe('150.00');
    });

    it('debe parsear referencia de 3 dígitos con etiqueta', () => {
      const text = 'Referencia: 123\nMonto: $75.50';
      
      const result = parsePaymentData(text);
      
      expect(result).toBeTruthy();
      expect(result.reference).toBe('123');
      expect(result.amount).toBe('75.50');
    });
  });

  describe('parsePaymentData - Referencias estándar', () => {
    it('debe parsear referencia de 8 dígitos sin etiqueta', () => {
      const text = '36521422';
      
      const result = parsePaymentData(text);
      
      expect(result).toBeTruthy();
      expect(result.reference).toBe('36521422');
      expect(result.amount).toBeNull();
    });

    it('debe parsear referencia larga con etiqueta y monto', () => {
      const text = `Referencia: 36521422
Monto: $1000.00 USD`;

      const result = parsePaymentData(text);
      
      expect(result).toBeTruthy();
      expect(result.reference).toBe('36521422');
      expect(result.amount).toBe('1000.00');
    });
  });

  describe('parsePaymentData - Casos especiales', () => {
    it('NO debe confundir monto con referencia si la referencia está etiquetada', () => {
      const text = `Referencia: 2
Monto: 47292.00`;

      const result = parsePaymentData(text);
      
      expect(result).toBeTruthy();
      expect(result.reference).toBe('2');
      expect(result.amount).toBe('47292.00'); // El monto NO debe tomarse como referencia
    });

    it('debe rechazar referencia corta SIN etiqueta', () => {
      const text = '2\n200.00';
      
      const result = parsePaymentData(text);
      
      // Sin etiqueta, no puede determinar qué es qué con referencias tan cortas
      expect(result).toBeNull();
    });

    it('debe parsear formato completo legacy', () => {
      const text = `Referencia: 2
Monto: $200.00 USD (Bs. 47292.00)
Método: Pago Móvil
Banco: Banesco Banco Universal
Cuenta: 01340468264681061879`;

      const result = parsePaymentData(text);
      
      expect(result).toBeTruthy();
      expect(result.reference).toBe('2');
      expect(result.amount).toBe('200.00');
    });
  });

  describe('parsePaymentData - Montos con formato europeo', () => {
    it('debe parsear monto con coma decimal', () => {
      const text = 'Referencia: 456\nMonto: 1234,56';
      
      const result = parsePaymentData(text);
      
      expect(result).toBeTruthy();
      expect(result.reference).toBe('456');
      expect(result.amount).toBe('1234.56');
    });

    it('debe parsear monto con punto de miles y coma decimal', () => {
      const text = 'Referencia: 789\nMonto: 4.909,12';
      
      const result = parsePaymentData(text);
      
      expect(result).toBeTruthy();
      expect(result.reference).toBe('789');
      expect(result.amount).toBe('4909.12');
    });
  });
});
