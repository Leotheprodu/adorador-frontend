'use client';

import { Button } from "@heroui/react";
import { PlusIcon } from '@global/icons';
import { useAddSongButton } from '../_hooks/useAddSongButton';
import { AddSongModal } from './AddSongModal';

export const AddSongButton = ({ bandId }: { bandId: string }) => {
  const {
    isOpen,
    onOpen,
    onOpenChange,
    onClose,
    form,
    setForm,
    handleChange,
    handleAddSong,
    handleClear,
    isSubmitting,
    isSuccess,
  } = useAddSongButton(bandId);

  return (
    <>
      <Button
        onClick={() => {
          onOpen();
        }}
        size="sm"
        className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:bg-brand-purple-800 dark:text-slate-100 dark:hover:border-brand-purple-800 dark:hover:bg-brand-purple-950"
      >
        <PlusIcon className="h-5 w-5" /> Añadir canción
      </Button>
      <AddSongModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        form={form}
        setForm={setForm}
        handleChange={handleChange}
        handleAddSong={handleAddSong}
        handleClear={handleClear}
        isSubmitting={isSubmitting}
        isSuccess={isSuccess}
      />
    </>
  );
};
