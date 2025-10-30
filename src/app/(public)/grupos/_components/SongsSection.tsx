import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { AddSongButton } from './AddSongButton';

export const SongsSection = ({ data, bandId }) => {
  return (
    <div className="my-4 flex flex-col justify-center">
      <div className="my-6 flex items-center">
        <h2 className="text-lg">Canciones</h2>
        <AddSongButton bandId={bandId} />
      </div>
      <ul className="flex flex-wrap justify-center gap-3">
        {data &&
          data.songs?.map((song) => (
            <li key={song.id}>
              <Link href={`/grupos/${bandId}/canciones/${song.id}`}>
                <div className="rounded-md border p-2 hover:cursor-pointer hover:bg-gray-100">
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
                </div>
              </Link>
            </li>
          ))}
      </ul>
      {data && data?._count.songs > 5 && (
        <div className="flex justify-center">
          <Button
            color="primary"
            variant="ghost"
            as={Link}
            href={`/grupos/${bandId}/canciones`}
            className="mt-4 w-48"
          >
            Ver todas las canciones ({data?._count.songs})
          </Button>
        </div>
      )}
    </div>
  );
};
