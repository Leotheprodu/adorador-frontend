import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { useStore } from '@nanostores/react';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

// ============================================================================
// LyricsCard Interfaces
// ============================================================================

export interface LyricsCardProps {
  lyric: LyricsProps;
  index: number;
  refetchLyricsOfCurrentSong: () => void;
  params: { bandId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  lyricsOfCurrentSong: LyricsProps[];
  transpose?: number;
  showChords?: boolean;
  lyricsScale?: number;
  isPracticeMode?: boolean;
  activeLineId?: number | null;
  activeChordId?: number | null;
  isUserScrolling?: boolean;
}

export interface LyricsContentProps {
  lyric: LyricsProps;
  transpose: number;
  showChords: boolean;
  lyricsScale: number;
  chordPreferences: ReturnType<typeof useStore>['state'];
  isEditMode?: boolean;
  activeChordId?: number | null;
}

export interface LyricsDragHandleProps {
  dragHandleProps: DraggableProvidedDragHandleProps | null;
}

// ============================================================================
// LyricsGroupedCard Interfaces
// ============================================================================

export interface LyricsGroupedCardProps {
  structure: string;
  structureId: number;
  lyrics: LyricsProps[];
  refetchLyricsOfCurrentSong: () => void;
  params: { bandId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  lyricsOfCurrentSong: LyricsProps[];
  transpose?: number;
  showChords?: boolean;
  lyricsScale?: number;
  isPracticeMode?: boolean;
  activeLineId?: number | null;
  activeChordId?: number | null;
  isUserScrolling?: boolean;
}

export interface LyricsInsertButtonProps {
  onClick: () => void;
  position: 'before' | 'after';
}

export interface LyricsPositionUpdate {
  id: number;
  position: number;
  structureId?: number;
}

// ============================================================================
// EditLyricsOptions Interfaces
// ============================================================================

export interface EditLyricsOptionsProps {
  params: { bandId: string; songId: string };
  songTitle?: string;
  refetchLyricsOfCurrentSong: () => void;
  mutateUploadLyricsByFile: (formData: FormData) => void;
  existingLyrics: LyricsProps[];
  isExpanded?: boolean;
  onClose?: () => void;
}

export interface FileDropZoneProps {
  isDragging: boolean;
  onDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface LyricsDeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

// ============================================================================
// SongViewControls Interfaces
// ============================================================================

export interface SongViewControlsProps {
  songId: string;
}

export interface InlineTransposeControlsProps {
  transpose: number;
  onTransposeChange: (value: number) => void;
}

export interface InlineDisplayTogglesProps {
  showChords: boolean;
  onShowChordsChange: (value: boolean) => void;
  noteType: 'regular' | 'american';
  onNoteTypeChange: (value: 'regular' | 'american') => void;
}
