import { EventControlsButtonsLirics } from './EventControlsButtonsLirics';
/* import { EventControlsButtonsLiveMessages } from './EventControlsButtonsLiveMessages'; */
import { EventControlsButtonsScreen } from './EventControlsButtonsScreen';

export const EventControlsButtons = ({
  isEventAdmin,
  /*  churchId, */
}: {
  isEventAdmin: boolean;
  churchId: number;
}) => {
  return (
    <div
      className={`col-start-1 col-end-3 h-full w-full ${isEventAdmin ? 'md:col-start-3' : ''} `}
    >
      <h3 className="mb-3 text-center font-bold text-slate-800">
        Panel de botones
      </h3>
      <div className="flex h-[10rem] items-center justify-center gap-2 rounded-md bg-slate-100 p-2">
        <EventControlsButtonsScreen />
        {isEventAdmin && <EventControlsButtonsLirics />}
        {/* <EventControlsButtonsLiveMessages churchId={churchId} /> */}
      </div>
    </div>
  );
};
