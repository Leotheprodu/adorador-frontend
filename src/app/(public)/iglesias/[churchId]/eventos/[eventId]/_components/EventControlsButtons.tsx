import { EventControlsButtonsLirics } from './EventControlsButtonsLirics';
import { EventControlsButtonsScreen } from './EventControlsButtonsScreen';

export const EventControlsButtons = () => {
  return (
    <div className="h-full w-full">
      <h3 className="mb-3 text-center font-bold text-slate-800">
        Panel de botones
      </h3>
      <div className="flex h-[10rem] items-start gap-2 rounded-md bg-slate-100 p-2">
        <EventControlsButtonsLirics />
        <EventControlsButtonsScreen />
      </div>
    </div>
  );
};
