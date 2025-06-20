import { BandIdMain } from '@bands/_components/BandIdMain';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tu grupo',
  description: 'Toda la información de tu grupo',
};

export default function BandById({ params }: { params: { bandId: string } }) {
  return (
    <div className="flex h-full flex-col items-center p-8 pb-20 sm:p-20">
      <section>
        <BandIdMain bandId={params.bandId} />
      </section>
    </div>
  );
}
