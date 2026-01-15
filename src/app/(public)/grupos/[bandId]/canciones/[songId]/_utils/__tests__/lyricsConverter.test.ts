import { convertLyricsToPlainText } from '../lyricsConverter';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

describe('lyricsConverter', () => {
  describe('convertLyricsToPlainText', () => {
    it('should return empty string for empty lyrics array', () => {
      const result = convertLyricsToPlainText([]);
      expect(result).toBe('');
    });

    it('should return empty string for null/undefined lyrics', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = convertLyricsToPlainText(null as any);
      expect(result).toBe('');
    });

    it('should convert simple lyrics without chords', () => {
      const lyrics: LyricsProps[] = [
        {
          id: 1,
          position: 1,
          startTime: 0,
          lyrics: 'Me has tomado en Tus Brazos',
          structure: { id: 2, title: 'verse' },
          chords: [],
        },
      ];

      const result = convertLyricsToPlainText(lyrics);
      expect(result).toBe('(verso)\nMe has tomado en Tus Brazos');
    });

    it('should convert lyrics with chords in correct positions', () => {
      const lyrics: LyricsProps[] = [
        {
          id: 1,
          position: 1,
          startTime: 0,
          lyrics: 'Me has tomado en Tus Brazos',
          structure: { id: 2, title: 'verse' },
          chords: [
            {
              id: 1,
              rootNote: 'Em',
              chordQuality: '',
              slashChord: '',
              position: 1,
            },
            {
              id: 2,
              rootNote: 'D',
              chordQuality: '',
              slashChord: '',
              position: 4,
            },
          ],
        },
      ];

      const result = convertLyricsToPlainText(lyrics);
      expect(result).toContain('(verso)');
      expect(result).toContain('Em');
      expect(result).toContain('D');
      expect(result).toContain('Me has tomado en Tus Brazos');
    });

    it('should handle chords with quality and slash chords', () => {
      const lyrics: LyricsProps[] = [
        {
          id: 1,
          position: 1,
          startTime: 0,
          lyrics: 'Asombroso amor',
          structure: { id: 4, title: 'chorus' },
          chords: [
            {
              id: 1,
              rootNote: 'C',
              chordQuality: 'm7',
              slashChord: 'G',
              position: 1,
            },
          ],
        },
      ];

      const result = convertLyricsToPlainText(lyrics);
      expect(result).toContain('Cm7/G');
    });

    it('should group multiple lyrics by structure', () => {
      const lyrics: LyricsProps[] = [
        {
          id: 1,
          position: 1,
          startTime: 0,
          lyrics: 'Primera línea',
          structure: { id: 2, title: 'verse' },
          chords: [],
        },
        {
          id: 2,
          position: 2,
          startTime: 0,
          lyrics: 'Segunda línea',
          structure: { id: 2, title: 'verse' },
          chords: [],
        },
      ];

      const result = convertLyricsToPlainText(lyrics);
      expect(result).toBe('(verso)\nPrimera línea\nSegunda línea');
    });

    it('should add spacing between different structures', () => {
      const lyrics: LyricsProps[] = [
        {
          id: 1,
          position: 1,
          startTime: 0,
          lyrics: 'Verso línea',
          structure: { id: 2, title: 'verse' },
          chords: [],
        },
        {
          id: 2,
          position: 2,
          startTime: 0,
          lyrics: 'Coro línea',
          structure: { id: 4, title: 'chorus' },
          chords: [],
        },
      ];

      const result = convertLyricsToPlainText(lyrics);
      expect(result).toContain('(verso)\nVerso línea');
      expect(result).toContain('\n\n');
      expect(result).toContain('(coro)\nCoro línea');
    });

    it('should handle multiple chords on the same line', () => {
      const lyrics: LyricsProps[] = [
        {
          id: 1,
          position: 1,
          startTime: 0,
          lyrics: 'Me has tomado en Tus Brazos fuertemente',
          structure: { id: 2, title: 'verse' },
          chords: [
            {
              id: 1,
              rootNote: 'Em',
              chordQuality: '',
              slashChord: '',
              position: 1,
            },
            {
              id: 2,
              rootNote: 'D',
              chordQuality: '',
              slashChord: '',
              position: 3,
            },
            {
              id: 3,
              rootNote: 'G',
              chordQuality: '',
              slashChord: '',
              position: 5,
            },
          ],
        },
      ];

      const result = convertLyricsToPlainText(lyrics);
      const lines = result.split('\n');
      expect(lines).toHaveLength(3); // structure, chords, lyrics
      expect(lines[1]).toContain('Em');
      expect(lines[1]).toContain('D');
      expect(lines[1]).toContain('G');
    });

    it('should handle structures with lowercase conversion', () => {
      const lyrics: LyricsProps[] = [
        {
          id: 1,
          position: 1,
          startTime: 0,
          lyrics: 'Test line',
          structure: { id: 1, title: 'INTRO' },
          chords: [],
        },
      ];

      const result = convertLyricsToPlainText(lyrics);
      expect(result).toContain('(intro)');
      expect(result).not.toContain('(INTRO)');
    });

    it('should correctly position chords based on 5-column system', () => {
      const lyrics: LyricsProps[] = [
        {
          id: 1,
          position: 1,
          startTime: 0,
          lyrics: '12345678901234567890', // 20 characters
          structure: { id: 2, title: 'verse' },
          chords: [
            {
              id: 1,
              rootNote: 'A',
              chordQuality: '',
              slashChord: '',
              position: 1, // Should be at index 0
            },
            {
              id: 2,
              rootNote: 'B',
              chordQuality: '',
              slashChord: '',
              position: 3, // Should be at index 8 (20/5 * 2)
            },
          ],
        },
      ];

      const result = convertLyricsToPlainText(lyrics);
      const lines = result.split('\n');
      const chordLine = lines[1];
      expect(chordLine[0]).toBe('A');
      // Position 3 should be at columnWidth * 2 = 4 * 2 = 8
      expect(chordLine[8]).toBe('B');
    });

    it('should prevent chords from overlapping/touching', () => {
      const lyrics: LyricsProps[] = [
        {
          id: 1,
          position: 1,
          startTime: 0,
          lyrics: 'Y mi enfermedad',
          structure: { id: 2, title: 'verse' },
          chords: [
            {
              id: 1,
              rootNote: 'F#',
              chordQuality: 'm',
              slashChord: '',
              position: 1, // Start
            },
            {
              id: 2,
              rootNote: 'E',
              chordQuality: '',
              slashChord: '',
              position: 2, // Very close
            },
          ],
        },
      ];

      const result = convertLyricsToPlainText(lyrics);
      const lines = result.split('\n');
      const chordLine = lines[1];

      // Should contain "F#m E" with at least one space
      expect(chordLine).toMatch(/F#m\s+E/);
      expect(chordLine).not.toContain('F#mE');
    });
  });
});
