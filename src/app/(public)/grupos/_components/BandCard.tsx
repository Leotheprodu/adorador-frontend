import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
import { formatDate, formatTime } from '@global/utils/dataFormat';
import { useEffect, useState } from 'react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { GuitarIcon } from '@global/icons/GuitarIcon';
import { BandsWithMembersCount } from '@bands/_interfaces/bandsInterface';
import { SecondaryButton } from '@global/components/buttons';

export const BandCard = ({ band }: { band: BandsWithMembersCount }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const events =
    band.events?.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    ) ?? [];

  //si el evento actual es igual a la fecha actual, el valor de la variable isCurrentEvent es verdadero
  const [isCurrentEvent, setIsCurrentEvent] = useState(false);

  useEffect(() => {
    setIsCurrentEvent(
      new Date(events[currentEventIndex]?.date).setHours(0, 0, 0, 0) ===
        new Date().setHours(0, 0, 0, 0),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEventIndex]);

  const isUserAuthorized = CheckUserStatus({
    isLoggedIn: true,
    checkBandId: band.id,
  });
  return (
    <Card className="relative flex w-80 flex-col overflow-hidden rounded-md border border-gray-300">
      <CardHeader className="my-4 pb-6">
        <GuitarIcon className="absolute right-[-4rem] top-[2rem] z-0 h-[20rem] w-auto text-slate-100" />
        <div className="z-10 h-12">
          <h2 className="text-xl font-bold">{band.name}</h2>
          <p className="text-sm text-gray-500">
            {band._count.events} eventos, {band._count.songs} canciones,{' '}
            {band._count.members} miembros
          </p>
        </div>
      </CardHeader>
      <CardBody className="z-10 h-44">
        {events.length > 0 && (
          <div className="">
            <h2 className="text-center font-bold">Próximos Eventos</h2>

            <div className="mt-2 flex h-full items-center justify-between">
              <button
                onClick={() =>
                  setCurrentEventIndex((prevIndex) =>
                    Math.max(prevIndex - 1, 0),
                  )
                }
                disabled={currentEventIndex === 0}
                className="h-full w-6 rounded bg-gray-200 px-2 py-1 font-bold text-primary disabled:opacity-50"
              >
                {'<'}
              </button>

              <div className="text-center">
                <h3>{events[currentEventIndex].title}</h3>
                <p>
                  {formatDate(events[currentEventIndex].date, true)}, a las{' '}
                  {formatTime(events[currentEventIndex].date)}
                </p>
              </div>
              <button
                onClick={() =>
                  setCurrentEventIndex((prevIndex) =>
                    Math.min(prevIndex + 1, events.length - 1),
                  )
                }
                disabled={currentEventIndex === events.length - 1}
                className="h-full w-6 rounded bg-gray-200 px-2 py-1 font-bold text-primary disabled:opacity-50"
              >
                {'>'}
              </button>
            </div>
          </div>
        )}
      </CardBody>
      <CardFooter className="flex gap-3">
        <SecondaryButton
          href={`/grupos/${band.id}`}
          className="z-10 mt-2 rounded"
        >
          Ver grupo
        </SecondaryButton>
        {events.length > 0 && (isCurrentEvent || isUserAuthorized) && (
          <SecondaryButton
            href={`/grupos/${band.id}/eventos/${events[currentEventIndex].id}`}
            className="z-10 mt-2 rounded"
          >
            Ver evento
          </SecondaryButton>
        )}
      </CardFooter>
    </Card>
  );
};
