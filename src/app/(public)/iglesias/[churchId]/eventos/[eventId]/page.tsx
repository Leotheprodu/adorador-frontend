export default function EventId({
  params,
}: {
  params: { churchId: string; eventId: string };
}) {
  return (
    <main className="flex h-screen flex-col items-center p-8 pb-20 sm:p-20">
      <section>
        <h1>
          evento id: {params.eventId} de la Iglesia id: {params.churchId}
        </h1>
      </section>
    </main>
  );
}
