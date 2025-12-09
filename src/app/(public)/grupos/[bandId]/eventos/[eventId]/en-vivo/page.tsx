import { EventByIdPage } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventByIdPage';

export default async function EventoEnVivo({
  params,
}: {
  params: Promise<{ bandId: string; eventId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="flex h-full w-full flex-col items-center p-8 pb-20 sm:p-20">
      <EventByIdPage params={resolvedParams} />
    </div>
  );
}
