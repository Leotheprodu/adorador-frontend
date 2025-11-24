import { BandsWithMembersCount } from '@bands/_interfaces/bandsInterface';
import { EditBandModal } from './EditBandModal';
import { DeleteBandModal } from './DeleteBandModal';
import { useBandCard } from '../_hooks/useBandCard';
import { BandHeader } from './BandHeader';
import { BandStats } from './BandStats';
import { BandEvents } from './BandEvents';
import { BandActions } from './BandActions';

export const BandCard = ({ band }: { band: BandsWithMembersCount }) => {
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

  return (
    <div className="group relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-2xl hover:ring-slate-300/50 dark:bg-brand-purple-900 dark:ring-brand-purple-800 dark:hover:ring-brand-purple-700/50">
      <BandHeader
        name={band.name}
        isUserAuthorized={isUserAuthorized}
        onEditOpen={onEditOpen}
        onDeleteOpen={onDeleteOpen}
      />

      <BandStats
        eventCount={band._count.events}
        songCount={band._count.songs}
        memberCount={band._count.members}
      />

      <BandEvents
        events={events}
        currentEventIndex={currentEventIndex}
        isCurrentEvent={isCurrentEvent}
        eventTimeLeft={eventTimeLeft}
        onNextEvent={handleNextEvent}
        onPrevEvent={handlePrevEvent}
      />

      <BandActions
        bandId={band.id}
        eventId={events[currentEventIndex]?.id}
      />

      {/* Efecto de hover en toda la card */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-transparent transition-all duration-300 group-hover:ring-brand-purple-200"></div>

      {/* Modales */}
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
    </div>
  );
};
