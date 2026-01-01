'use client';
import { useSavedSongs } from '../_hooks/useSavedSongs';
import { SavedSongRow } from './SavedSongRow';
import { EmptyState } from '@global/components/EmptyState';
import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $PlayList } from '@stores/player';
import { CopySongModal } from '@app/(public)/feed/_components/CopySongModal';
import { copySongDirectService } from '@app/(public)/feed/_services/feedService';
import { $user } from '@stores/users';
import toast from 'react-hot-toast';
import { useDisclosure } from '@heroui/react';

export const SavedSongsList = () => {
  const { songs, isLoading, refetch } = useSavedSongs();
  const [mounted, setMounted] = useState(false);
  const user = useStore($user);

  const {
    isOpen: isCopyOpen,
    onOpen: onCopyOpen,
    onClose: onCopyClose,
  } = useDisclosure();
  const [selectedSongToCopy, setSelectedSongToCopy] = useState<any | null>(
    null,
  );

  const copySongDirect = copySongDirectService({
    songId: selectedSongToCopy?.songId || 0,
  });

  const handleCopySong = (song: any) => {
    setSelectedSongToCopy(song);
    onCopyOpen();
  };

  const submitCopySong = (copyData: any) => {
    if (!selectedSongToCopy) return;

    // Add commentId if needed, otherwise just spread copyData
    // The service expects { targetBandId, songId, key, tempo, ... }
    // But copySongDirectService hook takes { songId } during creation?
    // Let's check FeedClient. Logic there:
    // copySongDirect.mutate(copyDataWithComment...)
    // copyData usually has { targetBandId: number, ... }

    copySongDirect.mutate(copyData, {
      onSuccess: () => {
        onCopyClose();
        toast.success('¡Canción copiada exitosamente!');
        // No need to invalidate feed infinite here, maybe invalidate target band songs?
      },
      onError: (error) => {
        console.error('Error copiando canción:', error);
        toast.error('Error al copiar la canción');
      },
    });
  };

  const userBands =
    user?.membersofBands
      ?.filter((membership) => membership.isActive)
      .map((membership) => membership.band) || [];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (songs.length > 0) {
      const playlist = songs
        .filter((s) => s.song.youtubeLink)
        .map((s) => ({
          id: s.song.id,
          youtubeLink: s.song.youtubeLink!,
          name: s.song.title,
          bandId: String(s.song.bandId),
          key: s.song.key,
          tempo: s.song.tempo,
          startTime: s.song.startTime,
          hasSyncedLyrics: true,
          hasSyncedChords: true,
        }));

      if (playlist.length > 0) {
        $PlayList.set(playlist);
      }
    }
  }, [songs]);

  // Placeholder for back navigation if needed, though this is a top-level page
  const handleBack = () => {
    // window.history.back(); // Or router.push('/')
  };

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-950"></div>;
  }

  // Redirect or show login prompt if not logged in?
  // Usually middleware handles this, or we show specific UI.
  // For now assuming the page is protected or we show empty state.

  return (
    <div className="w-full px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 p-6 shadow-lg backdrop-blur-sm dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Canciones{' '}
                <span className="text-gradient-simple">Guardadas</span>
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {songs.length} canciones en tu colección personal
              </p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex animate-pulse flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 w-full rounded-lg bg-gray-200 dark:bg-gray-800"
            ></div>
          ))}
        </div>
      ) : songs.length > 0 ? (
        <div className="mb-6 overflow-hidden rounded-2xl bg-white/80 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm dark:bg-gray-950 dark:shadow-none dark:ring-slate-800">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="hidden border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-gray-900 dark:text-slate-300 sm:table-header-group">
                <tr>
                  <th className="px-4 py-3 text-left">Título</th>
                  <th className="hidden px-4 py-3 text-left sm:table-cell">
                    Artista
                  </th>
                  <th className="hidden px-4 py-3 text-left sm:table-cell">
                    Tonalidad
                  </th>
                  <th className="hidden px-4 py-3 text-left sm:table-cell">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <SavedSongRow
                    key={song.id}
                    savedItem={song}
                    refetch={refetch}
                    onCopy={() => handleCopySong(song)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon="🎵"
          title="No hay canciones guardadas"
          description="Guarda canciones del Feed o de tus grupos para verlas aquí."
        />
      )}

      {/* Modal Copiar Canción */}
      {selectedSongToCopy && (
        <CopySongModal
          isOpen={isCopyOpen}
          onClose={onCopyClose}
          onSubmit={submitCopySong}
          isLoading={copySongDirect.isPending}
          userBands={userBands}
          songTitle={selectedSongToCopy.song.title}
          currentKey={selectedSongToCopy.song.key}
          currentTempo={selectedSongToCopy.song.tempo}
        />
      )}
    </div>
  );
};
