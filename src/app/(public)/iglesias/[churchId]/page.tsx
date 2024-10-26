import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tu iglesia',
  description: 'Toda la información de tu iglesia',
};

export default function ChurchById({
  params,
}: {
  params: { churchId: string };
}) {
  return (
    <div className="flex h-screen flex-col items-center p-8 pb-20 sm:p-20">
      <section>
        <h1>Iglesia id: {params.churchId}</h1>
      </section>
    </div>
  );
}
