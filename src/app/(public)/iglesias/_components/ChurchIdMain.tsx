'use client';

import { formatDate, formatTime } from '@global/utils/dataFormat';
import { SongProps } from '@iglesias/[churchId]/canciones/_interfaces/songsInterface';
import { getSongsOfChurch } from '@iglesias/[churchId]/canciones/_services/songsOfChurchService';
import { getChurchById } from '@iglesias/_services/churchesService';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export const ChurchIdMain = ({ churchId }: { churchId: string }) => {
  const { data } = getChurchById(churchId);
  const { data: songs } = getSongsOfChurch({
    churchId,
  });
  const currentDate = new Date();
  const [LimitedListOfSongs, setLimitedListOfSongs] = useState<SongProps[]>([]);
  const limitOfSongs = 5;
  useEffect(() => {
    if (songs) {
      setLimitedListOfSongs(
        songs
          .sort((a, b) => b._count.events - a._count.events)
          .slice(0, limitOfSongs),
      );
    }
  }, [songs]);
  return (
    <div>
      <h1 className="text-center text-xl font-bold">{data?.name}</h1>

      <div className="my-4 flex flex-col items-center justify-center">
        <div className="my-4 flex flex-col justify-center">
          <h2 className="my-6 text-lg">Canciones</h2>
          <ul className="flex flex-wrap justify-center gap-3">
            {LimitedListOfSongs?.map((song) => (
              <li key={song.id}>
                <Link href={`/iglesias/${churchId}/canciones/${song.id}`}>
                  <div className="rounded-md border p-2 hover:cursor-pointer hover:bg-gray-100">
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {songs && songs?.length > limitOfSongs && (
            <div className="flex justify-center">
              <Button
                color="primary"
                variant="ghost"
                as={Link}
                href={`/iglesias/${churchId}/canciones`}
                className="mt-4 w-48"
              >
                Ver todas las canciones
              </Button>
            </div>
          )}
        </div>
        <div className="my-4 flex flex-col justify-center">
          <h2 className="my-6 text-lg">Eventos</h2>
          <ul className="flex flex-wrap justify-center gap-3">
            {data?.events
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime(),
              )
              .map((event) => (
                <li className="flex flex-wrap" key={event.id}>
                  <Link href={`/iglesias/${churchId}/eventos/${event.id}`}>
                    <div
                      className={`${currentDate < new Date(event.date) ? 'border-success-500' : 'border-gray-100'} rounded-md border p-2 hover:cursor-pointer hover:bg-gray-100`}
                    >
                      <h3>{event.title}</h3>
                      <div className="border-b border-t border-gray-200">
                        <div className="flex w-full justify-center bg-slate-100">
                          {currentDate < new Date(event.date) ? (
                            <small className="text-primary-400">
                              Próximamente
                            </small>
                          ) : (
                            <small className="text-secondary-400">
                              Ya pasó
                            </small>
                          )}
                        </div>
                        <div className="flex flex-col items-center">
                          <p>{formatDate(event.date)}</p>
                          <p>{formatTime(event.date)}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
