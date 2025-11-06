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
      <h3 className="mb-3 bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-center text-lg font-bold text-transparent">
        Panel de Control
      </h3>
      <div className="flex items-center justify-center gap-3 rounded-xl bg-white/70 p-4 shadow-inner backdrop-blur-sm">
        <EventControlsButtonsScreen />
        {isSystemAdmin && <EventControlsButtonsSwipe />}
        {/* <EventControlsButtonsLiveMessages bandId={bandId} /> */}
      </div>
    </div>
  );
};
