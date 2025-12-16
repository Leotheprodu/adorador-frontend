import { useStore } from '@nanostores/react';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@heroui/react';
import { $event } from '@stores/event';
import React, { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { addSongsToEventService } from './services/AddSongsToEventService';
import { songTypes } from '@global/config/constants';
import { getSongsOfBand } from '@bands/[bandId]/canciones/_services/songsOfBandService';
import { SearchIcon, MicrophoneIcon } from '@global/icons';
import { useBandSongsWebSocket } from '@global/hooks/useBandSongsWebSocket';
import { SelectVideoLyricModal } from './SelectVideoLyricModal';
import type { SongPropsWithCount } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { useQueryClient } from '@tanstack/react-query';
import { setPreferredVideoLyricsService } from '@bands/[bandId]/canciones/[songId]/_services/videoLyricsService';

export const AddSongEventBySavedSongs = ({
  params,
  refetch,
  eventSongs: eventSongsProp,
  isOpen,
  onClose,
  eventMode: eventModeProp,
}: {
  params: { bandId: string; eventId: string };
  refetch: () => void;
  eventSongs?: { order: number; transpose: number; song: { id: number } }[];
  isOpen: boolean;
  onClose: () => void;
  eventMode?: string;
}) => {
  // Usar directamente el prop o el store como fallback
  const eventFromStore = useStore($event);
  const eventSongs = useMemo(
    () => eventSongsProp || eventFromStore.songs || [],
    [eventSongsProp, eventFromStore.songs],
  );
  // Usar eventMode del prop si está disponible, sino del store
  const eventMode = eventModeProp || eventFromStore.eventMode;

  const { bandId } = params;
  const { data } = getSongsOfBand({ bandId });
  const queryClient = useQueryClient();

  // Conectar al WebSocket para actualizaciones en tiempo real
  useBandSongsWebSocket({
    bandId: parseInt(bandId),
    enabled: isOpen,
  });
  const [selectedSongs, setSelectedSongs] = useState<
    { songId: number; order: number; transpose: number }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [songTypeFilter, setSongTypeFilter] = useState<
    'all' | 'worship' | 'praise'
  >('all');
  const [selectedVideoLyrics, setSelectedVideoLyrics] = useState<{
    [songId: number]: number;
  }>({});

  const [videoId, setVideoId] = useState<number>(0);
  const [songId, setSongId] = useState<string>('0');

  // Estado para el modal de selección de video lyric
  const [videoLyricModalOpen, setVideoLyricModalOpen] = useState(false);
  const [songForVideoSelection, setSongForVideoSelection] =
    useState<SongPropsWithCount | null>(null);

  const [filteredSongs, setFilteredSongs] = useState(data);
  const { mutate: setPreferred } = setPreferredVideoLyricsService({
    bandId,
    songId,
    videoId,
  });

  // Function to normalize text (remove accents and convert to lowercase)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  useEffect(() => {
    let filtered = data?.filter(
      (song) => !eventSongs.some((track) => track.song.id === song.id),
    );

    // Filter by video lyrics for videolyrics events
    if (eventMode === 'videolyrics') {
      filtered = filtered?.filter((song) => song._count.videoLyrics > 0);
    }

    // Apply search filter
    if (searchTerm !== '') {
      const normalizedSearch = normalizeText(searchTerm);
      filtered = filtered?.filter(
        (song) =>
          normalizeText(song.title).includes(normalizedSearch) ||
          normalizeText(song.artist || '').includes(normalizedSearch) ||
          normalizeText(song.key || '').includes(normalizedSearch) ||
          normalizeText(songTypes[song.songType].es || '').includes(
            normalizedSearch,
          ),
      );
    }

    // Apply song type filter
    if (songTypeFilter !== 'all') {
      filtered = filtered?.filter((song) => song.songType === songTypeFilter);
    }

    // Sort alphabetically by title
    filtered = filtered?.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
    );

    setFilteredSongs(filtered);
  }, [searchTerm, songTypeFilter, data, eventSongs, eventMode]);

  const { status, mutate } = addSongsToEventService({ params });

  useEffect(() => {
    if (status === 'success') {
      toast.success('Canciones agregadas al evento');
      refetch();
      onClose();

      // Resetear estados después de agregar exitosamente
      setSelectedSongs([]);
      setSearchTerm('');
      setSongTypeFilter('all');

      // Emitir evento global para que otras partes de la app actualicen
      const event = new CustomEvent('eventSongsUpdated', {
        detail: { eventId: params.eventId, changeType: 'songs-added' },
      });
      window.dispatchEvent(event);
    }
    if (status === 'error') {
      toast.error('Error al agregar canciones al evento');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSelectSong = (song: SongPropsWithCount) => {
    const songId = song.id;
    const eventSongsLength = eventSongs.length;
    if (songId) {
      const isSelected = selectedSongs.some((s) => s.songId === songId);
      const isAlreadyInEvent = eventSongs.some((s) => s.song.id === songId);
      if (isAlreadyInEvent) {
        toast.error('La canción ya está en el evento');
        return;
      }
      if (isSelected) {
        // Deseleccionar
        setSelectedSongs(selectedSongs.filter((s) => s.songId !== songId));
      } else {
        // Si tiene múltiples video lyrics, abrir modal de selección
        if (song.videoLyrics && song.videoLyrics.length > 1) {
          setSongForVideoSelection(song);
          setVideoLyricModalOpen(true);
        } else {
          // Agregar directamente
          const newOrder = eventSongsLength + selectedSongs.length + 1;
          setSelectedSongs([
            ...selectedSongs,
            { songId, transpose: 0, order: newOrder },
          ]);
        }
      }
    }
  };

  const handleVideoLyricSelected = async (videoLyricId: number) => {
    if (!songForVideoSelection) return;

    // Configurar los IDs para el hook
    setSongId(songForVideoSelection.id.toString());
    setVideoId(videoLyricId);

    setPreferred(null, {
      onSuccess: () => {
        // 2. Agregar la canción al evento (usará automáticamente el preferido)
        const eventSongsLength = eventSongs.length;
        const newOrder = eventSongsLength + selectedSongs.length + 1;

        setSelectedSongs([
          ...selectedSongs,
          { songId: songForVideoSelection.id, transpose: 0, order: newOrder },
        ]);

        // 3. Mostrar mensaje de confirmación
        const selectedVideo = songForVideoSelection.videoLyrics?.find(
          (v) => v.id === videoLyricId,
        );
        toast.success(
          `"${songForVideoSelection.title}" agregada con: "${selectedVideo?.title || 'Video ' + videoLyricId}"`,
        );

        // 4. Actualizar cache
        queryClient.invalidateQueries({ queryKey: ['songs', bandId] });
        queryClient.invalidateQueries({ queryKey: ['SongsOfBand', bandId] });

        // 5. Limpiar estado
        setSongForVideoSelection(null);
      },
      onError: () => {
        toast.error('Error al actualizar video lyric preferido');
        setSongForVideoSelection(null);
      },
    });
  };

  const handleAddSongToEvent = () => {
    mutate({ songDetails: selectedSongs });
  };

  const handleModalClose = () => {
    // Resetear estados cuando se cierra el modal
    setSelectedSongs([]);
    setSearchTerm('');
    setSongTypeFilter('all');
    setSongForVideoSelection(null);
    setVideoLyricModalOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleModalClose();
          onClose();
        }
      }}
      isDismissable={true}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white dark:bg-gray-900 max-h-[90vh]',
        header: 'border-b border-slate-200 py-3',
        body: 'py-3 px-4 overflow-visible',
        footer: 'border-t border-slate-200 py-3',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-lg font-bold text-transparent">
                    Agregar Canciones al Evento
                  </span>
                  {selectedSongs.length > 0 && (
                    <span className="rounded-full bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 px-2.5 py-0.5 text-xs font-semibold text-white">
                      +{selectedSongs.length}
                    </span>
                  )}
                </div>
                {eventMode === 'videolyrics' && (
                  <span className="text-xs font-medium text-amber-600">
                    📹 Solo canciones con video lyrics
                  </span>
                )}
                {filteredSongs && filteredSongs.length > 0 && (
                  <span className="text-xs text-slate-500">
                    {filteredSongs.length} canciones disponibles
                  </span>
                )}
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3">
                {/* Search input */}
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="h-5 w-5 text-slate-400 dark:text-slate-100" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por título, artista, tonalidad o tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border-2 border-slate-200 py-2 pl-10 pr-4 text-sm transition-all duration-200 focus:border-brand-purple-600 focus:outline-none focus:ring-2 focus:ring-brand-purple-200"
                  />
                </div>

                {/* Filter buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setSongTypeFilter('all')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      songTypeFilter === 'all'
                        ? 'bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 text-white shadow-sm'
                        : 'border-2 border-slate-200 text-slate-600 hover:border-brand-purple-300 hover:bg-slate-50'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setSongTypeFilter('worship')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      songTypeFilter === 'worship'
                        ? 'bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 text-white shadow-sm'
                        : 'border-2 border-slate-200 text-slate-600 hover:border-brand-purple-300 hover:bg-slate-50 dark:text-slate-100'
                    }`}
                  >
                    🙏 Adoración
                  </button>
                  <button
                    onClick={() => setSongTypeFilter('praise')}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      songTypeFilter === 'praise'
                        ? 'bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 text-white shadow-sm'
                        : 'border-2 border-slate-200 text-slate-600 hover:border-brand-purple-300 hover:bg-slate-50 dark:text-slate-100'
                    }`}
                  >
                    🎉 Alabanza
                  </button>
                </div>

                {/* Songs list */}
                <div className="max-h-[50vh] overflow-y-auto">
                  <ul className="flex flex-col gap-1.5 pr-1">
                    {filteredSongs && filteredSongs.length > 0 ? (
                      filteredSongs.map((song) => {
                        const isSelected = selectedSongs.some(
                          (track) => track.songId === song.id,
                        );
                        return (
                          <li
                            key={song.id}
                            className={`group cursor-pointer rounded-lg border-2 px-3 py-2.5 transition-all duration-200 ${
                              isSelected
                                ? 'border-brand-purple-600 bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 shadow-sm dark:border-brand-purple-400 dark:from-brand-purple-900 dark:to-brand-blue-900'
                                : 'border-slate-200 hover:border-brand-purple-300 hover:bg-slate-50 hover:shadow-sm dark:border-slate-700 dark:bg-black dark:hover:bg-gray-800'
                            }`}
                            onClick={() => handleSelectSong(song)}
                          >
                            <div className="flex flex-col gap-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                                    {song.title}
                                  </p>
                                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                                    {song.artist && (
                                      <span className="flex items-center gap-1">
                                        <MicrophoneIcon className="h-3 w-3" />{' '}
                                        {song.artist}
                                      </span>
                                    )}
                                    {song.key && (
                                      <span className="rounded bg-slate-200 px-1.5 py-0.5 font-mono font-semibold">
                                        {song.key}
                                      </span>
                                    )}
                                    <span className="rounded bg-brand-purple-100 px-1.5 py-0.5 text-brand-purple-700">
                                      {songTypes[song.songType].es}
                                    </span>
                                    {song._count?.videoLyrics > 0 && (
                                      <span className="rounded bg-green-100 px-1.5 py-0.5 font-semibold text-green-700">
                                        📹 {song._count.videoLyrics}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {isSelected && (
                                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 text-white">
                                    ✓
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <div className="flex h-32 items-center justify-center text-slate-500">
                        <p className="text-sm">
                          {searchTerm || songTypeFilter !== 'all'
                            ? 'No se encontraron canciones con los filtros aplicados'
                            : 'No hay canciones disponibles'}
                        </p>
                      </div>
                    )}
                  </ul>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex-wrap gap-2">
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  handleModalClose();
                  onClose();
                }}
                className="whitespace-nowrap font-medium"
              >
                Cancelar
              </Button>
              <Button
                onPress={handleAddSongToEvent}
                isDisabled={selectedSongs.length === 0 || status === 'pending'}
                isLoading={status === 'pending'}
                className="whitespace-nowrap bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 font-semibold text-white"
              >
                {status === 'pending'
                  ? 'Agregando...'
                  : `Agregar ${selectedSongs.length > 0 ? `(${selectedSongs.length})` : ''}`}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>

      {/* Modal de selección de video lyric */}
      {songForVideoSelection && (
        <SelectVideoLyricModal
          isOpen={videoLyricModalOpen}
          onClose={() => {
            setVideoLyricModalOpen(false);
            setSongForVideoSelection(null);
          }}
          songTitle={songForVideoSelection.title}
          videoLyrics={songForVideoSelection.videoLyrics || []}
          onSelect={handleVideoLyricSelected}
        />
      )}
    </Modal>
  );
};
