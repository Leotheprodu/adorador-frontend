import { BandIdMain } from '@bands/_components/BandIdMain';
import { Metadata } from 'next';

import { Server1API } from '@global/config/constants';
import { BandWithSongsProps } from '@bands/_interfaces/bandsInterface';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bandId: string }>;
}): Promise<Metadata> {
  const { bandId } = await params;

  try {
    const response = await fetch(`${Server1API}/bands/${bandId}`, {
      next: { revalidate: 3600 },
    });
    const band: BandWithSongsProps | null = await response.json();

    if (!band || !band.name) {
      throw new Error('Band not found');
    }

    return {
      title: band.name,
      description: `Explora las canciones y eventos de ${band.name} en Zamr.`,
      openGraph: {
        title: band.name,
        description: `Información y repertorio de ${band.name}.`,
      },
    };
  } catch (error) {
    return {
      title: 'Grupo de Alabanza',
      description: 'Detalles del grupo en Zamr.',
    };
  }
}

export default async function BandById({
  params,
}: {
  params: Promise<{ bandId: string }>;
}) {
  const { bandId } = await params;
  return (
    <div className="flex h-full min-h-screen flex-col items-center bg-slate-50 px-4 py-8 pb-20 dark:bg-gray-950 sm:px-6 sm:py-12">
      <section className="w-full max-w-7xl">
        <BandIdMain bandId={bandId} />
      </section>
    </div>
  );
}
