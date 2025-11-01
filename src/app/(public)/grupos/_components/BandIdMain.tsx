'use client';
import { getBandById } from '@bands/_services/bandsService';
import { SongsSection } from './SongsSection';
import { EventsSection } from './EventsSection';
import { UIGuard } from '@global/utils/UIGuard';

export const BandIdMain = ({ bandId }: { bandId: string }) => {
  const { data, isLoading } = getBandById(bandId);

  return (
    <UIGuard
      isLoggedIn={true}
      checkBandId={Number(bandId)}
      isLoading={isLoading}
    >
      <div>
        <h1 className="text-center text-xl font-bold">{data?.name}</h1>
        <div className="my-4 flex flex-col items-center justify-center">
          <SongsSection data={data} bandId={bandId} />
          <EventsSection data={data} bandId={bandId} />
        </div>
      </div>
    </UIGuard>
  );
};
