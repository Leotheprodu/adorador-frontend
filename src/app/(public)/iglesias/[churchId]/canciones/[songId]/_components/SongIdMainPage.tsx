'use client';

import { UIGuard } from '@global/utils/UIGuard';
import { getSongData } from '../_services/songIdServices';
import { SongBasicInfo } from './SongBasicInfo';

export const SongIdMainPage = ({
  params,
}: {
  params: { churchId: string; songId: string };
}) => {
  const { data, isLoading, status } = getSongData({ params });

  return (
    <UIGuard
      isLoggedIn
      checkChurchId={parseInt(params.churchId)}
      isLoading={isLoading}
    >
      <section>
        <SongBasicInfo data={data} status={status} />
      </section>
    </UIGuard>
  );
};
