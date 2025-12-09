import { useStore } from '@nanostores/react';
import { Checkbox } from "@heroui/react";
import { $eventConfig } from '@stores/event';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';
import { useEffect } from 'react';
import { LockClosedIcon, LockOpenIcon, CheckIcon } from '@global/icons';

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
    <div className="flex flex-col gap-3 rounded-xl bg-gradient-to-br from-white to-brand-pink-50/30 p-3 shadow-sm dark:bg-gradient-to-br dark:from-brand-purple-900/50 dark:to-brand-blue-900/50">
      <h3 className="flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-brand-pink-700">
        <LockClosedIcon className="h-4 w-4" /> Control Admin
      </h3>
      <div className="flex flex-wrap items-center justify-center gap-1">
        <Checkbox
          color="secondary"
          size="sm"
          isSelected={eventConfig.swipeLocked}
          aria-label="Bloquear swipe"
          onValueChange={toggleSwipeLock}
        >
          <p className="flex items-center gap-1.5 text-xs font-medium">
            <LockOpenIcon className="h-3.5 w-3.5" /> Bloquear Swipe
          </p>
        </Checkbox>
      </div>
      <p className="text-center text-xs font-medium text-slate-600">
        {eventConfig.swipeLocked ? (
          <span className="flex items-center justify-center gap-1 text-brand-pink-600">
            <CheckIcon className="h-3.5 w-3.5" /> Pantalla protegida
          </span>
        ) : (
          <span className="text-slate-500">⚠️ Swipe activo</span>
        )}
      </p>
    </div>
  );
};
