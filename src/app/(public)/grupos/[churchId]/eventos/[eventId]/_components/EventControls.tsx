import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { EventControlsButtons } from '@app/(public)/grupos/[churchId]/eventos/[eventId]/_components/EventControlsButtons';
import { EventControlsSongsList } from '@app/(public)/grupos/[churchId]/eventos/[eventId]/_components/EventControlsSongsList';
import { EventControlsLyricsSelect } from '@app/(public)/grupos/[churchId]/eventos/[eventId]/_components/EventControlsLyricsSelect';
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $eventAdminName } from '@stores/event';
import { EventControlsHandleManager } from './EventControlsHandleManager';

export const EventControls = ({
  params,
  refetch,
  isLoading,
}: {
  params: { churchId: string; eventId: string };
  refetch: () => void;
  isLoading: boolean;
}) => {
  const { churchId } = params;

  const eventAdminName = useStore($eventAdminName);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventAdminName]);

  const checkAdminEvent = CheckUserStatus({
    isLoggedIn: true,
    checkAdminEvent: true,
  });

  return (
    <div>
      <section
        className={`mt-5 h-full w-full flex-grow flex-col items-center justify-center gap-3 bg-slate-50 p-4`}
      >
        <EventControlsSongsList
          params={params}
          refetch={refetch}
          isLoading={isLoading}
        />

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
