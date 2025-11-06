import { SongIdMainPage } from './_components/SongIdMainPage';

export default function SongsById({
  params,
}: {
  params: { bandId: string; songId: string };
}) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-purple-50 via-white to-brand-pink-50 p-4 pb-20 sm:p-8">
      <SongIdMainPage params={params} />
    </main>
  );
}
