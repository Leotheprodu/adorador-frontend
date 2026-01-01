import { Metadata } from 'next';
import { SavedSongsList } from './_components/SavedSongsList';

export const metadata: Metadata = {
  title: 'Canciones Guardadas - zamr',
  description: 'Tu colección personal de canciones guardadas.',
};

export default function SavedSongsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <SavedSongsList />
    </div>
  );
}
