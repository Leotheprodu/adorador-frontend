import { ChurchIcon } from '@global/icons/ChurchIcon';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  CardFooter,
} from '@nextui-org/react';
import { ChurchProps } from '@churches/_interfaces/churchesInterface';
import { formatDate, formatTime } from '@/global/utils/dataFormat';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { $user } from '@/global/stores/users';
import { useStore } from '@nanostores/react';

export const ChurchCard = ({ church }: { church: ChurchProps }) => {
  const router = useRouter();
  const user = useStore($user);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const events =
    church.events.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    ) ?? [];
  const MembershipsChurches =
    user?.memberships.map((membership) => membership.church.id) ?? [];

  return (
    <Card className="relative flex h-80 w-80 flex-col overflow-hidden rounded-md border border-gray-300">
      <CardHeader className="mt-4">
        <div>
          {MembershipsChurches.includes(church.id) && (
            <div className="absolute right-0 top-0 z-10">
              <span className="rounded-l-full bg-primary px-2 py-1 text-sm text-white">
                Mi Iglesia
              </span>
            </div>
          )}
        </div>
        <ChurchIcon className="absolute right-[-4rem] top-[1rem] z-0 h-[20rem] w-auto text-slate-100" />
        <div className="z-10 h-12">
          <h2 className="text-xl font-bold">{church.name}</h2>
          <p className="text-xs">
            <span className="">{church.country}</span>, {church.address}
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
      <CardFooter>
        <Button
          onClick={() => router.push(`/iglesias/${church.id}`)}
          className="z-10 mt-2 rounded bg-gray-200 px-2 py-1"
        >
          Mas información
        </Button>
      </CardFooter>
    </Card>
  );
};
