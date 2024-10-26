export default function Songs({ params }: { params: { churchId: string } }) {
  return (
    <div className="flex h-screen flex-col items-center p-8 pb-20 sm:p-20">
      <section>
        <h1>canciones de la Iglesia id: {params.churchId}</h1>
      </section>
    </div>
  );
}
