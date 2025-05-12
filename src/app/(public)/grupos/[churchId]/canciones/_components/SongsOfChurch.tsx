'use client';

import { useEffect } from 'react';
import { getSongsOfChurch } from '../_services/songsOfChurchService';
import { SongOfChurchCard } from './SongOfChurchCard';
import { $PlayList } from '@stores/player';
import { UIGuard } from '@global/utils/UIGuard';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import Link from 'next/link';

export const SongsOfChurch = ({ params }: { params: { churchId: string } }) => {
  const { data, isLoading, status } = getSongsOfChurch({
    churchId: params.churchId,
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
          href={`/grupos/${params.churchId}`}
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
                <SongOfChurchCard
                  key={song.id}
                  song={song}
                  churchId={params.churchId}
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
                <SongOfChurchCard
                  key={song.id}
                  song={song}
                  churchId={params.churchId}
                />
              ))}
        </section>
      </div>
    </UIGuard>
  );
};
