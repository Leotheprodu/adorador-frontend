import { AddSongIcon } from '@global/icons/AddSongIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { AddSongEventBySavedSongs } from './AddSongEventBySavedSongs';
import { AddNewSongtoChurchAndEvent } from './AddNewSongtoChurchAndEvent';
import { useState } from 'react';

export const AddSongEventButton = ({
  params,
  refetch,
}: {
  params: { bandId: string; eventId: string };
  refetch: () => void;
}) => {
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  return (
    <Popover
      className={isOpenPopover ? '' : 'hidden'}
      onOpenChange={(open) => setIsOpenPopover(open)}
      classNames={{
        content: 'p-1 bg-white/95 backdrop-blur-sm shadow-lg',
      }}
    >
      <PopoverTrigger>
        <button
          className="rounded-full p-2 transition-all duration-200 hover:bg-gradient-icon hover:shadow-md"
          aria-label="Agregar canción al evento"
        >
          <AddSongIcon className="text-brand-purple-600" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex min-w-[280px] flex-col gap-1 p-1">
          <AddSongEventBySavedSongs
            params={params}
            setIsOpenPopover={setIsOpenPopover}
            refetch={refetch}
          />
          <AddNewSongtoChurchAndEvent
            params={params}
            setIsOpenPopover={setIsOpenPopover}
            refetch={refetch}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};
