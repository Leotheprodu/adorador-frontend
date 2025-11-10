import { SongIdMainPage } from './_components/SongIdMainPage';

export default function SongsById({
  params,
}: {
  params: { bandId: string; songId: string };
}) {
  return (
    <div className="flex h-full min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 via-white to-brand-purple-50/20 px-4 py-8 pb-20 sm:px-6 sm:py-12">
      <section className="w-full max-w-7xl">
        <SongIdMainPage params={params} />
      </section>
    </div>
  );
}
