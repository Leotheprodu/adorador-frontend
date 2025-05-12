/* import { EventControlsButtonsLiveMessages } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControlsButtonsLiveMessages'; */
import { EventControlsButtonsScreen } from '@app/(public)/grupos/[churchId]/eventos/[eventId]/_components/EventControlsButtonsScreen';

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
      <div className="flex items-center justify-center gap-2 rounded-md bg-slate-100 p-2">
        <EventControlsButtonsScreen />
        {/* <EventControlsButtonsLiveMessages churchId={churchId} /> */}
      </div>
    </div>
  );
};
