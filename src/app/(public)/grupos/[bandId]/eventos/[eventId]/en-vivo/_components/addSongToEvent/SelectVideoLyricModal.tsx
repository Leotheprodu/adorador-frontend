import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import { SongVideoLyrics } from '@bands/[bandId]/canciones/_interfaces/songsInterface';

interface SelectVideoLyricModalProps {
  isOpen: boolean;
  onClose: () => void;
  songTitle: string;
  videoLyrics: SongVideoLyrics[];
  onSelect: (videoLyricId: number) => void;
}

export const SelectVideoLyricModal = ({
  isOpen,
  onClose,
  songTitle,
  videoLyrics,
  onSelect,
}: SelectVideoLyricModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2 bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 pb-4 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 shadow-md">
                  <span className="text-xl">📹</span>
                </div>
                <div>
                  <h2 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-xl font-bold text-transparent dark:from-brand-purple-300 dark:to-brand-blue-300">
                    Seleccionar Video Lyric
                  </h2>
                  <p className="text-xs font-normal text-slate-500 dark:text-slate-300">
                    &quot;{songTitle}&quot; tiene {videoLyrics.length} opciones
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="py-6 dark:bg-gray-950">
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-300">
                Selecciona el video lyric que deseas usar para este evento:
              </p>
              <div className="space-y-2">
                {videoLyrics.map((videoLyric) => (
                  <button
                    key={videoLyric.id}
                    onClick={() => {
                      onSelect(videoLyric.id);
                      onClose();
                    }}
                    className="w-full rounded-lg border-2 border-slate-200 bg-white p-4 text-left transition-all hover:border-brand-purple-400 hover:bg-brand-purple-50 hover:shadow-md dark:border-slate-700 dark:bg-gray-900 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                            {videoLyric.title || `Video ${videoLyric.id}`}
                          </h4>
                          {videoLyric.isPreferred && (
                            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-900 dark:text-amber-200">
                              ⭐ Preferido
                            </span>
                          )}
                        </div>
                        {videoLyric.description && (
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                            {videoLyric.description}
                          </p>
                        )}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                            {videoLyric.videoType === 'instrumental'
                              ? '🎹 Instrumental'
                              : '🎤 Con voces'}
                          </span>
                          <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                            ID: {videoLyric.youtubeId}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </ModalBody>
            <ModalFooter className="bg-slate-50 dark:bg-gray-900">
              <Button variant="flat" onPress={onClose} className="font-medium">
                Cancelar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
