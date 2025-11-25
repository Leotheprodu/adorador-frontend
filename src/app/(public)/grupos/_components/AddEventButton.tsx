'use client';

import { Button, Tooltip } from '@nextui-org/react';
import { PlusIcon } from '@global/icons';
import { useAddEventButton } from '../_hooks/useAddEventButton';
import { AddEventModal } from './AddEventModal';

export const AddEventButton = ({ bandId }: { bandId: string }) => {
  const {
    isOpen,
    onOpen,
    onOpenChange,
    onClose,
    form,
    setForm,
    handleChange,
    handleAddEvent,
    handleClear,
    hasPermission,
    isSubmitting,
    isSuccess,
  } = useAddEventButton(bandId);

  return (
    <>
      <Tooltip
        content={
          hasPermission
            ? 'Crear evento'
            : 'Solo los administradores de la banda pueden crear eventos'
        }
      >
        <div className="inline-block">
          <Button
            onClick={hasPermission ? onOpen : undefined}
            size="sm"
            isDisabled={!hasPermission}
            className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:bg-brand-purple-800 dark:text-slate-100 dark:hover:border-brand-purple-800 dark:hover:bg-brand-purple-950"
          >
            <PlusIcon className="h-5 w-5" /> Crear evento
          </Button>
        </div>
      </Tooltip>
      <AddEventModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        form={form}
        setForm={setForm}
        handleChange={handleChange}
        handleAddEvent={handleAddEvent}
        handleClear={handleClear}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
      />
    </>
  );
};
