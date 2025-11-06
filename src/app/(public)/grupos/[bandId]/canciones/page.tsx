import { SongsOfBand } from './_components/SongsOfBand';

export default function Songs({ params }: { params: { bandId: string } }) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 via-white to-brand-purple-50/20 px-4 py-8 pb-20 sm:px-6 sm:py-12">
      <div className="w-full max-w-7xl">
        <SongsOfBand params={params} />
      </div>
    </div>
  );
}
