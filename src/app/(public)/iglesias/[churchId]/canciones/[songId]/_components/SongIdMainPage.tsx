'use client';

import { getSongData } from '../_services/songIdServices';

export const SongIdMainPage = ({
  params,
}: {
  params: { churchId: string; songId: string };
}) => {
  const { data, status } = getSongData({ params });
  return (
    <section>
      <h1>{status === 'success' ? data.title : 'Loading...'}</h1>
    </section>
  );
};
