import { EventControlsButtons } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventControlsButtons';
import { EventControlsSongsList } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventControlsSongsList';
import { EventControlsLyricsSelect } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventControlsLyricsSelect';
import { VideoControlBar } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/VideoControlBar';
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $eventAdminName, $event } from '@stores/event';
import { EventControlsHandleManager } from './EventControlsHandleManager';
import { LightBulbIcon } from '@global/icons';
import { useEventPermissions } from '../_hooks/useEventPermissions';
import { EventControlsProps } from '../_interfaces/liveEventInterfaces';

export const EventControls = ({
  params,
  refetch,
  isLoading,
}: EventControlsProps) => {
  const { bandId } = params;
  const eventAdminName = useStore($eventAdminName);
  const eventData = useStore($event);

  // Usar hook compartido de permisos
  const {
    isSystemAdmin,
    isAdminEvent: checkAdminEvent,
    isEventManager,
    isBandMemberOnly,
  } = useEventPermissions();

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventAdminName]);

  const isVideoLyricsMode = eventData.eventMode === 'videolyrics';

  return (
    <div>
      <section
        className={`mt-5 h-full w-full flex-grow flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-brand-purple-50/30 p-4 shadow-lg backdrop-blur-sm dark:bg-gradient-to-br dark:from-gray-800 dark:via-gray-900 dark:to-black sm:p-6`}
      >
        <EventControlsSongsList
          params={params}
          refetch={refetch}
          isLoading={isLoading}
          checkAdminEvent={checkAdminEvent}
          isEventManager={isEventManager}
          isBandMemberOnly={isBandMemberOnly}
        />

        {/* Show lyrics selector in live mode, video control in videolyrics mode */}
        {(checkAdminEvent || isEventManager) && !isVideoLyricsMode && (
          <EventControlsLyricsSelect />
        )}

        {isVideoLyricsMode && (
          <VideoControlBar isEventManager={isEventManager} />
        )}

        <EventControlsButtons
          bandId={parseInt(bandId)}
          isEventAdmin={checkAdminEvent}
        />

        {isBandMemberOnly && (
          <div className="w-full rounded-xl bg-gradient-to-r from-brand-blue-50 to-brand-purple-50 p-4 text-center shadow-sm">
            <p className="flex items-center justify-center gap-2 text-sm font-medium text-brand-purple-700">
              <LightBulbIcon className="h-5 w-5 text-brand-purple-500" />
              Eres miembro del grupo. Solo el administrador de la banda puede
              modificar el evento.
            </p>
          </div>
        )}
      </section>

      <EventControlsHandleManager
        checkAdminEvent={checkAdminEvent}
        isEventManager={isEventManager}
        isSystemAdmin={isSystemAdmin}
        params={params}
      />
    </div>
  );
};
