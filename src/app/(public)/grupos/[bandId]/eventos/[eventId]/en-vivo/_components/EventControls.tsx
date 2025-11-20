import { EventControlsButtons } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventControlsButtons';
import { EventControlsSongsList } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventControlsSongsList';
import { EventControlsLyricsSelect } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventControlsLyricsSelect';
import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $eventAdminName, $event } from '@stores/event';
import { $user } from '@stores/users';
import { EventControlsHandleManager } from './EventControlsHandleManager';
import { userRoles } from '@global/config/constants';
import { LightBulbIcon } from '@global/icons';

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

  // Verificación precisa: usuario debe ser específicamente admin de la banda
  // Primero verificar si es miembro de la banda del evento
  const bandMembership =
    user.isLoggedIn && user.membersofBands
      ? user.membersofBands.find(
          (membership) => membership.band.id === event.bandId,
        )
      : undefined;

  // Verificar si es administrador de la banda (NO solo event manager) O administrador del sistema
  const checkAdminEvent = Boolean(
    (bandMembership && bandMembership.isAdmin) || isSystemAdmin,
  );

  // Verificar si es event manager (puede cambiar canciones durante el evento pero no modificar el evento)
  const isEventManager = Boolean(
    bandMembership && bandMembership.isEventManager && !bandMembership.isAdmin,
  );

  // Verificar si es miembro del grupo pero NO admin ni event manager (solo puede ver)
  // Los admins del sistema NO deben aparecer como "solo miembros"
  const isBandMemberOnly = Boolean(
    bandMembership &&
      !bandMembership.isAdmin &&
      !bandMembership.isEventManager &&
      !isSystemAdmin,
  );

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

        {(checkAdminEvent || isEventManager) && <EventControlsLyricsSelect />}

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
