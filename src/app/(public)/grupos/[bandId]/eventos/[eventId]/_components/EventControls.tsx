import { EventControlsButtons } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsButtons';
import { EventControlsSongsList } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsSongsList';
import { EventControlsLyricsSelect } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsLyricsSelect';
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $eventAdminName, $event } from '@stores/event';
import { $user } from '@stores/users';
import { EventControlsHandleManager } from './EventControlsHandleManager';

export const EventControls = ({
  params,
  refetch,
  isLoading,
}: {
  params: { bandId: string; eventId: string };
  refetch: () => void;
  isLoading: boolean;
}) => {
  const { bandId } = params;

  const eventAdminName = useStore($eventAdminName);
  const user = useStore($user);
  const event = useStore($event);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventAdminName]);

  // Verificación precisa: usuario debe ser específicamente admin de este evento
  // Primero verificar si es miembro de la banda del evento
  const bandMembership =
    user.isLoggedIn &&
    user.membersofBands &&
    user.membersofBands.find(
      (membership) => membership.band.id === event.bandId,
    );

  // Verificar si es administrador específico del evento
  const checkAdminEvent = Boolean(
    bandMembership && bandMembership.isEventManager,
  );

  // Verificar si es miembro del grupo pero NO admin (puede ver canciones pero no cambiarlas)
  const isBandMemberOnly = Boolean(
    bandMembership && !bandMembership.isEventManager,
  );

  return (
    <div>
      <section
        className={`mt-5 h-full w-full flex-grow flex-col items-center justify-center gap-3 bg-slate-50 p-4`}
      >
        <EventControlsSongsList
          params={params}
          refetch={refetch}
          isLoading={isLoading}
          checkAdminEvent={checkAdminEvent}
          isBandMemberOnly={isBandMemberOnly}
        />

        {checkAdminEvent && <EventControlsLyricsSelect />}
        {checkAdminEvent && (
          <EventControlsButtons
            bandId={parseInt(bandId)}
            isEventAdmin={checkAdminEvent}
          />
        )}
      </section>

      <EventControlsHandleManager
        checkAdminEvent={checkAdminEvent}
        params={params}
      />
    </div>
  );
};
