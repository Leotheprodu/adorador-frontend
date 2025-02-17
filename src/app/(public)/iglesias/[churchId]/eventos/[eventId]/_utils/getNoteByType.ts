import { keys, rootNotes } from '@global/config/constants';

export const getNoteByType = (
  noteKey: string,
  transpose: number = 0,
  chordPreferences: { noteType: string; accidentalType: string },
): string | undefined => {
  const { noteType, accidentalType } = chordPreferences;
  const noteIndex = keys.indexOf(noteKey);
  if (noteIndex === -1) return undefined;

  // Calculate the new index after transposition
  const newIndex = (noteIndex + transpose + keys.length) % keys.length;
  const newNoteKey = keys[newIndex];

  const note = rootNotes[newNoteKey];
  if (!note) return undefined;

  if (noteType === 'american') {
    return note.american;
  } else if (noteType === 'regular') {
    if (accidentalType === 'sostenido') {
      return note.regular;
    } else if (accidentalType === 'bemol') {
      return note.aBemol || note.rBemol || note.regular;
    }
  }
  return undefined;
};
