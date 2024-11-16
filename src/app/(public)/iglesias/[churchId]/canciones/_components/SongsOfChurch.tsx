'use client';

import { useEffect } from 'react';
import { getSongsOfChurch } from '../_services/songsOfChurchService';
import { SongOfChurchCard } from './SongOfChurchCard';
import { $PlayList } from '@stores/player';

export const SongsOfChurch = ({ params }: { params: { churchId: string } }) => {
  const { data, status } = getSongsOfChurch({ churchId: params.churchId });

  useEffect(() => {
    const songsWithYoutubeLink = data?.filter((song) => song.youtubeLink);

    if (songsWithYoutubeLink && songsWithYoutubeLink.length > 0) {
      const songsToPlaylists = songsWithYoutubeLink.map((song) => ({
        id: song.id,
        youtubeLink: song.youtubeLink,
        name: song.title,
      }));
      $PlayList.set(songsToPlaylists);
    }
  }, [data]);
  return (
    <section className="flex flex-wrap gap-2">
      {status === 'success' &&
        data.map((song) => (
          <SongOfChurchCard
            key={song.id}
            song={song}
            churchId={params.churchId}
          />
        ))}
    </section>
  );
};
