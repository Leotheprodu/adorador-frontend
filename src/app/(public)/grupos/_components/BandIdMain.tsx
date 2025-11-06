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
      <div className="space-y-8">
        {/* Header Premium del Grupo */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-purple-600 via-brand-pink-500 to-brand-blue-600 p-8 shadow-2xl">
          {/* Patrón decorativo de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative z-10 text-center">
            <div className="mb-2 inline-block rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/90">
                Panel de Control
              </p>
            </div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              {data?.name}
            </h1>
            <p className="mt-3 text-sm text-white/80 sm:text-base">
              Gestiona canciones, eventos y tu equipo de adoración
            </p>
          </div>
        </div>

        {/* Secciones del contenido */}
        <div className="space-y-6">
          <SongsSection data={data} bandId={bandId} />
          <EventsSection data={data} bandId={bandId} />
        </div>
      </div>
    </UIGuard>
  );
};
