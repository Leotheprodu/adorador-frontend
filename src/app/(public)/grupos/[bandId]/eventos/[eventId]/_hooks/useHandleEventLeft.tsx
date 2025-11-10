import { useStore } from '@nanostores/react';
import { $event } from '@stores/event';
import { useEventTimeLeft } from '@global/hooks/useEventTimeLeft';

export const useHandleEventLeft = () => {
  const { date } = useStore($event);
  const { eventTimeLeft } = useEventTimeLeft(date);

  return {
    eventDateLeft: eventTimeLeft,
  };
};
