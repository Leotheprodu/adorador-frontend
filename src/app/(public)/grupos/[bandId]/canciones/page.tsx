import { SongsOfBand } from './_components/SongsOfBand';

export default function Songs({ params }: { params: { bandId: string } }) {
  return (
    <div className="flex h-full flex-col items-center p-8 pb-20 sm:p-20">
      <SongsOfBand params={params} />
    </div>
  );
}
