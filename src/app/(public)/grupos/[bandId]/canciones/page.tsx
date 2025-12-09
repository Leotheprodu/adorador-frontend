import { SongsOfBand } from './_components/SongsOfBand';

export default async function Songs({ params }: { params: Promise<{ bandId: string }> }) {
  const resolvedParams = await params;
  return (
    <div className="flex h-full min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 via-white to-brand-purple-50/20 px-4 py-8 pb-20 sm:px-6 sm:py-12 dark:bg-gray-950 dark:bg-none">
      <div className="w-full max-w-7xl">
        <SongsOfBand params={resolvedParams} />
      </div>
    </div>
  );
}
