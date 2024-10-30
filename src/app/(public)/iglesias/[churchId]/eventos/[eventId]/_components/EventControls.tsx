import { churchRoles } from '@global/config/constants';
import { EventSongsProps } from '../../_interfaces/eventsInterface';
import { Button } from '@nextui-org/react';
import { $isStreamAdmin } from '@stores/event';
import { useStore } from '@nanostores/react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { EventControlsLyricsButtons } from './EventControlsLyricsButtons';
import { EventControlsSongsList } from './EventControlsSongsList';
import { EventControlsLyricsSelect } from './EventControlsLyricsSelect';

export const EventControls = ({
  songs,
  churchId,
}: {
  songs: EventSongsProps[];
  churchId: string;
}) => {
  const isStreamAdmin = useStore($isStreamAdmin);

  const checkUser = CheckUserStatus({
    isLoggedIn: true,
    checkChurchId: parseInt(churchId),
    churchRoles: [churchRoles.musician.id, churchRoles.worshipLeader.id],
  });
  const handleStreamAdmin = () => {
    if (isStreamAdmin) return;
    $isStreamAdmin.set(true);
  };
  if (!checkUser) {
    return null;
  } else if (checkUser && !isStreamAdmin) {
    return (
      <div className="flex w-full items-center">
        <p>
          En este momento nadie esta administrando este evento,{' '}
          <span className="font-bold">¿Quieres administrarlo?</span>
        </p>
        <Button variant="solid" color="primary" onClick={handleStreamAdmin}>
          Aceptar
        </Button>
      </div>
    );
  }
  if (checkUser && isStreamAdmin) {
    return (
      <section className="grid w-full grid-cols-2 grid-rows-2 items-center justify-center gap-3 bg-slate-50 p-4 md:grid-cols-3 md:grid-rows-1">
        <EventControlsSongsList songs={songs} />

        <EventControlsLyricsSelect />
        <EventControlsLyricsButtons />
      </section>
    );
  }
};
