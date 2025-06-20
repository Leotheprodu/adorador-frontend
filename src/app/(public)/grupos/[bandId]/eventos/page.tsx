export default function Events({ params }: { params: { bandId: string } }) {
  return (
    <div className="flex h-full flex-col items-center p-8 pb-20 sm:p-20">
      <section>
        <h1>eventos del grupo id: {params.bandId}</h1>
      </section>
    </div>
  );
}
