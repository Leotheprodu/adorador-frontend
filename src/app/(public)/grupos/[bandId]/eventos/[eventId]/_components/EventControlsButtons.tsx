/* import { EventControlsButtonsLiveMessages } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsButtonsLiveMessages'; */
import { EventControlsButtonsScreen } from '@bands/[bandId]/eventos/[eventId]/_components/EventControlsButtonsScreen';

export const EventControlsButtons = ({
  isEventAdmin,
  /*  bandId, */
}: {
  isEventAdmin: boolean;
  bandId: number;
}) => {
  return (
    <div
      className={`col-start-1 col-end-3 h-full w-full ${isEventAdmin ? 'md:col-start-3' : ''} `}
    >
      <h3 className="mb-3 text-center font-bold text-slate-800">
        Panel de botones
      </h3>
      <div className="flex items-center justify-center gap-2 rounded-md bg-slate-100 p-2">
        <EventControlsButtonsScreen />
        {/* <EventControlsButtonsLiveMessages bandId={bandId} /> */}
      </div>
    </div>
  );
};
