import { useStore } from '@nanostores/react';
import { Checkbox } from '@nextui-org/react';
import { $eventConfig } from '@stores/event';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';
import { useEffect } from 'react';

export const EventControlsButtonsSwipe = () => {
  const eventConfig = useStore($eventConfig);

  useEffect(() => {
    if (getLocalStorage('eventConfig')) {
      $eventConfig.set(getLocalStorage('eventConfig'));
    }
  }, []);

  const toggleSwipeLock = (isSelected: boolean) => {
    const newConfig = {
      ...eventConfig,
      swipeLocked: isSelected,
    };

    $eventConfig.set(newConfig);
    setLocalStorage('eventConfig', newConfig);
  };

  return (
    <div className="flex flex-col gap-2 rounded-md bg-white p-2">
      <h3 className="text-center text-xs">Control Admin</h3>
      <div className="flex flex-wrap items-center gap-1">
        <Checkbox
          color="default"
          size="sm"
          isSelected={eventConfig.swipeLocked}
          aria-label="Bloquear swipe"
          onValueChange={toggleSwipeLock}
        >
          <p className="text-xs">🔒 Bloquear Swipe</p>
        </Checkbox>
      </div>
      <p className="text-center text-xs text-slate-500">
        {eventConfig.swipeLocked
          ? 'Tocar pantalla no cambiará letras'
          : 'Tocar pantalla cambiará letras'}
      </p>
    </div>
  );
};
