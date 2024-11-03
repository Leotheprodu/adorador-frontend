import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { EventControlsButtonsLirics } from './EventControlsButtonsLirics';
import { EventControlsButtonsScreen } from './EventControlsButtonsScreen';
import { churchRoles, structureLib } from '@global/config/constants';
import { Button } from '@nextui-org/react';
import { useEventGateway } from '../_hooks/useEventGateway';
import { $lyricSelected } from '@stores/event';
import { useStore } from '@nanostores/react';
import { useDataOfLyricSelected } from '../_hooks/useDataOfLyricSelected';

export const EventControlsButtons = ({
  isEventAdmin,
  churchId,
}: {
  isEventAdmin: boolean;
  churchId: number;
}) => {
  const isWorshipLeader = CheckUserStatus({
    isLoggedIn: true,
    checkChurchId: churchId,
    churchRoles: [churchRoles.worshipLeader.id],
  });
  const lyricSelected = useStore($lyricSelected);
  const { dataOfLyricSelected } = useDataOfLyricSelected({
    lyricSelected,
  });
  const { sendMessage } = useEventGateway();
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
        {isWorshipLeader && (
          <div className="">
            <Button
              onPress={() =>
                sendMessage({
                  type: 'liveMessage',
                  data: `Repetir${
                    dataOfLyricSelected !== undefined &&
                    dataOfLyricSelected.structure &&
                    structureLib[dataOfLyricSelected.structure.title].es
                  }`,
                })
              }
            >
              {`Repetir ${
                dataOfLyricSelected !== undefined &&
                dataOfLyricSelected.structure &&
                structureLib[dataOfLyricSelected.structure.title].es
              }`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
