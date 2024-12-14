import { LyricsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import {
  addNewLyricService,
  updateLyricService,
  updateLyricsPositionsService,
} from '../_services/songIdServices';
import { songStructure, structureLib } from '@global/config/constants';
import toast from 'react-hot-toast';

export const AddOrUpdateLyricForm = ({
  refetchLyricsOfCurrentSong,
  LyricsOfCurrentSong,
  params,
  setAddNewLyric,
  type = 'add',
  dataOfLyricToUpdate,
  newPosition,
}: {
  refetchLyricsOfCurrentSong: () => void;
  params: { churchId: string; songId: string };
  LyricsOfCurrentSong?: LyricsProps[];
  setAddNewLyric?: React.Dispatch<React.SetStateAction<boolean>>;
  type?: 'add' | 'update';
  dataOfLyricToUpdate?: LyricsProps;
  newPosition?: number;
}) => {
  const [newLyric, setNewLyric] = useState<string>('');
  const [structure, setStructure] = useState<number>(0);
  const {
    status: statusAddNewLyric,
    mutate: mutateAddNewLyric,
    isPending: isPendingAddNewLyric,
  } = addNewLyricService({ params });

  const {
    status: statusUpdateLyric,
    mutate: mutateUpdateLyric,
    isPending: isPendingUpdateLyric,
  } = updateLyricService({
    params,
    lyricId: dataOfLyricToUpdate ? dataOfLyricToUpdate.id : 0,
  });

  const {
    status: statusUpdateLyricsPositions,
    mutate: mutateUpdateLyricsPositions,
    isPending: isPendingUpdateLyricsPositions,
  } = updateLyricsPositionsService({ params });

  useEffect(() => {
    if (statusUpdateLyricsPositions === 'success' && newPosition) {
      mutateAddNewLyric({
        structureId: structure,
        lyrics: newLyric,
        position: newPosition,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUpdateLyricsPositions, newPosition]);

  useEffect(() => {
    if (type === 'update' && dataOfLyricToUpdate) {
      setNewLyric(dataOfLyricToUpdate.lyrics);
      setStructure(dataOfLyricToUpdate.structure.id);
    }
  }, [dataOfLyricToUpdate, type]);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (structure === 0) {
      toast.error('Selecciona una estructura');
      return;
    }
    if (newLyric === '') {
      toast.error('La letra no puede estar vacía');
      return;
    }
    if (type === 'add') {
      if (
        LyricsOfCurrentSong &&
        newPosition &&
        newPosition <= LyricsOfCurrentSong.length
      ) {
        const newLyrics = [...LyricsOfCurrentSong].sort(
          (a, b) => a.position - b.position,
        );
        const newPositionOfLyrics = newLyrics.map((lyric) => {
          if (lyric.position >= newPosition) {
            return { id: lyric.id, position: lyric.position + 1 };
          }
        });
        if (newPositionOfLyrics && newPositionOfLyrics.length > 0) {
          const filteredNewPositionOfLyrics = newPositionOfLyrics.filter(
            (lyric) => lyric !== undefined,
          ) as { id: number; position: number }[];
          mutateUpdateLyricsPositions(filteredNewPositionOfLyrics);
        }
      } else if (LyricsOfCurrentSong && !newPosition) {
        mutateAddNewLyric({
          structureId: structure,
          lyrics: newLyric,
          position: LyricsOfCurrentSong.length + 1,
        });
      } else if (
        LyricsOfCurrentSong &&
        newPosition &&
        newPosition === LyricsOfCurrentSong.length + 1
      ) {
        mutateAddNewLyric({
          structureId: structure,
          lyrics: newLyric,
          position: newPosition,
        });
      }
    } else if (type === 'update' && dataOfLyricToUpdate) {
      mutateUpdateLyric({
        structureId: structure,
        lyrics: newLyric,
        position: dataOfLyricToUpdate.position,
      });
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const formElement = document.querySelector(
        type === 'add' ? '.form-add-new-lyric' : '.form-update-lyric',
      );
      if (formElement && !formElement.contains(event.target as Node)) {
        if (setAddNewLyric) setAddNewLyric(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setAddNewLyric, type]);
  useEffect(() => {
    if (statusAddNewLyric === 'success') {
      setNewLyric('');
      refetchLyricsOfCurrentSong();
      toast.success('Letra agregada');
      if (setAddNewLyric) setAddNewLyric(false);
    }
  }, [statusAddNewLyric, refetchLyricsOfCurrentSong, setAddNewLyric]);
  useEffect(() => {
    if (statusUpdateLyric === 'success') {
      setNewLyric('');
      refetchLyricsOfCurrentSong();
      toast.success('Letra actualizada');
      if (setAddNewLyric) setAddNewLyric(false);
    }
  }, [statusUpdateLyric, refetchLyricsOfCurrentSong, setAddNewLyric]);

  return (
    <form
      onSubmit={handleSubmit}
      className={`${type === 'add' ? 'form-add-new-lyric' : 'form-update-lyric'} flex flex-col items-center justify-center gap-3 rounded-lg border-1 border-slate-100 bg-slate-50 p-4`}
    >
      <Input
        value={newLyric}
        onChange={(e) => setNewLyric(e.currentTarget.value)}
        placeholder="Agregar nueva letra"
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            if (setAddNewLyric) setAddNewLyric(false);
          }
        }}
      />
      <div className="flex w-full items-center gap-2">
        <Select
          className=""
          selectedKeys={structure === 0 ? undefined : [structure.toString()]}
          label="Estructura"
          onChange={(e) => {
            setStructure(parseInt(e.target.value));
          }}
        >
          {songStructure.map((structure) => (
            <SelectItem key={structure.id}>
              {structureLib[structure.title].es}
            </SelectItem>
          ))}
        </Select>
        <Button
          isLoading={
            isPendingAddNewLyric ||
            isPendingUpdateLyric ||
            isPendingUpdateLyricsPositions
          }
          type="submit"
          color="primary"
        >
          Aceptar
        </Button>
      </div>
    </form>
  );
};
