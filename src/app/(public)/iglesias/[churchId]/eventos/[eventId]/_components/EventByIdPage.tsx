'use client';
import { UIGuard } from '@global/utils/UIGuard';
import { EventControls } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControls';
import { EventMainScreen } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventMainScreen';
import { useEventByIdPage } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useEventByIdPage';
import { EventSimpleTitle } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventSimpleTitle';

export const EventByIdPage = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const { isLoading, refetch } = useEventByIdPage({
    params,
  });

  return (
    <UIGuard isLoading={isLoading}>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-screen-md flex-col">
          <EventMainScreen />

          <EventSimpleTitle />

          <EventControls refetch={refetch} params={params} />
        </div>
      </div>
    </UIGuard>
  );
};
