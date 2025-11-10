import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { AddSongButton } from './AddSongButton';
import { MusicNoteIcon } from '@global/icons';

export const SongsSection = ({ data, bandId }) => {
  const hasMany = data && data?._count.songs > 5;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* Header de la sección */}
      <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-purple-600">
            <MusicNoteIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Canciones</h2>
            {data && (
              <p className="text-sm text-slate-500">
                {data?._count?.songs || 0} en total
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasMany && (
            <Button
              as={Link}
              href={`/grupos/${bandId}/canciones`}
              size="sm"
              className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50"
            >
              <span className="whitespace-nowrap">
                Ver todas ({data?._count.songs})
              </span>
            </Button>
          )}
          <AddSongButton bandId={bandId} />
        </div>
      </div>

      {/* Grid de canciones o estado vacío */}
      {data && data.songs && data.songs.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.songs.map((song) => (
            <li key={song.id}>
              <Link href={`/grupos/${bandId}/canciones/${song.id}`}>
                <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-brand-purple-300 hover:shadow-md active:scale-[0.98]">
                  <div className="relative z-10">
                    <h3 className="mb-1 font-semibold text-slate-800 group-hover:text-brand-purple-600">
                      {song.title}
                    </h3>
                    <p className="text-sm text-slate-500">{song.artist}</p>
                  </div>

                  {/* Indicador de acción */}
                  <div className="absolute bottom-3 right-3 text-slate-300 opacity-0 transition-all duration-200 group-hover:text-brand-purple-500 group-hover:opacity-100">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12">
          <MusicNoteIcon className="mb-4 h-12 w-12 text-slate-300" />
          <h3 className="mb-2 text-lg font-semibold text-slate-700">
            Aún no hay canciones
          </h3>
          <p className="text-sm text-slate-500">
            Comienza agregando tu primera canción al repertorio
          </p>
        </div>
      )}
    </div>
  );
};
