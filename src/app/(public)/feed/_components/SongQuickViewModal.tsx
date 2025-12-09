'use client';

import { useMemo } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  Chip,
} from "@heroui/react";
import { Post, LyricsProps } from '../_interfaces/feedInterface';
import { getSongWithLyricsService } from '../_services/feedService';
import { structureColors, structureLib } from '@global/config/constants';
import { ChordDisplay } from '../../grupos/[bandId]/canciones/[songId]/_components/ChordDisplay';

interface SongQuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post;
  onCopySong?: (
    postId: number,
    suggestedKey?: string,
    suggestedTempo?: number,
  ) => void;
}

export const SongQuickViewModal = ({
  isOpen,
  onClose,
  post,
  onCopySong,
}: SongQuickViewModalProps) => {
  // Preferencias de acordes fijas en cifrado americano
  const chordPreferences = {
    noteType: 'american' as const,
    accidentalType: 'sostenido' as const,
  };

  const { data: songData, isLoading } = getSongWithLyricsService({
    songId: post.sharedSongId || 0,
    bandId: post.bandId,
    isEnabled: isOpen && !!post.sharedSongId,
  });

  // Agrupar letras por estructura
  const lyricsGrouped = useMemo(() => {
    if (!songData?.lyrics) return [];

    const grouped = songData.lyrics.reduce(
      (acc, lyric) => {
        const structureTitle = lyric.structure.title;
        if (!acc[structureTitle]) {
          acc[structureTitle] = [];
        }
        acc[structureTitle].push(lyric);
        return acc;
      },
      {} as Record<string, LyricsProps[]>,
    );

    return Object.entries(grouped).map(([structure, lyrics]) => ({
      structure,
      lyrics: lyrics.sort((a, b) => a.position - b.position),
    }));
  }, [songData?.lyrics]);

  const renderLyricLine = (lyric: LyricsProps) => {
    return (
      <div className="mb-4" style={{ width: 'fit-content' }}>
        {/* Chords Section */}
        {lyric.chords && lyric.chords.length > 0 && (
          <ChordDisplay
            chords={lyric.chords}
            transpose={0}
            chordPreferences={chordPreferences}
            lyricsScale={1}
          />
        )}

        {/* Lyrics Section */}
        <div className="font-medium leading-relaxed text-foreground">
          {lyric.lyrics}
        </div>
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: 'max-h-[90vh]',
        body: 'py-6',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">
                    {post.sharedSong?.title}
                  </h3>
                  {post.sharedSong?.artist && (
                    <p className="text-sm text-foreground-500">
                      {post.sharedSong.artist}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {post.sharedSong?.key && (
                      <Chip size="sm" variant="flat">
                        Tono: {post.sharedSong.key}
                      </Chip>
                    )}
                    {post.sharedSong?.tempo && (
                      <Chip size="sm" variant="flat">
                        BPM: {post.sharedSong.tempo}
                      </Chip>
                    )}
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        post.sharedSong?.songType === 'worship'
                          ? 'primary'
                          : 'secondary'
                      }
                    >
                      {post.sharedSong?.songType === 'worship'
                        ? 'Adoración'
                        : 'Alabanza'}
                    </Chip>
                  </div>
                </div>
              </div>
            </ModalHeader>

            <ModalBody>
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Spinner size="lg" />
                </div>
              ) : !songData?.lyrics || songData.lyrics.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-foreground-500">
                    Esta canción aún no tiene letra registrada
                  </p>
                </div>
              ) : (
                <>
                  {/* Letra y acordes */}
                  <div className="space-y-6">
                    {lyricsGrouped.map(({ structure, lyrics }, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 py-4 pl-4"
                        style={{
                          borderColor: structureColors[structure] || '#888888',
                        }}
                      >
                        <h3
                          className="mb-4 text-lg font-bold"
                          style={{
                            color: structureColors[structure] || '#888888',
                          }}
                        >
                          {structureLib[structure]?.es || structure}
                        </h3>
                        <div className="space-y-2">
                          {lyrics.map((lyric) => (
                            <div key={lyric.id}>{renderLyricLine(lyric)}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </ModalBody>

            <ModalFooter>
              {onCopySong && (
                <Button
                  color="primary"
                  variant="flat"
                  onPress={() => {
                    // Sin transposición, copiar con tono y tempo originales
                    const suggestedTempo = post.sharedSong?.tempo || undefined;
                    const suggestedKey = post.sharedSong?.key || undefined;
                    onCopySong(post.id, suggestedKey, suggestedTempo);
                    // NO cerrar el modal para que el usuario pueda seleccionar la banda
                  }}
                >
                  Copiar a mi banda
                </Button>
              )}
              <Button variant="light" onPress={onClose}>
                Cerrar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
