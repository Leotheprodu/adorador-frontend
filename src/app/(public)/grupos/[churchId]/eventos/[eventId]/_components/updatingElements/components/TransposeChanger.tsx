import { ArrowsUpDownIconIcon } from '@global/icons/ArrowsUpDownIcon';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@nextui-org/react';

import { EventSongsProps } from '@app/(public)/grupos/[churchId]/eventos/_interfaces/eventsInterface';
import { handleTranspose } from '@app/(public)/grupos/[churchId]/eventos/[eventId]/_utils/handleTranspose';

export const TransposeChanger = ({
  data,
  songOrder,
  setSongOrder,
  index,
}: {
  data: EventSongsProps;
  songOrder: EventSongsProps[];
  setSongOrder: React.Dispatch<React.SetStateAction<EventSongsProps[]>>;
  index: number;
}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <button className="flex items-center justify-center rounded-full p-1 duration-200 hover:bg-slate-300">
          <ArrowsUpDownIconIcon className="text-primary-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="px-1 py-2">
          <div className="text-small font-bold">
            tonalidad actual:{' '}
            {data.song.key !== null &&
              `${handleTranspose(data.song.key, data.transpose)}`}
            {data.transpose === 0
              ? ' (original)'
              : ` (original ${data.song.key})`}
          </div>
          <div className="text-tiny">
            {data.transpose === 0
              ? 'aun no has transpuesto el tono'
              : `transpuesta ${data.transpose} ${data.transpose === 1 ? 'semitono' : 'semitonos'}`}
          </div>
          <div className="mt-4 flex w-full items-center justify-center gap-2">
            <Button
              color="success"
              isDisabled={data.transpose === 6}
              variant="light"
              onPress={() => {
                const updatedSongs = [...songOrder];
                updatedSongs[index].transpose += 1;
                setSongOrder(updatedSongs);
              }}
            >
              Subir tono
            </Button>
            <Button
              isDisabled={data.transpose === -6}
              color="danger"
              variant="light"
              onPress={() => {
                const updatedSongs = [...songOrder];
                updatedSongs[index].transpose -= 1;
                setSongOrder(updatedSongs);
              }}
            >
              Bajar tono
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
