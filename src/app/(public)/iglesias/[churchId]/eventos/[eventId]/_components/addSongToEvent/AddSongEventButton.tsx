import { AddSongIcon } from '@global/icons/AddSongIcon';
import { Popover, PopoverContent, PopoverTrigger } from '@nextui-org/react';
import { AddSongEventBySavedSongs } from './AddSongEventBySavedSongs';
import { AddNewSongtoChurchAndEvent } from './AddNewSongtoChurchAndEvent';
import { useState } from 'react';

export const AddSongEventButton = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  return (
    <Popover
      className={isOpenPopover ? '' : 'hidden'}
      onOpenChange={(open) => setIsOpenPopover(open)}
    >
      <PopoverTrigger>
        <button className="rounded-full p-2 transition-colors duration-200 hover:bg-slate-300">
          <AddSongIcon className="text-primary-500" />
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col justify-center gap-2">
          <AddSongEventBySavedSongs
            params={params}
            setIsOpenPopover={setIsOpenPopover}
          />
          <AddNewSongtoChurchAndEvent />
        </div>
      </PopoverContent>
    </Popover>
  );
};
