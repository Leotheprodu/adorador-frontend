import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { AddSongButton } from './AddSongButton';

export const SongsSection = ({ data, bandId }) => {
  return (
    <div className="rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm">
      {/* Header de la sección */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 shadow-lg">
            <span className="text-2xl">🎵</span>
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
              Canciones
            </h2>
            {data && (
              <p className="text-sm text-slate-500">
                {data?._count?.songs || 0} en total
              </p>
            )}
          </div>
        </div>
        <AddSongButton bandId={bandId} />
      </div>

      {/* Grid de canciones o estado vacío */}
      {data && data.songs && data.songs.length > 0 ? (
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.songs.map((song) => (
            <li key={song.id}>
              <Link href={`/grupos/${bandId}/canciones/${song.id}`}>
                <div className="group relative overflow-hidden rounded-xl border-2 border-transparent bg-gradient-to-br from-white to-brand-purple-50/30 p-4 shadow-sm transition-all duration-200 hover:scale-105 hover:border-brand-purple-300 hover:shadow-xl active:scale-95">
                  {/* Efecto hover decorativo */}
                  <div className="absolute right-0 top-0 h-20 w-20 -translate-y-8 translate-x-8 rounded-full bg-gradient-to-br from-brand-purple-200 to-brand-blue-200 opacity-0 blur-2xl transition-opacity duration-200 group-hover:opacity-100"></div>

                  <div className="relative z-10">
                    <h3 className="mb-1 font-semibold text-slate-800 group-hover:text-brand-purple-700">
                      {song.title}
                    </h3>
                    <p className="text-sm text-slate-500">{song.artist}</p>
                  </div>

                  {/* Indicador de acción */}
                  <div className="absolute bottom-2 right-2 text-brand-purple-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
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
        <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-brand-purple-50/50 to-brand-blue-50/50 py-12">
          <div className="mb-4 text-6xl opacity-50">🎵</div>
          <h3 className="mb-2 text-lg font-semibold text-slate-700">
            Aún no hay canciones
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            Comienza agregando tu primera canción al repertorio
          </p>
        </div>
      )}

      {/* Botón ver todas */}
      {data && data?._count.songs > 5 && (
        <div className="mt-6 flex justify-center">
          <Button
            as={Link}
            href={`/grupos/${bandId}/canciones`}
            className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Ver todas las canciones ({data?._count.songs})
          </Button>
        </div>
      )}
    </div>
  );
};
