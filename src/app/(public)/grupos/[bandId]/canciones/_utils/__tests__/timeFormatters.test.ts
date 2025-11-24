import { formatTime, formatDuration, formatProgress } from '../timeFormatters';

describe('timeFormatters', () => {
    describe('formatTime', () => {
        it('formatea segundos a MM:SS correctamente', () => {
            expect(formatTime(0)).toBe('0:00');
            expect(formatTime(30)).toBe('0:30');
            expect(formatTime(60)).toBe('1:00');
            expect(formatTime(90)).toBe('1:30');
            expect(formatTime(125)).toBe('2:05');
            expect(formatTime(3661)).toBe('61:01');
        });

        it('agrega cero inicial a segundos menores a 10', () => {
            expect(formatTime(5)).toBe('0:05');
            expect(formatTime(65)).toBe('1:05');
        });
    });

    describe('formatDuration', () => {
        it('formatea duración restando 1 segundo', () => {
            expect(formatDuration(60)).toBe('0:59');
            expect(formatDuration(120)).toBe('1:59');
            expect(formatDuration(90)).toBe('1:29');
        });

        it('maneja correctamente segundos menores a 10', () => {
            expect(formatDuration(10)).toBe('0:09');
            expect(formatDuration(70)).toBe('1:09');
        });
    });

    describe('formatProgress', () => {
        it('formatea progreso con lógica especial de minutos', () => {
            expect(formatProgress(0)).toBe('0:00');
            expect(formatProgress(30)).toBe('0:30');
            expect(formatProgress(58)).toBe('0:58');
        });

        it('maneja el cambio de minuto correctamente', () => {
            expect(formatProgress(59)).toBe('0:59');
            expect(formatProgress(60)).toBe('1:00');
            expect(formatProgress(61)).toBe('1:01');
        });

        it('maneja múltiples minutos', () => {
            expect(formatProgress(120)).toBe('2:00');
            expect(formatProgress(125)).toBe('2:05');
            expect(formatProgress(185)).toBe('3:05');
        });
    });
});
