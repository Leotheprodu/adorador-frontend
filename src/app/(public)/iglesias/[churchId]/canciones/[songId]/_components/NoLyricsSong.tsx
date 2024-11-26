import React from 'react';
import { AddOrUpdateLyricForm } from './AddOrUpdateLyricForm';
import { LyricsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';

export const NoLyricsSong = ({
  mutateUploadLyricsByFile,
  refetchLyricsOfCurrentSong,
  LyricsOfCurrentSong,
  params,
}: {
  mutateUploadLyricsByFile: (formData: FormData) => void;
  refetchLyricsOfCurrentSong: () => void;
  LyricsOfCurrentSong: LyricsProps[];
  params: { churchId: string; songId: string };
}) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold">Esta canción aun no tiene letra</h3>
      <p>Empieza a escribir la letra o puedes subir un archivo txt</p>
      <AddOrUpdateLyricForm
        refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
        LyricsOfCurrentSong={LyricsOfCurrentSong}
        params={params}
      />
      <div className="flex flex-col gap-3 rounded-lg border-1 border-slate-100 bg-slate-50 p-4">
        <h4 className="mb-4 font-bold">Subir Archivo .txt</h4>
        <p>
          Al subir un archivo txt con la letra y acordes,{' '}
          <span className="text-danger-800">
            debes cumplir con los siguietes requisitos
          </span>
          :
        </p>
        <ol>
          <li>No debe haber espacios en blanco entre lineas</li>
          <li>Los acordes deben estar sobre la letra a la que pertenecen</li>
          <li>
            Unicamente letra y acordes, no deben haber titulos ni anotaciones
            diferentes
          </li>
          <li>Los acordes deben estar en el formato C, Cm, C7, Bm/G, D# etc</li>
          <li>El archivo txt debe estar codificado en UTF-8</li>
        </ol>
        <div className="rounded-md bg-slate-100 p-5">
          <input
            type="file"
            accept=".txt"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const formData = new FormData();
                formData.append('file', file);
                mutateUploadLyricsByFile(formData);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};
