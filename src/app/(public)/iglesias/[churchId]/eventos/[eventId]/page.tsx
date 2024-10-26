import { EventByIdPage } from './_components/EventByIdPage';

export default function EventId({
  params,
}: {
  params: { churchId: string; eventId: string };
}) {
  return (
    <div className="flex h-screen w-full flex-col items-center p-8 pb-20 sm:p-20">
      <EventByIdPage params={params} />
    </div>
  );
}
