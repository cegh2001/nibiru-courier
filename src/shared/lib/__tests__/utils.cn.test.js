import { describe, it, expect } from 'vitest';
import { cn } from '../utils';

describe('cn() - Class Name Merger', () => {
  describe('Casos básicos', () => {
    it('debe combinar clases simples', () => {
      const result = cn('px-4', 'py-2');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
    });

    it('debe eliminar espacios duplicados', () => {
      const result = cn('px-4  py-2   mb-1');
      const trimmed = result.trim();
      // No debe haber espacios múltiples consecutivos
      expect(/\s{2,}/.test(trimmed)).toBe(false);
    });

    it('debe retornar string vacío si no hay entradas', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('debe retornar string vacío si todas son falsas', () => {
      const result = cn(null, undefined, false, '');
      expect(result).toBe('');
    });

    it('debe ignorar valores null y undefined', () => {
      const result = cn('px-4', null, 'py-2', undefined);
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).not.toContain('null');
      expect(result).not.toContain('undefined');
    });
  });

  describe('Fusión de conflictos Tailwind (tw-merge)', () => {
    it('debe resolver conflictos de padding horizontal', () => {
      const result = cn('px-4', 'px-8');
      // px-8 debe prevalecer (último valor)
      expect(result).toContain('px-8');
      // px-4 debe ser eliminado por conflicto
      expect(result).not.toContain('px-4');
    });

    it('debe resolver conflictos de color de texto', () => {
      const result = cn('text-red-500', 'text-blue-500');
      expect(result).toContain('text-blue-500');
      expect(result).not.toContain('text-red-500');
    });

    it('debe resolver conflictos de display', () => {
      const result = cn('flex', 'block');
      expect(result).toContain('block');
      expect(result).not.toContain('flex');
    });

    it('debe mantener clases que no entran en conflicto', () => {
      const result = cn('px-4', 'text-white', 'rounded');
      expect(result).toContain('px-4');
      expect(result).toContain('text-white');
      expect(result).toContain('rounded');
    });
  });

  describe('Manejo de arrays', () => {
    it('debe manejar arrays de clases', () => {
      const result = cn(['px-4', 'py-2']);
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
    });

    it('debe aplanar arrays anidados', () => {
      const result = cn(['px-4', ['py-2', 'rounded']]);
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('rounded');
    });

    it('debe ignorar arrays vacíos', () => {
      const result = cn('px-4', [], 'py-2');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
    });
  });

  describe('Objetos condicionales (como en clsx)', () => {
    it('debe incluir clase si valor es true', () => {
      const result = cn({ 'px-4': true, 'py-2': false });
      expect(result).toContain('px-4');
      expect(result).not.toContain('py-2');
    });

    it('debe manejar objetos con valores booleanos', () => {
      const isActive = true;
      const isDisabled = false;
      const result = cn({
        'bg-blue-500': isActive,
        'bg-gray-300': isDisabled,
      });
      expect(result).toContain('bg-blue-500');
      expect(result).not.toContain('bg-gray-300');
    });

    it('debe ignorar objeto vacío', () => {
      const result = cn('px-4', {}, 'py-2');
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
    });
  });

  describe('Casos de uso reales', () => {
    it('debe funcionar en un componente Button típico', () => {
      const isDisabled = false;
      const variant = 'primary';
      const result = cn(
        'px-4 py-2 rounded font-medium',
        variant === 'primary' && 'bg-blue-500 text-white',
        variant === 'secondary' && 'bg-gray-200 text-black',
        isDisabled && 'opacity-50 cursor-not-allowed'
      );
      expect(result).toContain('px-4');
      expect(result).toContain('py-2');
      expect(result).toContain('rounded');
      expect(result).toContain('bg-blue-500');
      expect(result).not.toContain('opacity-50');
    });

    it('debe funcionar en componente Input con estados', () => {
      const hasError = true;
      const isFocused = false;
      const result = cn(
        'w-full px-3 py-2 border rounded',
        hasError && 'border-red-500 bg-red-50',
        !hasError && 'border-gray-300 bg-white',
        isFocused && 'ring-2 ring-blue-500'
      );
      expect(result).toContain('border-red-500');
      expect(result).toContain('bg-red-50');
      expect(result).not.toContain('ring-2');
    });

    it('debe resolver conflictos en tema de dark mode', () => {
      const isDark = true;
      const result = cn(
        'bg-white text-black',
        isDark && 'dark:bg-gray-900 dark:text-white'
      );
      expect(result).toContain('dark:bg-gray-900');
      expect(result).toContain('dark:text-white');
    });
  });

  describe('Performance y estabilidad', () => {
    it('debe retornar el mismo resultado para las mismas entradas', () => {
      const input = ['px-4', 'py-2', 'rounded'];
      const result1 = cn(...input);
      const result2 = cn(...input);
      expect(result1).toBe(result2);
    });

    it('debe manejar muchas clases sin problema', () => {
      const classes = Array(100)
        .fill(0)
        .map((_, i) => `class-${i}`);
      const result = cn(...classes);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('debe ser case-sensitive', () => {
      const result1 = cn('Px-4');
      const result2 = cn('px-4');
      // Tailwind es case-sensitive, px-4 es válido, Px-4 no
      expect(result1).not.toBe(result2);
    });
  });

  describe('Integración con Tailwind utilities', () => {
    it('debe preservar prefijos de variantes (hover:, focus:, etc)', () => {
      const result = cn('hover:bg-blue-600', 'focus:ring-2');
      expect(result).toContain('hover:bg-blue-600');
      expect(result).toContain('focus:ring-2');
    });

    it('debe preservar prefijos de responsive (sm:, md:, lg:, etc)', () => {
      const result = cn('md:px-8', 'lg:py-4');
      expect(result).toContain('md:px-8');
      expect(result).toContain('lg:py-4');
    });

    it('debe resolver conflictos incluso con prefijos', () => {
      const result = cn('text-red-500', 'md:text-blue-500');
      // Ambos deben estar presentes (contextos diferentes)
      expect(result).toContain('text-red-500');
      expect(result).toContain('md:text-blue-500');
    });

    it('debe preservar clases arbitrarias [...]', () => {
      const result = cn('flex', '[&>*]:rounded');
      expect(result).toContain('flex');
      expect(result).toContain('[&>*]:rounded');
    });
  });
});
