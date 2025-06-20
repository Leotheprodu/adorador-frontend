import { chordQualities, keys } from '@global/config/constants';
import {
  ChordPropsWithoutId,
  LyricsProps,
} from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { addChordToLyricService } from '../_services/songIdServices';

export const NoChordCard = ({
  position,
  lyric,
  refetchLyricsOfCurrentSong,
  params,
}: {
  position: number;
  lyric: LyricsProps;
  refetchLyricsOfCurrentSong: () => void;
  params: { bandId: string; songId: string };
}) => {
  const [chord, setChord] = useState<ChordPropsWithoutId>({
    rootNote: '',
    chordQuality: '',
    slashChord: '',
    position: position,
  });

  const { status, isPending, mutate } = addChordToLyricService({
    params,
    lyricId: lyric.id,
  });

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (status === 'success') {
      refetchLyricsOfCurrentSong();
      onOpenChange();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);
  const handleSetChord = (e, name: string) => {
    const selectedValue = Array.from(e);
    if (name === 'rootNote') {
      setChord({ ...chord, rootNote: selectedValue[0] as string });
    } else if (name === 'chordQuality') {
      setChord({ ...chord, chordQuality: selectedValue[0] as string });
    } else {
      setChord({ ...chord, slashChord: selectedValue[0] as string });
    }
  };
  const [chordQualitiesSorted, setChordQualities] = useState<string[]>(['']);
  useEffect(() => {
    const sortedChordQualities = chordQualities.sort((a, b) => {
      if (a === '') return -1;
      if (b === '') return 1;
      return a.localeCompare(b);
    });
    setChordQualities(sortedChordQualities);
  }, []);

  const createNewChordHandle = () => {
    mutate({
      rootNote: chord.rootNote,
      chordQuality: chord.chordQuality === '' ? undefined : chord.chordQuality,
      slashChord: chord.slashChord === '' ? undefined : chord.slashChord,
      position,
    });
  };
  return (
    <div
      style={{
        gridColumnStart: position,
        gridColumnEnd: position + 1,
        gridRowStart: 1,
      }}
      className="flex h-10 w-10 items-end justify-center gap-1 rounded-md border-primary-500 hover:border-1"
    >
      <button
        onClick={onOpen}
        className={
          'invisible w-full text-center text-slate-400 group-hover:visible'
        }
      >
        +
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Agregar nuevo acorde
              </ModalHeader>
              <ModalBody>
                <form>
                  <div className="flex flex-col gap-2 rounded-sm border-1 border-slate-200 px-2 py-4">
                    <h2>Acorde Principal</h2>

                    <div className="flex gap-2">
                      <Select
                        className=""
                        name="rootNote"
                        label="selecciona una nota"
                        onSelectionChange={(e) => handleSetChord(e, 'rootNote')}
                        value={chord.rootNote}
                      >
                        {keys.map((nota) => (
                          <SelectItem key={nota}>{nota}</SelectItem>
                        ))}
                      </Select>
                      <Select
                        className=""
                        name="chordQuality"
                        label="selecciona la calidad"
                        onSelectionChange={(e) =>
                          handleSetChord(e, 'chordQuality')
                        }
                        value={chord.chordQuality}
                      >
                        {chordQualitiesSorted.map((quality) => (
                          <SelectItem key={quality}>
                            {quality === '' ? 'Mayor' : quality}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 rounded-sm border-1 border-slate-200 px-2 py-4">
                    <h2>Acorde con bajo</h2>

                    <div className="flex gap-2">
                      <Select
                        className=""
                        name="slashChord"
                        label="Selecciona si el acorde tiene un bajo diferente"
                        onSelectionChange={(e) =>
                          handleSetChord(e, 'slashChord')
                        }
                        value={chord.slashChord}
                      >
                        {keys.map((nota) => (
                          <SelectItem key={nota}>{nota}</SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  disabled={isPending}
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancelar
                </Button>
                <Button
                  isLoading={isPending}
                  color="primary"
                  onPress={createNewChordHandle}
                >
                  Agregar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
