'use client';

import { BandsWithMembersCount } from '@bands/_interfaces/bandsInterface';
import { useBandCard } from '../_hooks/useBandCard';
import { EditBandModal } from './EditBandModal';
import { DeleteBandModal } from './DeleteBandModal';
import {
  CalendarIcon,
  ClockIcon,
  EditIcon,
  TrashIcon,
  MicrophoneIcon,
  FolderMusicIcon,
} from '@global/icons';
import { PrimaryButton } from '@global/components/buttons';
import { formatDate, formatTime } from '@global/utils/dataFormat';
import { Tooltip, Chip } from '@heroui/react';

const BandTableRow = ({ band }: { band: BandsWithMembersCount }) => {
  const {
    currentEventIndex,
    events,
    isCurrentEvent,
    eventTimeLeft,
    isEditOpen,
    onEditOpen,
    onEditClose,
    isDeleteOpen,
    onDeleteOpen,
    onDeleteClose,
    isUserAuthorized,
    handleNextEvent,
    handlePrevEvent,
  } = useBandCard(band);

  const currentEvent = events[currentEventIndex];

  return (
    <>
      <tr className="border-b bg-white transition-colors hover:bg-slate-50 dark:border-slate-800 dark:bg-gray-950 dark:hover:bg-gray-900/50">
        {/* Name & Admin Actions */}
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-purple-100 text-brand-purple-600 dark:bg-brand-purple-900/30 dark:text-brand-purple-300">
              <span className="font-bold">{band.name.charAt(0)}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-800 dark:text-gray-100">
                {band.name}
              </span>
              {isUserAuthorized && (
                <div className="mt-1 flex items-center gap-1">
                  <Tooltip content="Editar grupo">
                    <button
                      onClick={onEditOpen}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-brand-purple-500 dark:hover:bg-gray-800 dark:hover:text-brand-purple-400"
                    >
                      <EditIcon className="h-3 w-3" />
                    </button>
                  </Tooltip>
                  <Tooltip content="Eliminar grupo">
                    <button
                      onClick={onDeleteOpen}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500 dark:hover:bg-gray-800 dark:hover:text-red-400"
                    >
                      <TrashIcon className="h-3 w-3" />
                    </button>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
        </td>

        {/* Stats */}
        <td className="px-6 py-4 text-center">
          <Chip
            size="sm"
            variant="flat"
            className="bg-slate-100 dark:bg-slate-800"
          >
            {band._count.events}
          </Chip>
        </td>
        <td className="px-6 py-4 text-center">
          <Chip
            size="sm"
            variant="flat"
            className="bg-slate-100 dark:bg-slate-800"
          >
            {band._count.songs}
          </Chip>
        </td>
        <td className="px-6 py-4 text-center">
          <Chip
            size="sm"
            variant="flat"
            className="bg-slate-100 dark:bg-slate-800"
          >
            {band._count.members}
          </Chip>
        </td>

        {/* Next Event */}
        <td className="min-w-[250px] px-6 py-4">
          {events.length > 0 ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevEvent}
                disabled={currentEventIndex === 0}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-brand-purple-600 disabled:opacity-30 dark:hover:bg-gray-800"
              >
                ‹
              </button>

              <div className="flex-1 rounded-lg border border-slate-100 bg-slate-50/50 p-2 dark:border-slate-800 dark:bg-gray-900/50">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-700 dark:text-gray-200">
                      {currentEvent.title}
                    </span>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        {formatDate(currentEvent.date, true)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        {formatTime(currentEvent.date)}
                      </span>
                    </div>
                  </div>
                  {isCurrentEvent && (
                    <span className="relative mt-1 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                    </span>
                  )}
                </div>
                {eventTimeLeft && new Date(currentEvent.date) > new Date() && (
                  <div className="mt-2 text-xs font-medium text-brand-purple-600 dark:text-brand-purple-400">
                    ⏱️ {eventTimeLeft}
                  </div>
                )}
              </div>

              <button
                onClick={handleNextEvent}
                disabled={currentEventIndex === events.length - 1}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-brand-purple-600 disabled:opacity-30 dark:hover:bg-gray-800"
              >
                ›
              </button>
            </div>
          ) : (
            <span className="text-sm italic text-slate-400">
              Sin eventos próximos
            </span>
          )}
        </td>

        {/* Actions */}
        <td className="px-6 py-4 text-right">
          <div className="flex items-center justify-end gap-2">
            {events[currentEventIndex]?.id && (
              <Tooltip content="Ver evento">
                <PrimaryButton
                  href={`/grupos/${band.id}/eventos/${events[currentEventIndex].id}`}
                  size="sm"
                  className="bg-brand-purple-100 text-brand-purple-700 hover:bg-brand-purple-200 dark:bg-brand-purple-900/30 dark:text-brand-purple-300"
                >
                  <MicrophoneIcon className="h-4 w-4" />
                </PrimaryButton>
              </Tooltip>
            )}
            <Tooltip content="Administrar grupo">
              <PrimaryButton
                href={`/grupos/${band.id}`}
                size="sm"
                className="bg-brand-purple-600 text-white hover:bg-brand-purple-700"
              >
                <FolderMusicIcon className="h-4 w-4" />
              </PrimaryButton>
            </Tooltip>
          </div>
        </td>
      </tr>

      {/* Modals */}
      <EditBandModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        bandId={band.id}
        currentName={band.name}
      />
      <DeleteBandModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        bandId={band.id}
        bandName={band.name}
      />
    </>
  );
};

interface BandTableProps {
  bands: BandsWithMembersCount[];
}

export const BandTable = ({ bands }: BandTableProps) => {
  return (
    <div className="w-full overflow-hidden rounded-2xl bg-white shadow ring-1 ring-slate-200/50 dark:bg-gray-950 dark:ring-slate-800">
      <div className="overflow-x-auto">
        <table className="w-full whitespace-nowrap text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 dark:bg-gray-900 dark:text-slate-400">
            <tr>
              <th className="px-6 py-4 font-semibold">Grupo</th>
              <th className="px-6 py-4 text-center font-semibold">Eventos</th>
              <th className="px-6 py-4 text-center font-semibold">Canciones</th>
              <th className="px-6 py-4 text-center font-semibold">Miembros</th>
              <th className="px-6 py-4 font-semibold">Próximo Evento</th>
              <th className="px-6 py-4 text-right font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {bands.map((band) => (
              <BandTableRow key={band.id} band={band} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
