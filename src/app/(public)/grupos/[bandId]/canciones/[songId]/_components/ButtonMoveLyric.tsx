import { structureLib } from '@global/config/constants';
import { ArrowsUpDownIconIcon } from '@global/icons/ArrowsUpDownIcon';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";
import { useEffect, useState } from 'react';
import { updateLyricsPositionsService } from '../_services/songIdServices';

export const ButtonMoveLyric = ({
  lyricsOfCurrentSong,
  currentLyric,
  params,
  refetchLyricsOfCurrentSong,
}: {
  lyricsOfCurrentSong: LyricsProps[];
  currentLyric: LyricsProps;
  params: { bandId: string; songId: string };
  refetchLyricsOfCurrentSong: () => void;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [spaces, setSpaces] = useState<number>(0);
  const [message, setMessage] = useState<string>('');
  const [lyricBehing, setLyricBehind] = useState<LyricsProps | null>(null);
  const {
    mutate: mutateUpdateLyricsPositions,
    isPending: isPendingUpdateLyricsPositions,
    status: statusUpdateLyricsPositions,
  } = updateLyricsPositionsService({ params });
  useEffect(() => {
    const spacesToFind = direction === 'up' && spaces === 1 ? 2 : spaces;
    const findLyricBehind = lyricsOfCurrentSong?.find(
      (lyric) =>
        lyric.position !== 1 &&
        lyric.position ===
          currentLyric?.position +
            (direction === 'up' ? -spacesToFind : spacesToFind),
    );
    setLyricBehind(findLyricBehind || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaces, direction]);

  useEffect(() => {
    const actualLyricPosition = currentLyric.position;
    setMessage('');
    if (direction === 'up' && actualLyricPosition - spaces < 1) {
      setMessage('No se puede mover la letra a esa posición');
      return;
    }
    if (
      direction === 'down' &&
      actualLyricPosition + spaces > lyricsOfCurrentSong.length
    ) {
      setMessage('No se puede mover la letra a esa posición');
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spaces, direction]);

  useEffect(() => {
    if (statusUpdateLyricsPositions === 'success') {
      refetchLyricsOfCurrentSong();
      onOpenChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUpdateLyricsPositions]);

  const handleSetSpaces = (e: React.ChangeEvent<HTMLInputElement>) => {
    const spacesSelected = Number(e.target.value);

    setSpaces(spacesSelected);
  };

  const handleMoveLyric = () => {
    const newLyrics = [...lyricsOfCurrentSong].sort(
      (a, b) => a.position - b.position,
    );
    const newPositionOfCurrentLyric =
      direction === 'up'
        ? currentLyric.position - spaces
        : currentLyric.position + spaces;
    const newPositionOfLyrics = newLyrics.map((lyrics) => {
      if (lyrics.position === currentLyric.position) {
        return {
          id: lyrics.id,
          position: newPositionOfCurrentLyric,
        };
      } else if (lyrics.position === newPositionOfCurrentLyric) {
        return {
          id: lyrics.id,
          position: lyrics.position + (direction === 'up' ? 1 : -1),
        };
      } else if (
        direction === 'up' &&
        lyrics.position > newPositionOfCurrentLyric &&
        lyrics.position < currentLyric.position
      ) {
        return {
          id: lyrics.id,
          position: lyrics.position + 1,
        };
      } else if (
        direction === 'down' &&
        lyrics.position < newPositionOfCurrentLyric &&
        lyrics.position > currentLyric.position
      ) {
        return {
          id: lyrics.id,
          position: lyrics.position - 1,
        };
      }
    });
    if (newPositionOfLyrics && newPositionOfLyrics.length > 0) {
      const filteredNewPositionOfLyrics = newPositionOfLyrics.filter(
        (lyric) => lyric !== undefined,
      ) as { id: number; position: number }[];
      mutateUpdateLyricsPositions(filteredNewPositionOfLyrics);
    }
  };

  return (
    <>
      <button onClick={onOpen}>
        <ArrowsUpDownIconIcon className="text-primary-500" />
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Mover letra
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Cuantos espacios y en que dirección desea mover la letra:{' '}
                  <span className="font-bold">{currentLyric.lyrics}</span>?
                </p>
                <div className="flex items-center gap-4">
                  <Select
                    label="Dirección"
                    selectedKeys={[direction]}
                    onChange={(e) =>
                      setDirection(e.target.value as 'up' | 'down')
                    }
                  >
                    <SelectItem key="up">Subir</SelectItem>
                    <SelectItem key="down">Bajar</SelectItem>
                  </Select>

                  <Input
                    label="Espacios a mover"
                    value={spaces.toString()}
                    onChange={handleSetSpaces}
                    type="number"
                  />
                </div>
                {message === '' && spaces > 0 ? (
                  <p className="text-sm">
                    De acuerdo a la selección, la letra se moverá {spaces}{' '}
                    {spaces === 1 ? 'espacio' : 'espacios'} hacia{' '}
                    {direction === 'up' ? 'arriba' : 'abajo'},
                    {lyricBehing === null ? (
                      <span> al inicio.</span>
                    ) : (
                      <span>
                        {' '}
                        justo después de la letra{' '}
                        <span className="font-bold">
                          {lyricBehing?.lyrics}
                        </span>{' '}
                        que está el{' '}
                        <span className="font-bold">
                          {lyricBehing &&
                            structureLib[lyricBehing?.structure.title].es}
                        </span>
                      </span>
                    )}
                  </p>
                ) : (
                  <p>{message}</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  isLoading={isPendingUpdateLyricsPositions}
                  isDisabled={message !== ''}
                  color="primary"
                  onPress={handleMoveLyric}
                >
                  Aceptar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
