'use client';

import { useEffect } from 'react';
import { $PlayList } from '@stores/player';
import { UIGuard } from '@global/utils/UIGuard';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import Link from 'next/link';
import { getSongsOfBand } from '../_services/songsOfBandService';
import { SongOfBandCard } from './SongOfBandCard';

export const SongsOfBand = ({ params }: { params: { bandId: string } }) => {
  const { data, isLoading, status, refetch } = getSongsOfBand({
    bandId: params.bandId,
  });

  useEffect(() => {
    const songsWithYoutubeLink = data?.filter((song) => song.youtubeLink);

    if (songsWithYoutubeLink && songsWithYoutubeLink.length > 0) {
      const songsToPlaylists = songsWithYoutubeLink.map((song) => ({
        id: song.id,
        youtubeLink: song.youtubeLink,
        name: song.title,
      }));
      $PlayList.set(
        songsToPlaylists.sort((a, b) => a.name.localeCompare(b.name)),
      );
    }
  }, [data]);
  return (
    <UIGuard isLoading={isLoading}>
      <div className="mb-6 flex items-center gap-2">
        <Link
          href={`/grupos/${params.bandId}`}
          className="group flex items-center justify-center gap-2 transition-all duration-150 hover:cursor-pointer hover:text-primary-500"
        >
          <BackwardIcon />
          <small className="hidden group-hover:block">Volver al grupo</small>
        </Link>
        <h1 className="text-xl font-bold">Canciones</h1>
      </div>
      <div className="my-6 border-l-2 border-teal-300 p-2">
        <h2 className="my-4 text-lg">Adoración</h2>
        <section className="flex flex-wrap gap-2">
          {status === 'success' &&
            data
              .filter((song) => song.songType === 'worship')
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((song) => (
                <SongOfBandCard
                  key={song.id}
                  song={song}
                  bandId={params.bandId}
                  refetch={refetch}
                />
              ))}
        </section>
      </div>
      <div className="my-6 border-l-2 border-orange-200 p-2">
        <h2 className="my-4 text-lg">Alabanza</h2>
        <section className="flex flex-wrap gap-2">
          {status === 'success' &&
            data
              .filter((song) => song.songType === 'praise')
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((song) => (
                <SongOfBandCard
                  key={song.id}
                  song={song}
                  bandId={params.bandId}
                  refetch={refetch}
                />
              ))}
        </section>
      </div>
    </UIGuard>
  );
};
