'use client';
import { useEffect, useState } from 'react';
import { getAllTempLyrics, deleteTempLyrics } from '../_utils/lyricsStorage';
import { CloseIcon } from '@global/icons/CloseIcon';
import Link from 'next/link';

export const StoredLyricsAlert = () => {
  const [storedLyrics, setStoredLyrics] = useState<
    Array<{
      songId: string;
      bandId: string;
      text: string;
      timestamp: number;
      songTitle?: string;
    }>
  >([]);
  const [isMinimized, setIsMinimized] = useState(false);

  const loadStoredLyrics = () => {
    const lyrics = getAllTempLyrics();
    setStoredLyrics(lyrics);
  };

  useEffect(() => {
    loadStoredLyrics();

    // Listen for storage changes from other tabs/windows
    const handleStorageChange = () => {
      loadStoredLyrics();
    };

    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom event for same-window changes
    window.addEventListener('lyricsStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('lyricsStorageChange', handleStorageChange);
    };
  }, []);

  const handleDelete = (bandId: string, songId: string) => {
    deleteTempLyrics(bandId, songId);
    loadStoredLyrics();
    // Dispatch custom event for same-window changes
    window.dispatchEvent(new Event('lyricsStorageChange'));
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  if (storedLyrics.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md transition-all duration-300">
      <div className="rounded-lg border-2 border-warning-500 bg-warning-50 shadow-lg">
        {/* Header - Always visible */}
        <div
          className="flex cursor-pointer items-center justify-between p-4"
          onClick={toggleMinimize}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            <div>
              <h3 className="font-bold text-warning-900">Letras sin guardar</h3>
              {isMinimized && (
                <p className="text-xs text-warning-700">
                  {storedLyrics.length}{' '}
                  {storedLyrics.length === 1 ? 'pendiente' : 'pendientes'}
                </p>
              )}
            </div>
          </div>
          <button
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-warning-200"
            title={isMinimized ? 'Expandir' : 'Minimizar'}
          >
            {isMinimized ? (
              <svg
                className="h-5 w-5 text-warning-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-warning-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Content - Collapsible */}
        {!isMinimized && (
          <div className="px-4 pb-4">
            <p className="mb-3 text-sm text-warning-800">
              Tienes letras pendientes por terminar
            </p>

            <div className="space-y-2">
              {storedLyrics.map((lyric) => (
                <div
                  key={`${lyric.bandId}-${lyric.songId}`}
                  className="flex items-center justify-between rounded-md bg-white p-3 shadow-sm"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      {lyric.songTitle || `Canción ${lyric.songId}`}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(lyric.timestamp).toLocaleString('es-ES')}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      {lyric.text.length} caracteres
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/grupos/${lyric.bandId}/canciones/${lyric.songId}#edit-lyrics`}
                      className="rounded-md bg-primary-500 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-primary-600"
                    >
                      Ir
                    </Link>
                    <button
                      onClick={() => handleDelete(lyric.bandId, lyric.songId)}
                      className="flex items-center justify-center rounded-md bg-danger-500 p-1 text-white transition-colors hover:bg-danger-600"
                      title="Eliminar borrador"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-xs text-warning-800">
              💡 Completa o elimina estos borradores para liberar espacio
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
