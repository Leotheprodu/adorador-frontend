import { songKeys } from '@global/config/constants';
import { keysType } from '@iglesias/[bandId]/eventos/_interfaces/eventsInterface';

export const handleTranspose = (key: keysType | null, transpose: number) => {
  if (key === null) return '';

  const keyIndex = songKeys.indexOf(key);
  if (keyIndex === -1) return '';
  let newIndex = (keyIndex + transpose * 2) % songKeys.length;
  if (newIndex < 0) newIndex += songKeys.length;
  return songKeys[newIndex];
};
