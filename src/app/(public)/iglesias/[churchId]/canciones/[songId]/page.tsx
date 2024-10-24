export default function SongsById({
  params,
}: {
  params: { churchId: string; songId };
}) {
  return (
    <main className="flex h-screen flex-col items-center p-8 pb-20 sm:p-20">
      <section>
        <h1>
          cancion id: {params.songId} de la Iglesia id: {params.churchId}
        </h1>
      </section>
    </main>
  );
}
