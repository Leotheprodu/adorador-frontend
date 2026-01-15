'use client';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { GearIcon } from '@global/icons';
import { useRehearsalControls } from '../_hooks/useRehearsalControls';
import { TransposeControls } from './rehearsalControls/TransposeControls';
import { LyricsScaleControls } from './rehearsalControls/LyricsScaleControls';
import { DisplayOptions } from './rehearsalControls/DisplayOptions';
import { NoteType } from '@stores/event';

interface RehearsalControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  songId: string;
  transpose: number;
  onTransposeChange?: (val: number) => void;
  lyricsScale: number;
  onScaleChange?: (val: number) => void;
  showChords: boolean;
  onShowChordsChange?: (val: boolean) => void;
  noteType: NoteType;
  onNoteTypeChange?: (val: NoteType) => void;
}

export const RehearsalControlsModal = ({
  isOpen,
  onClose,
  songId,
  transpose,
  onTransposeChange,
  lyricsScale,
  onScaleChange,
  showChords,
  onShowChordsChange,
  noteType,
  onNoteTypeChange,
}: RehearsalControlsModalProps) => {
  // No internal hook usage
  // All state is controlled by props

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 dark:bg-gray-900">
          <GearIcon className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Controles de Ensayo
            </h3>
            <p className="text-xs font-normal text-slate-500 dark:text-slate-400">
              Ajusta la visualización para practicar
            </p>
          </div>
        </ModalHeader>
        <ModalBody className="space-y-6 py-6 dark:bg-gray-950">
          {/* Transpose Control */}
          <TransposeControls
            transpose={transpose}
            onTransposeChange={onTransposeChange || (() => {})}
          />

          {/* Lyrics Scale Control */}
          <LyricsScaleControls
            lyricsScale={lyricsScale}
            onScaleChange={onScaleChange || (() => {})}
          />

          {/* Display Options */}
          <DisplayOptions
            showChords={showChords}
            noteType={noteType}
            onShowChordsChange={onShowChordsChange || (() => {})}
            onNoteTypeChange={onNoteTypeChange || (() => {})}
          />

          {/* Info footer */}
          <div className="rounded-lg bg-slate-50 p-3 text-center dark:bg-gray-900">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Los cambios se sincronizan automáticamente con eventos activos
            </p>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
