import { EventsOfBand } from './_components/EventsOfBand';

export default async function Events({ params }: { params: Promise<{ bandId: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="flex h-full min-h-screen flex-col items-center bg-white px-4 py-8 pb-20 dark:bg-gray-950 sm:px-6 sm:py-12">
      <div className="w-full max-w-7xl">
        <EventsOfBand params={resolvedParams} />
      </div>
    </div>
  );
}
