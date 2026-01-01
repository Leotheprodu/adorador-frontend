'use client';

import { Textarea, Button, Divider } from '@heroui/react';
import { SendIcon, XMarkIcon, MusicalNoteIcon, HandsIcon } from '@global/icons';
import { PostType } from '../_interfaces/feedInterface';
import { PostTypeSelectorButtons } from './PostTypeSelectorButtons';
import { BandSelector } from './BandSelector';
import { SongShareFields } from './SongShareFields';
import { SongRequestFields } from './SongRequestFields';

interface CreatePostExpandedFormProps {
  // User info
  userName: string;

  // Form state
  postType: PostType;
  bandId: string;
  content: string;
  sharedSongId: string;
  requestedSongTitle: string;
  requestedSongArtist: string;
  requestedYoutubeUrl: string;

  // Data
  userBands: Array<{ id: number; name: string }>;
  bandSongs: Array<{ id: number; title: string; artist: string | null }>;

  // Helpers
  selectedBandName: string;
  selectedSongInfo: { title: string; artist: string | null } | null;
  isValid: boolean;
  isLoading?: boolean;

  // Refs
  textareaRef: React.RefObject<HTMLTextAreaElement>;

  // Handlers
  onPostTypeChange: (type: PostType) => void;
  onBandChange: (bandId: string) => void;
  onContentChange: (value: string) => void;
  onSongChange: (songId: string) => void;
  onTitleChange: (value: string) => void;
  onArtistChange: (value: string) => void;
  onYoutubeChange: (value: string) => void;
  onYoutubeClear: () => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export const CreatePostExpandedForm = ({
  userName,
  postType,
  bandId,
  content,
  sharedSongId,
  requestedSongTitle,
  requestedSongArtist,
  requestedYoutubeUrl,
  userBands,
  bandSongs,
  selectedBandName,
  selectedSongInfo,
  isValid,
  isLoading,
  textareaRef,
  onPostTypeChange,
  onBandChange,
  onContentChange,
  onSongChange,
  onTitleChange,
  onArtistChange,
  onYoutubeChange,
  onYoutubeClear,
  onSubmit,
  onCancel,
}: CreatePostExpandedFormProps) => {
  return (
    <div className="animate-in fade-in-0 space-y-4 bg-gradient-to-br from-white via-gray-50/30 to-brand-purple-50/20 p-3 duration-300 dark:from-default-100 dark:via-default-50/30 dark:to-brand-purple-900/10 sm:p-4">
      {/* Header con avatar y tipo de post */}
      <div className="space-y-4">
        {/* Selector de tipo de post */}
        <PostTypeSelectorButtons
          postType={postType}
          onPostTypeChange={onPostTypeChange}
        />

        {/* Selector de banda */}
        <BandSelector
          bandId={bandId}
          userBands={userBands}
          selectedBandName={selectedBandName}
          onBandChange={onBandChange}
        />

        {/* Área de texto principal */}
        <Textarea
          ref={textareaRef}
          placeholder={
            postType === 'SONG_SHARE'
              ? 'Escribe algo sobre esta canción...'
              : 'Explica por qué necesitas esta canción...'
          }
          value={content}
          onValueChange={onContentChange}
          minRows={3}
          maxRows={5}
          variant="bordered"
          classNames={{
            input: 'text-base',
            inputWrapper:
              'bg-white/90 border-brand-purple-200 hover:border-brand-purple-300 focus-within:border-brand-purple-400 dark:bg-default-100/90 dark:border-brand-purple-700 dark:hover:border-brand-purple-600 dark:focus-within:border-brand-purple-500',
          }}
        />

        {/* Campos específicos según el tipo */}
        {postType === 'SONG_SHARE' && (
          <SongShareFields
            sharedSongId={sharedSongId}
            bandSongs={bandSongs}
            selectedSongInfo={selectedSongInfo}
            onSongChange={onSongChange}
          />
        )}

        {postType === 'SONG_REQUEST' && (
          <SongRequestFields
            requestedSongTitle={requestedSongTitle}
            requestedSongArtist={requestedSongArtist}
            requestedYoutubeUrl={requestedYoutubeUrl}
            onTitleChange={onTitleChange}
            onArtistChange={onArtistChange}
            onYoutubeChange={onYoutubeChange}
            onYoutubeClear={onYoutubeClear}
          />
        )}
      </div>

      <Divider className="bg-gradient-to-r from-transparent via-brand-purple-200 to-transparent" />

      {/* Footer con acciones */}
      <div className="flex items-center justify-end gap-2 rounded-lg bg-white/60 p-3 backdrop-blur-sm dark:bg-default-100/60">
        <Button
          variant="bordered"
          size="sm"
          onPress={onCancel}
          startContent={<XMarkIcon className="h-4 w-4" />}
          className="border-default-300 text-foreground-600 hover:bg-default-100 dark:border-default-600 dark:hover:bg-default-200"
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          onPress={onSubmit}
          isLoading={isLoading}
          isDisabled={!isValid}
          startContent={
            !isLoading &&
            (postType === 'SONG_SHARE' ? (
              <MusicalNoteIcon className="h-4 w-4" />
            ) : (
              <HandsIcon className="h-4 w-4" />
            ))
          }
          className={`shadow-lg transition-all duration-200 ${
            postType === 'SONG_SHARE'
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
              : 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700'
          } ${!isValid ? 'cursor-not-allowed opacity-50' : 'hover:-translate-y-0.5 hover:shadow-xl'} `}
        >
          {postType === 'SONG_SHARE' ? 'Compartir' : 'Solicitar'}
        </Button>
      </div>
    </div>
  );
};
