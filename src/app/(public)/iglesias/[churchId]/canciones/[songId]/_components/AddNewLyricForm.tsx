import { LyricsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { addNewLyricService } from '../_services/songIdServices';
import { songStructure, structureLib } from '@global/config/constants';

export const AddNewLyricForm = ({
  refetchLyricsOfCurrentSong,
  LyricsOfCurrentSong,
  params,
  setAddNewLyric,
}: {
  refetchLyricsOfCurrentSong: () => void;
  LyricsOfCurrentSong: LyricsProps[];
  params: { churchId: string; songId: string };
  setAddNewLyric?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [newLyric, setNewLyric] = useState<string>('');
  const [structure, setStructure] = useState<number>(0);
  const {
    status,
    mutate: mutateAddNewLyric,
    isPending,
  } = addNewLyricService({ params });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (structure !== 0 && newLyric !== '') {
      mutateAddNewLyric({
        structureId: structure,
        lyrics: newLyric,
        position: LyricsOfCurrentSong.length + 1,
      });
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const formElement = document.querySelector('.form-add-new-lyric');
      if (formElement && !formElement.contains(event.target as Node)) {
        if (setAddNewLyric) setAddNewLyric(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [setAddNewLyric]);
  useEffect(() => {
    if (status === 'success') {
      setNewLyric('');
      refetchLyricsOfCurrentSong();
      if (setAddNewLyric) setAddNewLyric(false);
    }
  }, [status, refetchLyricsOfCurrentSong, setAddNewLyric]);

  return (
    <form
      onSubmit={handleSubmit}
      className="form-add-new-lyric flex flex-col items-center justify-center gap-3 rounded-lg border-1 border-slate-100 bg-slate-50 p-4"
    >
      <Input
        value={newLyric}
        onChange={(e) => setNewLyric(e.currentTarget.value)}
        placeholder="Agregar nueva letra"
        autoFocus
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            e.preventDefault();
            if (setAddNewLyric) setAddNewLyric(false);
          }
        }}
      />
      <div className="flex items-center justify-center gap-4">
        <Select
          className="w-[10rem]"
          label="Estructura"
          onSelectionChange={(e) => {
            const selectedValue = Array.from(e);

            setStructure(parseInt(selectedValue[0] as string));
          }}
        >
          {songStructure.map((structure) => (
            <SelectItem key={structure.id}>
              {structureLib[structure.title].es}
            </SelectItem>
          ))}
        </Select>
        <Button isLoading={isPending} type="submit" color="primary">
          Agregar
        </Button>
      </div>
    </form>
  );
};
