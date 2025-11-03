/* import { EventControlsButtonsLiveMessages } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsButtonsLiveMessages'; */
import { EventControlsButtonsScreen } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsButtonsScreen';
import { EventControlsButtonsSwipe } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsButtonsSwipe';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { userRoles } from '@global/config/constants';

export const EventControlsButtons = ({
  isEventAdmin,
  /*  bandId, */
}: {
  isEventAdmin: boolean;
  bandId: number;
}) => {
  const user = useStore($user);

  // Verificar si el usuario es admin del sistema (no solo admin del evento)
  const isSystemAdmin =
    user?.isLoggedIn && user?.roles.includes(userRoles.admin.id);

  return (
    <div
      className={`col-start-1 col-end-3 h-full w-full ${isEventAdmin ? 'md:col-start-3' : ''} `}
    >
      <h3 className="mb-3 text-center font-bold text-slate-800">
        Panel de botones
      </h3>
      <div className="flex items-center justify-center gap-2 rounded-md bg-slate-100 p-2">
        <EventControlsButtonsScreen />
        {isSystemAdmin && <EventControlsButtonsSwipe />}
        {/* <EventControlsButtonsLiveMessages bandId={bandId} /> */}
      </div>
    </div>
  );
};
