import { AddSongIcon } from '@global/icons/AddSongIcon';
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
} from '@nextui-org/react';
import { AddSongEventBySavedSongs } from './AddSongEventBySavedSongs';
import { AddNewSongtoChurchAndEvent } from './AddNewSongtoChurchAndEvent';
import { useState } from 'react';

export const AddSongEventButton = ({
  params,
  refetch,
  isAdminEvent,
}: {
  params: { bandId: string; eventId: string };
  refetch: () => void;
  isAdminEvent?: boolean;
}) => {
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const hasPermission = isAdminEvent !== undefined ? isAdminEvent : true;

  return (
    <Tooltip
      content={
        !hasPermission
          ? 'Solo los administradores de la banda pueden agregar canciones'
          : 'Agregar canción al evento'
      }
    >
      <div className="inline-block">
        <Popover
          isOpen={hasPermission ? isOpenPopover : false}
          onOpenChange={(open) => hasPermission && setIsOpenPopover(open)}
          classNames={{
            content: 'p-1 bg-white/95 backdrop-blur-sm shadow-lg',
          }}
        >
          <PopoverTrigger>
            <Button
              isIconOnly
              radius="full"
              variant="light"
              size="sm"
              isDisabled={!hasPermission}
              className={`transition-all duration-200 ${
                hasPermission
                  ? 'hover:bg-gradient-icon hover:shadow-md'
                  : 'cursor-not-allowed opacity-50'
              }`}
              aria-label="Agregar canción al evento"
            >
              <AddSongIcon className="text-brand-purple-600" />
            </Button>
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
      </div>
    </Tooltip>
  );
};
