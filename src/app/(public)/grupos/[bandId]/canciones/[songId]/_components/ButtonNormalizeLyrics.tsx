'use client';
import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { normalizeLyricsService } from '../_services/songIdServices';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import toast from 'react-hot-toast';

interface ButtonNormalizeLyricsProps {
  params: { bandId: string; songId: string };
  lyrics: LyricsProps[];
  refetchLyricsOfCurrentSong: () => void;
}

export const ButtonNormalizeLyrics = ({
  params,
  lyrics,
  refetchLyricsOfCurrentSong,
}: ButtonNormalizeLyricsProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    mutate: mutateNormalizeLyrics,
    status: statusNormalizeLyrics,
    data: normalizeData,
  } = normalizeLyricsService({ params });

  useEffect(() => {
    if (statusNormalizeLyrics === 'success' && normalizeData) {
      toast.success(
        `Se normalizaron ${normalizeData.normalized} letras correctamente`,
      );
      refetchLyricsOfCurrentSong();
      setIsProcessing(false);
    } else if (statusNormalizeLyrics === 'error') {
      toast.error('Error al normalizar las letras');
      setIsProcessing(false);
    }
  }, [statusNormalizeLyrics, normalizeData, refetchLyricsOfCurrentSong]);

  const handleNormalize = () => {
    setIsProcessing(true);
    const lyricIds = lyrics.map((lyric) => lyric.id);
    mutateNormalizeLyrics({ lyricIds });
  };

  if (!lyrics || lyrics.length === 0) {
    return null;
  }

  return (
    <>
      <Button
        size="sm"
        onClick={onOpen}
        disabled={isProcessing}
        className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
        startContent={<span className="text-base">🔧</span>}
      >
        Normalizar
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Normalizar Formato de Letras
              </ModalHeader>
              <ModalBody>
                <div className="space-y-3">
                  <p>
                    Esta acción va a normalizar el formato de{' '}
                    <span className="font-bold">{lyrics.length} letras</span> de
                    la canción.
                  </p>
                  <div className="rounded-lg bg-slate-100 p-3">
                    <p className="mb-2 text-sm font-semibold text-slate-700">
                      ¿Qué hace la normalización?
                    </p>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• Ajusta el espaciado entre acordes</li>
                      <li>• Corrige la posición de los acordes</li>
                      <li>• Estandariza el formato de la letra</li>
                      <li>• Limpia caracteres innecesarios</li>
                    </ul>
                  </div>
                  <p className="text-sm text-warning-600">
                    ⚠️ Este proceso es irreversible. Asegúrate de revisar las
                    letras después de normalizar.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  disabled={isProcessing}
                >
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleNormalize();
                    onClose();
                  }}
                  isLoading={isProcessing}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Normalizando...' : 'Normalizar'}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
