import { EventAdminPage } from '@bands/[bandId]/eventos/[eventId]/_components/EventAdminPage';

export default async function EventId({
  params,
}: {
  params: Promise<{ bandId: string; eventId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="flex h-full w-full flex-col items-center p-8 pb-20 sm:p-20">
      <EventAdminPage params={resolvedParams} />
    </div>
  );
}
