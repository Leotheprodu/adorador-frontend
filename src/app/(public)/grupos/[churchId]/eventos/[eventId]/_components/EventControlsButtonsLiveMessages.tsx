import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { churchRoles, structureLib } from '@global/config/constants';
import { Button } from '@nextui-org/react';
import { useEventGateway } from '@app/(public)/grupos/[churchId]/eventos/[eventId]/_hooks/useEventGateway';
import { $lyricSelected } from '@stores/event';
import { useStore } from '@nanostores/react';
import { useDataOfLyricSelected } from '@app/(public)/grupos/[churchId]/eventos/[eventId]/_hooks/useDataOfLyricSelected';

export const EventControlsButtonsLiveMessages = ({
  churchId,
}: {
  churchId: number;
}) => {
  const canSendMessages = CheckUserStatus({
    isLoggedIn: true,
    checkChurchId: churchId,
    churchRoles: [churchRoles.worshipLeader.id, churchRoles.eventWebManager.id],
  });
  const lyricSelected = useStore($lyricSelected);
  const { dataOfLyricSelected } = useDataOfLyricSelected({
    lyricSelected,
  });
  const { sendMessage } = useEventGateway();

  return (
    <>
      {canSendMessages && (
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
    </>
  );
};
