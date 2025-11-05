import { moneyFormat, formatNumber, formatDate } from '../dataFormat';

describe('dataFormat utils', () => {
  describe('moneyFormat', () => {
    it('should format number as Costa Rican currency', () => {
      const result = moneyFormat(1000);
      expect(result).toContain('1');
      expect(result).toContain('000');
    });

    it('should handle decimal values', () => {
      const result = moneyFormat(1500.5);
      expect(result).toContain('1');
      expect(result).toContain('500');
    });

    it('should handle zero', () => {
      const result = moneyFormat(0);
      expect(result).toBeDefined();
    });
  });

  describe('formatNumber', () => {
    it('should format number with 2 decimal places', () => {
      const result = formatNumber(1234.5);
      // El formato usa separador de miles y comas para decimales
      expect(result).toMatch(/1[\s.]234,50/);
      expect(result).toContain('234,50');
    });

    it('should format whole numbers with decimals', () => {
      const result = formatNumber(1000);
      expect(result).toMatch(/1[\s.]000,00/);
      expect(result).toContain('000,00');
    });
  });

  describe('formatDate', () => {
    it('should format date correctly in dd-mm-yyyy format', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      // El formato es dd-mm-yyyy
      expect(result).toMatch(/\d{2}-\d{2}-\d{4}/);
      expect(result).toContain('2024');
    });

    it('should handle string dates', () => {
      const result = formatDate('2024-12-25');
      expect(result).toMatch(/\d{2}-\d{2}-\d{4}/);
      expect(result).toContain('2024');
    });

    it('should include day name when showDay is true', () => {
      const result = formatDate('2024-01-15', true);
      // Debería incluir el nombre del día
      expect(result).toMatch(
        /(lunes|martes|miércoles|jueves|viernes|sábado|domingo)/,
      );
    });
  });
});
