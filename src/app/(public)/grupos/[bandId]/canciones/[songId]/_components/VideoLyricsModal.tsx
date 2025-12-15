'use client';

import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/react';
import { VideoLyricsManager } from './VideoLyricsManager';
import { PlayIcon } from '@global/icons';

interface VideoLyricsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bandId: string;
  songId: string;
}

export const VideoLyricsModal = ({
  isOpen,
  onClose,
  bandId,
  songId,
}: VideoLyricsModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: 'max-h-[90vh]',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex items-center gap-3 bg-brand-purple-50 pb-4 dark:bg-gray-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-pink-500 to-brand-purple-500 shadow-md">
            <PlayIcon className="h-4 w-4" />
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 bg-clip-text text-xl font-bold text-transparent">
              Videos con Lyrics
            </h2>
            <p className="text-xs font-normal text-slate-500">
              Gestiona videos de YouTube con instrumental y/o letras
            </p>
          </div>
        </ModalHeader>
        <ModalBody className="py-6">
          <VideoLyricsManager bandId={bandId} songId={songId} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
