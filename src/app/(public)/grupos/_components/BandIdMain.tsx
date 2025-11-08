'use client';
import { getBandById } from '@bands/_services/bandsService';
import { SongsSection } from './SongsSection';
import { EventsSection } from './EventsSection';
import { BandMembers } from '@app/(public)/grupos/[bandId]/_components/BandMembers';
import { UIGuard } from '@global/utils/UIGuard';
import { GuitarIcon } from '@global/icons';

export const BandIdMain = ({ bandId }: { bandId: string }) => {
  const { data, isLoading } = getBandById(bandId);

  return (
    <UIGuard
      isLoggedIn={true}
      checkBandId={Number(bandId)}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {/* Header Minimalista del Grupo */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-purple-600">
              <GuitarIcon className="h-7 w-7 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                {data?.name}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Panel de administración
              </p>
            </div>
          </div>
        </div>

        {/* Secciones del contenido */}
        <div className="space-y-6">
          <BandMembers bandId={Number(bandId)} />
          <SongsSection data={data} bandId={bandId} />
          <EventsSection data={data} bandId={bandId} />
        </div>
      </div>
    </UIGuard>
  );
};
