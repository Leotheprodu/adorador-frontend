'use client';
import { UIGuard } from '@global/utils/UIGuard';
import { getEventsById } from '@iglesias/[churchId]/eventos/[eventId]/_services/eventByIdService';
import { useFullscreen } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useFullscreen';
import { useLeftTime } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useLeftTime';
import { useHandleEventLeft } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useHandleEventLeft';
import { EventControls } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControls';
import { FullscreenIcon } from '@global/icons/FullScreenIcon';

export const EventByIdPage = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const { data, isLoading } = getEventsById({
    churchId: params.churchId,
    eventId: params.eventId,
  });

  const { timeLeft } = useLeftTime({ date: data?.date });
  const { eventDateLeft } = useHandleEventLeft({
    timeLeft,
    date: data?.date,
  });

  const { isFullscreen, activateFullscreen, divRef } = useFullscreen();

  return (
    <UIGuard isLoading={isLoading}>
      <div className="flex h-full w-1/2 flex-col items-center justify-center">
        <div
          ref={divRef}
          className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-black p-5 text-blanco"
        >
          <div className="font-agdasima flex flex-col items-center justify-center">
            <h1 className="text-5xl uppercase text-slate-400">{data?.title}</h1>
            <h3 className="text-6xl uppercase">{eventDateLeft}</h3>
          </div>

          {isFullscreen && (
            <div className="absolute bottom-0 left-0 h-40 w-full bg-slate-900">
              <EventControls songs={data?.songs ?? []} />
            </div>
          )}
          {!isFullscreen && (
            <button
              className="absolute bottom-2 right-2 hover:opacity-70"
              onClick={activateFullscreen}
            >
              <FullscreenIcon />
            </button>
          )}
        </div>
        {!isFullscreen && (
          <div className="mt-5 h-40 w-full rounded-lg bg-slate-900 p-4 shadow-lg">
            <EventControls songs={data?.songs ?? []} />
          </div>
        )}
      </div>
    </UIGuard>
  );
};
