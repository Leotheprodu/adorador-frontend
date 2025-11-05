import {
  moneyFormat,
  formatNumber,
  formatDate,
  formatTime,
  convertDateForInput,
  formatTimeLeft,
} from '../dataFormat';

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

    it('should add leading zeros for single digit days', () => {
      const date = new Date(2024, 5, 5); // June 5, 2024
      const result = formatDate(date);
      expect(result).toContain('05-06-2024');
    });

    it('should handle end of year date', () => {
      const date = new Date(2024, 11, 31); // December 31, 2024
      const result = formatDate(date);
      expect(result).toContain('31-12-2024');
    });
  });

  describe('formatTime', () => {
    describe('12-hour format', () => {
      it('should format morning time with AM', () => {
        const date = new Date(2024, 0, 1, 9, 30); // 9:30 AM
        const result = formatTime(date, 12);
        expect(result).toBe('09:30 AM');
      });

      it('should format afternoon time with PM', () => {
        const date = new Date(2024, 0, 1, 15, 45); // 3:45 PM
        const result = formatTime(date, 12);
        expect(result).toBe('03:45 PM');
      });

      it('should format midnight as 12:00 AM', () => {
        const date = new Date(2024, 0, 1, 0, 0); // Midnight
        const result = formatTime(date, 12);
        expect(result).toBe('12:00 AM');
      });

      it('should format noon as 12:00 PM', () => {
        const date = new Date(2024, 0, 1, 12, 0); // Noon
        const result = formatTime(date, 12);
        expect(result).toBe('12:00 PM');
      });

      it('should default to 12-hour format', () => {
        const date = new Date(2024, 0, 1, 14, 30);
        const result = formatTime(date);
        expect(result).toBe('02:30 PM');
      });
    });

    describe('24-hour format', () => {
      it('should format morning time', () => {
        const date = new Date(2024, 0, 1, 9, 30);
        const result = formatTime(date, 24);
        expect(result).toBe('09:30');
      });

      it('should format afternoon time', () => {
        const date = new Date(2024, 0, 1, 15, 45);
        const result = formatTime(date, 24);
        expect(result).toBe('15:45');
      });

      it('should format midnight', () => {
        const date = new Date(2024, 0, 1, 0, 0);
        const result = formatTime(date, 24);
        expect(result).toBe('00:00');
      });

      it('should handle end of day', () => {
        const date = new Date(2024, 0, 1, 23, 59);
        const result = formatTime(date, 24);
        expect(result).toBe('23:59');
      });
    });
  });

  describe('convertDateForInput', () => {
    it('should convert date to yyyy-mm-dd format', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      const result = convertDateForInput(date);
      expect(result).toBe('2024-01-15');
    });

    it('should add leading zeros to month', () => {
      const date = new Date(2024, 2, 20); // March 20, 2024
      const result = convertDateForInput(date);
      expect(result).toBe('2024-03-20');
    });

    it('should add leading zeros to day', () => {
      const date = new Date(2024, 5, 5); // June 5, 2024
      const result = convertDateForInput(date);
      expect(result).toBe('2024-06-05');
    });

    it('should handle end of year', () => {
      const date = new Date(2024, 11, 31); // December 31, 2024
      const result = convertDateForInput(date);
      expect(result).toBe('2024-12-31');
    });
  });

  describe('formatTimeLeft', () => {
    it('should format days, hours, minutes, and seconds', () => {
      const milliseconds =
        2 * 24 * 60 * 60 * 1000 + // 2 days
        3 * 60 * 60 * 1000 + // 3 hours
        45 * 60 * 1000 + // 45 minutes
        30 * 1000; // 30 seconds
      const result = formatTimeLeft(milliseconds);
      expect(result).toBe('2d 3h 45m 30s');
    });

    it('should handle only seconds', () => {
      const milliseconds = 45 * 1000; // 45 seconds
      const result = formatTimeLeft(milliseconds);
      expect(result).toBe('0d 0h 0m 45s');
    });

    it('should handle only hours', () => {
      const milliseconds = 5 * 60 * 60 * 1000; // 5 hours
      const result = formatTimeLeft(milliseconds);
      expect(result).toBe('0d 5h 0m 0s');
    });

    it('should handle zero milliseconds', () => {
      const result = formatTimeLeft(0);
      expect(result).toBe('0d 0h 0m 0s');
    });

    it('should handle exactly one day', () => {
      const milliseconds = 24 * 60 * 60 * 1000; // 1 day
      const result = formatTimeLeft(milliseconds);
      expect(result).toBe('1d 0h 0m 0s');
    });

    it('should handle large time periods', () => {
      const milliseconds = 365 * 24 * 60 * 60 * 1000; // ~1 year
      const result = formatTimeLeft(milliseconds);
      expect(result).toBe('365d 0h 0m 0s');
    });

    it('should floor partial seconds', () => {
      const milliseconds = 1500; // 1.5 seconds
      const result = formatTimeLeft(milliseconds);
      expect(result).toBe('0d 0h 0m 1s');
    });
  });
});
