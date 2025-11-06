import { EventControlsButtons } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsButtons';
import { EventControlsSongsList } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsSongsList';
import { EventControlsLyricsSelect } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsLyricsSelect';
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $eventAdminName, $event } from '@stores/event';
import { $user } from '@stores/users';
import { EventControlsHandleManager } from './EventControlsHandleManager';
import { userRoles } from '@global/config/constants';

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

  // Verificar si es administrador del sistema
  const isSystemAdmin =
    user?.isLoggedIn && user?.roles.includes(userRoles.admin.id);

  // Verificación precisa: usuario debe ser específicamente admin de este evento
  // Primero verificar si es miembro de la banda del evento
  const bandMembership =
    user.isLoggedIn && user.membersofBands
      ? user.membersofBands.find(
          (membership) => membership.band.id === event.bandId,
        )
      : undefined;

  // Verificar si es administrador específico del evento O administrador del sistema
  const checkAdminEvent = Boolean(
    (bandMembership && bandMembership.isEventManager) || isSystemAdmin,
  );

  // Verificar si es miembro del grupo pero NO admin (puede ver canciones pero no cambiarlas)
  // Los admins del sistema NO deben aparecer como "solo miembros"
  const isBandMemberOnly = Boolean(
    bandMembership && !bandMembership.isEventManager && !isSystemAdmin,
  );

  return (
    <div>
      <section
        className={`mt-5 h-full w-full flex-grow flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-brand-purple-50/30 p-4 shadow-lg backdrop-blur-sm sm:p-6`}
      >
        <EventControlsSongsList
          params={params}
          refetch={refetch}
          isLoading={isLoading}
          checkAdminEvent={checkAdminEvent}
          isBandMemberOnly={isBandMemberOnly}
        />

        {checkAdminEvent && <EventControlsLyricsSelect />}

        <EventControlsButtons
          bandId={parseInt(bandId)}
          isEventAdmin={checkAdminEvent}
        />

        {isBandMemberOnly && (
          <div className="w-full rounded-xl bg-gradient-to-r from-brand-blue-50 to-brand-purple-50 p-4 text-center shadow-sm">
            <p className="text-sm font-medium text-brand-purple-700">
              💡 Eres miembro del grupo. Solo el administrador del evento puede
              cambiar canciones.
            </p>
          </div>
        )}
      </section>

      <EventControlsHandleManager
        checkAdminEvent={checkAdminEvent}
        isSystemAdmin={isSystemAdmin}
        params={params}
      />
    </div>
  );
};
