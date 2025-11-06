import { BandIdMain } from '@bands/_components/BandIdMain';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tu grupo',
  description: 'Toda la información de tu grupo',
};

export default function BandById({ params }: { params: { bandId: string } }) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 via-white to-brand-purple-50/20 px-4 py-8 pb-20 sm:px-6 sm:py-12">
      <section className="w-full max-w-7xl">
        <BandIdMain bandId={params.bandId} />
      </section>
    </div>
  );
}
