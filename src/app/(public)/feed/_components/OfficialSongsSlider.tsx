'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Chip, useDisclosure } from '@heroui/react';
import {
  PlayIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  BookmarkIcon,
  CopyIcon,
} from '@global/icons';
import { SongProps } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { getYouTubeThumbnail } from '@global/utils/formUtils';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/handleTranspose';
import Link from 'next/link';
import { useSavedSong } from '@/app/(public)/feed/_hooks/useSavedSong';
import { OFFICIAL_BAND_ID } from '@global/config/constants';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { CopySongModal } from './CopySongModal';
import { copySongDirectService } from '../_services/feedService';
import toast from 'react-hot-toast';

interface OfficialSongsSliderProps {
  songs: SongProps[];
}

export const OfficialSongsSlider = ({ songs }: OfficialSongsSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const user = useStore($user);

  // Modal for copying song
  const {
    isOpen: isCopyOpen,
    onOpen: onCopyOpen,
    onClose: onCopyClose,
  } = useDisclosure();

  // Service to copy song
  const copySongMutation = copySongDirectService({
    songId: songs[activeIndex]?.id || 0,
  });

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % (songs?.length || 1));
  }, [songs?.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + (songs?.length || 1)) % (songs?.length || 1),
    );
  }, [songs?.length]);

  // Auto-slide effect
  useEffect(() => {
    if (isHovered || isCopyOpen || !songs?.length) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Clear any existing timer before setting a new one
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [nextSlide, isHovered, isCopyOpen, songs?.length]);

  // Reset index when songs change to avoid out of bounds error
  useEffect(() => {
    setActiveIndex(0);
  }, [songs]);

  const currentSong = songs?.[activeIndex];

  // Guard against undefined currentSong (e.g. during render before effect updates)
  const safeSongId = currentSong?.id || 0;
  const { isSaved, toggleSave } = useSavedSong(safeSongId);

  if (!songs || songs.length === 0 || !currentSong) return null;

  const handleCopySubmit = (data: { targetBandId: number }) => {
    copySongMutation.mutate(
      { ...data },
      {
        onSuccess: () => {
          toast.success('Canción copiada a tu grupo exitosamente');
          onCopyClose();
        },
        onError: (error: {
          response?: { data?: { message?: string } };
          message?: string;
        }) => {
          console.error('Copy Error:', error);
          let errorMessage =
            error?.response?.data?.message ||
            error?.message ||
            'Error al copiar la canción';

          // Limpiar el prefijo de código de estado si existe (ej: "403-Mensaje")
          if (errorMessage.match(/^\d+-/)) {
            errorMessage = errorMessage.replace(/^\d+-/, '');
          }

          toast.error(errorMessage);
        },
      },
    );
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-2xl bg-black shadow-2xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Canciones Recomendadas"
    >
      {/* Background Image with Blur */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSong.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0 h-full w-full"
        >
          {currentSong.youtubeLink ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={getYouTubeThumbnail(
                currentSong.youtubeLink,
                'maxresdefault',
              )}
              alt={currentSong.title}
              className="h-full w-full object-cover opacity-50 blur-xl filter"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-brand-purple-900 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 grid min-h-[450px] grid-cols-1 items-center gap-8 p-8 lg:grid-cols-2 lg:p-12">
        {/* Left: Content Information */}
        <div className="space-y-6">
          <motion.div
            key={`content-${activeIndex}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <Chip
                size="sm"
                color="warning"
                variant="flat"
                className="border-none bg-yellow-500/20 text-yellow-300"
              >
                Oficial Zamr
              </Chip>
              {currentSong.tempo && (
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-white/10 text-white"
                >
                  {currentSong.tempo} BPM
                </Chip>
              )}
              {currentSong.key && (
                <Chip
                  size="sm"
                  variant="flat"
                  className="bg-white/10 text-white"
                >
                  {handleTranspose(currentSong.key, 0)}
                </Chip>
              )}
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight text-white drop-shadow-lg lg:text-5xl">
              {currentSong.title}
            </h2>
            <p className="text-xl font-medium text-gray-300">
              {currentSong.artist}
            </p>

            <div className="flex flex-wrap gap-3 pt-4">
              <Button
                as={Link}
                href={`/grupos/${OFFICIAL_BAND_ID}/canciones/${currentSong.id}`}
                size="lg"
                color="primary"
                className="bg-brand-purple-600 font-bold shadow-lg shadow-brand-purple-500/30"
                startContent={<PlayIcon className="h-6 w-6" />}
              >
                Ver Canción
              </Button>

              <Button
                size="lg"
                variant="bordered"
                onPress={toggleSave}
                className={`border-white/30 text-white hover:bg-white/10 ${isSaved ? 'bg-white/20' : ''}`}
                startContent={
                  <BookmarkIcon
                    className={`h-5 w-5 ${isSaved ? 'text-brand-purple-400' : ''}`}
                  />
                }
              >
                {isSaved ? 'Guardada' : 'Guardar'}
              </Button>

              <Button
                size="lg"
                variant="bordered"
                onPress={onCopyOpen}
                className="border-white/30 text-white hover:bg-white/10"
                startContent={<CopyIcon className="h-5 w-5" />}
              >
                Copiar
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Right: Focused Thumbnail Card */}
        <div className="relative flex justify-center lg:justify-end">
          <motion.div
            key={`card-${activeIndex}-img`}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative aspect-video w-full max-w-md overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/50"
          >
            {currentSong.youtubeLink ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={getYouTubeThumbnail(
                  currentSong.youtubeLink,
                  'maxresdefault',
                )}
                alt={currentSong.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-900 text-white">
                <span className="text-3xl">🎵</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-6 right-6 z-20 flex gap-2">
        <Button
          onPress={prevSlide}
          isIconOnly
          variant="flat"
          className="bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
        >
          <ArrowLeftIcon className="h-6 w-6" />
        </Button>
        <Button
          onPress={nextSlide}
          isIconOnly
          variant="flat"
          className="bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
        >
          <ArrowRightIcon className="h-6 w-6" />
        </Button>
      </div>

      {/* Dots Indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2 lg:left-12 lg:translate-x-0">
        {songs.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all ${idx === activeIndex ? 'w-8 bg-brand-purple-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            aria-label={`Ir a la canción ${idx + 1}`}
          />
        ))}
      </div>

      {/* Copy Song Modal */}
      <CopySongModal
        isOpen={isCopyOpen}
        onClose={onCopyClose}
        onSubmit={handleCopySubmit}
        isLoading={copySongMutation.isPending}
        userBands={user.membersofBands.map((mb) => ({
          id: mb.band.id,
          name: mb.band.name,
        }))}
        songTitle={currentSong.title}
        currentKey={currentSong.key}
        currentTempo={currentSong.tempo}
        suggestedKey={currentSong.key || undefined}
        suggestedTempo={currentSong.tempo || undefined}
      />
    </div>
  );
};
