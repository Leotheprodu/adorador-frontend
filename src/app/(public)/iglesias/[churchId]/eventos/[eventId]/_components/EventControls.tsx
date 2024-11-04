import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { EventControlsButtons } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControlsButtons';
import { EventControlsSongsList } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControlsSongsList';
import { EventControlsLyricsSelect } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControlsLyricsSelect';
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $eventAdminName } from '@stores/event';
import { EventControlsHandleManager } from './EventControlsHandleManager';

export const EventControls = ({
  params,
  refetch,
}: {
  params: { churchId: string; eventId: string };
  refetch: () => void;
}) => {
  const { churchId } = params;

  const eventAdminName = useStore($eventAdminName);

  useEffect(() => {
    refetch();
  }, [refetch, eventAdminName]);

  const checkAdminEvent = CheckUserStatus({
    isLoggedIn: true,
    checkAdminEvent: true,
  });

  return (
    <div>
      <section
        className={`mt-5 grid w-full items-center justify-center gap-3 bg-slate-50 p-4 ${checkAdminEvent ? 'grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-1' : 'grid-cols-1 grid-rows-1'}`}
      >
        {checkAdminEvent && <EventControlsSongsList />}
        {checkAdminEvent && <EventControlsLyricsSelect />}
        <EventControlsButtons
          churchId={parseInt(churchId)}
          isEventAdmin={checkAdminEvent}
        />
      </section>

      <EventControlsHandleManager
        checkAdminEvent={checkAdminEvent}
        params={params}
      />
    </div>
  );
};
