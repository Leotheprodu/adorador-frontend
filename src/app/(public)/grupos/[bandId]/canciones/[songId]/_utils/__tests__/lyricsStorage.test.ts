import {
  saveTempLyrics,
  getTempLyrics,
  deleteTempLyrics,
  getAllTempLyrics,
  hasTempLyrics,
  clearAllTempLyrics,
} from '../lyricsStorage';

describe('lyricsStorage', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};

    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
      key: (index: number) => {
        const keys = Object.keys(store);
        return keys[index] || null;
      },
      get length() {
        return Object.keys(store).length;
      },
    };
  })();

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('saveTempLyrics', () => {
    it('should save lyrics to localStorage', () => {
      saveTempLyrics('1', '100', 'Test lyrics', 'Test Song');

      const stored = localStorage.getItem('adorador_temp_lyrics_1_100');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored!);
      expect(parsed.bandId).toBe('1');
      expect(parsed.songId).toBe('100');
      expect(parsed.text).toBe('Test lyrics');
      expect(parsed.songTitle).toBe('Test Song');
      expect(parsed.timestamp).toBeDefined();
    });

    it('should save lyrics without song title', () => {
      saveTempLyrics('2', '200', 'Another lyrics');

      const stored = localStorage.getItem('adorador_temp_lyrics_2_200');
      const parsed = JSON.parse(stored!);
      expect(parsed.songTitle).toBeUndefined();
    });

    it('should handle errors gracefully', () => {
      // Mock setItem to throw error
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = jest.fn(() => {
        throw new Error('Storage full');
      });

      // Should not throw
      expect(() => {
        saveTempLyrics('1', '100', 'Test');
      }).not.toThrow();

      localStorage.setItem = originalSetItem;
    });
  });

  describe('getTempLyrics', () => {
    it('should retrieve saved lyrics', () => {
      saveTempLyrics('1', '100', 'Test lyrics', 'Test Song');

      const retrieved = getTempLyrics('1', '100');
      expect(retrieved).toBeTruthy();
      expect(retrieved?.text).toBe('Test lyrics');
      expect(retrieved?.songTitle).toBe('Test Song');
    });

    it('should return null for non-existent lyrics', () => {
      const retrieved = getTempLyrics('999', '999');
      expect(retrieved).toBeNull();
    });

    it('should handle errors gracefully', () => {
      // Mock getItem to throw error
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      const result = getTempLyrics('1', '100');
      expect(result).toBeNull();

      localStorage.getItem = originalGetItem;
    });

    it('should handle invalid JSON', () => {
      localStorage.setItem('adorador_temp_lyrics_1_100', 'invalid json');

      const result = getTempLyrics('1', '100');
      expect(result).toBeNull();
    });
  });

  describe('deleteTempLyrics', () => {
    it('should delete saved lyrics', () => {
      saveTempLyrics('1', '100', 'Test lyrics');
      expect(getTempLyrics('1', '100')).toBeTruthy();

      deleteTempLyrics('1', '100');
      expect(getTempLyrics('1', '100')).toBeNull();
    });

    it('should handle errors gracefully', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        deleteTempLyrics('1', '100');
      }).not.toThrow();

      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('getAllTempLyrics', () => {
    it('should return all saved lyrics', () => {
      saveTempLyrics('1', '100', 'Lyrics 1', 'Song 1');
      saveTempLyrics('1', '101', 'Lyrics 2', 'Song 2');
      saveTempLyrics('2', '200', 'Lyrics 3', 'Song 3');

      const all = getAllTempLyrics();
      expect(all).toHaveLength(3);
      expect(all.map((l) => l.songId)).toContain('100');
      expect(all.map((l) => l.songId)).toContain('101');
      expect(all.map((l) => l.songId)).toContain('200');
    });

    it('should return empty array when no lyrics exist', () => {
      const all = getAllTempLyrics();
      expect(all).toEqual([]);
    });

    it('should ignore non-lyrics localStorage items', () => {
      saveTempLyrics('1', '100', 'Lyrics 1');
      localStorage.setItem('other_key', 'other value');
      localStorage.setItem('another_key', 'another value');

      const all = getAllTempLyrics();
      expect(all).toHaveLength(1);
    });

    it('should handle errors gracefully', () => {
      saveTempLyrics('1', '100', 'Lyrics 1');

      const originalKey = localStorage.key;
      localStorage.key = jest.fn(() => {
        throw new Error('Storage error');
      });

      const result = getAllTempLyrics();
      expect(result).toEqual([]);

      localStorage.key = originalKey;
    });
  });

  describe('hasTempLyrics', () => {
    it('should return true when lyrics exist', () => {
      saveTempLyrics('1', '100', 'Test lyrics');
      expect(hasTempLyrics('1', '100')).toBe(true);
    });

    it('should return false when lyrics do not exist', () => {
      expect(hasTempLyrics('999', '999')).toBe(false);
    });
  });

  describe('clearAllTempLyrics', () => {
    it('should clear all lyrics from localStorage', () => {
      saveTempLyrics('1', '100', 'Lyrics 1');
      saveTempLyrics('1', '101', 'Lyrics 2');
      saveTempLyrics('2', '200', 'Lyrics 3');

      expect(getAllTempLyrics()).toHaveLength(3);

      clearAllTempLyrics();

      expect(getAllTempLyrics()).toHaveLength(0);
      expect(hasTempLyrics('1', '100')).toBe(false);
      expect(hasTempLyrics('1', '101')).toBe(false);
      expect(hasTempLyrics('2', '200')).toBe(false);
    });

    it('should not affect other localStorage items', () => {
      saveTempLyrics('1', '100', 'Lyrics 1');
      localStorage.setItem('important_data', 'keep this');

      clearAllTempLyrics();

      expect(localStorage.getItem('important_data')).toBe('keep this');
      expect(getAllTempLyrics()).toHaveLength(0);
    });

    it('should handle errors gracefully', () => {
      const originalRemoveItem = localStorage.removeItem;
      localStorage.removeItem = jest.fn(() => {
        throw new Error('Storage error');
      });

      expect(() => {
        clearAllTempLyrics();
      }).not.toThrow();

      localStorage.removeItem = originalRemoveItem;
    });
  });

  describe('integration scenarios', () => {
    it('should handle full workflow: save, retrieve, delete', () => {
      // Save
      saveTempLyrics('1', '100', 'Test lyrics', 'Test Song');
      expect(hasTempLyrics('1', '100')).toBe(true);

      // Retrieve
      const lyrics = getTempLyrics('1', '100');
      expect(lyrics?.text).toBe('Test lyrics');

      // Delete
      deleteTempLyrics('1', '100');
      expect(hasTempLyrics('1', '100')).toBe(false);
    });

    it('should handle multiple songs from different bands', () => {
      saveTempLyrics('1', '100', 'Band 1 Song 1');
      saveTempLyrics('1', '101', 'Band 1 Song 2');
      saveTempLyrics('2', '200', 'Band 2 Song 1');

      expect(getAllTempLyrics()).toHaveLength(3);

      deleteTempLyrics('1', '100');
      expect(getAllTempLyrics()).toHaveLength(2);

      expect(hasTempLyrics('1', '101')).toBe(true);
      expect(hasTempLyrics('2', '200')).toBe(true);
    });
  });
});
