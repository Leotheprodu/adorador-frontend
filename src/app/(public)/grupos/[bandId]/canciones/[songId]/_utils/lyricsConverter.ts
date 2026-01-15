import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { structureLib } from '@global/config/constants';

/**
 * Converts lyrics data structure back to plain text format
 * This allows editing existing lyrics in the text editor
 */
export const convertLyricsToPlainText = (lyrics: LyricsProps[]): string => {
  if (!lyrics || lyrics.length === 0) return '';

  // Group lyrics by structure
  const groupedByStructure: { [key: string]: LyricsProps[] } = {};

  lyrics.forEach((lyric) => {
    const structureName = lyric.structure.title.toLowerCase();
    if (!groupedByStructure[structureName]) {
      groupedByStructure[structureName] = [];
    }
    groupedByStructure[structureName].push(lyric);
  });

  let plainText = '';
  let currentStructure = '';

  // Sort by position and reconstruct text
  const sortedLyrics = [...lyrics].sort((a, b) => a.position - b.position);

  sortedLyrics.forEach((lyric, index) => {
    const structureName = lyric.structure.title.toLowerCase();
    // Get Spanish name from structureLib, fallback to English name
    const structureDisplayName =
      structureLib[structureName]?.es.toLowerCase() || structureName;

    // Add structure label if it's a new structure
    if (currentStructure !== structureName) {
      // Add spacing between sections (except for the first one)
      if (index > 0) {
        plainText += '\n\n';
      }
      plainText += `(${structureDisplayName})\n`;
      currentStructure = structureName;
    }

    // Add chords line if there are chords
    if (lyric.chords && lyric.chords.length > 0) {
      const chordsLine = reconstructChordsLine(lyric.lyrics, lyric.chords);
      if (chordsLine) {
        plainText += chordsLine + '\n';
      }
    }

    // Add lyrics line
    plainText += lyric.lyrics + '\n';
  });

  return plainText.trim();
};

/**
 * Reconstructs the chords line based on chord positions in the lyrics
 * Position system: 1-5 represent columns that divide the lyric line into 5 equal parts
 * Position 1 = start, Position 3 = middle, Position 5 = end
 */
const reconstructChordsLine = (
  lyricsText: string,
  chords: Array<{
    rootNote: string;
    chordQuality?: string;
    slashChord?: string;
    position: number;
  }>,
): string => {
  if (!chords || chords.length === 0) return '';

  // Sort chords by position
  const sortedChords = [...chords].sort((a, b) => a.position - b.position);

  // Calculate the length of the lyrics line
  const lyricsLength = lyricsText.length;

  // Calculate column width (divide lyrics into 5 equal parts)
  const columnWidth = Math.max(1, Math.floor(lyricsLength / 5));

  // Calculate positions with collision detection
  const positionedChords: { chordStr: string; startPos: number }[] = [];
  let lastEndPos = -1; // The index of the last character of the previous chord

  sortedChords.forEach((chord) => {
    const chordStr = getChordString(chord);
    // Convert position (1-5) to actual character position
    // Position 1 = index 0, Position 2 = columnWidth, etc.
    let startPos = (chord.position - 1) * columnWidth;

    // Ensure startPos is at least one space after the previous chord
    // (lastEndPos is the index of the last character, so lastEndPos + 1 is the next free slot)
    // We want at least one space, so lastEndPos + 2
    if (startPos <= lastEndPos + 1) {
      startPos = lastEndPos + 2;
    }

    // Ensure startPos is non-negative
    startPos = Math.max(0, startPos);

    positionedChords.push({ chordStr, startPos });
    lastEndPos = startPos + chordStr.length - 1;
  });

  // Calculate total length needed
  const lastChord = positionedChords[positionedChords.length - 1];
  const minChordsLineLength = lastChord.startPos + lastChord.chordStr.length;
  const chordsLineLength = Math.max(minChordsLineLength, lyricsLength);

  const chordsArray = new Array(chordsLineLength).fill(' ');

  // Place each chord at its calculated position
  positionedChords.forEach(({ chordStr, startPos }) => {
    for (let i = 0; i < chordStr.length; i++) {
      if (startPos + i < chordsLineLength) {
        chordsArray[startPos + i] = chordStr[i];
      }
    }
  });

  // Convert array to string and trim trailing spaces
  return chordsArray.join('').trimEnd();
};

/**
 * Converts chord object to string representation
 */
const getChordString = (chord: {
  rootNote: string;
  chordQuality?: string;
  slashChord?: string;
}): string => {
  let chordStr = chord.rootNote;
  if (chord.chordQuality) {
    chordStr += chord.chordQuality;
  }
  if (chord.slashChord) {
    chordStr += '/' + chord.slashChord;
  }
  return chordStr;
};
