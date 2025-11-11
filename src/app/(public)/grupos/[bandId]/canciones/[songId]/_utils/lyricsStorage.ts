// Utility to manage temporary lyrics storage for song editing

interface StoredLyric {
  songId: string;
  bandId: string;
  text: string;
  timestamp: number;
  songTitle?: string;
}

const STORAGE_KEY = 'adorador_temp_lyrics';

/**
 * Save lyrics temporarily to localStorage
 */
export const saveTempLyrics = (
  bandId: string,
  songId: string,
  text: string,
  songTitle?: string,
): void => {
  try {
    const storedLyric: StoredLyric = {
      songId,
      bandId,
      text,
      timestamp: Date.now(),
      songTitle,
    };
    localStorage.setItem(
      `${STORAGE_KEY}_${bandId}_${songId}`,
      JSON.stringify(storedLyric),
    );
    // Dispatch custom event for same-window changes
    window.dispatchEvent(new Event('lyricsStorageChange'));
  } catch (error) {
    console.error('Error saving lyrics to localStorage:', error);
  }
};

/**
 * Get temporary lyrics from localStorage for a specific song
 */
export const getTempLyrics = (
  bandId: string,
  songId: string,
): StoredLyric | null => {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY}_${bandId}_${songId}`);
    if (!stored) return null;
    return JSON.parse(stored) as StoredLyric;
  } catch (error) {
    console.error('Error getting lyrics from localStorage:', error);
    return null;
  }
};

/**
 * Delete temporary lyrics from localStorage
 */
export const deleteTempLyrics = (bandId: string, songId: string): void => {
  try {
    localStorage.removeItem(`${STORAGE_KEY}_${bandId}_${songId}`);
    // Dispatch custom event for same-window changes
    window.dispatchEvent(new Event('lyricsStorageChange'));
  } catch (error) {
    console.error('Error deleting lyrics from localStorage:', error);
  }
};

/**
 * Get all temporary lyrics stored
 */
export const getAllTempLyrics = (): StoredLyric[] => {
  try {
    const allLyrics: StoredLyric[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY)) {
        const stored = localStorage.getItem(key);
        if (stored) {
          allLyrics.push(JSON.parse(stored) as StoredLyric);
        }
      }
    }
    return allLyrics;
  } catch (error) {
    console.error('Error getting all lyrics from localStorage:', error);
    return [];
  }
};

/**
 * Check if there are temporary lyrics for a specific song
 */
export const hasTempLyrics = (bandId: string, songId: string): boolean => {
  return getTempLyrics(bandId, songId) !== null;
};

/**
 * Clear all temporary lyrics (useful for maintenance)
 */
export const clearAllTempLyrics = (): void => {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    // Dispatch custom event for same-window changes
    window.dispatchEvent(new Event('lyricsStorageChange'));
  } catch (error) {
    console.error('Error clearing all lyrics from localStorage:', error);
  }
};
