'use client';
import { UIGuard } from '@global/utils/UIGuard';
import { getEventsById } from '@iglesias/[churchId]/eventos/[eventId]/_services/eventByIdService';
import { useFullscreen } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useFullscreen';
import { useLeftTime } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useLeftTime';
import { useHandleEventLeft } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useHandleEventLeft';
import { EventControls } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControls';
import { EventMainScreen } from './EventMainScreen';
import { useEffect } from 'react';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';
import { $event } from '@stores/event';
export const EventByIdPage = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const { data, isLoading, error } = getEventsById({
    churchId: params.churchId,
    eventId: params.eventId,
  });

  useEffect(() => {
    document.title = data?.title ?? 'Eventos';
  }, [data]);
  useEffect(() => {
    if (data) {
      $event.set(data);
      setLocalStorage(`event`, data);
    } else if (error && getLocalStorage(`event`)) {
      $event.set(getLocalStorage(`event`));
    }
  }, [data, params.eventId, error]);

  const { timeLeft } = useLeftTime({ date: data?.date });
  const { eventDateLeft } = useHandleEventLeft({
    timeLeft,
    date: data?.date,
  });
  const { isFullscreen, activateFullscreen, divRef } = useFullscreen();

  return (
    <UIGuard isLoading={isLoading}>
      <div className="flex h-full flex-col lg:w-1/2">
        <EventMainScreen
          eventMainScreenProps={{
            divRef,
            title: data?.title ?? '',
            eventDateLeft,
            isFullscreen,
            activateFullscreen,
          }}
        />

        {!isFullscreen && (
          <div className="mt-5 h-full w-full rounded-lg p-4">
            <EventControls songs={data?.songs ?? []} />
          </div>
        )}
      </div>
    </UIGuard>
  );
};
