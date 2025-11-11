import { EventAdminPage } from '@bands/[bandId]/eventos/[eventId]/_components/EventAdminPage';

export default function EventId({
  params,
}: {
  params: { bandId: string; eventId: string };
}) {
  return (
    <div className="flex h-full w-full flex-col items-center p-8 pb-20 sm:p-20">
      <EventAdminPage params={params} />
    </div>
  );
}
