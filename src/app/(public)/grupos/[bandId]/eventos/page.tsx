import { EventsOfBand } from './_components/EventsOfBand';

export default function Events({ params }: { params: { bandId: string } }) {
  return (
    <div className="flex h-full flex-col items-center p-8 pb-20 sm:p-20">
      <section>
        <EventsOfBand params={params} />
      </section>
    </div>
  );
}
