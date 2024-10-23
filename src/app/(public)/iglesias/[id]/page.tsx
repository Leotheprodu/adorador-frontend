export default function ChurchById({ params }: { params: { id: string } }) {
  return (
    <main className="flex h-screen flex-col items-center p-8 pb-20 sm:p-20">
      <section>
        <h1>Iglesia id: {params.id}</h1>
      </section>
    </main>
  );
}
