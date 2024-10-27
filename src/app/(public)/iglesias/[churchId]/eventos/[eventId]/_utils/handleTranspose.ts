import { songKeys } from '@global/config/constants';
import { keysType } from '../../_interfaces/eventsInterface';

export const handleTranspose = (key: keysType | null, transpose: number) => {
  if (key === null) return '';

  const keyIndex = songKeys.indexOf(key);
  if (keyIndex === -1) return '';
  const newIndex = (keyIndex + transpose * 2) % songKeys.length;
  return songKeys[newIndex];
};
